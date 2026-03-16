<script lang="ts">
	import { goto } from '$app/navigation';
	import { isBlockHash, isNumeric, isAddress } from '$lib/utils';

	let query = $state('');

	function handleSearch() {
		const q = query.trim();
		if (!q) return;

		if (isNumeric(q)) {
			goto(`/blocks/${q}`);
		} else if (isBlockHash(q)) {
			goto(`/search?q=${q}`);
		} else if (isAddress(q)) {
			goto(`/address/${q}`);
		} else {
			goto(`/search?q=${q}`);
		}
		query = '';
	}
</script>

<form onsubmit={handleSearch} class="flex w-full max-w-xl">
	<input
		type="text"
		bind:value={query}
		placeholder="Search block hash, height, txid, or address..."
		class="flex-1 bg-tri-surface border border-tri-border rounded-l-lg px-4 py-2 text-sm text-tri-text placeholder-tri-muted focus:outline-none focus:border-tri-accent"
	/>
	<button
		type="submit"
		class="bg-tri-accent hover:bg-tri-accent-light text-white px-4 py-2 rounded-r-lg text-sm font-medium transition-colors"
	>
		Search
	</button>
</form>
