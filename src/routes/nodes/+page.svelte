<script lang="ts">
	import { onMount } from 'svelte';
	import 'leaflet/dist/leaflet.css';

	let mapContainer: HTMLDivElement;
	let map: any;

	// Seed node data with approximate locations
	const seedNodes = [
		{
			name: 'DNS2 (Germany)',
			ip: '194.233.88.206:24112',
			onion: 'gxvrhv3qitnc6kobrhsrse46bmcfitnybapor3or3oczzuxn6hfzxyid.onion:24112',
			lat: 51.1657,
			lon: 10.4515,
			location: 'Germany'
		},
		{
			name: 'DNS3 (USA - East Coast)',
			ip: '74.208.167.19:24112',
			onion: 'futmtrvh6j34t7s6yjdxfia6iwuyfzwh4k5eqfof5kfhoqk3xmi3qoqd.onion:24112',
			lat: 40.7128,
			lon: -74.0060,
			location: 'New York, USA'
		}
	];

	const dnsSeeds = [
		{ name: 'seed1.cryptographic-triangles.org', location: 'DNS Seed 1' },
		{ name: 'seed2.cryptographic-triangles.org', location: 'DNS Seed 2' }
	];

	onMount(async () => {
		// Dynamically import Leaflet (client-side only)
		const L = await import('leaflet');

		// Initialize map
		map = L.map(mapContainer).setView([20, 0], 2);

		// Add tile layer
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors',
			maxZoom: 19
		}).addTo(map);

		// Create custom icon using TRI logo
		const triIcon = L.icon({
			iconUrl: '/logo-192.png',
			iconSize: [32, 32],
			iconAnchor: [16, 16],
			popupAnchor: [0, -16]
		});

		// Add markers for each seed node
		seedNodes.forEach(node => {
			const marker = L.marker([node.lat, node.lon], { icon: triIcon }).addTo(map);
			
			const popupContent = `
				<div class="text-sm">
					<h3 class="font-bold text-tri-accent mb-2">${node.name}</h3>
					<p class="mb-1"><strong>Location:</strong> ${node.location}</p>
					<p class="mb-1"><strong>Clearnet:</strong><br/><code class="text-xs">${node.ip}</code></p>
					<p><strong>Tor v3:</strong><br/><code class="text-xs break-all">${node.onion}</code></p>
				</div>
			`;
			
			marker.bindPopup(popupContent);
		});
	});
</script>

<svelte:head>
	<title>Node Map - Triangles Explorer</title>
	<meta name="description" content="Geographic distribution of Triangles seed nodes" />
</svelte:head>

<div class="space-y-6">
	<div>
		<h1 class="text-3xl font-bold mb-2">Node Map</h1>
		<p class="text-tri-muted">Geographic distribution of Triangles (TRI) seed nodes</p>
	</div>

	<!-- Map Container -->
	<div class="bg-tri-surface rounded-lg overflow-hidden border border-tri-border">
		<div bind:this={mapContainer} class="w-full h-[600px]"></div>
	</div>

	<!-- Seed Node List -->
	<div class="grid md:grid-cols-2 gap-4">
		<div class="bg-tri-surface p-4 rounded-lg border border-tri-border">
			<h2 class="text-xl font-bold mb-3 text-tri-accent">Clearnet Seed Nodes</h2>
			<div class="space-y-3">
				{#each seedNodes as node}
					<div class="border-l-2 border-tri-accent pl-3">
						<p class="font-semibold">{node.name}</p>
						<p class="text-sm text-tri-muted">{node.location}</p>
						<code class="text-xs bg-tri-bg px-2 py-1 rounded">{node.ip}</code>
					</div>
				{/each}
			</div>
		</div>

		<div class="bg-tri-surface p-4 rounded-lg border border-tri-border">
			<h2 class="text-xl font-bold mb-3 text-tri-accent">Tor v3 Onion Seeds</h2>
			<div class="space-y-3">
				{#each seedNodes as node}
					<div class="border-l-2 border-tri-accent pl-3">
						<p class="font-semibold">{node.name}</p>
						<code class="text-xs bg-tri-bg px-2 py-1 rounded break-all block">{node.onion}</code>
					</div>
				{/each}
			</div>
		</div>

		<div class="bg-tri-surface p-4 rounded-lg border border-tri-border md:col-span-2">
			<h2 class="text-xl font-bold mb-3 text-tri-accent">DNS Seeds</h2>
			<div class="grid md:grid-cols-2 gap-3">
				{#each dnsSeeds as dns}
					<div class="border-l-2 border-tri-accent pl-3">
						<code class="text-sm bg-tri-bg px-2 py-1 rounded">{dns.name}</code>
					</div>
				{/each}
			</div>
			<p class="text-sm text-tri-muted mt-3">
				DNS seeds provide dynamic peer discovery. Your node will query these domains to find active peers.
			</p>
		</div>
	</div>

	<!-- Connection Instructions -->
	<div class="bg-tri-surface p-4 rounded-lg border border-tri-border">
		<h2 class="text-xl font-bold mb-3 text-tri-accent">Connect to the Network</h2>
		<div class="space-y-3">
			<div>
				<h3 class="font-semibold mb-2">Add to triangles.conf:</h3>
				<pre class="bg-tri-bg p-3 rounded text-xs overflow-x-auto"><code>addnode=194.233.88.206
addnode=74.208.167.19</code></pre>
			</div>
			<div>
				<h3 class="font-semibold mb-2">Tor Configuration:</h3>
				<pre class="bg-tri-bg p-3 rounded text-xs overflow-x-auto"><code>addnode=gxvrhv3qitnc6kobrhsrse46bmcfitnybapor3or3oczzuxn6hfzxyid.onion
addnode=futmtrvh6j34t7s6yjdxfia6iwuyfzwh4k5eqfof5kfhoqk3xmi3qoqd.onion
onlynet=tor
proxy=127.0.0.1:9050</code></pre>
			</div>
		</div>
	</div>
</div>

<style>
	:global(.leaflet-popup-content-wrapper) {
		background-color: #1a1a2e;
		color: #e0e0e0;
		border: 1px solid #2d2d44;
	}
	:global(.leaflet-popup-tip) {
		background-color: #1a1a2e;
	}
</style>
