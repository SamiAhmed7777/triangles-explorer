import { getAddressBalance, getAddressUtxos, getAddressTxids, validateAddress } from '$lib/api';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

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

		return { address: params.addr, balance, utxos, txids };
	} catch (e: unknown) {
		const msg = e instanceof Error ? e.message : String(e);
		if (msg.includes('Address index not enabled')) {
			return { address: params.addr, balance: null, utxos: [], txids: [], indexError: true };
		}
		error(404, 'Address not found');
	}
};
