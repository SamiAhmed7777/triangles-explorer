<script lang="ts">
	let { page, hasNext, basePath }: { page: number; hasNext: boolean; basePath: string } = $props();
</script>

<div class="flex items-center justify-between mt-6">
	{#if page > 1}
		<a
			href="{basePath}?page={page - 1}"
			class="bg-tri-surface border border-tri-border text-tri-text px-4 py-2 rounded-lg text-sm hover:border-tri-accent transition-colors"
		>
			Previous
		</a>
	{:else}
		<div></div>
	{/if}

	<span class="text-tri-muted text-sm">Page {page}</span>

	{#if hasNext}
		<a
			href="{basePath}?page={page + 1}"
			class="bg-tri-surface border border-tri-border text-tri-text px-4 py-2 rounded-lg text-sm hover:border-tri-accent transition-colors"
		>
			Next
		</a>
	{:else}
		<div></div>
	{/if}
</div>
