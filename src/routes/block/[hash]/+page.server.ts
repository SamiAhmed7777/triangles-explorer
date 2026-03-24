import { getBlock, getTransaction } from '$lib/api';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const block = await getBlock(params.hash);
		
		// Fetch addresses from all transactions
		const addressSet = new Set<string>();
		await Promise.all(
			block.tx.map(async (txid) => {
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

		return { 
			block,
			addresses: Array.from(addressSet)
		};
	} catch {
		error(404, 'Block not found');
	}
};
