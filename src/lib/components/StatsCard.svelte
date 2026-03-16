<script lang="ts">
	let { label, value, sub = '' }: { label: string; value: string; sub?: string } = $props();
</script>

<div class="bg-tri-surface border border-tri-border rounded-lg p-4">
	<div class="text-tri-muted text-xs uppercase tracking-wider mb-1">{label}</div>
	<div class="text-tri-text text-lg font-semibold">{value}</div>
	{#if sub}
		<div class="text-tri-muted text-xs mt-1">{sub}</div>
	{/if}
</div>
