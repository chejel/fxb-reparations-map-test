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
			features: data.airtableRecords
				.map((d) => {
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
				// Must have Location, Geography, State fields
				.filter(
					(feature) =>
						feature.properties['Location'] &&
						feature.properties['Geography'] &&
						feature.properties['State']
				)
		});

		// ...filtered to city data
		reparationsCityData.set(
			$reparationsData?.features
				.filter(
					(feature) =>
						feature.properties['Geography'] === 'City' &&
						//feature.properties['State'] &&
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
					(feature) => feature.properties['Geography'] === 'County'
					//&& feature.properties['State']
				)
				// remove non-applicable point geometry data (long/lat) from county data
				// .map((feature) => {
				// 	delete feature.geometry;
				// 	return feature;
				// })
				.map((feature) => {
					// If feature contains a comma, remove + everything after
					if (feature.properties['Location']?.includes(',')) {
						feature.properties['Location'] = feature.properties['Location'].split(',', 1)[0].trim();
					}

					// If feature contains a parenthesis, remove + everything after
					if (feature.properties['Location']?.includes('(')) {
						feature.properties['Location'] = feature.properties['Location'].split('(', 1)[0].trim();
					}
					// 	// If feature contains " County", remove the string
					// 	// if (feature.properties['Location']?.includes(' County')) {
					// 	// 	feature.properties['Location'] = feature.properties['Location'].replace(' County', '');
					// 	// }
					return feature;
				})
		);

		// ...filtered to state data
		reparationsStateData.set(
			$reparationsData?.features
				.filter((feature) => {
					return feature.properties['Geography'] === 'State' && feature.properties['State'];
				})
				// remove any non-applicable point geometry data (long/lat) from state data
				.map((feature) => {
					delete feature.geometry;
					return feature;
				})
		);

		// In fipsCodes, convert fips_code to string value
		// Source: https://www.census.gov/library/reference/code-lists/ansi.html#cou
		fipsCodes.forEach((d) => {
			d.fips_code = String(d.fips_code);
			// Create a new property that extracts from the county name any of the following: County, Parish, Borough, or Census Area
			// d.county_name = d.COUNTYNAME
			// 	.replace(/County|Parish|Borough|Census Area|Municipality/g, '')
			// 	.trim();
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
			style="font-size: 1.35em; text-transform: uppercase; font-weight: 700; color: rgba(var(--orange), 1);"
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
		background-color: rgb(var(--light-gray), 1);
		top: 0;
		z-index: 1;
		margin: 1rem;
		box-shadow: 0px 0px 24px 3px rgba(var(--black), 0.1);
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
