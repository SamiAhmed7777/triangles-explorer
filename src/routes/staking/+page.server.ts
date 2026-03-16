import { getStaking, getMining, getSubsidy, getDifficulty, getChainInfo, getBlockHeader, getBlockHashByHeight } from '$lib/api';
import type { PageServerLoad } from './$types';
import type { BlockHeader } from '$lib/types';

export const load: PageServerLoad = async () => {
	try {
		const [staking, mining, subsidy, difficulty, chain] = await Promise.all([
			getStaking(),
			getMining(),
			getSubsidy(),
			getDifficulty(),
			getChainInfo()
		]);

		// Fetch last 50 block headers for difficulty chart
		const headers: BlockHeader[] = [];
		for (let i = 0; i < 50 && chain.blocks - i >= 0; i++) {
			try {
				const { blockhash } = await getBlockHashByHeight(chain.blocks - i);
				headers.push(await getBlockHeader(blockhash));
			} catch { break; }
		}

		return { staking, mining, subsidy, difficulty, headers: headers.reverse() };
	} catch (e) {
		return { staking: null, mining: null, subsidy: null, difficulty: null, headers: [], error: String(e) };
	}
};
