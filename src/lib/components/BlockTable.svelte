<script lang="ts">
	import type { Block } from '$lib/types';
	import { truncateHash, timeAgo, blockType, formatDifficulty } from '$lib/utils';

	interface BlockWithAddresses extends Block {
		addresses?: string[];
	}

	let { blocks }: { blocks: BlockWithAddresses[] } = $props();
</script>

<div class="overflow-x-auto">
	<table class="w-full text-sm">
		<thead>
			<tr class="text-tri-muted text-xs uppercase tracking-wider border-b border-tri-border">
				<th class="text-left py-3 px-3">Height</th>
				<th class="text-left py-3 px-3">Hash</th>
				<th class="text-left py-3 px-3">Age</th>
				<th class="text-center py-3 px-3">Txs</th>
				<th class="text-left py-3 px-3">Addresses</th>
				<th class="text-center py-3 px-3">Type</th>
				<th class="text-right py-3 px-3">Difficulty</th>
			</tr>
		</thead>
		<tbody>
			{#each blocks as block}
				<tr class="border-b border-tri-border/50 hover:bg-tri-surface/50 transition-colors">
					<td class="py-2.5 px-3">
						<a href="/blocks/{block.height}" class="text-tri-accent hover:text-tri-accent-light">
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
					<td class="py-2.5 px-3">
						{#if block.addresses && block.addresses.length > 0}
							<div class="flex flex-wrap gap-1">
								{#each block.addresses.slice(0, 3) as addr}
									<a 
										href="/address/{addr}" 
										class="inline-block font-mono text-xs px-1.5 py-0.5 rounded bg-tri-surface-dark/50 text-tri-text hover:text-tri-accent-light hover:bg-tri-surface-dark transition-colors"
										title={addr}
									>
										{truncateHash(addr, 8)}
									</a>
								{/each}
								{#if block.addresses.length > 3}
									<span class="text-xs text-tri-muted">+{block.addresses.length - 3}</span>
								{/if}
							</div>
						{:else}
							<span class="text-tri-muted text-xs">—</span>
						{/if}
					</td>
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
