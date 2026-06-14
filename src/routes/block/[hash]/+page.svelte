<script lang="ts">
	import TxTable from '$lib/components/TxTable.svelte';
	import { formatTimestamp, formatDifficulty, blockType, truncateHash, formatNumber, formatAmount, timeAgo } from '$lib/utils';

	let { data } = $props();
	const block = data.block;
	const addresses = data.addresses || [];

	// Calculate block reward from transactions
	const blockReward = block.mint || 0;
	
	// Block age
	const blockAge = timeAgo(block.time);
	const blockDate = formatTimestamp(block.time);
	
	// Transaction summary
	const txCount = block.tx.length;
	const coinbaseTx = data.txs?.find((tx: any) => tx.vin?.[0]?.coinbase);
	
	// PoS specific data
	const isPoS = block.flags?.includes('proof-of-stake');
	const isPoW = block.flags?.includes('proof-of-work');
</script>

<svelte:head>
	<title>Block {block.height} - Triangles Explorer</title>
	<meta name="description" content="Triangles block {block.height} details: {txCount} transactions, {blockType(block.flags)} block" />
</svelte:head>

<!-- Header with navigation -->
<div class="mb-6">
	<div class="flex items-start justify-between mb-3">
		<div class="flex-1 min-w-0">
			<div class="flex items-center gap-3 mb-2">
				<h1 class="text-3xl font-bold text-white">Block #{formatNumber(block.height)}</h1>
				<span class="inline-block px-3 py-1 rounded-full text-sm font-medium {isPoS ? 'bg-tri-green/20 text-tri-green border border-tri-green/30' : 'bg-tri-yellow/20 text-tri-yellow border border-tri-yellow/30'}">
					{blockType(block.flags)}
				</span>
			</div>
			<p class="text-tri-muted text-sm mb-1">
				{blockAge} • {blockDate}
			</p>
		</div>
		<div class="flex gap-2 shrink-0 ml-4">
			{#if block.previousblockhash}
				<a href="/block/{block.previousblockhash}" 
				   class="bg-tri-surface border border-tri-border text-tri-text px-4 py-2 rounded hover:border-tri-accent hover:text-tri-accent transition-colors flex items-center gap-1">
					<span>←</span>
					<span class="hidden sm:inline">Previous</span>
				</a>
			{/if}
			{#if block.nextblockhash}
				<a href="/block/{block.nextblockhash}" 
				   class="bg-tri-surface border border-tri-border text-tri-text px-4 py-2 rounded hover:border-tri-accent hover:text-tri-accent transition-colors flex items-center gap-1">
					<span class="hidden sm:inline">Next</span>
					<span>→</span>
				</a>
			{/if}
		</div>
	</div>
	
	<!-- Block Hash -->
	<div class="bg-tri-surface border border-tri-border rounded-lg p-4">
		<div class="text-tri-muted text-xs uppercase tracking-wider mb-2">Block Hash</div>
		<div class="font-mono text-sm text-tri-text break-all">{block.hash}</div>
	</div>
</div>

<!-- Stats Grid -->
<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
	<div class="bg-tri-surface border border-tri-border rounded-lg p-4">
		<div class="text-tri-muted text-xs uppercase tracking-wider mb-1">Confirmations</div>
		<div class="text-2xl font-bold text-white">{formatNumber(block.confirmations)}</div>
	</div>
	<div class="bg-tri-surface border border-tri-border rounded-lg p-4">
		<div class="text-tri-muted text-xs uppercase tracking-wider mb-1">Transactions</div>
		<div class="text-2xl font-bold text-white">{txCount}</div>
	</div>
	<div class="bg-tri-surface border border-tri-border rounded-lg p-4">
		<div class="text-tri-muted text-xs uppercase tracking-wider mb-1">Block Reward</div>
		<div class="text-2xl font-bold text-tri-accent">{formatAmount(blockReward)} <span class="text-base text-tri-muted">TRI</span></div>
	</div>
	<div class="bg-tri-surface border border-tri-border rounded-lg p-4">
		<div class="text-tri-muted text-xs uppercase tracking-wider mb-1">Size</div>
		<div class="text-2xl font-bold text-white">{formatNumber(block.size || 0)} <span class="text-base text-tri-muted">bytes</span></div>
	</div>
</div>

<!-- Main Details Grid -->
<div class="grid md:grid-cols-2 gap-6 mb-6">
	<!-- Left Column: Block Information -->
	<div class="space-y-6">
		<!-- Basic Info -->
		<div class="bg-tri-surface border border-tri-border rounded-lg">
			<div class="px-4 py-3 border-b border-tri-border">
				<h2 class="text-white font-semibold">Block Information</h2>
			</div>
			<div class="divide-y divide-tri-border">
				<div class="px-4 py-3">
					<div class="text-tri-muted text-xs uppercase tracking-wider mb-1">Height</div>
					<div class="text-tri-text font-mono">{formatNumber(block.height)}</div>
				</div>
				<div class="px-4 py-3">
					<div class="text-tri-muted text-xs uppercase tracking-wider mb-1">Timestamp</div>
					<div class="text-tri-text">{blockDate}</div>
					<div class="text-tri-muted text-xs mt-0.5">{blockAge}</div>
				</div>
				<div class="px-4 py-3">
					<div class="text-tri-muted text-xs uppercase tracking-wider mb-1">Received Time</div>
					<div class="text-tri-text font-mono">{block.time}</div>
				</div>
				<div class="px-4 py-3">
					<div class="text-tri-muted text-xs uppercase tracking-wider mb-1">Block Type</div>
					<div class="flex items-center gap-2">
						<span class="inline-block px-2 py-1 rounded text-xs font-medium {isPoS ? 'bg-tri-green/20 text-tri-green' : 'bg-tri-yellow/20 text-tri-yellow'}">
							{blockType(block.flags)}
						</span>
						{#if isPoS}
							<span class="text-tri-muted text-xs">(Stake Proof)</span>
						{:else if isPoW}
							<span class="text-tri-muted text-xs">(Work Proof)</span>
						{/if}
					</div>
				</div>
				<div class="px-4 py-3">
					<div class="text-tri-muted text-xs uppercase tracking-wider mb-1">Difficulty</div>
					<div class="text-tri-text font-mono">{formatDifficulty(block.difficulty)}</div>
				</div>
				<div class="px-4 py-3">
					<div class="text-tri-muted text-xs uppercase tracking-wider mb-1">Block Reward</div>
					<div class="text-tri-accent font-semibold">{formatAmount(blockReward)} TRI</div>
				</div>
			</div>
		</div>

		<!-- Technical Details -->
		<div class="bg-tri-surface border border-tri-border rounded-lg">
			<div class="px-4 py-3 border-b border-tri-border">
				<h2 class="text-white font-semibold">Technical Details</h2>
			</div>
			<div class="divide-y divide-tri-border">
				<div class="px-4 py-3">
					<div class="text-tri-muted text-xs uppercase tracking-wider mb-1">Version</div>
					<div class="text-tri-text font-mono">{block.version}</div>
				</div>
				<div class="px-4 py-3">
					<div class="text-tri-muted text-xs uppercase tracking-wider mb-1">Size</div>
					<div class="text-tri-text font-mono">{formatNumber(block.size || 0)} bytes</div>
				</div>
				<div class="px-4 py-3">
					<div class="text-tri-muted text-xs uppercase tracking-wider mb-1">Nonce</div>
					<div class="text-tri-text font-mono">{block.nonce}</div>
				</div>
				<div class="px-4 py-3">
					<div class="text-tri-muted text-xs uppercase tracking-wider mb-1">Bits</div>
					<div class="text-tri-text font-mono">{block.bits}</div>
				</div>
				{#if block.blocktrust}
					<div class="px-4 py-3">
						<div class="text-tri-muted text-xs uppercase tracking-wider mb-1">Block Trust</div>
						<div class="text-tri-text font-mono">{block.blocktrust}</div>
					</div>
				{/if}
				{#if block.chaintrust}
					<div class="px-4 py-3">
						<div class="text-tri-muted text-xs uppercase tracking-wider mb-1">Chain Trust</div>
						<div class="text-tri-text font-mono">{block.chaintrust}</div>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Right Column: Hashes & PoS Info -->
	<div class="space-y-6">
		<!-- Hashes -->
		<div class="bg-tri-surface border border-tri-border rounded-lg">
			<div class="px-4 py-3 border-b border-tri-border">
				<h2 class="text-white font-semibold">Cryptographic Hashes</h2>
			</div>
			<div class="divide-y divide-tri-border">
				<div class="px-4 py-3">
					<div class="text-tri-muted text-xs uppercase tracking-wider mb-2">Merkle Root</div>
					<div class="text-tri-text font-mono text-xs break-all">{block.merkleroot}</div>
				</div>
				<div class="px-4 py-3">
					<div class="text-tri-muted text-xs uppercase tracking-wider mb-2">Previous Block</div>
					{#if block.previousblockhash}
						<a href="/block/{block.previousblockhash}" class="text-tri-accent hover:text-tri-accent-light font-mono text-xs break-all">
							{block.previousblockhash}
						</a>
					{:else}
						<span class="text-tri-muted text-xs">Genesis Block</span>
					{/if}
				</div>
				<div class="px-4 py-3">
					<div class="text-tri-muted text-xs uppercase tracking-wider mb-2">Next Block</div>
					{#if block.nextblockhash}
						<a href="/block/{block.nextblockhash}" class="text-tri-accent hover:text-tri-accent-light font-mono text-xs break-all">
							{block.nextblockhash}
						</a>
					{:else}
						<span class="text-tri-muted text-xs">Latest Block</span>
					{/if}
				</div>
			</div>
		</div>

		<!-- PoS-specific Information -->
		{#if isPoS}
			<div class="bg-tri-surface border border-tri-border rounded-lg">
				<div class="px-4 py-3 border-b border-tri-border">
					<h2 class="text-white font-semibold flex items-center gap-2">
						<span class="text-tri-green">●</span>
						Proof-of-Stake Details
					</h2>
				</div>
				<div class="divide-y divide-tri-border">
					{#if block.proofhash}
						<div class="px-4 py-3">
							<div class="text-tri-muted text-xs uppercase tracking-wider mb-2">Proof Hash</div>
							<div class="text-tri-text font-mono text-xs break-all">{block.proofhash}</div>
						</div>
					{/if}
					{#if block.modifier}
						<div class="px-4 py-3">
							<div class="text-tri-muted text-xs uppercase tracking-wider mb-1">Stake Modifier</div>
							<div class="text-tri-text font-mono">{block.modifier}</div>
						</div>
					{/if}
					{#if block.modifierchecksum}
						<div class="px-4 py-3">
							<div class="text-tri-muted text-xs uppercase tracking-wider mb-1">Modifier Checksum</div>
							<div class="text-tri-text font-mono">{block.modifierchecksum}</div>
						</div>
					{/if}
					{#if block.entropybit !== undefined}
						<div class="px-4 py-3">
							<div class="text-tri-muted text-xs uppercase tracking-wider mb-1">Entropy Bit</div>
							<div class="text-tri-text font-mono">{block.entropybit}</div>
						</div>
					{/if}
					{#if block.signature}
						<div class="px-4 py-3">
							<div class="text-tri-muted text-xs uppercase tracking-wider mb-2">Block Signature</div>
							<div class="text-tri-text font-mono text-xs break-all">{block.signature}</div>
						</div>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Block Flags -->
		<div class="bg-tri-surface border border-tri-border rounded-lg">
			<div class="px-4 py-3 border-b border-tri-border">
				<h2 class="text-white font-semibold">Flags</h2>
			</div>
			<div class="px-4 py-3">
				<div class="text-tri-text font-mono text-sm">{block.flags}</div>
			</div>
		</div>
	</div>
</div>

<!-- Addresses Involved -->
{#if addresses.length > 0}
	<div class="bg-tri-surface border border-tri-border rounded-lg mb-6">
		<div class="px-4 py-3 border-b border-tri-border">
			<h2 class="text-white font-semibold">Addresses Involved ({addresses.length})</h2>
		</div>
		<div class="px-4 py-4">
			<div class="flex flex-wrap gap-2">
				{#each addresses as addr}
					<a 
						href="/address/{addr}" 
						class="inline-block font-mono text-xs px-3 py-1.5 rounded bg-tri-surface-dark border border-tri-border text-tri-text hover:text-tri-accent hover:border-tri-accent transition-colors"
						title={addr}
					>
						{addr}
					</a>
				{/each}
			</div>
		</div>
	</div>
{/if}

<!-- Transactions -->
<div class="bg-tri-surface border border-tri-border rounded-lg overflow-hidden">
	<div class="px-4 py-3 border-b border-tri-border">
		<h2 class="text-white font-semibold">Transactions ({txCount})</h2>
	</div>
	{#if data.txs && data.txs.length > 0}
		<TxTable txs={data.txs} />
	{:else}
		<div class="px-4 py-8 text-center text-tri-muted">
			<p>Transaction data loading...</p>
		</div>
	{/if}
</div>
