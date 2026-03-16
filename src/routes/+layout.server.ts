import { getChainInfo, getNetwork } from '$lib/api';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	try {
		const [chain, network] = await Promise.all([getChainInfo(), getNetwork()]);
		return { chain, network };
	} catch {
		return { chain: null, network: null };
	}
};
