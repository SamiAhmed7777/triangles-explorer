import { getTransaction } from '$lib/api';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const tx = await getTransaction(params.txid);
		return { tx };
	} catch {
		error(404, 'Transaction not found');
	}
};
