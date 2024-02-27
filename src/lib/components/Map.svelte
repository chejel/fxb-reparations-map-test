<script>
	// Initialize map
	import { onMount, onDestroy } from 'svelte';

	// Packages
	import mapboxgl from 'mapbox-gl';
	import '../../../node_modules/mapbox-gl/dist/mapbox-gl.css';

	// Stores
	import { map } from '$lib/stores.js';

	// Import components
	import ResetMap from '$lib/components/ResetMap.svelte';

	// Import transition
	import { slide } from 'svelte/transition';

	// Set variables
	let mapContainer;
	// for resetting center of map
	let initialCenterLng;
	let movedCenterLng;

	mapboxgl.accessToken =
		'pk.eyJ1IjoiamVuY2hlIiwiYSI6ImNsZzZ6OWh4ajA0dGczd25wMzRwcmUwZnEifQ.wSe4_SgYEgC-QX-6Clad9w';

	onMount(async () => {
		// Set up map via store
		map.set(
			new mapboxgl.Map({
				container: mapContainer,
				accessToken: mapboxgl.accessToken,
				style: 'mapbox://styles/jenche/clt3p16ui003i01qph9fuhxoq',
				center: [-95.7, 38.1],
				zoom: 3.75,
				minZoom: 3.75,
				maxZoom: 7
			})
		);

		// Add contiguous US bounding box
		// $map.fitBounds([
		// 	[-125, 23], // SW corner
		// 	[-66.7, 51.5] // NE corner
		// ]);

		// Add zoom controls
		$map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');

		$map.on('load', () => {
			// Establish initial center longtitude value
			initialCenterLng = $map?.getCenter().lng;
			movedCenterLng = $map?.getCenter().lng;

			// ...to determine when map has been panned/zoomed
			$map.on('move', () => {
				movedCenterLng = $map?.getCenter().lng;
			});
		});
	});

	onDestroy(() => {
		if ($map) {
			$map.remove();
		}
	});
</script>

<div class="map" bind:this={mapContainer} />

{#if initialCenterLng?.toFixed(1) !== movedCenterLng?.toFixed(1)}
	<div class="btn-container">
		<div class="reset-container" transition:slide={{ axis: 'y', duration: 300 }}>
			<ResetMap>Reset Map</ResetMap>
		</div>
	</div>
{/if}

<style>
	.map {
		position: absolute;
		width: 100%;
		top: 0;
		bottom: 0;
	}

	.btn-container {
		position: absolute;
		top: 10px;
		right: 10px;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		row-gap: 10px;
	}

	.reset-container {
		top: 0;
		right: 10px;
	}
</style>
