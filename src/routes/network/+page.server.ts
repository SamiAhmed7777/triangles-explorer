import { getNetwork, getPeers } from '$lib/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const [network, peers] = await Promise.all([getNetwork(), getPeers()]);
		return { network, peers };
	} catch (e) {
		return { network: null, peers: [], error: String(e) };
	}
};
