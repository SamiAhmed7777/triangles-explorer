<script lang="ts">
	import { onMount } from 'svelte';
	import StatsCard from '$lib/components/StatsCard.svelte';
	import { formatNumber, formatDifficulty } from '$lib/utils';
	import { Chart, registerables } from 'chart.js';

	let { data } = $props();
	let chartCanvas: HTMLCanvasElement;

	onMount(() => {
		if (data.headers.length > 0) {
			Chart.register(...registerables);
			new Chart(chartCanvas, {
				type: 'line',
				data: {
					labels: data.headers.map(h => h.height),
					datasets: [{
						label: 'PoS Difficulty',
						data: data.headers.filter(h => h.flags.includes('proof-of-stake')).map(h => h.difficulty),
						borderColor: '#22c55e',
						backgroundColor: 'rgba(34, 197, 94, 0.1)',
						fill: true,
						tension: 0.3,
						pointRadius: 0
					}]
				},
				options: {
					responsive: true,
					plugins: { legend: { labels: { color: '#94a3b8' } } },
					scales: {
						x: { ticks: { color: '#94a3b8', maxTicksLimit: 10 }, grid: { color: '#2a2d3a' } },
						y: { ticks: { color: '#94a3b8' }, grid: { color: '#2a2d3a' } }
					}
				}
			});
		}
	});
</script>

<svelte:head>
	<title>Staking - Triangles Explorer</title>
</svelte:head>

<h1 class="text-2xl font-bold text-white mb-6">Staking Dashboard</h1>

{#if data.staking && data.mining}
	<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
		<StatsCard label="Staking Active" value={data.staking.staking ? 'Yes' : 'No'} />
		<StatsCard label="PoS Difficulty" value={formatDifficulty(data.staking.difficulty)} />
		<StatsCard label="Network Stake Weight" value={formatNumber(data.staking.netstakeweight)} />
		<StatsCard label="Stake Interest" value="{data.mining.stakeinterest}% annual" />
		<StatsCard label="Block Subsidy" value={data.subsidy != null ? String(data.subsidy) : 'N/A'} />
		<StatsCard label="Net Hash Rate" value="{data.mining.netmhashps.toFixed(2)} MH/s" />
		<StatsCard label="PoW Difficulty" value={data.difficulty ? formatDifficulty(data.difficulty['proof-of-work']) : 'N/A'} />
		<StatsCard
			label="Expected Time"
			value={data.staking.expectedtime > 0 ? `${Math.floor(data.staking.expectedtime / 3600)}h ${Math.floor((data.staking.expectedtime % 3600) / 60)}m` : 'N/A'}
			sub="Until next stake"
		/>
	</div>

	<!-- Difficulty Chart -->
	{#if data.headers.length > 0}
		<div class="bg-tri-surface border border-tri-border rounded-lg p-4">
			<h2 class="text-white font-semibold mb-4">PoS Difficulty (Last 50 blocks)</h2>
			<canvas bind:this={chartCanvas}></canvas>
		</div>
	{/if}
{:else}
	<div class="bg-tri-red/10 border border-tri-red/30 rounded-lg p-4 text-tri-red text-sm">
		Unable to load staking data. Is the daemon running?
	</div>
{/if}
