import { getChainInfo, getBlockByHeight, getTransaction } from '$lib/api';
import type { PageServerLoad } from './$types';
import type { Block } from '$lib/types';

const PAGE_SIZE = 20;

interface BlockWithAddresses extends Block {
	addresses?: string[];
}

export const load: PageServerLoad = async ({ url }) => {
	const page = parseInt(url.searchParams.get('page') || '1');

	try {
		const chain = await getChainInfo();
		const startHeight = chain.blocks - (page - 1) * PAGE_SIZE;

		const blocks: BlockWithAddresses[] = [];
		for (let i = 0; i < PAGE_SIZE && startHeight - i >= 0; i++) {
			try {
				const block = await getBlockByHeight(startHeight - i);
				
				// Fetch addresses from transactions (limit to first 50 txs to avoid slowdown)
				const addressSet = new Set<string>();
				const txsToFetch = block.tx.slice(0, 50);
				
				await Promise.all(
					txsToFetch.map(async (txid) => {
						try {
							const tx = await getTransaction(txid);
							// Extract addresses from outputs
							tx.vout.forEach(out => {
								if (out.scriptPubKey.addresses) {
									out.scriptPubKey.addresses.forEach(addr => addressSet.add(addr));
								}
							});
						} catch {
							// Skip failed tx fetches
						}
					})
				);

				blocks.push({
					...block,
					addresses: Array.from(addressSet)
				});
			} catch { break; }
		}

		const hasNext = startHeight - PAGE_SIZE >= 0;
		return { blocks, page, hasNext, totalBlocks: chain.blocks };
	} catch (e) {
		return { blocks: [], page, hasNext: false, totalBlocks: 0, error: String(e) };
	}
};
