<script lang="ts">
	const endpoints = [
		{ method: 'GET', path: '/rest/chaininfo', desc: 'Chain state: height, best block hash, supply, difficulty' },
		{ method: 'GET', path: '/rest/block/{hash}', desc: 'Block details by hash. Append .hex for raw hex.' },
		{ method: 'GET', path: '/rest/blockheader/{hash}', desc: 'Block header (lightweight, no tx list)' },
		{ method: 'GET', path: '/rest/blockbyheight/{n}', desc: 'Block details by height' },
		{ method: 'GET', path: '/rest/blockhashbyheight/{n}', desc: 'Get block hash at a given height' },
		{ method: 'GET', path: '/rest/tx/{txid}', desc: 'Transaction details. Append .hex for raw hex.' },
		{ method: 'GET', path: '/rest/mempool', desc: 'List of unconfirmed transaction IDs' },
		{ method: 'GET', path: '/rest/difficulty', desc: 'Current PoW and PoS difficulty' },
		{ method: 'GET', path: '/rest/supply', desc: 'UTXO set statistics and total supply' },
		{ method: 'GET', path: '/rest/staking', desc: 'Staking network stats (weight, difficulty, expected time)' },
		{ method: 'GET', path: '/rest/mining', desc: 'Mining info (hashrate, block value, stake interest)' },
		{ method: 'GET', path: '/rest/subsidy', desc: 'Current block subsidy/reward' },
		{ method: 'GET', path: '/rest/estimatefee', desc: 'Estimated fee per kilobyte' },
		{ method: 'GET', path: '/rest/checkpoint', desc: 'Sync checkpoint information' },
		{ method: 'GET', path: '/rest/network', desc: 'Network info (version, connections, proxy)' },
		{ method: 'GET', path: '/rest/peers', desc: 'List of connected peers with details' },
		{ method: 'GET', path: '/rest/validate/{addr}', desc: 'Validate a Triangles address' },
		{ method: 'GET', path: '/rest/address/{addr}/balance', desc: 'Address balance (requires -addressindex=1)' },
		{ method: 'GET', path: '/rest/address/{addr}/utxos', desc: 'Address unspent outputs (requires -addressindex=1)' },
		{ method: 'GET', path: '/rest/address/{addr}/txids', desc: 'Address transaction history. Supports ?start=N&end=N (requires -addressindex=1)' },
		{ method: 'POST', path: '/rest/tx/decode', desc: 'Decode a raw transaction. Body: {"hex":"..."}' },
		{ method: 'POST', path: '/rest/tx/send', desc: 'Broadcast a raw transaction. Body: {"hex":"..."}' },
	];

	const walletEndpoints = [
		{ method: 'GET', path: '/rest/wallet/info', desc: 'Wallet summary (balance, tx count, keypool)' },
		{ method: 'GET', path: '/rest/wallet/balance', desc: 'Wallet balance' },
		{ method: 'GET', path: '/rest/wallet/transactions', desc: 'Recent wallet transactions. Supports ?count=N&skip=N' },
		{ method: 'GET', path: '/rest/wallet/transaction/{txid}', desc: 'Wallet transaction detail' },
		{ method: 'GET', path: '/rest/wallet/unspent', desc: 'Wallet unspent outputs. Supports ?minconf=N&maxconf=N' },
		{ method: 'GET', path: '/rest/wallet/addresses', desc: 'Wallet address groupings' },
		{ method: 'GET', path: '/rest/wallet/staking', desc: 'Staking info for this wallet' },
		{ method: 'POST', path: '/rest/wallet/address/new', desc: 'Generate a new receiving address' },
		{ method: 'POST', path: '/rest/wallet/send', desc: 'Send coins. Body: {"address":"...", "amount":N}' },
		{ method: 'POST', path: '/rest/wallet/sendmany', desc: 'Send to multiple addresses. Body: {"recipients":{"addr":amount}}' },
		{ method: 'POST', path: '/rest/wallet/unlock', desc: 'Unlock wallet. Body: {"passphrase":"...", "timeout":N}' },
		{ method: 'POST', path: '/rest/wallet/lock', desc: 'Lock the wallet' },
	];
</script>

<svelte:head>
	<title>API Documentation - Triangles Explorer</title>
</svelte:head>

<h1 class="text-2xl font-bold text-white mb-2">REST API Documentation</h1>
<p class="text-tri-muted text-sm mb-8">
	The Triangles daemon exposes a REST API on the RPC port (default 19112) when started with <code class="bg-tri-surface px-1 rounded">-rest=1</code>.
	All responses are JSON. Public endpoints require no authentication.
</p>

<!-- Public Endpoints -->
<div class="bg-tri-surface border border-tri-border rounded-lg mb-8 overflow-hidden">
	<div class="px-4 py-3 border-b border-tri-border">
		<h2 class="text-white font-semibold">Public Endpoints</h2>
		<p class="text-tri-muted text-xs mt-1">No authentication required. Rate limited.</p>
	</div>
	<div class="divide-y divide-tri-border/50">
		{#each endpoints as ep}
			<div class="px-4 py-3 hover:bg-tri-bg/30 transition-colors">
				<div class="flex items-center gap-2 mb-1">
					<span class="inline-block px-2 py-0.5 rounded text-xs font-bold {ep.method === 'GET' ? 'bg-tri-green/20 text-tri-green' : 'bg-tri-accent/20 text-tri-accent-light'}">
						{ep.method}
					</span>
					<code class="text-tri-text text-sm">{ep.path}</code>
				</div>
				<p class="text-tri-muted text-xs ml-14">{ep.desc}</p>
			</div>
		{/each}
	</div>
</div>

<!-- Wallet Endpoints -->
<div class="bg-tri-surface border border-tri-border rounded-lg overflow-hidden">
	<div class="px-4 py-3 border-b border-tri-border">
		<h2 class="text-white font-semibold">Wallet Endpoints</h2>
		<p class="text-tri-muted text-xs mt-1">Require HTTP Basic Auth (RPC credentials) or Bearer token (<code>-restapikey</code>).</p>
	</div>
	<div class="divide-y divide-tri-border/50">
		{#each walletEndpoints as ep}
			<div class="px-4 py-3 hover:bg-tri-bg/30 transition-colors">
				<div class="flex items-center gap-2 mb-1">
					<span class="inline-block px-2 py-0.5 rounded text-xs font-bold {ep.method === 'GET' ? 'bg-tri-green/20 text-tri-green' : 'bg-tri-accent/20 text-tri-accent-light'}">
						{ep.method}
					</span>
					<code class="text-tri-text text-sm">{ep.path}</code>
				</div>
				<p class="text-tri-muted text-xs ml-14">{ep.desc}</p>
			</div>
		{/each}
	</div>
</div>

<!-- Configuration -->
<div class="bg-tri-surface border border-tri-border rounded-lg mt-8 p-6">
	<h2 class="text-white font-semibold mb-4">Configuration</h2>
	<div class="space-y-3 text-sm">
		<div>
			<code class="text-tri-accent">-rest=1</code>
			<span class="text-tri-muted ml-2">Enable the REST API</span>
		</div>
		<div>
			<code class="text-tri-accent">-addressindex=1</code>
			<span class="text-tri-muted ml-2">Enable address index (required for /address/* endpoints)</span>
		</div>
		<div>
			<code class="text-tri-accent">-restcorsorigin=*</code>
			<span class="text-tri-muted ml-2">Set CORS allowed origin (default: *)</span>
		</div>
		<div>
			<code class="text-tri-accent">-restapikey=&lt;token&gt;</code>
			<span class="text-tri-muted ml-2">Bearer token for wallet endpoint authentication</span>
		</div>
		<div>
			<code class="text-tri-accent">-restratelimit=30</code>
			<span class="text-tri-muted ml-2">Rate limit per IP per second (default: 30, 0=disabled)</span>
		</div>
	</div>
</div>
