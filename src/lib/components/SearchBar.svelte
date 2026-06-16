<script lang="ts">
	import { goto } from '$app/navigation';

	let query = $state('');

	function handleSearch(e: Event) {
		e.preventDefault();
		const q = query.trim();
		if (!q) return;
		// Delegate disambiguation (height / block hash / txid / address) to the
		// /search server loader, which redirects to the correct page.
		goto(`/search?q=${encodeURIComponent(q)}`);
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
