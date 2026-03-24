<script lang="ts">
	import { formatTimestamp, formatAmount, truncateHash } from '$lib/utils';

	let { data } = $props();
	const tx = data.tx;
	
	// Extract unique addresses from outputs
	const addresses = new Set<string>();
	tx.vout.forEach(out => {
		if (out.scriptPubKey.addresses) {
			out.scriptPubKey.addresses.forEach(addr => addresses.add(addr));
		}
	});
	const uniqueAddresses = Array.from(addresses);
</script>

<svelte:head>
	<title>Tx {truncateHash(tx.txid, 8)} - Triangles Explorer</title>
</svelte:head>

<div class="mb-6">
	<h1 class="text-2xl font-bold text-white">Transaction</h1>
	<p class="text-tri-muted text-xs font-mono mt-1 break-all">{tx.txid}</p>
</div>

<!-- Tx Info -->
<div class="bg-tri-surface border border-tri-border rounded-lg mb-6">
	<div class="px-4 py-3 border-b border-tri-border">
		<h2 class="text-white font-semibold">Details</h2>
	</div>
	<div class="grid grid-cols-1 md:grid-cols-2 gap-px bg-tri-border">
		{#if tx.blockhash}
			<div class="bg-tri-surface px-4 py-3">
				<span class="text-tri-muted text-xs uppercase tracking-wider">Block</span>
				<div class="text-sm mt-0.5">
					<a href="/block/{tx.blockhash}" class="text-tri-accent hover:text-tri-accent-light font-mono">{truncateHash(tx.blockhash, 12)}</a>
				</div>
			</div>
		{/if}
		<div class="bg-tri-surface px-4 py-3">
			<span class="text-tri-muted text-xs uppercase tracking-wider">Confirmations</span>
			<div class="text-tri-text text-sm mt-0.5">{tx.confirmations ?? 'Unconfirmed'}</div>
		</div>
		<div class="bg-tri-surface px-4 py-3">
			<span class="text-tri-muted text-xs uppercase tracking-wider">Timestamp</span>
			<div class="text-tri-text text-sm mt-0.5 font-mono">{formatTimestamp(tx.time)}</div>
		</div>
		<div class="bg-tri-surface px-4 py-3">
			<span class="text-tri-muted text-xs uppercase tracking-wider">Version</span>
			<div class="text-tri-text text-sm mt-0.5">{tx.version}</div>
		</div>
	</div>
</div>

<!-- Addresses Involved -->
{#if uniqueAddresses.length > 0}
<div class="bg-tri-surface border border-tri-border rounded-lg mb-6">
	<div class="px-4 py-3 border-b border-tri-border">
		<h2 class="text-white font-semibold">Addresses Involved ({uniqueAddresses.length})</h2>
	</div>
	<div class="px-4 py-4">
		<div class="flex flex-wrap gap-2">
			{#each uniqueAddresses as addr}
				<a 
					href="/address/{addr}" 
					class="inline-block font-mono text-xs px-3 py-1.5 rounded bg-tri-surface-dark border border-tri-border text-tri-text hover:text-tri-accent hover:border-tri-accent transition-colors"
				>
					{addr}
				</a>
			{/each}
		</div>
	</div>
</div>
{/if}

<!-- Inputs -->
<div class="bg-tri-surface border border-tri-border rounded-lg mb-6 overflow-hidden">
	<div class="px-4 py-3 border-b border-tri-border">
		<h2 class="text-white font-semibold">Inputs ({tx.vin.length})</h2>
	</div>
	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<thead>
				<tr class="text-tri-muted text-xs uppercase tracking-wider border-b border-tri-border">
					<th class="text-left py-3 px-3">#</th>
					<th class="text-left py-3 px-3">Source</th>
					<th class="text-left py-3 px-3">Script</th>
				</tr>
			</thead>
			<tbody>
				{#each tx.vin as vin, i}
					<tr class="border-b border-tri-border/50">
						<td class="py-2.5 px-3 text-tri-muted">{i}</td>
						<td class="py-2.5 px-3 font-mono text-xs">
							{#if vin.coinbase}
								<span class="text-tri-green">Coinbase / Staking reward</span>
							{:else if vin.txid}
								<a href="/tx/{vin.txid}" class="text-tri-accent hover:text-tri-accent-light">
									{truncateHash(vin.txid, 10)}:{vin.vout}
								</a>
							{/if}
						</td>
						<td class="py-2.5 px-3 font-mono text-xs text-tri-muted max-w-xs truncate">
							{vin.scriptSig?.asm || vin.coinbase || ''}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<!-- Outputs -->
<div class="bg-tri-surface border border-tri-border rounded-lg overflow-hidden">
	<div class="px-4 py-3 border-b border-tri-border">
		<h2 class="text-white font-semibold">Outputs ({tx.vout.length})</h2>
	</div>
	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<thead>
				<tr class="text-tri-muted text-xs uppercase tracking-wider border-b border-tri-border">
					<th class="text-left py-3 px-3">#</th>
					<th class="text-left py-3 px-3">Address</th>
					<th class="text-right py-3 px-3">Amount</th>
					<th class="text-left py-3 px-3">Type</th>
				</tr>
			</thead>
			<tbody>
				{#each tx.vout as vout}
					<tr class="border-b border-tri-border/50">
						<td class="py-2.5 px-3 text-tri-muted">{vout.n}</td>
						<td class="py-2.5 px-3 font-mono text-xs">
							{#if vout.scriptPubKey.addresses}
								{#each vout.scriptPubKey.addresses as addr}
									<a href="/address/{addr}" class="text-tri-accent hover:text-tri-accent-light">{addr}</a>
								{/each}
							{:else}
								<span class="text-tri-muted">N/A</span>
							{/if}
						</td>
						<td class="py-2.5 px-3 text-right font-mono text-tri-green">{formatAmount(vout.value)} TRI</td>
						<td class="py-2.5 px-3 text-xs text-tri-muted">{vout.scriptPubKey.type}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
