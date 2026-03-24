import { getChainInfo, getBlockByHeight, getStaking, getMining } from '$lib/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const t0 = Date.now();
	try {
		console.log('[SSR] Starting homepage load...');
		
		// Fetch chaininfo first to get current height
		const t1 = Date.now();
		const chain = await getChainInfo();
		console.log(`[SSR] getChainInfo took ${Date.now() - t1}ms`);
		
		// Then fetch everything else in parallel
		const heights = Array.from({ length: 10 }, (_, i) => chain.blocks - i).filter(h => h >= 0);
		const t2 = Date.now();
		const [blocks, staking, mining] = await Promise.all([
			Promise.allSettled(heights.map(h => getBlockByHeight(h)))
				.then(results => results
					.filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
					.map(r => r.value)
				),
			getStaking(),
			getMining()
		]);
		console.log(`[SSR] Parallel fetch (blocks+staking+mining) took ${Date.now() - t2}ms`);
		console.log(`[SSR] Total load time: ${Date.now() - t0}ms`);
		
		return { chain, blocks, staking, mining };
	} catch (e) {
		console.error('[SSR] Error:', e);
		return { chain: null, blocks: [], staking: null, mining: null, error: String(e) };
	}
};
