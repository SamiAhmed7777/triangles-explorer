export function timeAgo(timestamp: number): string {
	const seconds = Math.floor(Date.now() / 1000 - timestamp);
	if (seconds < 60) return `${seconds}s ago`;
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.floor(hours / 24);
	return `${days}d ago`;
}

export function truncateHash(hash: string, chars = 8): string {
	if (hash.length <= chars * 2 + 3) return hash;
	return `${hash.slice(0, chars)}...${hash.slice(-chars)}`;
}

export function formatAmount(amount: number): string {
	return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 });
}

export function formatDifficulty(diff: number): string {
	if (diff >= 1e12) return (diff / 1e12).toFixed(2) + 'T';
	if (diff >= 1e9) return (diff / 1e9).toFixed(2) + 'G';
	if (diff >= 1e6) return (diff / 1e6).toFixed(2) + 'M';
	if (diff >= 1e3) return (diff / 1e3).toFixed(2) + 'K';
	return diff.toFixed(4);
}

export function formatNumber(n: number): string {
	return n.toLocaleString();
}

export function formatTimestamp(ts: number): string {
	return new Date(ts * 1000).toLocaleString();
}

export function isBlockHash(input: string): boolean {
	return /^[0-9a-fA-F]{64}$/.test(input);
}

export function isNumeric(input: string): boolean {
	return /^\d+$/.test(input);
}

export function isAddress(input: string): boolean {
	return /^[A-Za-z1-9]{25,34}$/.test(input);
}

export function blockType(flags: string): string {
	if (flags.includes('proof-of-stake')) return 'PoS';
	return 'PoW';
}
