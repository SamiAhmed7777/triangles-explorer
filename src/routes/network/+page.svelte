<script lang="ts">
	import StatsCard from '$lib/components/StatsCard.svelte';
	import PeerTable from '$lib/components/PeerTable.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Network - Triangles Explorer</title>
</svelte:head>

<h1 class="text-2xl font-bold text-white mb-6">Network</h1>

{#if data.network}
	<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
		<StatsCard label="Connections" value={String(data.network.connections)} />
		<StatsCard label="Protocol Version" value={String(data.network.protocolversion)} />
		<StatsCard label="Client Version" value={String(data.network.version)} />
		<StatsCard label="Network" value={data.network.testnet ? 'Testnet' : 'Mainnet'} />
	</div>

	{#if data.network.errors}
		<div class="bg-tri-yellow/10 border border-tri-yellow/30 rounded-lg p-4 mb-6 text-tri-yellow text-sm">
			{data.network.errors}
		</div>
	{/if}
{/if}

<!-- Peers -->
<div class="bg-tri-surface border border-tri-border rounded-lg overflow-hidden">
	<div class="px-4 py-3 border-b border-tri-border">
		<h2 class="text-white font-semibold">Connected Peers ({data.peers.length})</h2>
	</div>
	{#if data.peers.length > 0}
		<PeerTable peers={data.peers} />
	{:else}
		<div class="p-8 text-center text-tri-muted">No peers connected</div>
	{/if}
</div>
