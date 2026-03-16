<script lang="ts">
	import type { PeerInfo } from '$lib/types';
	import { timeAgo } from '$lib/utils';

	let { peers }: { peers: PeerInfo[] } = $props();
</script>

<div class="overflow-x-auto">
	<table class="w-full text-sm">
		<thead>
			<tr class="text-tri-muted text-xs uppercase tracking-wider border-b border-tri-border">
				<th class="text-left py-3 px-3">Address</th>
				<th class="text-left py-3 px-3">Version</th>
				<th class="text-center py-3 px-3">Direction</th>
				<th class="text-right py-3 px-3">Height</th>
				<th class="text-right py-3 px-3">Connected</th>
			</tr>
		</thead>
		<tbody>
			{#each peers as peer}
				<tr class="border-b border-tri-border/50 hover:bg-tri-surface/50 transition-colors">
					<td class="py-2.5 px-3 font-mono text-xs">{peer.addr}</td>
					<td class="py-2.5 px-3 text-xs text-tri-muted">{peer.subver}</td>
					<td class="py-2.5 px-3 text-center">
						<span class="inline-block px-2 py-0.5 rounded text-xs font-medium {peer.inbound ? 'bg-tri-green/20 text-tri-green' : 'bg-tri-accent/20 text-tri-accent-light'}">
							{peer.inbound ? 'In' : 'Out'}
						</span>
					</td>
					<td class="py-2.5 px-3 text-right">{peer.startingheight}</td>
					<td class="py-2.5 px-3 text-right text-tri-muted">{timeAgo(peer.conntime)}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
