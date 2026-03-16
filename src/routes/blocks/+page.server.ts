import { getChainInfo, getBlockByHeight } from '$lib/api';
import type { PageServerLoad } from './$types';
import type { Block } from '$lib/types';

const PAGE_SIZE = 20;

export const load: PageServerLoad = async ({ url }) => {
	const page = parseInt(url.searchParams.get('page') || '1');

	try {
		const chain = await getChainInfo();
		const startHeight = chain.blocks - (page - 1) * PAGE_SIZE;

		const blocks: Block[] = [];
		for (let i = 0; i < PAGE_SIZE && startHeight - i >= 0; i++) {
			try {
				blocks.push(await getBlockByHeight(startHeight - i));
			} catch { break; }
		}

		const hasNext = startHeight - PAGE_SIZE >= 0;
		return { blocks, page, hasNext, totalBlocks: chain.blocks };
	} catch (e) {
		return { blocks: [], page, hasNext: false, totalBlocks: 0, error: String(e) };
	}
};
