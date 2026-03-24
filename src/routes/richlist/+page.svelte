<script lang="ts">
	import { formatAmount, formatNumber } from '$lib/utils';

	let { data } = $props();
</script>

<svelte:head>
	<title>Rich List - Triangles Block Explorer</title>
</svelte:head>

<h1 class="text-3xl font-bold mb-6">Rich List - Top Holders</h1>

<!-- Scanner Status Banner -->
{#if data.scannerStatus.status === 'scanning'}
	<div class="bg-tri-accent/10 border border-tri-accent/30 rounded-lg p-4 mb-6">
		<div class="flex items-center justify-between mb-2">
			<span class="font-semibold">⏳ Building Rich List Database</span>
			<span class="text-sm text-tri-muted">{data.scannerStatus.progress.toFixed(2)}% complete</span>
		</div>
		<div class="w-full bg-tri-border rounded-full h-2 overflow-hidden">
			<div 
				class="bg-tri-accent h-full transition-all duration-500" 
				style="width: {data.scannerStatus.progress}%"
			></div>
		</div>
		<p class="text-sm text-tri-muted mt-2">
			Processing block {formatNumber(data.scannerStatus.lastProcessedBlock)} of {formatNumber(data.scannerStatus.chainHeight)}
		</p>
	</div>
{:else if data.scannerStatus.status === 'synced'}
	<div class="bg-tri-green/10 border border-tri-green/30 rounded-lg p-3 mb-6 text-sm">
		✅ Rich list is fully synced — Tracking {formatNumber(data.scannerStatus.totalAddresses)} addresses
	</div>
{/if}

<!-- Rich List Table -->
{#if data.richlist.length > 0}
	<div class="bg-tri-surface border border-tri-border rounded-lg overflow-hidden">
		<table class="w-full">
			<thead class="bg-tri-border/50">
				<tr class="text-left text-sm text-tri-muted">
					<th class="px-4 py-3 font-semibold">Rank</th>
					<th class="px-4 py-3 font-semibold">Address</th>
					<th class="px-4 py-3 font-semibold text-right">Balance</th>
					<th class="px-4 py-3 font-semibold text-right">% of Supply</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-tri-border">
				{#each data.richlist as entry, index}
					<tr class="hover:bg-tri-border/30 transition-colors">
						<td class="px-4 py-3 text-tri-muted">#{index + 1}</td>
						<td class="px-4 py-3">
							<a 
								href="/address/{entry.address}" 
								class="text-tri-accent hover:text-tri-accent-light font-mono text-sm"
							>
								{entry.address}
							</a>
						</td>
						<td class="px-4 py-3 text-right font-mono">{formatAmount(entry.balance)} TRI</td>
						<td class="px-4 py-3 text-right text-tri-muted text-sm">
							{((entry.balance / 222222) * 100).toFixed(4)}%
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	{#if data.total > data.richlist.length}
		<p class="text-center text-tri-muted text-sm mt-4">
			Showing top {data.richlist.length} of {formatNumber(data.total)} addresses
		</p>
	{/if}
{:else if data.status === 'scanning'}
	<div class="bg-tri-surface border border-tri-border rounded-lg p-12 text-center">
		<p class="text-tri-muted mb-2">⏳ Rich list is still being generated</p>
		<p class="text-sm text-tri-muted">Check back soon!</p>
	</div>
{:else}
	<div class="bg-tri-surface border border-tri-border rounded-lg p-12 text-center">
		<p class="text-tri-muted">No rich list data available</p>
	</div>
{/if}
