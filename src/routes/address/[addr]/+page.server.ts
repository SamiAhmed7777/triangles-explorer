import {
	getAddressBalance,
	getAddressUtxos,
	getAddressTxids,
	getTransactionSummaries,
	validateAddress
} from '$lib/api';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const TX_HISTORY_LIMIT = 50;

export const load: PageServerLoad = async ({ params }) => {
	try {
		const [validation, balance, utxos, txids] = await Promise.all([
			validateAddress(params.addr),
			getAddressBalance(params.addr),
			getAddressUtxos(params.addr),
			getAddressTxids(params.addr)
		]);

		if (!validation.isvalid) {
			error(400, 'Invalid address');
		}

		const txs = await getTransactionSummaries(txids, TX_HISTORY_LIMIT);
		return { address: params.addr, balance, utxos, txs, totalTxs: txids.length };
	} catch (e: unknown) {
		const msg = e instanceof Error ? e.message : String(e);
		if (msg.includes('Address index not enabled')) {
			return { address: params.addr, balance: null, utxos: [], txs: [], totalTxs: 0, indexError: true };
		}
		error(404, 'Address not found');
	}
};
