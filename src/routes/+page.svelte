<script>
	// Import components
	import Map from '$lib/components/Map.svelte';
	import Footer from '$lib/components/Footer.svelte';
	// Sidebar components
	import Sidebar from '$lib/components/Sidebar.svelte';
	// Import icon components
	import ListIcon from '$lib/components/icons/List.svelte';

	// Import stores
	import { reparationsData, reparationsStateData } from '$lib/stores.js';

	// Set state of sidebar
	let sidebarVisible = true;

	// Import transition
	import { fade } from 'svelte/transition';

	// Import reparations data
	import { onMount } from 'svelte';
	import { csv } from 'd3-fetch';

	onMount(async () => {
		reparationsData.set(
			await csv(
				'https://docs.google.com/spreadsheets/d/e/2PACX-1vT__H1c2RsZwADkEXXbVsqJD5G-GyeA9YrRG1-Y4oCBACYTNQyzWtDFTYxs7v9P5hJODeZz0jRnkcK3/pub?gid=0&single=true&output=csv'
			)
		);

		reparationsData.update((data) => {
			return data.map((d) => {
				return {
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: [+d['Longitude'], +d['Latitude']]
					},
					properties: { ...d }
				};
			});
		});

		reparationsStateData.set(
			await csv(
				'https://docs.google.com/spreadsheets/d/e/2PACX-1vT__H1c2RsZwADkEXXbVsqJD5G-GyeA9YrRG1-Y4oCBACYTNQyzWtDFTYxs7v9P5hJODeZz0jRnkcK3/pub?gid=1230514702&single=true&output=csv'
			)
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
			max-width: 100svw;
			max-height: 100svh;
			margin: 0;
		}
	}
</style>
