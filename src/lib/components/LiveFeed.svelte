<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { io, type Socket } from 'socket.io-client';
	import { timeAgo } from '$lib/utils';
	
	interface BlockEvent {
		height: number;
		hash: string;
		time: number;
		tx: number;
		size: number;
		type: 'PoS' | 'PoW';
		difficulty: number;
		timestamp?: number;
	}
	
	interface NetworkEvent {
		peers: number;
		blockHeight: number;
		difficulty: any;
		timestamp?: number;
	}
	
	type FeedEvent = 
		| { type: 'block'; data: BlockEvent }
		| { type: 'network'; data: NetworkEvent };
	
	let events = $state<FeedEvent[]>([]);
	let socket: Socket | null = $state(null);
	let connected = $state(false);
	let currentTime = $state(Date.now());
	
	// Update current time every second for live relative timestamps
	onMount(() => {
		const timeInterval = setInterval(() => {
			currentTime = Date.now();
		}, 1000);
		
		return () => clearInterval(timeInterval);
	});
	
	onMount(() => {
		if (browser) {
			socket = io('http://localhost:3051');
			
			socket.on('connect', () => {
				connected = true;
				console.log('🟢 WebSocket connected');
			});
			
			socket.on('disconnect', () => {
				connected = false;
				console.log('🔴 WebSocket disconnected');
			});
			
			socket.on('newBlock', (block: BlockEvent) => {
				console.log('📦 New block:', block);
				events = [
					{ type: 'block', data: { ...block, timestamp: Date.now() } },
					...events.slice(0, 19) // Keep last 20 events
				];
			});
			
			socket.on('networkUpdate', (network: NetworkEvent) => {
				console.log('🌐 Network update:', network);
				// Only show network updates if it's a significant change
				if (events.length === 0 || events[0].type !== 'network') {
					events = [
						{ type: 'network', data: { ...network, timestamp: Date.now() } },
						...events.slice(0, 19)
					];
				}
			});
			
			return () => {
				socket?.disconnect();
			};
		}
	});
</script>

<div class="bg-tri-surface border border-tri-border rounded-lg overflow-hidden">
	<div class="px-4 py-3 border-b border-tri-border flex items-center justify-between">
		<h2 class="text-white font-semibold flex items-center gap-2">
			{#if connected}
				<span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
				<span>Live Network Activity</span>
			{:else}
				<span class="w-2 h-2 bg-gray-500 rounded-full"></span>
				<span class="text-tri-muted">Connecting...</span>
			{/if}
		</h2>
		<span class="text-xs text-tri-muted">Last {events.length} events</span>
	</div>
	
	<div class="divide-y divide-tri-border/30 max-h-96 overflow-y-auto">
		{#if events.length === 0}
			<div class="px-4 py-8 text-center text-tri-muted text-sm">
				Waiting for network activity...
			</div>
		{:else}
			{#each events as event}
				{#if event.type === 'block'}
					<div class="px-4 py-3 hover:bg-tri-surface/50 transition-colors animate-[slideIn_0.3s_ease-out]">
						<div class="flex items-start gap-3">
							<div class="shrink-0 w-8 h-8 rounded-lg bg-{event.data.type === 'PoS' ? 'green' : 'yellow'}-500/20 flex items-center justify-center">
								{#if event.data.type === 'PoS'}
									<span class="text-green-400 text-xs font-bold">⚡</span>
								{:else}
									<span class="text-yellow-400 text-xs font-bold">⛏️</span>
								{/if}
							</div>
							<div class="flex-1 min-w-0">
								<div class="flex items-center gap-2 mb-1">
									<a href="/blocks/{event.data.height}" class="text-white font-medium hover:text-tri-accent">
										Block #{event.data.height.toLocaleString()}
									</a>
									<span class="px-1.5 py-0.5 rounded text-xs font-medium bg-{event.data.type === 'PoS' ? 'green' : 'yellow'}-500/20 text-{event.data.type === 'PoS' ? 'green' : 'yellow'}-400">
										{event.data.type}
									</span>
								</div>
								<div class="text-xs text-tri-muted">
									{event.data.tx} transaction{event.data.tx !== 1 ? 's' : ''} · {(event.data.size / 1024).toFixed(1)} KB
								</div>
								{#if event.data.timestamp}
									<div class="text-xs text-tri-muted mt-1">
										{timeAgo(Math.floor(event.data.timestamp / 1000))}
									</div>
								{/if}
							</div>
						</div>
					</div>
				{:else if event.type === 'network'}
					<div class="px-4 py-3 hover:bg-tri-surface/50 transition-colors">
						<div class="flex items-start gap-3">
							<div class="shrink-0 w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
								<span class="text-blue-400 text-xs">🌐</span>
							</div>
							<div class="flex-1">
								<div class="text-white font-medium mb-1">
									Network Update
								</div>
								<div class="text-xs text-tri-muted">
									{event.data.peers} peer{event.data.peers !== 1 ? 's' : ''} connected · Height {event.data.blockHeight.toLocaleString()}
								</div>
								{#if event.data.timestamp}
									<div class="text-xs text-tri-muted mt-1">
										{timeAgo(Math.floor(event.data.timestamp / 1000))}
									</div>
								{/if}
							</div>
						</div>
					</div>
				{/if}
			{/each}
		{/if}
	</div>
</div>

<style>
	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
