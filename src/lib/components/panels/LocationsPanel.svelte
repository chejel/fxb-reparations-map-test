<script>
	// Import components
	import LocationsTable from '$lib/components/panels/LocationsTable.svelte';
	import SelectedLocationCard from '$lib/components/panels/SelectedLocationCard.svelte';
	import StateSortToggle from '$lib/components/panels/StateSortToggle.svelte';

	// Import icon components
	import ArrowLeft from '$lib/components/icons/ArrowLeft.svelte';

	// Import stores
	import {
		citiesPanelVisible,
		countiesPanelVisible,
		statesPanelVisible,
		selectedLocation,
		reparationsCityData,
		reparationsCountyData,
		reparationsStateData,
		map
	} from '$lib/stores.js';

	// Import transition
	import { fade } from 'svelte/transition';

	// Set variable for sort by state toggle
	let sortByState = false;
</script>

{#if $reparationsCityData && $reparationsCountyData && $reparationsStateData}
	<!-- Table of matching county names, state -->
	{#if !$selectedLocation}
		<p style="margin-bottom: {$statesPanelVisible ? '0.35rem' : '0'}">
			Select a {$citiesPanelVisible ? 'city' : $countiesPanelVisible ? 'county' : 'state'} for information
			about its reparations efforts.
		</p>

		<!-- Sort by state toggle -->
		{#if $citiesPanelVisible || $countiesPanelVisible}
			<div class="state-toggle-container">
				<StateSortToggle bind:checked={sortByState} />
			</div>
		{/if}

		<section aria-label="List of locations" class="card locations-table-container" in:fade>
			<LocationsTable
				sortByState={$citiesPanelVisible || $countiesPanelVisible ? sortByState : null}
			/>
		</section>
	{:else}
		<div class="back-arrow">
			<button
				on:click={() => {
					$selectedLocation = undefined;
					// Clear any location highlights on map:
					$map.setFilter('panel-city-selected-layer', ['==', 'Location', '']);
					$map.setFilter('panel-county-selected-layer', ['==', 'Location', '']);
					$map.setFilter('panel-county-selected-layer', ['==', 'State', '']);
					$map.setFilter('panel-state-selected-layer', ['==', 'State', '']);
				}}
				class="back-button"
			>
				<ArrowLeft />
				<span class="back-text"
					>List of {$citiesPanelVisible
						? 'cities'
						: $countiesPanelVisible
							? 'counties'
							: 'states'}</span
				>
			</button>
		</div>
		<section
			aria-label="Details about the selected location"
			class="card selected-location"
			in:fade
		>
			<SelectedLocationCard />
		</section>
	{/if}
{/if}

<style>
	.state-toggle-container {
		margin-bottom: 0.35rem;
		margin-right: 0.25rem;
		text-align: right;
	}

	.locations-table-container {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		/* padding: 0.25rem; */
		margin-top: 0;
		overflow: auto;
	}

	.back-button {
		display: flex;
		align-items: center;
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

	.selected-location {
		margin-top: 0.25rem;
	}

	/* for touch screens */
	@media (hover: none) {
		button {
			color: #333;
		}
	}
</style>
