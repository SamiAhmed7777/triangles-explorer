<script lang="ts">
	let address = $state('');
	let signature = $state('');
	let message = $state('');
	let result = $state<{ valid: boolean; error?: string } | null>(null);
	let loading = $state(false);

	async function verify(e: Event) {
		e.preventDefault();
		loading = true;
		result = null;
		try {
			const res = await fetch('/api/verify', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ address, signature, message })
			});
			const data = await res.json();
			result = data;
		} catch (err) {
			result = { valid: false, error: err instanceof Error ? err.message : String(err) };
		} finally {
			loading = false;
		}
	}

	function fillExample() {
		address = 'TRsiRzkMWm87ZuWFwPB8YXFGYr5AQZo7fb';
		signature = 'H/gT/bFSL+WFT4F4WYPvDIVAnt0/M2WQy/ypUvhMtdXgAop+Euycakif9QERNcUfPLNF29vDxuXZf1BJjd8Snro=';
		message = 'ROGER THAT, TRIANGLES DEV ADDRESS IS A GO.\n\n5.9.23 IS LIVE.';
	}
</script>

<svelte:head>
	<title>Verify Signed Message - Triangles Explorer</title>
	<meta
		name="description"
		content="Verify the signature of any Triangles (TRI) signed message. Re-check cryptographic proof of address ownership."
	/>
</svelte:head>

<div class="mb-6">
	<h1 class="text-3xl font-bold text-white mb-2">Verify Signed Message</h1>
	<p class="text-tri-muted text-sm">
		Paste a Triangles address, a signed message, and the signature. The explorer will call the daemon's
		<code class="bg-tri-surface px-1 rounded text-tri-text">verifymessage</code> RPC and report whether the
		signature is valid for that address and message.
	</p>
</div>

<form onsubmit={verify} class="bg-tri-surface border border-tri-border rounded-lg p-6 space-y-4">
	<div>
		<label for="addr" class="block text-tri-muted text-xs uppercase tracking-wider mb-2">Address</label>
		<input
			id="addr"
			type="text"
			bind:value={address}
			placeholder="TRsiRzkMWm87ZuWFwPB8YXFGYr5AQZo7fb"
			class="w-full bg-tri-bg border border-tri-border rounded px-3 py-2 text-tri-text font-mono text-sm focus:outline-none focus:border-tri-accent"
			required
		/>
	</div>

	<div>
		<label for="msg" class="block text-tri-muted text-xs uppercase tracking-wider mb-2">Message</label>
		<textarea
			id="msg"
			bind:value={message}
			rows="5"
			placeholder="The exact message that was signed (preserve newlines)"
			class="w-full bg-tri-bg border border-tri-border rounded px-3 py-2 text-tri-text font-mono text-sm focus:outline-none focus:border-tri-accent whitespace-pre-wrap"
			required
		></textarea>
		<p class="text-tri-muted text-xs mt-1">
			If your source has literal <code class="bg-tri-bg px-1 rounded">\n</code> characters instead of real
			newlines, they will be converted automatically.
		</p>
	</div>

	<div>
		<label for="sig" class="block text-tri-muted text-xs uppercase tracking-wider mb-2">Signature</label>
		<textarea
			id="sig"
			bind:value={signature}
			rows="3"
			placeholder="Base64-encoded compact ECDSA signature"
			class="w-full bg-tri-bg border border-tri-border rounded px-3 py-2 text-tri-text font-mono text-xs focus:outline-none focus:border-tri-accent break-all"
			required
		></textarea>
	</div>

	<div class="flex items-center gap-3 pt-2">
		<button
			type="submit"
			disabled={loading}
			class="px-5 py-2 bg-tri-accent hover:bg-tri-accent-light disabled:bg-tri-muted text-white rounded transition-colors text-sm font-medium"
		>
			{loading ? 'Verifying…' : 'Verify Signature'}
		</button>
		<button
			type="button"
			onclick={fillExample}
			class="px-4 py-2 bg-tri-border/50 hover:bg-tri-border text-tri-text rounded transition-colors text-sm"
		>
			Fill with verified dev contact proof
		</button>
	</div>
</form>

{#if result}
	<div
		class="mt-6 rounded-lg p-5 border-2 {result.valid
			? 'bg-tri-green/10 border-tri-green/40'
			: 'bg-tri-yellow/10 border-tri-yellow/40'}"
	>
		<div class="flex items-center gap-2 mb-2">
			<span class="text-2xl {result.valid ? 'text-tri-green' : 'text-tri-yellow'}">
				{result.valid ? '✓' : '✗'}
			</span>
			<h2 class="text-white font-semibold text-lg">
				{result.valid ? 'Signature valid' : 'Signature invalid'}
			</h2>
		</div>
		<p class="text-tri-muted text-sm">
			{#if result.valid}
				The signature is cryptographically valid for the provided address and message. The holder
				of the private key for this address produced the signature.
			{:else}
				The signature does <strong>not</strong> match the address + message combination.
				{#if result.error}
					<br /><span class="text-tri-yellow">{result.error}</span>
				{/if}
			{/if}
		</p>
	</div>
{/if}

<div class="mt-8 bg-tri-surface border border-tri-border rounded-lg p-5 text-sm">
	<h3 class="text-white font-semibold mb-2">How this works</h3>
	<ol class="list-decimal list-inside text-tri-muted space-y-1">
		<li>The browser sends your input to <code class="bg-tri-bg px-1 rounded">/api/verify</code> (server-side).</li>
		<li>
			The server calls the Triangles daemon's <code class="bg-tri-bg px-1 rounded"
				>verifymessage</code
			>JSON-RPC with the trio.
		</li>
		<li>
			The daemon recovers the public key from the signature, hashes it, and compares to the address's
			hash. If they match, the signature is valid.
		</li>
	</ol>
	<p class="text-tri-muted text-xs mt-3">
		You can also run the same check yourself from the command line:<br />
		<code class="block mt-1 bg-tri-bg p-2 rounded text-tri-text font-mono text-xs break-all">
			trianglesd verifymessage "&lt;address&gt;" "&lt;signature&gt;" "&lt;message&gt;"
		</code>
	</p>
</div>
