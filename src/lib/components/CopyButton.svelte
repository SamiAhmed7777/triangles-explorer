<script lang="ts">
	import { browser } from '$app/environment';
	
	let { value, label = 'Copy', size = 'sm' } = $props<{
		value: string;
		label?: string;
		size?: 'xs' | 'sm' | 'md';
	}>();
	
	let copied = $state(false);
	let timeoutId: ReturnType<typeof setTimeout> | null = null;
	
	async function copyToClipboard() {
		if (!browser || !value) return;
		
		try {
			await navigator.clipboard.writeText(value);
			copied = true;
			
			if (timeoutId) clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				copied = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}
	
	const sizeClasses = {
		xs: 'text-xs px-1.5 py-0.5',
		sm: 'text-sm px-2 py-1',
		md: 'text-base px-3 py-1.5'
	};
</script>

<button
	onclick={copyToClipboard}
	class="inline-flex items-center gap-1 {sizeClasses[size]} rounded bg-tri-border/30 hover:bg-tri-border/50 text-tri-muted hover:text-white transition-all duration-200 font-mono border border-tri-border/50"
	title="Copy to clipboard"
	type="button"
>
	{#if copied}
		<span class="text-green-400">✓</span>
		<span>Copied!</span>
	{:else}
		<span>📋</span>
		<span>{label}</span>
	{/if}
</button>
