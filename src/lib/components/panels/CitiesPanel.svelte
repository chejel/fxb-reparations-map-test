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

		<section class="cities-table" in:fade>
			<CitiesTable {sortByState} />
		</section>
	{:else}
		<section class="back-arrow">
			<button on:click={() => ($selectedCity = undefined)} class="back-button">
				<ArrowLeft /> <span class="back-text">Return to list of cities</span>
			</button>
		</section>
		<section class="selected-city" in:fade>
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
		overflow: auto;
		font-size: 1rem;
		background-color: rgba(255, 255, 253, 0.75);
		border: 0.75px solid #597e52;
		padding: 0.25rem;
		border-radius: 5px;
	}

	.back-button {
		display: flex;
		gap: 5px;
		margin-left: 0.2rem;
		margin-bottom: 0.5rem;
		border: 0;
		background-color: transparent;
		cursor: pointer;
	}

	.back-text {
		font-family: 'Barlow Condensed', sans-serif;
		text-transform: uppercase;
		font-size: 0.9rem;
		font-weight: 600;
	}

	.selected-city {
		background-color: rgba(255, 255, 253, 0.75);
		/* border: 0.75px solid #ffb347; */
		border: 0.75px solid #597e52;
		padding: 0.75rem;
		border-radius: 5px;
		/* position: relative; */
		overflow: auto;
	}

	/* for touch screens */
	@media (hover: none) {
		button {
			color: #333;
		}
	}
</style>
