<script>
	// Import components
	import Map from '$lib/components/Map.svelte';
	import Footer from '$lib/components/Footer.svelte';

	// Sidebar components
	import Sidebar from '$lib/components/Sidebar.svelte';

	// Import icon components
	import ListIcon from '$lib/components/icons/List.svelte';

	// Import reparations data
	import { onMount } from 'svelte';
	export let data; // Airtable directory data
	import {
		countiesMap,
		statesMap,
		countyPolygons,
		statePolygons,
		reparationsData,
		reparationsCityData,
		reparationsCountyData,
		reparationsStateData
	} from '$lib/stores.js';

	// County FIPS codes
	import fipsCodes from '$lib/data/fipsCodes.json';

	// Set state of sidebar
	let sidebarVisible = true;

	// Import transition
	import { fade } from 'svelte/transition';

	import * as topojson from 'topojson-client';

	// Declare variables for map data
	import topoCounties from '$lib/data/counties-10m.json'; // unprojected US county geometries

	onMount(async () => {
		// Reparations data via Airtable
		reparationsData.set({
			type: 'FeatureCollection',
			features: data.airtableRecords.map((d) => {
				const obj = {
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: [+d['Longitude'], +d['Latitude']]
					},
					properties: {
						...d
					}
				};

				return obj;
			})
		});

		// ...filtered to city data
		reparationsCityData.set(
			$reparationsData?.features.filter(
				(feature) =>
					feature.properties['Geography'] === 'City' &&
					feature.properties['State'] &&
					feature.properties['Latitude'] &&
					feature.properties['Longitude']
			)
		);

		// ...filtered to counties data
		reparationsCountyData.set(
			$reparationsData?.features.filter(
				(feature) => feature.properties['Geography'] === 'County' && feature.properties['State']
			)
			// .map((feature) => {
			// 	feature.properties['Location'] = feature.properties['Location'].replace(/^County\s*/, '');
			// })
		);

		// ...filtered to state data
		reparationsStateData.set(
			$reparationsData?.features.filter((feature) => {
				return feature.properties.Geography === 'State';
			})
		);

		// Map data for all counties
		countiesMap.set(topojson.feature(topoCounties, topoCounties.objects.counties));

		// In fipsCodes, convert fips_code to string value
		fipsCodes.forEach((d) => {
			d.fips_code = String(d.fips_code);
		});

		countiesMap.update((d) => {
			d.features.forEach((feature) => {
				// Exclude feature with id of 02261 (Valdez–Cordova Census Area, Alaska which has been replaced as of 2019; map data is 2017, fips data is 2020)

				if (feature.id !== '02261') {
					const fips = feature.id;
					const state = fipsCodes.find((d) => d.fips_code === fips);
					feature.properties['state'] = state.state_name;
				}
			});
			return d;
		});

		// Filter to counties (with reparation efforts) as feature collection for mapping
		countyPolygons.set({
			type: 'FeatureCollection',
			features: $countiesMap?.features.filter((d) =>
				$reparationsCountyData.some(
					(e) =>
						d.properties['name'] === e.properties.Location &&
						d.properties['state'] === e.properties.State
				)
			)
		});

		// Map data for all states
		statesMap.set(topojson.feature(topoCounties, topoCounties.objects.states));

		// Filter to individual states (with reparation efforts) as feature collection for mapping
		statePolygons.set({
			type: 'FeatureCollection',
			features: $statesMap?.features.filter((d) =>
				$reparationsStateData.some((e) => d.properties['name'] === e.properties.Location)
			)
		});
	});
</script>

<!-- Map -->
{#if $reparationsData}
	<Map bind:sidebarVisible />
{/if}

<!-- Sidebar -->
{#if sidebarVisible}
	<div class="sidebar-content" transition:fade={{ duration: 300 }}>
		<Sidebar bind:sidebarVisible></Sidebar>
	</div>
{:else}
	<button
		aria-label="Show sidebar"
		class="sidebar-collapsed"
		on:click|stopPropagation={() => (sidebarVisible = true)}
	>
		<ListIcon />
	</button>
{/if}

<!-- Footer -->
<footer class="footer-container">
	<Footer />
</footer>

<style>
	.sidebar-content {
		position: relative;
		max-width: 375px;
		max-height: calc(100svh - 2rem);
		border-radius: 5px;
		background-color: rgb(245, 247, 248);
		top: 0;
		z-index: 1;
		margin: 1rem;
		box-shadow: 0px 0px 24px 3px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		z-index: 2;
	}

	.sidebar-collapsed {
		position: absolute;
		top: 0;
		margin: 1rem;
		cursor: pointer;
		background-color: transparent;
		border: 0;
	}

	.footer-container {
		position: absolute;
		bottom: 35px;
		right: 10px;
	}

	/* Sidebar margins for mobile devices */
	@media screen and (max-width: 480px) {
		.sidebar-content {
			margin-left: auto;
			margin-right: auto;
		}
	}
</style>
