<script lang="ts">
	import StatsCard from '$lib/components/StatsCard.svelte';
	import BlockTable from '$lib/components/BlockTable.svelte';
	import LiveFeed from '$lib/components/LiveFeed.svelte';
	import { formatNumber, formatAmount, formatDifficulty, truncateHash } from '$lib/utils';

	let { data } = $props();
</script>

<svelte:head>
	<title>Triangles Block Explorer - Dashboard</title>
</svelte:head>

{#if data.error}
	<div class="bg-tri-red/10 border border-tri-red/30 rounded-lg p-4 mb-6 text-tri-red text-sm">
		Unable to connect to daemon: {data.error}
	</div>
{/if}

{#if data.chain}
	<!-- Stats Grid -->
	<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
		<StatsCard label="Block Height" value={formatNumber(data.chain.blocks)} />
		<StatsCard
			label="Supply"
			value="{formatAmount(data.chain.moneysupply)} TRI"
			sub="of 222,222 max"
		/>
		<StatsCard
			label="PoS Difficulty"
			value={formatDifficulty(data.chain.difficulty['proof-of-stake'])}
		/>
		<StatsCard
			label="Best Block"
			value={truncateHash(data.chain.bestblockhash, 8)}
		/>
	</div>

	<!-- Staking + Mining stats -->
	{#if data.staking || data.mining}
		<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
			{#if data.staking}
				<StatsCard
					label="Staking"
					value={data.staking.staking ? 'Active' : 'Inactive'}
					sub="Network weight: {formatNumber(data.staking.netstakeweight)}"
				/>
			{/if}
			{#if data.mining}
				<StatsCard
					label="Stake Interest"
					value="{data.mining.stakeinterest}%"
					sub="Annual rate"
				/>
				<StatsCard
					label="Network Hash"
					value="{data.mining.netmhashps.toFixed(2)} MH/s"
				/>
				<StatsCard
					label="Pooled Txs"
					value={formatNumber(data.mining.pooledtx)}
				/>
			{/if}
		</div>
	{/if}
{/if}

<!-- Live Feed + Latest Blocks Grid -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
	<!-- Live Feed (1 column) -->
	<div class="lg:col-span-1">
		<LiveFeed />
	</div>
	
	<!-- Latest Blocks (2 columns) -->
	<div class="lg:col-span-2">
		<div class="bg-tri-surface border border-tri-border rounded-lg overflow-hidden h-full">
			<div class="flex items-center justify-between px-4 py-3 border-b border-tri-border">
				<h2 class="text-white font-semibold">Latest Blocks</h2>
				<a href="/blocks" class="text-tri-accent text-sm hover:text-tri-accent-light">View all &rarr;</a>
			</div>
			{#if data.blocks.length > 0}
				<BlockTable blocks={data.blocks} />
			{:else}
				<div class="p-8 text-center text-tri-muted">No blocks available</div>
			{/if}
		</div>
	</div>
</div>
