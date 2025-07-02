<script>
	// Initialize map
	import { onMount, onDestroy } from 'svelte';

	// Packages
	import mapboxgl from 'mapbox-gl';
	import '../../../node_modules/mapbox-gl/dist/mapbox-gl.css';

	// Stores
	import {
		map,
		reparationsCityData,
		reparationsCountyData,
		reparationsStateData,
		selectedLocation,
		aboutPanelVisible,
		listPanelVisible,
		citiesPanelVisible,
		countiesPanelVisible,
		statesPanelVisible,
		cardScroll
	} from '$lib/stores.js';

	// Import components
	import ResetMapBtn from '$lib/components/ResetMapBtn.svelte';
	import FilteredList from '$lib/components/FilteredList.svelte';
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
		'pk.eyJ1IjoiZnhiLWNlbnRlciIsImEiOiJjbHVzaWw5YXowajd2Mmp0YnB0ZzR1b3VuIn0.VrL-9ZI_NCB3bDkJjCajTQ';

	// Center point of map
	const centerMapPt = { lng: -95.7, lat: 38.1 };
	const initialZoom = 3.75;

	onMount(async () => {
		// Set up map via store
		map.set(
			new mapboxgl.Map({
				container: mapContainer,
				accessToken: mapboxgl.accessToken,
				style: 'mapbox://styles/fxb-center/cluiiae6003iv01qqb1p0970w',
				center: [centerMapPt.lng, centerMapPt.lat],
				zoom: initialZoom,
				// minZoom: 3.75, // adds bounce when resetting map
				maxZoom: 10,
				maxBounds: [
					[-190, 10], // SW corner
					[-40, 72.5] // NE corner
				]
			})
		);

		// Add zoom controls
		$map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');

		$map.on('load', () => {
			// Establish initial center longitude value
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

			// Add state polygons data
			$map.addSource('states', {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: $reparationsStateData
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

			// Add border for state polygons
			$map.addLayer({
				id: 'state-border-layer',
				type: 'line',
				source: 'states',
				layout: {},
				paint: {
					'line-color': '#2b4518',
					'line-width': 0.85
				}
			});

			// Clicking on state polygon brings up card on panel
			$map.on('click', ['state-fill-layer'], (e) => {
				$cardScroll ? cardScroll.set(false) : cardScroll.set(true); // if card has been scrolled to bottom, scroll card to top when another location has been selected on the map
				selectedLocation.set({
					Location: e.features[0].properties.Location, // pulls from $statePolygons
					Geography: 'State',
					State: e.features[0].properties.State
				});
				//selectedState.set(e.features[0].properties.name);
				sidebarVisible = true;
				$aboutPanelVisible = false;
				$listPanelVisible = true;
				$citiesPanelVisible = false;
				$countiesPanelVisible = false;
				$statesPanelVisible = true;

				// Clear any highlighted/selected city or county on map
				// in order of geographic layers added to map
				if (
					$map.setFilter('panel-county-selected-layer', [
						'all',
						['==', $selectedLocation.Location, ['get', 'Location']],
						['==', $selectedLocation.State, ['get', 'State']]
					])
				) {
					$map.setFilter('panel-county-selected-layer', ['==', 'Location', '']);
				}

				if (
					$map.setFilter('panel-city-selected-layer', [
						'all',
						['==', $selectedLocation.Location, ['get', 'Location']],
						['==', $selectedLocation.State, ['get', 'State']]
					])
				) {
					$map.setFilter('panel-city-selected-layer', ['==', 'Location', '']);
				}
			});

			// Add layer for filtered states (fill)
			$map.addLayer({
				id: 'filtered-state-fill-layer',
				type: 'fill',
				source: 'states',
				paint: {
					'fill-color': 'rgb(120, 148, 97)',
					'fill-opacity': 0.15
				}
			});

			// Hide states on initial load on filtered layer (fill)
			$map.setFilter('filtered-state-fill-layer', ['==', 'Location', '']);
			// Use `==` for single values, `in` for arrays

			// Add layer for filtered states (border)
			$map.addLayer({
				id: 'filtered-state-border-layer',
				type: 'line',
				source: 'states',
				paint: {
					'line-color': '#2b4518',
					'line-width': 0.85
				}
			});

			// Hide states on initial load on filtered layer (border)
			$map.setFilter('filtered-state-border-layer', ['==', 'Location', '']);

			// Cursor becomes pointer when on polygon
			$map.on('mouseenter', 'state-fill-layer', () => {
				$map.getCanvas().style.cursor = 'pointer';
			});

			// Cursor goes back to default off point
			$map.on('mouseleave', 'state-fill-layer', () => {
				$map.getCanvas().style.cursor = '';
			});

			///////////////////////////
			// HIGHLIGHTED STATE from panel selection
			///////////////////////////

			$map.addLayer({
				id: 'panel-state-selected-layer',
				type: 'fill',
				source: 'states',
				layout: {},
				paint: {
					'fill-color': '#e9ed10',
					'fill-opacity': 0.25
				}
			});

			// Initially hide all markers in panel-state-selected-layer
			$map.setFilter('panel-state-selected-layer', ['==', 'State', '']);
			// When location is selected via panel, polygon will have a yellow glow

			///////////////////////////
			// POLYGONS for counties
			///////////////////////////

			// Add county polygons data
			$map.addSource('counties', {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: $reparationsCountyData
				}
			});

			// Add fill color for counties with reparation efforts
			$map.addLayer({
				id: 'county-fill-layer',
				type: 'fill',
				source: 'counties',
				layout: {},
				paint: {
					//'fill-color': 'rgb(120, 148, 97)',
					'fill-color': 'rgba(43, 69, 24, 0.85)', // '#2b4518',
					'fill-opacity': 0.8
				}
			});

			// Add border for county polygons
			$map.addLayer({
				id: 'county-border-layer',
				type: 'line',
				source: 'counties',
				layout: {},
				paint: {
					//'line-color': '#2b4518',
					'line-color': 'white', // '#789461',
					'line-width': 0.65
				}
			});

			// Clicking on county polygon brings up card on panel
			$map.on('click', ['county-fill-layer', 'county-labels-layer'], (e) => {
				$cardScroll ? cardScroll.set(false) : cardScroll.set(true); // if card has been scrolled to bottom, scroll card to top when another location has been selected on the map
				selectedLocation.set({
					Location: e.features[0].properties.Location,
					Geography: 'County',
					State: e.features[0].properties.State
				});
				sidebarVisible = true;
				$aboutPanelVisible = false;
				$listPanelVisible = true;
				$citiesPanelVisible = false;
				$countiesPanelVisible = true;
				$statesPanelVisible = false;

				// Clear any highlighted/selected state or county on map
				// in order of geographic layers added to map
				if (
					$map.setFilter('panel-state-selected-layer', [
						'any',
						['==', $selectedLocation.State, ['get', 'State']]
					])
				) {
					$map.setFilter('panel-state-selected-layer', ['==', 'State', '']);
				}

				if (
					$map.setFilter('panel-city-selected-layer', [
						'all',
						['==', $selectedLocation.Location, ['get', 'Location']],
						['==', $selectedLocation.State, ['get', 'State']]
					])
				) {
					$map.setFilter('panel-city-selected-layer', ['==', 'Location', '']);
				}
			});

			// Add layer for filtered counties (fill)
			$map.addLayer({
				id: 'filtered-county-fill-layer',
				type: 'fill',
				source: 'counties',
				paint: {
					//'fill-color': 'rgb(120, 148, 97)',
					'fill-color': '#2b4518',
					'fill-opacity': 0.8
				}
			});
			// Hide counties on initial load on filtered layer (fill)
			$map.setFilter('filtered-county-fill-layer', ['==', 'Location', '']);

			// Add layer for filtered counties (line)
			$map.addLayer({
				id: 'filtered-county-border-layer',
				type: 'line',
				source: 'counties',
				paint: {
					//'line-color': '#2b4518',
					'line-color': 'white', // '#789461',
					'line-width': 0.65
				}
			});
			// Hide counties on initial load on filtered layer
			$map.setFilter('filtered-county-border-layer', ['==', 'Location', '']);

			// Cursor becomes pointer when on polygon
			$map.on('mouseenter', ['county-fill-layer', 'county-labels-layer'], () => {
				$map.getCanvas().style.cursor = 'pointer';
			});

			// Cursor goes back to default off point
			$map.on('mouseleave', ['county-fill-layer', 'county-labels-layer'], () => {
				$map.getCanvas().style.cursor = '';
			});

			///////////////////////////
			// HIGHLIGHTED COUNTY from panel selection
			///////////////////////////

			$map.addLayer({
				id: 'panel-county-selected-layer',
				type: 'line',
				source: 'counties',
				layout: {},
				paint: {
					//'line-color': '#2b4518',
					'line-color': 'yellow', // '#789461',
					'line-width': 2
				}
			});

			// Initially hide all markers in panel-county-selected-layer
			$map.setFilter('panel-county-selected-layer', ['==', 'Location', '']);
			// When location is selected via panel, polygon will have a yellow glow

			// Add county labels (that appear above any highlighted county polygon)
			$map.addLayer({
				id: 'county-labels-layer',
				type: 'symbol',
				source: 'counties',
				layout: {
					'text-field': ['get', 'Full County Name'],
					'text-variable-anchor': ['left'],
					'text-radial-offset': 0.5,
					'text-justify': 'auto',
					'text-font': ['League Spartan Bold'],
					'text-size': {
						stops: [
							[3, 10],
							[5, 12],
							[7, 14]
						]
					}
				},
				paint: {
					'text-color': '#6f6f6f', // '#5d5d5d',
					'text-halo-color': 'white',
					'text-halo-width': 1
				}
			});

			///////////////////////////
			// POINTS for cities
			///////////////////////////

			// Add city data
			$map.addSource('cities', {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: $reparationsCityData
				}
			});

			// Add markers for cities
			$map.addLayer({
				id: 'city-markers-layer',
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
				id: 'city-labels-layer',
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

			// Bring up card from clicking city marker/label
			$map.on('click', ['city-markers-layer', 'city-labels-layer'], (e) => {
				$cardScroll ? cardScroll.set(false) : cardScroll.set(true);
				selectedLocation.set({
					Location: e.features[0].properties.Location,
					Geography: e.features[0].properties.Geography,
					State: e.features[0].properties.State
				});
				sidebarVisible = true;
				$aboutPanelVisible = false;
				$listPanelVisible = true;
				$citiesPanelVisible = true;
				$countiesPanelVisible = false;
				$statesPanelVisible = false;

				// Clear any highlighted/selected state or county on map
				// in order of geographic layers added to map
				if (
					$map.setFilter('panel-state-selected-layer', [
						'all',
						['==', $selectedLocation.State, ['get', 'State']]
					])
				) {
					$map.setFilter('panel-state-selected-layer', ['==', 'State', '']);
				}

				if (
					$map.setFilter('panel-county-selected-layer', [
						'all',
						['==', $selectedLocation.Location, ['get', 'Location']],
						['==', $selectedLocation.State, ['get', 'State']]
					])
				) {
					$map.setFilter('panel-county-selected-layer', ['==', 'Location', '']);
				}
			});

			// Add layer for filtered cities (via toggles)
			$map.addLayer({
				id: 'filtered-city-layer',
				type: 'circle',
				source: 'cities',
				paint: {
					'circle-radius': 4,
					'circle-stroke-width': 1.5,
					'circle-color': 'green',
					'circle-stroke-color': 'white'
				}
			});

			// Hide US cities on initial load on filtered layer
			$map.setFilter('filtered-city-layer', ['==', 'Location', '']);

			// Change cursor to pointer when hovering over marker
			$map.on('mouseenter', ['city-markers-layer', 'city-labels-layer'], () => {
				$map.getCanvas().style.cursor = 'pointer';
			});

			// Cursor goes back to default off point
			$map.on('mouseleave', ['city-markers-layer', 'city-labels-layer'], () => {
				$map.getCanvas().style.cursor = 'auto';
			});

			///////////////////////////
			// HIGHLIGHTED CITY from panel selection
			///////////////////////////

			$map.addLayer({
				id: 'panel-city-selected-layer',
				type: 'circle',
				source: 'cities',
				paint: {
					'circle-radius': 4,
					'circle-stroke-width': 3,
					'circle-color': '#C70039',
					'circle-stroke-color': 'yellow'
				}
			});

			// Initially hide all markers in panel-city-selected-layer
			$map.setFilter('panel-city-selected-layer', ['==', 'Location', '']);
			// When location is selected via panel, marker will have a yellow glow

			///////////////////////////
			// GENERAL MAP SETTINGS
			///////////////////////////

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

			// If sidebar "hidden" and locations touched, sidebar appears with location info
			$map.on(
				'click',
				[
					'city-layer',
					'city-labels-layer',
					'county-fill-layer',
					'county-labels-layer',
					'state-fill-layer'
				],
				() => {
					if (window.matchMedia('(max-width: 480px)').matches && !sidebarVisible) {
						sidebarVisible = true;
					}
				}
			);

			// "Disable map rotation using right click + drag"
			$map.dragRotate.disable();

			// "Disable map rotation using touch rotation gesture"
			$map.touchZoomRotate.disableRotation();
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

<!-- List of locations after filters applied -->
<div class="filtered-list-container">
	<FilteredList bind:sidebarVisible />
</div>

<!-- Reset map button -->
{#if initialCenterLng?.toFixed(1) !== movedCenterLng?.toFixed(1) || initialCenterLat?.toFixed(1) !== movedCenterLat?.toFixed(1) || $map?.getZoom() !== 3.75}
	<div class="reset-container" transition:fade={{ duration: 100 }}>
		Reset
		<ResetMapBtn {centerMapPt}><ResetIcon /></ResetMapBtn>
		Map
	</div>
	<!-- <div class="btn-container"></div> -->
{/if}

<!-- Map -->
<div class="map" bind:this={mapContainer} />

<style>
	.map {
		position: absolute;
		width: 100%;
		top: 0;
		bottom: 0;
	}

	/* .btn-container {
		position: absolute;
		top: 80px;
		right: 10px;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		row-gap: 10px;
	} */

	.filtered-list-container {
		position: absolute;
		top: 10px;
		right: 50px;
		z-index: 1;
	}

	.reset-container {
		position: absolute;
		top: 75px;
		right: 10px;
		z-index: 1;
		text-transform: uppercase;
		font-family: 'Barlow Condensed', sans-serif;
		font-size: 0.8rem;
		font-weight: 600;
		text-align: center;
		color: darkslategray;
	}
</style>
