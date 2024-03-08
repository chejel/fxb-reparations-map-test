<script>
	// Import components
	import CitiesTable from '$lib/components/panels/CitiesTable.svelte';
	import SelectedCityCard from '$lib/components/panels/SelectedCityCard.svelte';
	import StateSortToggle from '$lib/components/panels/StateSortToggle.svelte';

	// Import icon components
	import ArrowLeft from '$lib/components/icons/ArrowLeft.svelte';

	// Import stores
	import { reparationsData, selectedCity } from '$lib/stores.js';

	// Import transition
	import { fade } from 'svelte/transition';

	// Set variable for sort by state toggle
	let sortByState = false;
</script>

{#if $reparationsData}
	<!-- Table of matching city names, state, Wikipedia link-->
	{#if !$selectedCity}
		<p>Select a city for information about their reparation efforts.</p>

		<!-- Sort by state toggle -->
		<div class="state-toggle-container">
			<StateSortToggle bind:checked={sortByState} />
		</div>

		<section class="card cities-table" in:fade>
			<CitiesTable {sortByState} />
		</section>
	{:else}
		<section class="back-arrow">
			<button on:click={() => ($selectedCity = undefined)} class="back-button">
				<ArrowLeft /> <span class="back-text">List of cities</span>
			</button>
		</section>
		<section class="card selected-city" in:fade>
			<SelectedCityCard />
		</section>
	{/if}
{/if}

<style>
	.state-toggle-container {
		margin-bottom: 0.35rem;
		margin-right: 0.25rem;
		text-align: right;
	}

	.cities-table {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: 0.25rem;
		margin-top: 0;
	}

	.back-button {
		display: flex;
		gap: 5px;
		margin-left: 0.2rem;
		margin-bottom: 0.5rem;
	}

	.back-text {
		font-family: 'Barlow Condensed', sans-serif;
		text-transform: uppercase;
		font-size: 0.9rem;
		font-weight: 600;
	}

	.selected-city {
		padding: 0.75rem;
		margin-top: 0.25rem;
	}

	/* for touch screens */
	@media (hover: none) {
		button {
			color: #333;
		}
	}
</style>
