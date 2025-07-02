<script>
	// Import components
	import Map from '$lib/components/Map.svelte';
	import MapFilters from '$lib/components/MapFilters.svelte';
	import Footer from '$lib/components/Footer.svelte';

	// Sidebar components
	import Sidebar from '$lib/components/Sidebar.svelte';

	// Import icon components
	import ListIcon from '$lib/components/icons/List.svelte';

	// Import reparations data
	import { onMount } from 'svelte';

	import {
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

	// Hide elements when JavaScript is disabled
	let showJSDisabled = false;

	export let data;
	onMount(async () => {
		if (data) {
			reparationsData.set(data.data);
		}

		// ...filtered to city data
		const cityData = data.data.features
			?.filter(
				(feature) =>
					feature.properties['Geography'] === 'City' &&
					feature.properties['Latitude'] &&
					feature.properties['Longitude']
			)
			.map((feature) => {
				if (feature.properties['Location']?.includes(',')) {
					// Retain original location name
					feature.properties['Original location name'] = feature.properties['Location'];
					// If feature contains a comma, remove including everything after
					feature.properties['Location'] = feature.properties['Location'].split(',', 1)[0];
				}
				return feature;
			});

		reparationsCityData.set(cityData || []);

		// ...filtered to counties data
		const countyData = data.data.features
			?.filter((feature) => feature.properties['Geography'] === 'County')
			.map((feature) => {
				// Retain original location name
				feature.properties['Original location name'] = feature.properties['Location'];

				// If feature contains a comma, remove + everything after
				if (feature.properties['Location']?.includes(',')) {
					feature.properties['Location'] = feature.properties['Location'].split(',', 1)[0].trim();
				}

				// If feature contains a parenthesis, remove + everything after
				if (feature.properties['Location']?.includes('(')) {
					feature.properties['Location'] = feature.properties['Location'].split('(', 1)[0].trim();
				}
				return feature;
			});
		reparationsCountyData.set(countyData || []);

		// ...filtered to state data
		const stateData = data.data.features
			?.filter(
				(feature) => feature.properties['Geography'] === 'State' && feature.properties['State']
			)
			.map((feature) => {
				delete feature.geometry;
				return feature;
			});
		reparationsStateData.set(stateData || []);

		// In fipsCodes, convert fips_code to string value
		// Source: https://www.census.gov/library/reference/code-lists/ansi.html#cou
		fipsCodes.forEach((d) => {
			d.fips_code = String(d.fips_code);
		});

		// Map data for all counties
		let countiesMap = topojson
			.feature(topoCounties, topoCounties.objects.counties)
			// Add fips code to each county feature to use that as variable to match the reparations dataset and topojson
			.features.map((feature) => {
				// Exclude feature with id of 02261 (Valdez–Cordova Census Area, Alaska which has been replaced as of 2019; map data is 2017, fips data is 2020)
				if (feature.id !== '02261') {
					const fips = feature.id;
					const state = fipsCodes.find((d) => d.fips_code === fips);
					feature.properties['state'] = state.state_name;
					feature.properties['full_name'] = state.COUNTYNAME; // Include full county name for labeling
				}
				return feature;
			});

		// Add county geometry features from countiesMap to reparationsCountyData
		reparationsCountyData.update((reparationsData) => {
			return (
				reparationsData
					.map((feature) => {
						const county = countiesMap?.find(
							(topoData) =>
								topoData.properties['name'] ===
									feature.properties['Location']
										// Remove any noted geographic description
										.replace(/County|Borough|City and Borough|Census Area|Municipality|Parish/g, '')
										.trim() && topoData.properties['state'] === feature.properties['State']
						);
						// Add geometry feature
						if (county) {
							feature.geometry = county.geometry;
							// Add "full" county or equivalent name to reparationsCountyData
							feature.properties['Full County Name'] = county.properties['full_name'];
						}
						return feature;
					})
					// Return only features with a valid geometry
					.filter((feature) => feature.geometry.coordinates[0]) // sort by location name
					.sort((a, b) => a.properties['Location'].localeCompare(b.properties['Location']))
			);
		});

		// Map data for all states
		statesMap.set(topojson.feature(topoCounties, topoCounties.objects.states));

		// For reparationsStateData, pull in county polygon data from statesMap
		reparationsStateData.update((data) => {
			return (
				data
					.map((feature) => {
						// Retain original location name (to display on location card)
						feature.properties['Original location name'] = feature.properties['Location'];

						// If feature contains a comma, remove + everything after
						if (feature.properties['Location']?.includes(',')) {
							feature.properties['Location'] = feature.properties['Location']
								.split(',', 1)[0]
								.trim();
						}

						// If feature contains a parenthesis, remove + everything after
						if (feature.properties['Location']?.includes('(')) {
							feature.properties['Location'] = feature.properties['Location']
								.split('(', 1)[0]
								.trim();
						}

						const state = $statesMap?.features.find(
							(d) => d.properties['name'] === feature.properties['Location']
						);
						if (state) {
							feature.geometry = state.geometry;
						}
						return feature;
					})
					// Filter to only features with geometry
					.filter((feature) => feature.geometry)
			);
		});

		// Detect orientation change and resize
		// checkMobileLandscape();

		// Event listeners for change in screen size and orientation
		window.addEventListener('resize', checkMobileLandscape);
		window.addEventListener('orientationchange', checkMobileLandscape);

		// Remove event listeners when component destroyed
		return () => {
			window.removeEventListener('resize', checkMobileLandscape);
			window.removeEventListener('orientationchange', checkMobileLandscape);
		};
	});

	onMount(() => {
		// Hide elements when JavaScript is disabled
		showJSDisabled = true;
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

	// Loading elements
	import { browser } from '$app/environment';
	let mapLoaded = false;
	$: hasData = $reparationsData?.features?.length > 0; // Data loading state
</script>

<div class="map-layout">
	<!-- Sidebar -->
	{#if sidebarVisible && !isLandscapeMode}
		<div class="sidebar-content" transition:fly={{ x: -200, duration: 1000 }}>
			<!-- <div class="sidebar-content" transition:fade> -->
			<Sidebar bind:sidebarVisible />
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

	<!-- Map -->
	{#if !browser}
		<div class="map-fallback">
			<p>This page requires JavaScript to load.</p>
			<!-- <div class="loader"></div> -->
		</div>
	{:else}
		{#if !mapLoaded && !hasData}
			<div class="map-loader">
				<p>Loading map…</p>
				<div class="loader"></div>
			</div>
		{/if}

		{#if hasData}
			<Map bind:sidebarVisible on:load={() => (mapLoaded = true)} />
			<!-- Message when in mobile landscape mode -->
			{#if isLandscapeMode}
				<Modal bind:isLandscapeMode>
					<img src={rotateIcon} alt="" width="50" style="margin: auto; padding-bottom: 5px;" />
					<p>Please rotate your device to access the</p>
					<p
						style="font-size: 1.35em; text-transform: uppercase; font-weight: 700; color: rgba(var(--orange), 1);"
					>
						National Black Reparations Map
					</p>
				</Modal>
			{/if}
		{/if}
	{/if}

	<!-- Footer -->
	{#if showJSDisabled}
		<footer class="footer-container">
			<!-- toggle filters -->
			<div class="map-filters-container">
				<MapFilters />
			</div>

			<!-- logo -->
			<Footer />
		</footer>
	{/if}
</div>

<style>
	.map-layout {
		position: relative;
		width: 100vw;
		height: 100vh;
		height: 100dvh;
		overflow: hidden;
	}

	.map-fallback {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #eee;
		flex-direction: column;
	}

	/* loader */
	.map-loader {
		display: block;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}

	.sidebar-content {
		position: absolute;
		top: 1rem;
		left: 1rem;
		max-width: 375px;
		max-height: calc(100svh - 5rem);
		border-radius: 5px;
		background-color: rgb(var(--light-gray), 1);
		box-shadow: 0 0 24px 3px rgba(var(--black), 0.25);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		z-index: 10;
	}

	.sidebar-collapsed {
		position: absolute;
		top: 0;
		margin: 1rem;
		cursor: pointer;
		background-color: transparent;
		border: 0;
		z-index: 10;
	}

	.footer-container {
		position: absolute;
		bottom: 35px;
		right: 10px;

		display: flex;
		flex-direction: column;
		align-items: end;
		row-gap: 20px;
	}

	.map-filters-container {
		font-size: 12px;
		font-weight: 600;
		gap: 1px;
		font-family: 'Roboto Condensed', sans-serif;
	}

	/* Center sidebar on mobile devices */
	@media screen and (max-width: 480px) {
		.sidebar-content {
			margin-left: auto;
			margin-right: auto;
		}

		.footer-container {
			row-gap: 0;
		}
	}

	/* @media only screen and (max-device-width: 812px) and (orientation: landscape) {
		.sidebar-content {
			display: none;
		}
	} */

	p {
		margin: 8px;
	}

	.loader {
		height: 20px;
		width: 20px;
		border-radius: 100%;
		border: 3px solid;
		border-color: rgba(var(--light-gray), 1) rgba(var(--light-gray), 1) rgba(var(--orange), 1)
			rgba(var(--light-gray), 1);
		animation: spin 2s ease infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
