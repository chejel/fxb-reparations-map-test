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
	import { fly } from 'svelte/transition';

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
			$reparationsData?.features
				.filter(
					(feature) =>
						feature.properties['Geography'] === 'City' &&
						feature.properties['State'] &&
						feature.properties['Latitude'] &&
						feature.properties['Longitude']
				)
				.map((feature) => {
					// If feature contains a commma, remove including everything after
					if (feature.properties['Location']?.includes(',')) {
						feature.properties['Location'] = feature.properties['Location'].split(',', 1)[0];
					}
					return feature;
				})
		);

		// ...filtered to counties data
		reparationsCountyData.set(
			$reparationsData?.features
				.filter(
					(feature) => feature.properties['Geography'] === 'County' && feature.properties['State']
				)
				// remove non-applicable point geometry data (long/lat) from county data
				.map((feature) => {
					delete feature.geometry;
					return feature;
				})
				.map((feature) => {
					// If feature contains a commma, remove including everything after
					if (feature.properties['Location']?.includes(',')) {
						feature.properties['Location'] = feature.properties['Location'].split(',', 1)[0];
					}
					// If feature contains " County", remove the string
					if (feature.properties['Location']?.includes(' County')) {
						feature.properties['Location'] = feature.properties['Location'].replace(' County', '');
					}
					return feature;
				})
		);

		// ...filtered to state data
		reparationsStateData.set(
			$reparationsData?.features
				.filter((feature) => {
					return feature.properties['Geography'] === 'State' && feature.properties['State'];
				})
				// remove non-applicable point geometry data (long/lat) from state data
				.map((feature) => {
					delete feature.geometry;
					return feature;
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
		// countyPolygons.set({
		// 	type: 'FeatureCollection',
		// 	features: $countiesMap?.features.filter((d) =>
		// 		$reparationsCountyData.some(
		// 			(e) =>
		// 				d.properties['name'] === e.properties.Location &&
		// 				d.properties['state'] === e.properties.State
		// 		)
		// 	)
		// });

		// For reparationsCountyData, pull in county polygon data from countiesMap
		reparationsCountyData.update((data) => {
			return data.map((feature) => {
				const county = $countiesMap?.features.find(
					(d) =>
						d.properties['name'] === feature.properties['Location'] &&
						d.properties['state'] === feature.properties['State']
				);
				if (county) {
					feature.geometry = county.geometry;
				}
				return feature;
			});
		});

		// Map data for all states
		statesMap.set(topojson.feature(topoCounties, topoCounties.objects.states));

		// Filter to individual states (with reparation efforts) as feature collection for mapping
		// statePolygons.set({
		// 	type: 'FeatureCollection',
		// 	features: $statesMap?.features.filter((d) =>
		// 		$reparationsStateData.some((e) => d.properties['name'] === e.properties.Location)
		// 	)
		// });

		// For reparationsStateData, pull in county polygon data from statesMap
		reparationsStateData.update((data) => {
			return data.map((feature) => {
				const state = $statesMap?.features.find(
					(d) => d.properties['name'] === feature.properties['Location']
				);
				if (state) {
					feature.geometry = state.geometry;
				}
				return feature;
			});
		});
	});

	// Message when on mobile landscape mode
	import Modal from '$lib/components/Modal.svelte';
	import rotateIcon from '$lib/images/rotate-device-icon.png';
	let isLandscapeMode = false;

	// Check if using mobile in landscape mode
	function checkMobileLandscape() {
		const isMobile =
			/Android|BlackBerry|IEMobile|iPad|iPod|iPhone|Opera Mini|webOS/i.test(navigator.userAgent) &&
			window.matchMedia('(max-width: 932px)').matches;
		const isLandscape = window.matchMedia('(orientation: landscape)').matches;
		const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

		isLandscapeMode = isMobile && isLandscape && isTouchDevice;
	}

	// Detect orientation change and resize
	onMount(() => {
		checkMobileLandscape();

		// Event listeners for change in screen size and orientation
		window.addEventListener('resize', checkMobileLandscape);
		window.addEventListener('orientationchange', checkMobileLandscape);

		// Remove event listeners when component destroyed
		return () => {
			window.removeEventListener('resize', checkMobileLandscape);
			window.removeEventListener('orientationchange', checkMobileLandscape);
		};
	});
</script>

<!-- Map -->
{#if $reparationsData}
	<Map bind:sidebarVisible />
{/if}

<!-- Sidebar -->
{#if sidebarVisible && !isLandscapeMode}
	<div class="sidebar-content" transition:fly={{ x: -200, duration: 1000 }}>
		<!-- <div class="sidebar-content" transition:fade> -->
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

<!-- Message when in mobile landscape mode -->
{#if isLandscapeMode}
	<Modal bind:isLandscapeMode>
		<img src={rotateIcon} alt="" width="50" style="margin: auto; padding-bottom: 5px;" />
		<p>Please rotate your device to access the</p>
		<p
			style="font-size: 1.35em; text-transform: uppercase; font-weight: 700; color: var(--orange);"
		>
			Black Reparations Map
		</p>
	</Modal>
{/if}

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

	/* Center sidebar on mobile devices */
	@media screen and (max-width: 480px) {
		.sidebar-content {
			margin-left: auto;
			margin-right: auto;
		}
	}

	/* @media only screen and (max-device-width: 812px) and (orientation: landscape) {
		.sidebar-content {
			display: none;
		}
	} */
</style>
