<script lang="ts">
	import TxTable from '$lib/components/TxTable.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Mempool - Triangles Explorer</title>
</svelte:head>

<div class="mb-6">
	<h1 class="text-2xl font-bold text-white">Mempool</h1>
	<p class="text-tri-muted text-sm mt-1">{data.totalTxs} unconfirmed transaction{data.totalTxs !== 1 ? 's' : ''}</p>
</div>

<div class="bg-tri-surface border border-tri-border rounded-lg overflow-hidden">
	{#if data.txs.length > 0}
		<TxTable txs={data.txs} />
	{:else}
		<div class="p-8 text-center text-tri-muted">Mempool is empty</div>
	{/if}
</div>
