<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>Error {page.status} - Triangles Explorer</title>
</svelte:head>

<div class="flex flex-col items-center justify-center py-20">
	<div class="text-6xl font-bold text-tri-accent mb-4">{page.status}</div>
	<div class="text-tri-text text-xl mb-2">
		{#if page.status === 404}
			Not Found
		{:else}
			Something went wrong
		{/if}
	</div>
	<p class="text-tri-muted text-sm mb-6">{page.error?.message || 'An unexpected error occurred'}</p>
	<a href="/" class="bg-tri-accent hover:bg-tri-accent-light text-white px-6 py-2 rounded-lg text-sm transition-colors">
		Back to Home
	</a>
</div>
