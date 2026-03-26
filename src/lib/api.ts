import { env } from '$env/dynamic/private';
import type {
	ChainInfo, Block, BlockHeader, Transaction, Difficulty,
	StakingInfo, MiningInfo, NetworkInfo, PeerInfo,
	AddressBalance, AddressUtxo, SupplyInfo, ValidationResult, TransactionSummary
} from './types';

const BASE_URL = env.TRIANGLES_API_URL || 'http://127.0.0.1:19112';

async function get<T>(path: string): Promise<T> {
	const t0 = Date.now();
	const url = `${BASE_URL}/rest/${path}`;
	const res = await fetch(url);
	const fetchTime = Date.now() - t0;
	if (!res.ok) {
		const body = await res.text();
		throw new Error(`API error ${res.status}: ${body}`);
	}
	const data = await res.json();
	console.log(`[API] GET ${path} took ${Date.now() - t0}ms (fetch: ${fetchTime}ms)`);
	return data;
}

// In-memory cache with deduplication for expensive endpoints
const apiCache = new Map<string, { data: unknown; timestamp: number; promise?: Promise<unknown> }>();
const API_CACHE_TTL = 10000; // 10 seconds

async function getCached<T>(path: string, ttl = API_CACHE_TTL): Promise<T> {
	const now = Date.now();
	const entry = apiCache.get(path);
	
	// Return cached data if fresh
	if (entry?.data && (now - entry.timestamp) < ttl) {
		console.log(`[API] CACHE HIT ${path}`);
		return entry.data as T;
	}
	
	// Deduplicate in-flight requests
	if (entry?.promise) {
		console.log(`[API] DEDUP ${path}`);
		return entry.promise as Promise<T>;
	}
	
	// Make the request
	const promise = get<T>(path).then(data => {
		apiCache.set(path, { data, timestamp: Date.now() });
		return data;
	}).catch(err => {
		apiCache.delete(path);
		throw err;
	});
	
	apiCache.set(path, { data: entry?.data ?? null, timestamp: entry?.timestamp ?? 0, promise });
	return promise;
}

// Chain info (cached + deduplicated — expensive due to gettxoutsetinfo)
export const getChainInfo = () => getCached<ChainInfo>('chaininfo');

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

function summarizeTransaction(tx: Transaction): TransactionSummary {
	return {
		txid: tx.txid,
		time: tx.blocktime ?? tx.time,
		confirmations: tx.confirmations,
		outputCount: tx.vout.length,
		totalOutput: tx.vout.reduce((sum, vout) => sum + vout.value, 0),
		primaryAddress: tx.vout.flatMap((vout) => vout.scriptPubKey.addresses ?? [])[0],
		isReward: tx.vin.some((vin) => Boolean(vin.coinbase))
	};
}

export async function getTransactionSummaries(
	txids: string[],
	limit = txids.length
): Promise<TransactionSummary[]> {
	const selected = limit > 0 ? txids.slice(0, limit) : txids;

	return Promise.all(
		selected.map(async (txid) => {
			try {
				return summarizeTransaction(await getTransaction(txid));
			} catch {
				return { txid };
			}
		})
	);
}

// Helper: get latest N blocks (parallel fetch for performance)
export async function getLatestBlocks(count: number): Promise<Block[]> {
	const chain = await getChainInfo();
	const heights = Array.from({ length: count }, (_, i) => chain.blocks - i).filter(h => h >= 0);
	
	// Fetch all blocks in parallel
	const results = await Promise.allSettled(heights.map(h => getBlockByHeight(h)));
	
	// Return only successful fetches
	return results
		.filter((r): r is PromiseFulfilledResult<Block> => r.status === 'fulfilled')
		.map(r => r.value);
}
