<script lang="ts">
	import BlockTable from '$lib/components/BlockTable.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { formatNumber } from '$lib/utils';

	let { data } = $props();
</script>

<svelte:head>
	<title>Blocks - Triangles Explorer</title>
</svelte:head>

<div class="mb-6">
	<h1 class="text-2xl font-bold text-white">Blocks</h1>
	<p class="text-tri-muted text-sm mt-1">Total: {formatNumber(data.totalBlocks)} blocks</p>
</div>

<div class="bg-tri-surface border border-tri-border rounded-lg overflow-hidden">
	{#if data.blocks.length > 0}
		<BlockTable blocks={data.blocks} />
	{:else}
		<div class="p-8 text-center text-tri-muted">No blocks available</div>
	{/if}
</div>

<Pagination page={data.page} hasNext={data.hasNext} basePath="/blocks" />
