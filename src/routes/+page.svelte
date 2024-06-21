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
	import { reparationsData, reparationsCityData, reparationsStateData } from '$lib/stores.js';

	// Set state of sidebar
	let sidebarVisible = true;

	// Import transition
	import { fade } from 'svelte/transition';

	onMount(async () => {
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

		reparationsCityData.set(
			$reparationsData?.features.filter((feature) => {
				return feature.properties.Geography === 'City';
			})
		);

		reparationsStateData.set(
			$reparationsData?.features.filter((feature) => {
				return feature.properties.Geography === 'State';
			})
		);
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
