<script>
	// Import stores
	import {
		reparationsData,
		citiesPanelVisible,
		countiesPanelVisible,
		statesPanelVisible,
		selectedCity,
		selectedCounty,
		selectedState
	} from '$lib/stores.js';

	// Import components
	import CitiesPanel from '$lib/components/panels/CitiesPanel.svelte';
	import StatesPanel from '$lib/components/panels/StatesPanel.svelte';

	// Number of cities
	let citiesCount = $reparationsData?.length;
	let countiesCount = 3;
	let statesCount = 3;
</script>

<main class="about-body">
	<!-- Locations buttons -->
	<section class="btn-container">
		<button
			class:active={$citiesPanelVisible}
			on:click={() => {
				$citiesPanelVisible = true;
				$countiesPanelVisible = false;
				$statesPanelVisible = false;
				$selectedCounty = undefined;
				$selectedState = undefined;
			}}
			>Cities <span
				class="btn-badge"
				style="font-weight: 400; padding: {citiesCount < 10 ? '0.15rem 0.5rem' : '0.15rem 0.35rem'}"
				>{citiesCount}</span
			></button
		>
		<button
			class:active={$countiesPanelVisible}
			on:click={() => {
				$citiesPanelVisible = false;
				$countiesPanelVisible = true;
				$statesPanelVisible = false;
				$selectedCity = undefined;
				$selectedState = undefined;
			}}
			>Counties <span
				class="btn-badge"
				style="font-weight: 400; padding: {statesCount < 10 ? '0.15rem 0.5rem' : '0.15rem 0.35rem'}"
				>{countiesCount}</span
			></button
		>

		<button
			class:active={$statesPanelVisible}
			on:click={() => {
				$citiesPanelVisible = false;
				$countiesPanelVisible = false;
				$statesPanelVisible = true;
				$selectedCity = undefined;
				$selectedCounty = undefined;
			}}
			>States <span
				class="btn-badge"
				style="font-weight: 400; padding: {statesCount < 10 ? '0.15rem 0.5rem' : '0.15rem 0.35rem'}"
				>{statesCount}</span
			></button
		>
	</section>

	<!-- Location panel -->
	<section class="list-container">
		{#if $citiesPanelVisible}
			<CitiesPanel />
		{:else if $statesPanelVisible}
			<StatesPanel />
		{/if}
	</section>
</main>

<style>
	.about-body {
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	section:not(:last-child) {
		margin-bottom: 1rem;
	}

	.btn-container {
		display: flex;
		background-color: rgba(220, 220, 220, 0.75);
		border-radius: 5px;
		border: 0.5px solid silver;
	}

	button {
		background-color: transparent;
		padding: 0.5rem 1rem;
		font-family: 'Barlow', sans-serif;
		color: black;
		font-size: 0.85rem;
		font-weight: 500;
		border: none;
		cursor: pointer;
		flex-grow: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		/* border: 0.5px solid gray; */
		/* margin-left: -1px; */
	}

	button:first-child {
		border-radius: 5px 0 0 5px;
	}

	button:not(:first-child) {
		/* border-right: 0.5px solid white; */
		margin-left: -1px;
	}

	button {
		position: relative;
	}

	button:not(.active):after {
		content: '❘';
		/* font-family: 'sans-serif'; */
		font-size: 1.5rem;
		color: white;
		display: inline-block;
		position: absolute;
		right: -7px;
	}

	button:last-child {
		border-radius: 0 5px 5px 0;
	}

	.active {
		font-weight: 600;
		/* background-color: #f0ebe1; */
		background-color: rgba(255, 255, 253, 0.75);
		border: 1px solid #ffab4d;
		border-radius: 5px !important;
	}

	.list-container {
		overflow: auto;
	}

	.btn-badge {
		background-color: #ffab4d;
		color: #333;
		font-size: 0.8rem;
		margin-left: 0.5rem;
		border-radius: 50%;
	}
</style>
