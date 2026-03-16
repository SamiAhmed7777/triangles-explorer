import { getMempool } from '$lib/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const txids = await getMempool();
		return { txids };
	} catch (e) {
		return { txids: [], error: String(e) };
	}
};
