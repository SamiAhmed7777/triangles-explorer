<script lang="ts">
	import TxTable from '$lib/components/TxTable.svelte';
	import { formatAmount, truncateHash } from '$lib/utils';

	let { data } = $props();
</script>

<svelte:head>
	<title>Address {data.address} - Triangles Explorer</title>
</svelte:head>

<div class="mb-6">
	<h1 class="text-2xl font-bold text-white">Address</h1>
	<p class="text-tri-accent text-sm font-mono mt-1 break-all">{data.address}</p>
</div>

{#if data.indexError}
	<div class="bg-tri-yellow/10 border border-tri-yellow/30 rounded-lg p-4 text-tri-yellow text-sm">
		Address index is not enabled on this node. Start the daemon with <code class="bg-tri-surface px-1 rounded">-addressindex=1</code> to enable address lookups.
	</div>
{:else}
	<!-- Balance -->
	{#if data.balance}
		<div class="bg-tri-surface border border-tri-border rounded-lg p-6 mb-6">
			<div class="text-tri-muted text-xs uppercase tracking-wider mb-1">Balance</div>
			<div class="text-3xl font-bold text-white">
				{formatAmount(data.balance.balance / 100000000)} <span class="text-tri-muted text-lg">TRI</span>
			</div>
			<div class="text-tri-muted text-sm mt-1">
				Total received: {formatAmount(data.balance.received / 100000000)} TRI
			</div>
		</div>
	{/if}

	<!-- UTXOs -->
	{#if data.utxos.length > 0}
		<div class="bg-tri-surface border border-tri-border rounded-lg mb-6 overflow-hidden">
			<div class="px-4 py-3 border-b border-tri-border">
				<h2 class="text-white font-semibold">Unspent Outputs ({data.utxos.length})</h2>
			</div>
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead>
						<tr class="text-tri-muted text-xs uppercase tracking-wider border-b border-tri-border">
							<th class="text-left py-3 px-3">Txid</th>
							<th class="text-center py-3 px-3">Index</th>
							<th class="text-right py-3 px-3">Amount</th>
							<th class="text-right py-3 px-3">Height</th>
						</tr>
					</thead>
					<tbody>
						{#each data.utxos as utxo}
							<tr class="border-b border-tri-border/50">
								<td class="py-2.5 px-3 font-mono text-xs">
									<a href="/tx/{utxo.txid}" class="text-tri-accent hover:text-tri-accent-light">{truncateHash(utxo.txid, 10)}</a>
								</td>
								<td class="py-2.5 px-3 text-center">{utxo.outputIndex}</td>
								<td class="py-2.5 px-3 text-right font-mono text-tri-green">{formatAmount(utxo.satoshis / 100000000)} TRI</td>
								<td class="py-2.5 px-3 text-right">{utxo.height}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}

	<!-- Transaction History -->
	<div class="bg-tri-surface border border-tri-border rounded-lg overflow-hidden">
		<div class="px-4 py-3 border-b border-tri-border">
			<h2 class="text-white font-semibold">Transactions ({data.txids.length})</h2>
		</div>
		{#if data.txids.length > 0}
			<TxTable txids={data.txids} limit={50} />
			{#if data.txids.length > 50}
				<div class="px-4 py-3 text-center text-tri-muted text-sm border-t border-tri-border">
					Showing 50 of {data.txids.length} transactions
				</div>
			{/if}
		{:else}
			<div class="p-8 text-center text-tri-muted">No transactions found</div>
		{/if}
	</div>
{/if}
