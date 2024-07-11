<script>
	// Import components
	import StatesTable from '$lib/components/panels/StatesTable.svelte';
	import SelectedStateCard from '$lib/components/panels/SelectedStateCard.svelte';

	// Import icon components
	import ArrowLeft from '$lib/components/icons/ArrowLeft.svelte';

	// Import stores
	import { reparationsStateData, selectedState } from '$lib/stores.js';

	// Import transition
	import { fade } from 'svelte/transition';
</script>

{#if $reparationsStateData}
	<!-- Table of states -->
	{#if !$selectedState}
		<p style="margin-bottom: 0.35rem;">
			Select a state for information about their reparation efforts.
		</p>

		<section class="card states-table" in:fade>
			<StatesTable />
		</section>
	{:else}
		<section class="back-arrow">
			<button on:click={() => ($selectedState = undefined)} class="back-button">
				<ArrowLeft /> <span class="back-text">List of states</span>
			</button>
		</section>
		<section class="card selected-state" in:fade>
			<SelectedStateCard />
		</section>
	{/if}
{/if}

<style>
	/* .state-toggle-container {
		margin-bottom: 0.35rem;
		margin-right: 0.25rem;
		text-align: right;
	} */

	.states-table {
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

	.selected-state {
		/* padding: 0.75rem; */
		margin-top: 0.25rem;
	}

	/* for touch screens */
	@media (hover: none) {
		button {
			color: #333;
		}
	}
</style>
