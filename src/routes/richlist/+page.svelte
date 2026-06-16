<script lang="ts">
	let { data } = $props();
	const SUPPLY = 2222222;
</script>

<svelte:head><title>Rich List - Triangles Block Explorer</title></svelte:head>

<div class="space-y-4">
	<h1 class="text-xl font-semibold text-tri-text">
		Rich List
		<span class="text-tri-muted text-sm font-normal">(top {data.richlist.length} of {data.total} addresses)</span>
	</h1>

	{#if data.error}
		<p class="text-tri-muted">Rich list is being generated, please check back shortly.</p>
	{:else}
		<div class="overflow-x-auto rounded-lg border border-tri-border">
			<table class="w-full text-sm">
				<thead>
					<tr class="text-tri-muted text-xs uppercase tracking-wider border-b border-tri-border">
						<th class="text-left py-3 px-3">#</th>
						<th class="text-left py-3 px-3">Address</th>
						<th class="text-right py-3 px-3">Balance (TRI)</th>
						<th class="text-right py-3 px-3">% of supply</th>
					</tr>
				</thead>
				<tbody>
					{#each data.richlist as e, i}
						<tr class="border-b border-tri-border/50 hover:bg-tri-surface/50 transition-colors">
							<td class="py-2.5 px-3 text-tri-muted">{i + 1}</td>
							<td class="py-2.5 px-3 font-mono text-xs">
								<a href="/address/{e.address}" class="text-tri-accent hover:text-tri-accent-light">{e.address}</a>
							</td>
							<td class="py-2.5 px-3 text-right font-mono">{e.balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
							<td class="py-2.5 px-3 text-right text-tri-muted">{(e.balance / SUPPLY * 100).toFixed(3)}%</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
