<script lang="ts">
	import { onMount } from 'svelte';
	
	type ToastType = 'info' | 'success' | 'warning' | 'error';
	
	interface Toast {
		id: number;
		message: string;
		type: ToastType;
	}
	
	let toasts = $state<Toast[]>([]);
	let nextId = 0;
	
	export function show(message: string, type: ToastType = 'info', duration = 5000) {
		const id = nextId++;
		toasts = [...toasts, { id, message, type }];
		
		if (duration > 0) {
			setTimeout(() => {
				toasts = toasts.filter(t => t.id !== id);
			}, duration);
		}
	}
	
	function remove(id: number) {
		toasts = toasts.filter(t => t.id !== id);
	}
	
	function getTypeClasses(type: ToastType) {
		switch (type) {
			case 'success': return 'bg-tri-green/90 border-tri-green';
			case 'warning': return 'bg-tri-yellow/90 border-tri-yellow';
			case 'error': return 'bg-tri-red/90 border-tri-red';
			default: return 'bg-tri-accent/90 border-tri-accent';
		}
	}
</script>

<div class="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm">
	{#each toasts as toast (toast.id)}
		<div 
			class="border-l-4 rounded shadow-lg p-4 text-white backdrop-blur-sm {getTypeClasses(toast.type)} animate-slide-in"
		>
			<div class="flex justify-between items-start gap-3">
				<p class="text-sm flex-1">{toast.message}</p>
				<button 
					onclick={() => remove(toast.id)}
					class="text-white/80 hover:text-white text-lg leading-none"
				>
					×
				</button>
			</div>
		</div>
	{/each}
</div>

<style>
	@keyframes slide-in {
		from {
			transform: translateX(100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}
	
	.animate-slide-in {
		animation: slide-in 0.3s ease-out;
	}
</style>
