<script lang="ts">
	import type { TransactionSummary } from '$lib/types';
	import { formatAmount, formatTimestamp, truncateHash } from '$lib/utils';

	type Props = {
		txs?: TransactionSummary[];
		txids?: string[];
		limit?: number;
	};

	let { txs = [], txids = [], limit = 0 }: Props = $props();

	function displayed(): TransactionSummary[] {
		const source = txs.length > 0 ? txs : txids.map((txid) => ({ txid }));
		return limit > 0 ? source.slice(0, limit) : source;
	}
</script>

<div class="overflow-x-auto">
	<table class="w-full text-sm">
		<thead>
			<tr class="text-tri-muted text-xs uppercase tracking-wider border-b border-tri-border">
				<th class="text-left py-3 px-3">#</th>
				<th class="text-left py-3 px-3">Transaction ID</th>
				<th class="text-left py-3 px-3">Time</th>
				<th class="text-right py-3 px-3">Confirmations</th>
				<th class="text-right py-3 px-3">Outputs</th>
				<th class="text-right py-3 px-3">Total Output</th>
			</tr>
		</thead>
		<tbody>
			{#each displayed() as tx, i}
				<tr class="border-b border-tri-border/50 hover:bg-tri-surface/50 transition-colors">
					<td class="py-2.5 px-3 text-tri-muted">{i + 1}</td>
					<td class="py-2.5 px-3 font-mono text-xs">
						<a href="/tx/{tx.txid}" class="text-tri-accent hover:text-tri-accent-light">
							{truncateHash(tx.txid, 16)}
						</a>
						{#if tx.primaryAddress}
							<div class="mt-1 text-tri-muted">
								{#if tx.isReward}
									Reward to
								{:else}
									First output
								{/if}
								{' '}
								{truncateHash(tx.primaryAddress, 10)}
							</div>
						{/if}
					</td>
					<td class="py-2.5 px-3 text-xs text-tri-muted whitespace-nowrap">
						{#if tx.time != null}
							{formatTimestamp(tx.time)}
						{:else}
							<span class="text-tri-muted/60">Unavailable</span>
						{/if}
					</td>
					<td class="py-2.5 px-3 text-right">
						{#if tx.confirmations != null}
							<span class="font-mono text-xs">{tx.confirmations}</span>
						{:else}
							<span class="text-tri-yellow text-xs">Pending</span>
						{/if}
					</td>
					<td class="py-2.5 px-3 text-right font-mono text-xs">
						{tx.outputCount ?? '—'}
					</td>
					<td class="py-2.5 px-3 text-right font-mono text-xs">
						{#if tx.totalOutput != null}
							<span class="text-tri-green">{formatAmount(tx.totalOutput)} TRI</span>
						{:else}
							<span class="text-tri-muted/60">Unavailable</span>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
