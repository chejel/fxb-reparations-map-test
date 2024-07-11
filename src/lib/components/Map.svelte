<script>
	// Initialize map
	import { onMount, onDestroy } from 'svelte';

	// Packages
	import mapboxgl from 'mapbox-gl';
	import '../../../node_modules/mapbox-gl/dist/mapbox-gl.css';

	// Stores
	import {
		map,
		statePolygons,
		reparationsCityData,
		selectedCity,
		selectedState,
		aboutPanelVisible,
		listPanelVisible,
		citiesPanelVisible,
		statesPanelVisible,
		cardScroll
	} from '$lib/stores.js';

	// Import components
	import ResetMap from '$lib/components/ResetMap.svelte';
	import MapFilters from '$lib/components/MapFilters.svelte';
	// Import icon components
	import ResetIcon from '$lib/components/icons/Reset.svelte';

	// Import transition
	import { fade } from 'svelte/transition';

	// Set variables
	let mapContainer;

	// For resetting center of map
	let initialCenterLng;
	let initialCenterLat;
	let movedCenterLng;
	let movedCenterLat;

	// Set state of sidebar and map padding
	export let sidebarVisible;
	let mapPadding;

	$: if (sidebarVisible && window.matchMedia('(min-width: 1200px)').matches) {
		mapPadding = { left: 375 };
	} else {
		mapPadding = { left: 0 };
	}

	mapboxgl.accessToken =
		'pk.eyJ1IjoiamVuY2hlIiwiYSI6ImNsdDlhNWNtdTBnOXEybW5wMmxxMDRneGMifQ.-aAXBbQZGsiJeZ-zvOXJQA';

	onMount(async () => {
		// Set up map via store
		map.set(
			new mapboxgl.Map({
				container: mapContainer,
				accessToken: mapboxgl.accessToken,
				//style: 'mapbox://styles/jenche/clt3p16ui003i01qph9fuhxoq',
				style: 'mapbox://styles/fxb-center/cluiiae6003iv01qqb1p0970w',
				//style: 'mapbox://styles/mapbox/standard',
				center: [-95.7, 38.1],
				zoom: 3.75,
				// minZoom: 3.75, // adds bounce when resetting map
				maxZoom: 10,
				maxBounds: [
					[-190, 10], // SW corner
					[-40, 72.5] // NE corner
				]
			})
		);

		// Add contiguous US bounding box
		// $map.fitBounds([
		// 	[-125, 23], // SW corner
		// 	[-66.7, 51.5] // NE corner
		// ]);

		// Add zoom controls
		$map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');

		$map.on('load', () => {
			// Establish initial center longtitude value
			initialCenterLng = $map?.getCenter().lng;
			initialCenterLat = $map?.getCenter().lat;
			movedCenterLng = $map?.getCenter().lng;
			movedCenterLat = $map?.getCenter().lat;

			// ...to determine when map has been panned/zoomed
			$map.on('move', () => {
				movedCenterLng = $map?.getCenter().lng;
				movedCenterLat = $map?.getCenter().lat;
			});

			///////////////////////////
			// POLYGONS for states
			///////////////////////////

			// Add state polygons
			$map.addSource('states', {
				type: 'geojson',
				data: $statePolygons
			});

			// Add border for state polygons
			$map.addLayer({
				id: 'state-layer',
				type: 'line',
				source: 'states',
				layout: {},
				paint: {
					'line-color': '#2b4518',
					'line-width': 0.85
				}
			});

			// Add fill color for individual states with reparation efforts
			$map.addLayer({
				id: 'state-fill-layer',
				type: 'fill',
				source: 'states',
				layout: {},
				paint: {
					'fill-color': 'rgb(120, 148, 97)',
					'fill-opacity': 0.15
				}
			});

			// Clicking on state polygon brings up card on panel
			$map.on('click', ['state-fill-layer'], (e) => {
				$cardScroll ? cardScroll.set(false) : cardScroll.set(true); // if card has been scrolled to bottom, scroll card to top when another location has been selected on the map
				selectedState.set(e.features[0].properties.name);
				sidebarVisible = true;
				$aboutPanelVisible = false;
				$listPanelVisible = true;
				$citiesPanelVisible = false;
				$statesPanelVisible = true;
			});

			// Cursor becomes pointer when on polygon
			$map.on('mouseenter', 'state-fill-layer', () => {
				$map.getCanvas().style.cursor = 'pointer';
			});

			// Cursor goes back to default off point
			$map.on('mouseleave', 'state-fill-layer', () => {
				$map.getCanvas().style.cursor = '';
			});

			// Shift map based on state of sidebar
			$map.easeTo({
				padding: mapPadding,
				duration: 1000
			});

			// Hide sidebar on mobile if map touched
			$map.on('click', () => {
				if (window.matchMedia('(max-width: 480px)').matches && sidebarVisible) {
					sidebarVisible = false;
				}
			});

			///////////////////////////
			// POINTS for cities
			///////////////////////////

			// Add markers for cities
			$map.addSource('cities', {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: $reparationsCityData
				}
			});

			$map.addLayer({
				id: 'cities-layer',
				type: 'circle',
				source: 'cities',
				paint: {
					'circle-radius': 4,
					'circle-stroke-width': 1.5,
					'circle-color': '#C70039',
					'circle-stroke-color': 'white'
				}
			});

			// Add city labels:
			$map.addLayer({
				id: 'cities-labels',
				type: 'symbol',
				source: 'cities',
				layout: {
					'text-field': ['get', 'Location'],
					'text-variable-anchor': ['left'],
					'text-radial-offset': 0.5,
					'text-justify': 'auto',
					'text-font': ['League Spartan Bold'],
					//'text-size': 12
					'text-size': {
						stops: [
							[3, 12],
							[5, 14],
							[7, 16]
						]
					}
				},
				paint: {
					'text-color': '#333',
					'text-halo-color': 'white',
					'text-halo-width': 1
				}
			});

			// Change cursor to pointer when hovering over marker
			$map.on('mouseenter', ['cities-layer', 'cities-labels'], () => {
				$map.getCanvas().style.cursor = 'pointer';
			});

			// cursor goes back to default off point
			$map.on('mouseleave', ['cities-layer', 'cities-labels'], () => {
				$map.getCanvas().style.cursor = 'auto';
			});

			// Get city name from clicking marker/label
			$map.on('click', ['cities-layer', 'cities-labels'], (e) => {
				$cardScroll ? cardScroll.set(false) : cardScroll.set(true);
				selectedCity.set(e.features[0].properties.Location);
				sidebarVisible = true;
				$aboutPanelVisible = false;
				$listPanelVisible = true;
				$citiesPanelVisible = true;
				$statesPanelVisible = false;
			});

			// Add layer for filtered cities
			$map.addLayer({
				id: 'filtered-layer',
				type: 'circle',
				source: 'cities',
				paint: {
					'circle-radius': 4,
					'circle-stroke-width': 1.5,
					'circle-color': 'green',
					'circle-stroke-color': 'white'
				}
			});

			// Hide US cities on initial load
			$map.setFilter('filtered-layer', ['in', 'Location', '']);
		});
	});

	onDestroy(() => {
		if ($map) {
			$map.remove();
		}
	});

	// Update map padding depending on state of sidebar
	$: $map?.easeTo({
		padding: mapPadding,
		duration: 1000
	});
</script>

<!-- Reset map button -->
{#if initialCenterLng?.toFixed(1) !== movedCenterLng?.toFixed(1) || initialCenterLat?.toFixed(1) !== movedCenterLat?.toFixed(1) || $map?.getPitch() !== 0}
	<div class="reset-container" transition:fade>
		<ResetMap><ResetIcon /></ResetMap>
	</div>
	<div class="btn-container"></div>
{/if}

<!-- Map -->
<div class="map" bind:this={mapContainer} />

<!-- Toggle filters -->
<div class="map-filters-container">
	<MapFilters />
	<hr style="border-top: 0.5px solid rgba(255, 255, 255, 1);" />
</div>

<style>
	.map {
		position: absolute;
		width: 100%;
		top: 0;
		bottom: 0;
	}

	.btn-container {
		position: absolute;
		top: 80px;
		right: 10px;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		row-gap: 10px;
	}

	.reset-container {
		position: absolute;
		top: 75px;
		right: 10px;
		z-index: 1;
	}

	.map-filters-container {
		position: absolute;
		bottom: 100px;
		right: 10px;
		display: flex;
		flex-direction: column;
		row-gap: 7px;
	}

	@media screen and (max-device-width: 480px) {
		.map-filters-container {
			bottom: 30px;
			left: 10px;
			right: auto;
			display: flex;
			flex-direction: column;
		}
	}
</style>
