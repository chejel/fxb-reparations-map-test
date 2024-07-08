<script>
	// Import components
	import Stats from '$lib/components/panels/Stats.svelte';
	import Legend from '$lib/components/panels/Legend.svelte';

	// Import icon components
	import StatsIcon from '$lib/components/icons/Stats.svelte';

	// Import stores
	import { reparationsCityData, reparationsStateData } from '$lib/stores.js';
</script>

<!-- Intro text -->
<section class="introduction">
	<p>Zoom in or double click on the map to see any city names that do not initially appear.</p>
	<div class="legend-container">
		<div>
			<span style="font-weight: 600; text-transform: uppercase;">Map legend</span> of reparation efforts
		</div>
		<div class="legend">
			<span><Legend geoType="city" text="City-level" /></span>
			<span><Legend geoType="state" text="State-level" /></span>
		</div>
	</div>
</section>

<!-- Stats card -->
{#if $reparationsCityData}
	<section class="card">
		<!-- header -->
		<p class="card-header"><StatsIcon /> Represented</p>

		<!-- stats -->
		<div class="stats-table">
			<Stats />
		</div>
	</section>
{/if}

<style>
	.card-header {
		font-family: 'Barlow Condensed', sans-serif;
		font-size: 1rem;
		text-transform: uppercase;
		font-weight: 600;
		background-color: rgba(234, 230, 230, 0.7);
		padding: 0.6rem 0.75rem;
		display: flex;
		gap: 5px;
	}

	.stats-table {
		/* margin-top: 0.5rem; */
		padding: 0.5rem 0.75rem;
	}

	.legend-container {
		margin-top: 10px;
		font-size: 0.85rem;

		font-family: 'Barlow Condensed', sans-serif;

		color: var(--gray);
		display: flex;
		justify-content: space-between;
		border: 1px solid silver;
		padding: 5px 8px;
		border-radius: 3px;
	}

	.legend {
		display: flex;
		align-items: center;
		gap: 15px;
	}
</style>
