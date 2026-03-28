<script lang="ts">
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';
	
	let { data, size = 200 }: { data: string; size?: number } = $props();
	let canvas: HTMLCanvasElement;
	
	onMount(() => {
		if (canvas) {
			QRCode.toCanvas(canvas, data, {
				width: size,
				margin: 2,
				color: {
					dark: '#FFFFFF',  // White QR code
					light: '#1a1a2e'  // Dark background (tri-bg color)
				}
			}).catch(err => {
				console.error('QR code generation failed:', err);
			});
		}
	});
</script>

<canvas bind:this={canvas} class="rounded-lg border-2 border-tri-border"></canvas>
