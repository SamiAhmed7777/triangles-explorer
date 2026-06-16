import { getRichList } from '$lib/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const data = await getRichList(100);
		return { richlist: data.addresses || [], total: data.total || 0 };
	} catch (e) {
		return { richlist: [], total: 0, error: String(e) };
	}
};
