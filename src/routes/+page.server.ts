import { getChainInfo, getLatestBlocks, getStaking, getMining } from '$lib/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const [chain, blocks, staking, mining] = await Promise.all([
			getChainInfo(),
			getLatestBlocks(10),
			getStaking(),
			getMining()
		]);
		return { chain, blocks, staking, mining };
	} catch (e) {
		return { chain: null, blocks: [], staking: null, mining: null, error: String(e) };
	}
};
