<script lang="ts">
	let { 
		size = 'md',
		text = 'Loading...'
	} = $props<{
		size?: 'sm' | 'md' | 'lg';
		text?: string;
	}>();
	
	const sizes = {
		sm: 'w-4 h-4',
		md: 'w-8 h-8',
		lg: 'w-12 h-12'
	};
	
	const textSizes = {
		sm: 'text-xs',
		md: 'text-sm',
		lg: 'text-base'
	};
</script>

<div class="flex flex-col items-center justify-center gap-3 py-8">
	<div class="{sizes[size]} border-2 border-tri-border border-t-tri-accent rounded-full animate-spin"></div>
	<p class="text-tri-muted {textSizes[size]}">{text}</p>
</div>
