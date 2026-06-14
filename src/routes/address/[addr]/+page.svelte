<script lang="ts">
	import TxTable from '$lib/components/TxTable.svelte';
	import QRCode from '$lib/components/QRCode.svelte';
	import { formatAmount, truncateHash, formatNumber } from '$lib/utils';

	let { data } = $props();
	
	// Copy address to clipboard
	let copied = $state(false);
	function copyAddress() {
		navigator.clipboard.writeText(data.address).then(() => {
			copied = true;
			setTimeout(() => copied = false, 2000);
		});
	}
</script>

<svelte:head>
	<title>Address {data.address} - Triangles Explorer</title>
	<meta name="description" content="Triangles address {data.address} - balance, transactions, and QR code" />
</svelte:head>

{#if data.indexError}
	<div class="mb-6">
		<h1 class="text-3xl font-bold text-white mb-3">Address Details</h1>
		<div class="bg-tri-yellow/10 border border-tri-yellow/30 rounded-lg p-4 text-tri-yellow text-sm">
			Address index is not enabled on this node. Start the daemon with <code class="bg-tri-surface px-1 rounded">-addressindex=1</code> to enable address lookups.
		</div>
	</div>
	
	<!-- Still show address and QR even if index disabled -->
	<div class="bg-tri-surface border border-tri-border rounded-lg p-6">
		<div class="text-center">
			<div class="inline-block mb-4">
				<QRCode data={data.address} size={256} />
			</div>
			<div class="font-mono text-sm text-tri-text break-all mb-3">{data.address}</div>
			<button 
				onclick={copyAddress}
				class="px-4 py-2 bg-tri-accent hover:bg-tri-accent-light text-white rounded transition-colors text-sm font-medium"
			>
				{copied ? '✓ Copied!' : 'Copy Address'}
			</button>
		</div>
	</div>
{:else}
	<!-- Header -->
	<div class="mb-6">
		<h1 class="text-3xl font-bold text-white mb-2">Triangles Address</h1>
		<p class="text-tri-muted text-sm">View balance, transactions, and QR code</p>
	</div>

	<!-- Main Grid: QR + Balance Info -->
	<div class="grid md:grid-cols-3 gap-6 mb-6">
		<!-- QR Code Card -->
		<div class="bg-tri-surface border border-tri-border rounded-lg p-6">
			<div class="text-center">
				<h2 class="text-white font-semibold mb-4">QR Code</h2>
				<div class="inline-block mb-4">
					<QRCode data={data.address} size={200} />
				</div>
				<p class="text-tri-muted text-xs mb-3">Scan to send TRI to this address</p>
			</div>
		</div>

		<!-- Address & Balance Info -->
		<div class="md:col-span-2 space-y-4">
			<!-- Address Display -->
			<div class="bg-tri-surface border border-tri-border rounded-lg p-6">
				<div class="text-tri-muted text-xs uppercase tracking-wider mb-2">Address</div>
				<div class="font-mono text-sm text-tri-text break-all mb-3">{data.address}</div>
				<button 
					onclick={copyAddress}
					class="px-4 py-2 bg-tri-accent hover:bg-tri-accent-light text-white rounded transition-colors text-sm font-medium"
				>
					{copied ? '✓ Copied!' : 'Copy Address'}
				</button>
			</div>

			<!-- Balance Stats -->
			{#if data.balance}
				<div class="grid grid-cols-2 gap-4">
					<div class="bg-tri-surface border border-tri-border rounded-lg p-4">
						<div class="text-tri-muted text-xs uppercase tracking-wider mb-1">Balance</div>
						<div class="text-2xl font-bold text-white">
							{formatAmount(data.balance.balance / 100000000)}
						</div>
						<div class="text-tri-muted text-xs mt-0.5">TRI</div>
					</div>
					<div class="bg-tri-surface border border-tri-border rounded-lg p-4">
						<div class="text-tri-muted text-xs uppercase tracking-wider mb-1">Received</div>
						<div class="text-2xl font-bold text-tri-green">
							{formatAmount(data.balance.received / 100000000)}
						</div>
						<div class="text-tri-muted text-xs mt-0.5">TRI</div>
					</div>
				</div>
			{:else}
				<div class="bg-tri-surface border border-tri-border rounded-lg p-6">
					<div class="text-tri-muted text-center">Balance information unavailable</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Additional Stats -->
	<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
		<div class="bg-tri-surface border border-tri-border rounded-lg p-4">
			<div class="text-tri-muted text-xs uppercase tracking-wider mb-1">Transactions</div>
			<div class="text-2xl font-bold text-white">{formatNumber(data.totalTxs)}</div>
		</div>
		<div class="bg-tri-surface border border-tri-border rounded-lg p-4">
			<div class="text-tri-muted text-xs uppercase tracking-wider mb-1">Unspent Outputs</div>
			<div class="text-2xl font-bold text-white">{formatNumber(data.utxos.length)}</div>
		</div>
		{#if data.balance}
			<div class="bg-tri-surface border border-tri-border rounded-lg p-4">
				<div class="text-tri-muted text-xs uppercase tracking-wider mb-1">Sent</div>
				<div class="text-xl font-bold text-tri-yellow">
					{formatAmount((data.balance.received - data.balance.balance) / 100000000)}
				</div>
				<div class="text-tri-muted text-xs mt-0.5">TRI</div>
			</div>
			<div class="bg-tri-surface border border-tri-border rounded-lg p-4">
				<div class="text-tri-muted text-xs uppercase tracking-wider mb-1">Net Activity</div>
				<div class="text-xl font-bold text-tri-accent">
					{formatAmount(data.balance.balance / 100000000)}
				</div>
				<div class="text-tri-muted text-xs mt-0.5">TRI</div>
			</div>
		{/if}
	</div>

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
							<tr class="border-b border-tri-border/50 hover:bg-tri-surface/50 transition-colors">
								<td class="py-2.5 px-3 font-mono text-xs">
									<a href="/tx/{utxo.txid}" class="text-tri-accent hover:text-tri-accent-light">{truncateHash(utxo.txid, 10)}</a>
								</td>
								<td class="py-2.5 px-3 text-center">{utxo.outputIndex}</td>
								<td class="py-2.5 px-3 text-right font-mono text-tri-green">{formatAmount(utxo.satoshis / 100000000)} TRI</td>
								<td class="py-2.5 px-3 text-right">
									<a href="/blocks/{utxo.height}" class="text-tri-accent hover:text-tri-accent-light">{utxo.height}</a>
								</td>
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
			<h2 class="text-white font-semibold">Transaction History ({formatNumber(data.totalTxs)})</h2>
		</div>
		{#if data.txs.length > 0}
			<TxTable txs={data.txs} />
			{#if data.totalTxs > 50}
				<div class="px-4 py-3 text-center text-tri-muted text-sm border-t border-tri-border">
					Showing 50 of {formatNumber(data.totalTxs)} transactions
				</div>
			{/if}
		{:else}
			<div class="p-8 text-center text-tri-muted">No transactions found</div>
		{/if}
	</div>
{/if}
