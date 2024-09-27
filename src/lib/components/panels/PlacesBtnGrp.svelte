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
		selectedState
	} from '$lib/stores.js';

	// Import components
	import LocationsPanel from '$lib/components/panels/LocationsPanel.svelte';
	import StatesPanel from '$lib/components/panels/StatesPanel.svelte';

	// Number of places
	let citiesCount = $reparationsCityData?.length;
	let countiesCount = $reparationsCountyData?.length;
	let statesCount = $reparationsStateData?.length;

	// Import transition
	import { fade } from 'svelte/transition';
</script>

<main class="places-body">
	<!-- Buttons: Cities, Counties, States -->
	<section class="btn-container">
		<!-- Cities button -->
		<button
			class:active={$citiesPanelVisible}
			on:click={() => {
				$citiesPanelVisible = true;
				$countiesPanelVisible = false;
				$statesPanelVisible = false;
				// Selecting any of the buttons will clear the card and show the table
				$selectedLocation = undefined;
				$selectedState = undefined;
			}}
			>Cities <span
				class="btn-badge"
				style="padding: {citiesCount < 10 ? '0.15rem 0.5rem' : '0.15rem 0.25rem'}"
				>{citiesCount}</span
			></button
		>

		<!-- Counties button -->
		<button
			class:active={$countiesPanelVisible}
			on:click={() => {
				$citiesPanelVisible = false;
				$countiesPanelVisible = true;
				$statesPanelVisible = false;
				$selectedLocation = undefined;
				$selectedState = undefined;
			}}
			>Counties <span
				class="btn-badge"
				style="padding: {countiesCount < 10 ? '0.15rem 0.5rem' : '0.15rem 0.25rem'}"
				>{countiesCount}</span
			></button
		>

		<!-- States button -->
		<button
			class:active={$statesPanelVisible}
			on:click={() => {
				$citiesPanelVisible = false;
				$countiesPanelVisible = false;
				$statesPanelVisible = true;
				$selectedLocation = undefined;
				$selectedState = undefined;
			}}
			>States <span
				class="btn-badge"
				style="padding: {statesCount < 10 ? '0.15rem 0.5rem' : '0.15rem 0.25rem'}"
				>{statesCount}</span
			></button
		>
	</section>

	<!-- Cities / Counties / States panel -->
	{#if $citiesPanelVisible || $countiesPanelVisible}
		<section class="location-container" in:fade>
			<LocationsPanel />
		</section>
		<!-- {:else if $countiesPanelVisible}
		<section class="location-container" in:fade>
			<CountiesPanel />
		</section> -->
	{:else if $statesPanelVisible}
		<section class="location-container" in:fade>
			<StatesPanel />
		</section>
	{/if}
</main>

<style>
	/* to display scrollbar on table section only */
	.places-body {
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

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
		background-color: rgba(220, 220, 220, 0.65);
		border-radius: 5px;
		border: 0.5px solid silver;
	}

	button {
		padding: 0.35rem 0;
		font-size: 0.85rem;
		font-weight: 400;
		flex-grow: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	button:first-child {
		border-radius: 5px 0 0 5px;
	}

	button:not(:first-child) {
		margin-left: -1px;
	}

	button {
		position: relative;
	}

	button:not(.active):after {
		content: '❘';
		font-size: 1.5rem;
		color: #fffffd;
		display: inline-block;
		position: absolute;
		right: -7px;
	}

	button:last-child {
		border-radius: 0 5px 5px 0;
	}

	.active {
		font-weight: 700;
		background-color: rgba(255, 255, 253, 0.75);
		border: 1px solid var(--orange);
		border-radius: 5px !important;
	}

	.btn-badge {
		background-color: var(--orange);
		color: #333;
		font-size: 0.8rem;
		margin-left: 0.5rem;
		border-radius: 50%;
	}
</style>
