<script lang="ts">
	import type { Block } from '$lib/types';
	import { truncateHash, timeAgo, blockType, formatDifficulty } from '$lib/utils';

	let { blocks }: { blocks: Block[] } = $props();
</script>

<div class="overflow-x-auto">
	<table class="w-full text-sm">
		<thead>
			<tr class="text-tri-muted text-xs uppercase tracking-wider border-b border-tri-border">
				<th class="text-left py-3 px-3">Height</th>
				<th class="text-left py-3 px-3">Hash</th>
				<th class="text-left py-3 px-3">Age</th>
				<th class="text-center py-3 px-3">Txs</th>
				<th class="text-center py-3 px-3">Type</th>
				<th class="text-right py-3 px-3">Difficulty</th>
			</tr>
		</thead>
		<tbody>
			{#each blocks as block}
				<tr class="border-b border-tri-border/50 hover:bg-tri-surface/50 transition-colors">
					<td class="py-2.5 px-3">
						<a href="/block/{block.hash}" class="text-tri-accent hover:text-tri-accent-light">
							{block.height}
						</a>
					</td>
					<td class="py-2.5 px-3 font-mono text-xs">
						<a href="/block/{block.hash}" class="text-tri-text hover:text-tri-accent-light">
							{truncateHash(block.hash, 10)}
						</a>
					</td>
					<td class="py-2.5 px-3 text-tri-muted">{timeAgo(block.time)}</td>
					<td class="py-2.5 px-3 text-center">{block.tx.length}</td>
					<td class="py-2.5 px-3 text-center">
						<span class="inline-block px-2 py-0.5 rounded text-xs font-medium {block.flags.includes('proof-of-stake') ? 'bg-tri-green/20 text-tri-green' : 'bg-tri-yellow/20 text-tri-yellow'}">
							{blockType(block.flags)}
						</span>
					</td>
					<td class="py-2.5 px-3 text-right font-mono text-xs">{formatDifficulty(block.difficulty)}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
