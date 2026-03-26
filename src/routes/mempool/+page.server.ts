import { getMempool, getTransactionSummaries } from '$lib/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const txids = await getMempool();
		const txs = await getTransactionSummaries(txids);
		return { txs, totalTxs: txids.length };
	} catch (e) {
		return { txs: [], totalTxs: 0, error: String(e) };
	}
};
