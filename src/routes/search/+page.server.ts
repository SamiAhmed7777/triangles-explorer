import { getBlock, getTransaction, getBlockHashByHeight } from '$lib/api';
import { redirect, error } from '@sveltejs/kit';
import { isNumeric, isBlockHash } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const q = url.searchParams.get('q')?.trim();
	if (!q) error(400, 'No search query provided');

	// Numeric: treat as block height.
	// NOTE: redirect()/error() throw, so they must live OUTSIDE the try/catch —
	// otherwise the thrown redirect is swallowed and turned into a 404.
	if (isNumeric(q)) {
		let blockhash: string | undefined;
		try {
			({ blockhash } = await getBlockHashByHeight(parseInt(q)));
		} catch {
			blockhash = undefined;
		}
		if (!blockhash) error(404, `Block at height ${q} not found`);
		redirect(302, `/block/${blockhash}`);
	}

	// 64-char hex: try block hash, then txid.
	if (isBlockHash(q)) {
		let isBlock = false;
		try {
			await getBlock(q);
			isBlock = true;
		} catch {
			isBlock = false;
		}
		if (isBlock) redirect(302, `/block/${q}`);

		let isTx = false;
		try {
			await getTransaction(q);
			isTx = true;
		} catch {
			isTx = false;
		}
		if (isTx) redirect(302, `/tx/${q}`);

		error(404, `No block or transaction found for ${q}`);
	}

	// Otherwise: treat as an address and go straight to its page.
	redirect(302, `/address/${q}`);
};
