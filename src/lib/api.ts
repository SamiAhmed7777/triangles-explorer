import { env } from '$env/dynamic/private';
import type {
	ChainInfo, Block, BlockHeader, Transaction, Difficulty,
	StakingInfo, MiningInfo, NetworkInfo, PeerInfo,
	AddressBalance, AddressUtxo, SupplyInfo, ValidationResult
} from './types';

const BASE_URL = env.TRIANGLES_API_URL || 'http://127.0.0.1:19112';

async function get<T>(path: string): Promise<T> {
	const res = await fetch(`${BASE_URL}/rest/${path}`);
	if (!res.ok) {
		const body = await res.text();
		throw new Error(`API error ${res.status}: ${body}`);
	}
	return res.json();
}

// Chain info
export const getChainInfo = () => get<ChainInfo>('chaininfo');

// Blocks
export const getBlock = (hash: string) => get<Block>(`block/${hash}`);
export const getBlockHeader = (hash: string) => get<BlockHeader>(`blockheader/${hash}`);
export const getBlockByHeight = (n: number) => get<Block>(`blockbyheight/${n}`);
export const getBlockHashByHeight = (n: number) => get<{ blockhash: string }>(`blockhashbyheight/${n}`);

// Transactions
export const getTransaction = (txid: string) => get<Transaction>(`tx/${txid}`);

// Mempool
export const getMempool = () => get<string[]>('mempool');

// Network
export const getDifficulty = () => get<Difficulty>('difficulty');
export const getSupply = () => get<SupplyInfo>('supply');
export const getStaking = () => get<StakingInfo>('staking');
export const getMining = () => get<MiningInfo>('mining');
export const getSubsidy = () => get<number>('subsidy');
export const getEstimateFee = () => get<number>('estimatefee');
export const getCheckpoint = () => get<Record<string, unknown>>('checkpoint');
export const getNetwork = () => get<NetworkInfo>('network');
export const getPeers = () => get<PeerInfo[]>('peers');

// Address (requires -addressindex=1)
export const getAddressBalance = (addr: string) => get<AddressBalance>(`address/${addr}/balance`);
export const getAddressUtxos = (addr: string) => get<AddressUtxo[]>(`address/${addr}/utxos`);
export const getAddressTxids = (addr: string, start?: number, end?: number) => {
	let path = `address/${addr}/txids`;
	const params: string[] = [];
	if (start !== undefined) params.push(`start=${start}`);
	if (end !== undefined) params.push(`end=${end}`);
	if (params.length) path += '?' + params.join('&');
	return get<string[]>(path);
};

// Validation
export const validateAddress = (addr: string) => get<ValidationResult>(`validate/${addr}`);

// Helper: get latest N blocks
export async function getLatestBlocks(count: number): Promise<Block[]> {
	const chain = await getChainInfo();
	const blocks: Block[] = [];
	for (let i = 0; i < count && chain.blocks - i >= 0; i++) {
		try {
			blocks.push(await getBlockByHeight(chain.blocks - i));
		} catch { break; }
	}
	return blocks;
}
