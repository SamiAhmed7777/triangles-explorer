<script lang="ts">
	import '../app.css';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import { formatNumber, formatAmount, formatDifficulty } from '$lib/utils';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { io } from 'socket.io-client';

	let { data, children } = $props();
	let toast: any;

	const navLinks = [
		{ href: '/', label: 'Home' },
		{ href: '/blocks', label: 'Blocks' },
		{ href: '/richlist', label: 'Rich List' },
		{ href: '/staking', label: 'Staking' },
		{ href: '/network', label: 'Network' },
		{ href: '/mempool', label: 'Mempool' },
		{ href: '/api', label: 'API' }
	];

	onMount(() => {
		if (browser) {
			const socket = io('http://localhost:3051');
			
			socket.on('connect', () => {
				console.log('WebSocket connected');
			});
			
			socket.on('newBlock', (block: any) => {
				console.log('New block:', block);
				if (toast) {
					toast.show(
						`New Block #${block.height.toLocaleString()} - ${block.tx} txs`,
						'success',
						8000
					);
				}
			});
			
			socket.on('disconnect', () => {
				console.log('WebSocket disconnected');
			});
			
			return () => {
				socket.disconnect();
			};
		}
	});
</script>

<svelte:head>
	<title>Triangles Block Explorer</title>
	<meta name="description" content="Block explorer for the Triangles (TRI) cryptocurrency" />
</svelte:head>

<Toast bind:this={toast} />

<div class="min-h-screen bg-tri-bg text-tri-text flex flex-col">
	<!-- Header -->
	<header class="border-b border-tri-border bg-tri-surface/50 backdrop-blur-sm sticky top-0 z-50">
		<div class="max-w-7xl mx-auto px-4 py-3">
			<div class="flex items-center justify-between gap-4 flex-wrap">
				<a href="/" class="text-xl font-bold text-white flex items-center gap-2 shrink-0">
					<span class="text-tri-accent">&#9650;</span> Triangles Explorer
				</a>
				<SearchBar />
			</div>
			<nav class="flex gap-1 mt-2 overflow-x-auto">
				{#each navLinks as link}
					<a
						href={link.href}
						class="px-3 py-1.5 text-sm text-tri-muted hover:text-white hover:bg-tri-border/50 rounded transition-colors whitespace-nowrap"
					>
						{link.label}
					</a>
				{/each}
			</nav>
		</div>
	</header>

	<!-- Main -->
	<main class="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
		{@render children()}
	</main>

	<!-- Footer -->
	<footer class="border-t border-tri-border bg-tri-surface/30 py-6">
		<div class="max-w-7xl mx-auto px-4">
			{#if data.chain}
				<div class="flex flex-wrap gap-6 text-xs text-tri-muted justify-center mb-4">
					<span>Height: <strong class="text-tri-text">{formatNumber(data.chain.blocks)}</strong></span>
					<span>Supply: <strong class="text-tri-text">{formatAmount(data.chain.moneysupply)} TRI</strong></span>
					<span>PoS Diff: <strong class="text-tri-text">{formatDifficulty(data.chain.difficulty['proof-of-stake'])}</strong></span>
					{#if data.network}
						<span>Peers: <strong class="text-tri-text">{data.network.connections}</strong></span>
					{/if}
					<span>Chain: <strong class="text-tri-text">{data.chain.chain}</strong></span>
				</div>
			{:else}
				<div class="text-center text-xs text-tri-muted mb-4">Daemon unavailable</div>
			{/if}
			
			<!-- Links Section -->
			<div class="flex flex-wrap gap-4 justify-center text-xs mb-3">
				<a href="https://cryptographic-triangles.org" class="text-tri-accent hover:text-white transition-colors" target="_blank" rel="noopener">
					🌐 Official Website
				</a>
				<a href="https://github.com/triangles-project" class="text-tri-accent hover:text-white transition-colors" target="_blank" rel="noopener">
					📦 GitHub
				</a>
				<a href="https://discord.gg/byV4GhtXKg" class="text-tri-accent hover:text-white transition-colors" target="_blank" rel="noopener">
					💬 Discord
				</a>
				<a href="/api" class="text-tri-accent hover:text-white transition-colors">
					📖 API Docs
				</a>
				<a href="https://github.com/triangles-project/explorer" class="text-tri-muted hover:text-white transition-colors text-xs" target="_blank" rel="noopener">
					⭐ Star on GitHub
				</a>
			</div>
			
			<div class="text-center text-xs text-tri-muted">
				<p>Triangles Block Explorer v1.0.0</p>
				<p class="mt-1">Made with ❤️ for the Triangles community</p>
			</div>
		</div>
	</footer>
</div>
