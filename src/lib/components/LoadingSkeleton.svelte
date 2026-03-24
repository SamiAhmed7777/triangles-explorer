<script lang="ts">
	let { 
		rows = 3,
		type = 'text'
	} = $props<{
		rows?: number;
		type?: 'text' | 'card' | 'table';
	}>();
</script>

{#if type === 'text'}
	<div class="space-y-3 animate-pulse">
		{#each Array(rows) as _, i}
			<div class="h-4 bg-tri-border/30 rounded" style="width: {90 - (i * 10)}%"></div>
		{/each}
	</div>
{:else if type === 'card'}
	<div class="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
		{#each Array(rows) as _}
			<div class="bg-tri-surface border border-tri-border rounded-lg p-4">
				<div class="h-3 bg-tri-border/30 rounded w-1/2 mb-3"></div>
				<div class="h-6 bg-tri-border/30 rounded w-3/4"></div>
			</div>
		{/each}
	</div>
{:else if type === 'table'}
	<div class="animate-pulse">
		<div class="flex gap-4 border-b border-tri-border pb-3 mb-3">
			{#each Array(5) as _}
				<div class="h-3 bg-tri-border/30 rounded flex-1"></div>
			{/each}
		</div>
		{#each Array(rows) as _}
			<div class="flex gap-4 py-3">
				{#each Array(5) as _}
					<div class="h-4 bg-tri-border/20 rounded flex-1"></div>
				{/each}
			</div>
		{/each}
	</div>
{/if}
