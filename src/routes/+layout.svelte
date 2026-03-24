<script lang="ts">
	import '../app.css';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import { formatNumber, formatAmount, formatDifficulty } from '$lib/utils';

	let { data, children } = $props();

	const navLinks = [
		{ href: '/', label: 'Home' },
		{ href: '/blocks', label: 'Blocks' },
		{ href: '/staking', label: 'Staking' },
		{ href: '/network', label: 'Network' },
		{ href: '/mempool', label: 'Mempool' },
		{ href: '/api', label: 'API' }
	];
</script>

<svelte:head>
	<title>Triangles Block Explorer</title>
	<meta name="description" content="Block explorer for the Triangles (TRI) cryptocurrency" />
</svelte:head>

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
	<footer class="border-t border-tri-border bg-tri-surface/30 py-4">
		<div class="max-w-7xl mx-auto px-4">
			{#if data.chain}
				<div class="flex flex-wrap gap-6 text-xs text-tri-muted justify-center">
					<span>Height: <strong class="text-tri-text">{formatNumber(data.chain.blocks)}</strong></span>
					<span>Supply: <strong class="text-tri-text">{formatAmount(data.chain.moneysupply)} TRI</strong></span>
					<span>PoS Diff: <strong class="text-tri-text">{formatDifficulty(data.chain.difficulty['proof-of-stake'])}</strong></span>
					{#if data.network}
						<span>Peers: <strong class="text-tri-text">{data.network.connections}</strong></span>
					{/if}
					<span>Chain: <strong class="text-tri-text">{data.chain.chain}</strong></span>
				</div>
			{:else}
				<div class="text-center text-xs text-tri-muted">Daemon unavailable</div>
			{/if}
			<div class="text-center text-xs text-tri-muted mt-2">
				Triangles Block Explorer &mdash; <a href="https://cryptographic-triangles.org" class="text-tri-accent hover:underline">cryptographic-triangles.org</a>
				<span class="mx-2">|</span>
				<a href="https://t.me/+r3ba6HDT9YZmOTBk" target="_blank" rel="noopener noreferrer" class="text-tri-accent hover:underline">Telegram</a>
				<span class="mx-2">|</span>
				<a href="https://discord.gg/byV4GhtXKg" target="_blank" rel="noopener noreferrer" class="text-tri-accent hover:underline">Discord</a>
			</div>
		</div>
	</footer>
</div>
