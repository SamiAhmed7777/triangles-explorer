export interface ChainInfo {
	chain: string;
	blocks: number;
	bestblockhash: string;
	difficulty: {
		'proof-of-work': number;
		'proof-of-stake': number;
	};
	moneysupply: number;
}

export interface Block {
	hash: string;
	confirmations: number;
	size: number;
	height: number;
	version: number;
	merkleroot: string;
	mint: number;
	time: number;
	nonce: number;
	bits: string;
	difficulty: number;
	blocktrust: string;
	chaintrust: string;
	previousblockhash?: string;
	nextblockhash?: string;
	flags: string;
	proofhash: string;
	entropybit: number;
	modifier: string;
	tx: string[];
}

export interface BlockHeader {
	hash: string;
	confirmations: number;
	height: number;
	version: number;
	merkleroot: string;
	time: number;
	nonce: number;
	bits: string;
	difficulty: number;
	flags: string;
	previousblockhash?: string;
	nextblockhash?: string;
}

export interface Transaction {
	txid: string;
	version: number;
	time: number;
	locktime: number;
	vin: TxInput[];
	vout: TxOutput[];
	blockhash?: string;
	confirmations?: number;
	blocktime?: number;
}

export interface TransactionSummary {
	txid: string;
	time?: number;
	confirmations?: number;
	outputCount?: number;
	totalOutput?: number;
	primaryAddress?: string;
	isReward?: boolean;
}

export interface TxInput {
	txid?: string;
	vout?: number;
	scriptSig?: {
		asm: string;
		hex: string;
	};
	coinbase?: string;
	sequence: number;
}

export interface TxOutput {
	value: number;
	n: number;
	scriptPubKey: {
		asm: string;
		hex: string;
		reqSigs?: number;
		type: string;
		addresses?: string[];
	};
}

export interface Difficulty {
	'proof-of-work': number;
	'proof-of-stake': number;
	'search-interval': number;
}

export interface StakingInfo {
	enabled: boolean;
	staking: boolean;
	errors: string;
	currentblocksize: number;
	currentblocktx: number;
	difficulty: number;
	'search-interval': number;
	weight: number;
	netstakeweight: number;
	expectedtime: number;
}

export interface MiningInfo {
	blocks: number;
	currentblocksize: number;
	currentblocktx: number;
	difficulty: number;
	blockvalue: number;
	netmhashps: number;
	netstakeweight: number;
	errors: string;
	pooledtx: number;
	stakedifficulty: number;
	stakeinterest: number;
	testnet: boolean;
}

export interface NetworkInfo {
	version: number;
	protocolversion: number;
	connections: number;
	proxy: string;
	testnet: boolean;
	errors: string;
}

export interface PeerInfo {
	addr: string;
	services: string;
	lastsend: number;
	lastrecv: number;
	conntime: number;
	version: number;
	subver: string;
	inbound: boolean;
	startingheight: number;
	banscore: number;
}

export interface AddressBalance {
	balance: number;
	received: number;
}

export interface AddressUtxo {
	address: string;
	txid: string;
	outputIndex: number;
	satoshis: number;
	height: number;
}

export interface SupplyInfo {
	height: number;
	bestblock: string;
	total_amount: number;
}

export interface ValidationResult {
	isvalid: boolean;
	address?: string;
	ismine?: boolean;
	account?: string;
}
