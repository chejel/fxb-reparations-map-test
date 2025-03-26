<script>
	// Stores
	import { filteredLocations } from '$lib/stores.js';

	// Sort by location
	$: $filteredLocations?.sort((a, b) => a.Location.localeCompare(b.Location));

	// Transition effect for accordion
	import { slide, fade } from 'svelte/transition';
	let isOpen = false;
</script>

{#if $filteredLocations?.length > 0}
	<details bind:open={isOpen} transition:fade>
		<summary>Locations</summary>
		{#if isOpen}
			<!-- city list -->
			<div class="content" transition:slide>
				{#if $filteredLocations.some((location) => location.Geography === 'City')}
					<p class="category-label">Cities</p>
					{#each $filteredLocations.filter((location) => location.Geography === 'City') as location, iCity}
						<p class="city">
							<span class="index">{iCity + 1}</span>
							<span>{location.Location}, <span class="state">{location.State}</span></span>
						</p>
					{/each}
				{/if}

				<!-- county list -->
				{#if $filteredLocations.some((location) => location.Geography === 'County')}
					<p class="category-label">Counties</p>
					{#each $filteredLocations.filter((location) => location.Geography === 'County') as location, iCounty}
						<p class="county">
							<span class="index">{iCounty + 1}</span>
							<span>{location.Location} <span class="state">({location.State})</span></span>
						</p>
					{/each}
				{/if}

				<!-- state list -->
				{#if $filteredLocations.some((location) => location.Geography === 'State')}
					<p class="category-label">States</p>
					{#each $filteredLocations.filter((location) => location.Geography === 'State') as location, iState}
						<p class="state">
							<span class="index">{iState + 1}</span>
							<span class="state">{location.State}</span>
						</p>
					{/each}
				{/if}
			</div>
		{/if}
	</details>
{/if}

<style>
	details {
		width: 190px;
		border: 1px solid red;
		background-color: rgba(var(--black), 0.75);
		color: rgba(var(--white), 1);
		box-sizing: border-box;
		border: 0.75px solid rgba(var(--black), 1);
		border-radius: 3px;
		filter: drop-shadow(3px 3px 3px rgb(0.25 0.25 0.25 / 0.1));
	}

	summary,
	.category-label,
	.state {
		font-family: 'Barlow Condensed', sans-serif;
		text-transform: uppercase;
		font-weight: 600;
	}

	summary {
		cursor: pointer;
		font-size: 0.9rem;
		background-color: rgba(var(--black), 0.75);
		padding: 5px;
		color: rgba(var(--yellow-orange), 1);
	}

	/* space between arrow and text */
	summary::before {
		content: '\2008';
	}

	/* style arrow marker */
	summary::-webkit-details-marker {
		color: rgba(var(--yellow-orange), 0.8);
	}
	summary::marker {
		color: rgba(var(--yellow-orange), 0.8);
	}

	.content {
		padding: 8px 10px;
		max-height: 200px;
		overflow-y: auto;
	}

	p {
		font-size: 0.8rem;
		display: flex;
		align-items: center;
		column-gap: 3px;
	}

	.index {
		font-weight: bold;
		font-size: 0.65rem;
		color: rgba(var(--yellow-orange), 1);
	}

	.category-label {
		border-bottom: 1px solid rgba(var(--yellow-orange), 0.5);
		font-size: 0.8rem;
		color: rgba(var(--yellow), 1);
	}

	.category-label:not(:first-child) {
		margin-top: 10px;
	}

	.state {
		font-weight: 400;
	}

	/* scrollbar for list */
	.content::-webkit-scrollbar {
		width: 13px;
	}

	.content::-webkit-scrollbar-thumb {
		background-color: rgba(var(--orange), 0.75);
		border: 3px solid transparent;
		border-radius: 10px;
		background-clip: padding-box;
	}
</style>
