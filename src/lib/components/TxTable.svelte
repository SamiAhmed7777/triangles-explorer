<script lang="ts">
	import { truncateHash } from '$lib/utils';

	let { txids, limit = 0 }: { txids: string[]; limit?: number } = $props();
	const displayed = limit > 0 ? txids.slice(0, limit) : txids;
</script>

<div class="overflow-x-auto">
	<table class="w-full text-sm">
		<thead>
			<tr class="text-tri-muted text-xs uppercase tracking-wider border-b border-tri-border">
				<th class="text-left py-3 px-3">#</th>
				<th class="text-left py-3 px-3">Transaction ID</th>
			</tr>
		</thead>
		<tbody>
			{#each displayed as txid, i}
				<tr class="border-b border-tri-border/50 hover:bg-tri-surface/50 transition-colors">
					<td class="py-2.5 px-3 text-tri-muted">{i + 1}</td>
					<td class="py-2.5 px-3 font-mono text-xs">
						<a href="/tx/{txid}" class="text-tri-accent hover:text-tri-accent-light">
							{truncateHash(txid, 16)}
						</a>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
