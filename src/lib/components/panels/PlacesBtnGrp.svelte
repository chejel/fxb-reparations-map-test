<script>
	// Import stores
	import {
		reparationsCityData,
		reparationsCountyData,
		reparationsStateData,
		citiesPanelVisible,
		countiesPanelVisible,
		statesPanelVisible,
		selectedLocation,
		map
	} from '$lib/stores.js';

	// Import components
	import LocationsPanel from '$lib/components/panels/LocationsPanel.svelte';

	// Number of places
	let citiesCount = $reparationsCityData?.length;
	let countiesCount = $reparationsCountyData?.length;
	let statesCount = $reparationsStateData?.length;

	// Import transition
	import { fade } from 'svelte/transition';

	// Data array for buttons
	const buttonData = [
		{ label: 'Cities', count: citiesCount },
		{ label: 'Counties', count: countiesCount },
		{ label: 'States', count: statesCount }
	];

	function handlePlacesBtnClick(label) {
		$citiesPanelVisible = label === 'Cities';
		$countiesPanelVisible = label === 'Counties';
		$statesPanelVisible = label === 'States';
		$selectedLocation = undefined;
		// Clear any highlighted location on map:
		$map.setFilter('panel-city-selected-layer', ['==', 'Location', '']);
		$map.setFilter('panel-county-selected-layer', ['==', 'Location', '']);
		$map.setFilter('panel-county-selected-layer', ['==', 'State', '']);
		$map.setFilter('panel-state-selected-layer', ['==', 'State', '']);
	}
</script>

<!-- Buttons: Cities, Counties, States -->
<section aria-label="Buttons for viewing cities, counties and states" class="btn-container">
	<!-- Button template -->
	{#each buttonData as { label, count }}
		<button
			class:active={($citiesPanelVisible && label === 'Cities') ||
				($countiesPanelVisible && label === 'Counties') ||
				($statesPanelVisible && label === 'States')}
			on:click|stopPropagation={() => handlePlacesBtnClick(label)}
		>
			{label}
			<span class="btn-badge" style="padding: {count < 10 ? '0.15rem 0.5rem' : '0.15rem 0.25rem'}"
				>{count}</span
			>
		</button>
	{/each}
</section>

<!-- Cities / Counties / States panel -->
{#if $citiesPanelVisible || $countiesPanelVisible || $statesPanelVisible}
	<section aria-label="Locations with reparations efforts" class="location-container" in:fade>
		<LocationsPanel />
	</section>
{/if}

<style>
	.location-container {
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	section:not(:last-child) {
		margin-bottom: 1.25rem;
	}

	.btn-container {
		display: flex;
		background-color: rgba(var(--gray), 0.45);
		border-radius: 5px;
		border: 0.5px solid silver;
	}

	button {
		padding: 0.35rem 0;
		font-size: 0.9rem;
		font-weight: 400;
		flex-grow: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		font-family: 'Outfit', sans-serif;
		position: relative;
	}

	button:first-child {
		border-radius: 5px 0 0 5px;
	}

	button:not(:first-child) {
		margin-left: -1px;
	}

	button:not(.active):after {
		content: '❘';
		font-size: 1.5rem;
		color: rgba(var(--white), 1);
		display: inline-block;
		position: absolute;
		right: -7px;
	}

	button:last-child {
		border-radius: 0 5px 5px 0;
	}

	button.active {
		font-weight: 700;
		background-color: rgba(var(--white), 0.8);
		border: 1px solid rgba(var(--orange), 1);
		border-radius: 5px !important;
	}

	.btn-badge {
		background-color: rgba(var(--orange), 1);
		color: rgba(var(--black), 1);
		font-size: 0.8rem;
		margin-left: 0.5rem;
		border-radius: 50%;
	}
</style>
