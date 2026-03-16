<script lang="ts">
	import TxTable from '$lib/components/TxTable.svelte';
	import { formatTimestamp, formatDifficulty, blockType, truncateHash } from '$lib/utils';

	let { data } = $props();
	const block = data.block;

	const fields: [string, string][] = [
		['Height', String(block.height)],
		['Confirmations', String(block.confirmations)],
		['Timestamp', formatTimestamp(block.time)],
		['Type', blockType(block.flags)],
		['Difficulty', formatDifficulty(block.difficulty)],
		['Transactions', String(block.tx.length)],
		['Merkle Root', truncateHash(block.merkleroot, 16)],
		['Nonce', String(block.nonce)],
		['Bits', block.bits],
		['Size', block.size ? `${block.size} bytes` : 'N/A'],
		['Mint', String(block.mint)],
		['Flags', block.flags]
	];
</script>

<svelte:head>
	<title>Block {block.height} - Triangles Explorer</title>
</svelte:head>

<!-- Navigation -->
<div class="flex items-center justify-between mb-6">
	<div>
		<h1 class="text-2xl font-bold text-white">Block {block.height}</h1>
		<p class="text-tri-muted text-xs font-mono mt-1 break-all">{block.hash}</p>
	</div>
	<div class="flex gap-2 shrink-0">
		{#if block.previousblockhash}
			<a href="/block/{block.previousblockhash}" class="bg-tri-surface border border-tri-border text-tri-text px-3 py-1.5 rounded text-sm hover:border-tri-accent transition-colors">&larr; Prev</a>
		{/if}
		{#if block.nextblockhash}
			<a href="/block/{block.nextblockhash}" class="bg-tri-surface border border-tri-border text-tri-text px-3 py-1.5 rounded text-sm hover:border-tri-accent transition-colors">Next &rarr;</a>
		{/if}
	</div>
</div>

<!-- Block Info -->
<div class="bg-tri-surface border border-tri-border rounded-lg mb-6">
	<div class="px-4 py-3 border-b border-tri-border">
		<h2 class="text-white font-semibold">Block Details</h2>
	</div>
	<div class="grid grid-cols-1 md:grid-cols-2 gap-px bg-tri-border">
		{#each fields as [label, value]}
			<div class="bg-tri-surface px-4 py-3">
				<span class="text-tri-muted text-xs uppercase tracking-wider">{label}</span>
				<div class="text-tri-text text-sm mt-0.5 font-mono break-all">{value}</div>
			</div>
		{/each}
	</div>
</div>

<!-- Transactions -->
<div class="bg-tri-surface border border-tri-border rounded-lg overflow-hidden">
	<div class="px-4 py-3 border-b border-tri-border">
		<h2 class="text-white font-semibold">Transactions ({block.tx.length})</h2>
	</div>
	<TxTable txids={block.tx} />
</div>
