<script>
	// Import components
	import Stats from '$lib/components/panels/Stats.svelte';
	import Legend from '$lib/components/panels/Legend.svelte';

	// Import icon components
	import MarkerIcon from '$lib/components/icons/MapMarker.svelte';
	import StatsIcon from '$lib/components/icons/Stats.svelte';

	// Import stores
	import { reparationsCityData } from '$lib/stores.js';
</script>

<!-- Intro text -->
<section aria-label="Introduction" class="introduction">
	<p>Zoom in or double click on the map to see any city names that do not initially appear.</p>
	<div class="legend-container">
		<p class="legend-header">
			<MarkerIcon />
			<span><span style="font-weight: 600;">Map legend</span> of reparation efforts</span>
		</p>
		<div class="legend">
			<span><Legend geoType="city" text="City-level" /></span>
			<span><Legend geoType="county" text="County-level" /></span>
			<span><Legend geoType="state" text="State-level" /></span>
		</div>
	</div>
</section>

<!-- Stats card -->
{#if $reparationsCityData}
	<section
		aria-label="Stats about the number of cities, counties and states on the map"
		class="card"
	>
		<!-- header -->
		<p class="card-header"><StatsIcon /> Locations Represented</p>

		<!-- stats -->
		<div class="stats-table">
			<Stats />
		</div>
	</section>
{/if}

<style>
	.legend-container {
		margin-top: 10px;
		font-size: 0.85rem;
		font-family: 'Barlow Condensed', sans-serif;
		background-color: rgba(var(--white), 0.75);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		border: 0.75px solid rgba(var(--dark-green), 1);
		border-radius: 5px;
	}

	.legend-header {
		padding: 7px 10px;
		text-transform: uppercase;
		background-color: rgba(var(--yellow-orange), 0.75);
		display: flex;
		gap: 2px;
		align-items: center;
		border-radius: 5px 5px 0 0;
	}

	.legend {
		padding: 7px 10px;
		display: flex;
		align-items: center;
		/* justify-content: space-between; */
		gap: 25px;
	}

	/* stats */
	.card-header {
		font-family: 'Barlow Condensed', sans-serif;
		font-size: 1rem;
		text-transform: uppercase;
		font-weight: 600;
		background-color: rgba(var(--gray), 0.35);
		padding: 0.6rem 0.75rem;
		display: flex;
		gap: 5px;
	}

	.stats-table {
		/* margin-top: 0.5rem; */
		padding: 0.5rem 0.75rem;
	}
</style>
