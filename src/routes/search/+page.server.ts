import { getBlock, getTransaction, getBlockHashByHeight } from '$lib/api';
import { redirect, error } from '@sveltejs/kit';
import { isNumeric, isBlockHash } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const q = url.searchParams.get('q')?.trim();
	if (!q) error(400, 'No search query provided');

	// Numeric: treat as block height
	if (isNumeric(q)) {
		try {
			const { blockhash } = await getBlockHashByHeight(parseInt(q));
			redirect(302, `/block/${blockhash}`);
		} catch {
			error(404, `Block at height ${q} not found`);
		}
	}

	// 64-char hex: try block hash, then txid
	if (isBlockHash(q)) {
		try {
			await getBlock(q);
			redirect(302, `/block/${q}`);
		} catch {
			// Not a block, try as txid
		}
		try {
			await getTransaction(q);
			redirect(302, `/tx/${q}`);
		} catch {
			error(404, `No block or transaction found for ${q}`);
		}
	}

	// Otherwise: try as address
	redirect(302, `/address/${q}`);
};
