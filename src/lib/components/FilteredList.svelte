<script>
	// Stores
	import {
		filteredLocations,
		toggleTags,
		selectedLocation,
		map,
		aboutPanelVisible,
		listPanelVisible
	} from '$lib/stores.js';

	// Import icon components
	import CheckIcon from '$lib/components/icons/Check.svelte';

	// Sort by location
	$: $filteredLocations?.sort((a, b) => a.Location.localeCompare(b.Location));

	// Transition effect for accordion
	import { slide, fade } from 'svelte/transition';
	let isOpen = true;

	// If sidebar is closed, open when location selected
	export let sidebarVisible;

	// Zoom to AK or HI when state or location in state is selected
	function flyTo(state) {
		if (state === 'Hawaii') {
			$map.fitBounds([
				[-154.80833743387433, 22.23238695135951],
				[-160.24970712717126, 18.91727560534605]
			]);
		} else if (state === 'Alaska') {
			$map.fitBounds([
				[-155.95894737171596, 71.5388],
				[-115.02205262828487, 51.214183]
			]);
		}
	}

	const centerMapPt = { lng: -95.7, lat: 38.1 };
</script>

{#if $filteredLocations?.length > 0}
	<details bind:open={isOpen} transition:fade>
		<summary
			><span style="display: inline-flex; gap: 16px;"
				><span>Locations Shown on Map</span>{#if isOpen}
					<span style="color: pink;">✕</span>
				{/if}</span
			></summary
		>
		{#if isOpen}
			<div class="content" transition:slide>
				<!-- tags showing applied filters-->
				{#if $toggleTags.length > 0}
					<div class="tags-container">
						{#each $toggleTags as tag}
							<span class="filter-tag"
								><CheckIcon
									width="10px"
									height="10px"
									viewBox="0 0 20 20"
									fillColor="#00FF9C"
									strokeWidth="3.5"
								/>
								{tag}</span
							>
						{/each}
					</div>
				{/if}

				<!-- city list -->
				<div class="list-container">
					{#if $filteredLocations.some((location) => location.Geography === 'City')}
						<p class="category-label">Cities</p>
						{#each $filteredLocations.filter((location) => location.Geography === 'City') as location, iCity}
							<p class="city">
								<span class="index">{iCity + 1}</span>
								<button
									on:click={() => {
										selectedLocation.set({
											Location: location.Location,
											Geography: location.Geography,
											State: location.State
										});

										listPanelVisible.set(true);
										aboutPanelVisible.set(false);

										// If state is AK or HI, zoom to state
										if (location.State === 'Alaska' || location.State === 'Hawaii') {
											flyTo(location.State);
										} else {
											$map.flyTo({
												center: [centerMapPt.lng, centerMapPt.lat],
												essential: true,
												zoom: 3.75,
												pitch: 0,
												speed: 1,
												curve: 1
											});
										}

										// Clear any highlighted location on map:
										$map.setFilter('panel-city-selected-layer', ['==', 'Location', '']);
										$map.setFilter('panel-county-selected-layer', ['==', 'Location', '']);
										$map.setFilter('panel-county-selected-layer', ['==', 'State', '']);
										$map.setFilter('panel-state-selected-layer', ['==', 'State', '']);
										// Reset label colors:
										['city-labels-layer', 'county-labels-layer'].forEach((layer) => {
											$map.setPaintProperty(layer, 'text-color', '#333');
										});

										// If sidebar "hidden" and locations touched, sidebar appears with location info
										if (!sidebarVisible) {
											sidebarVisible = true;
										}
									}}
								>
									{location.Location}, <span class="state">{location.State}</span>
								</button>
							</p>
							<hr />
						{/each}
					{/if}

					<!-- county list -->
					{#if $filteredLocations.some((location) => location.Geography === 'County')}
						<p class="category-label">Counties</p>
						{#each $filteredLocations.filter((location) => location.Geography === 'County') as location, iCounty}
							<p class="county">
								<span class="index">{iCounty + 1}</span>
								<button
									on:click={() => {
										selectedLocation.set({
											Location: location.Location,
											Geography: location.Geography,
											State: location.State
										});

										listPanelVisible.set(true);
										aboutPanelVisible.set(false);

										// If state is AK or HI, zoom to state
										if (location.State === 'Alaska' || location.State === 'Hawaii') {
											flyTo(location.State);
										} else {
											$map.flyTo({
												center: [centerMapPt.lng, centerMapPt.lat],
												essential: true,
												zoom: 3.75,
												pitch: 0,
												speed: 1,
												curve: 1
											});
										}

										// Clear any highlighted location on map:
										$map.setFilter('panel-city-selected-layer', ['==', 'Location', '']);
										$map.setFilter('panel-county-selected-layer', ['==', 'Location', '']);
										$map.setFilter('panel-county-selected-layer', ['==', 'State', '']);
										$map.setFilter('panel-state-selected-layer', ['==', 'State', '']);
										// Reset label colors:
										['city-labels-layer', 'county-labels-layer'].forEach((layer) => {
											$map.setPaintProperty(layer, 'text-color', '#333');
										});

										// If sidebar "hidden" and locations touched, sidebar appears with location info
										if (!sidebarVisible) {
											sidebarVisible = true;
										}
									}}
								>
									{location.Location} <span class="state">({location.State})</span>
								</button>
							</p>
							<hr />
							<!-- <p class="county">
							<span class="index">{iCounty + 1}</span>
							<span>{location.Location} <span class="state">({location.State})</span></span>
						</p> -->
						{/each}
					{/if}

					<!-- state list -->
					{#if $filteredLocations.some((location) => location.Geography === 'State')}
						<p class="category-label">States</p>
						{#each $filteredLocations.filter((location) => location.Geography === 'State') as location, iState}
							<p class="state">
								<span class="index">{iState + 1}</span>
								<button
									on:click={() => {
										selectedLocation.set({
											Location: location.Location,
											Geography: location.Geography,
											State: location.State
										});

										listPanelVisible.set(true);
										aboutPanelVisible.set(false);

										// If state is AK or HI, zoom to state
										if (location.State === 'Alaska' || location.State === 'Hawaii') {
											flyTo(location.State);
										} else {
											$map.flyTo({
												center: [centerMapPt.lng, centerMapPt.lat],
												essential: true,
												zoom: 3.75,
												pitch: 0,
												speed: 1,
												curve: 1
											});
										}

										// Clear any highlighted location on map:
										$map.setFilter('panel-city-selected-layer', ['==', 'Location', '']);
										$map.setFilter('panel-county-selected-layer', ['==', 'Location', '']);
										$map.setFilter('panel-county-selected-layer', ['==', 'State', '']);
										$map.setFilter('panel-state-selected-layer', ['==', 'State', '']);
										// Reset label colors:
										['city-labels-layer', 'county-labels-layer'].forEach((layer) => {
											$map.setPaintProperty(layer, 'text-color', '#333');
										});

										// If sidebar "hidden" and locations touched, sidebar appears with location info
										if (!sidebarVisible) {
											sidebarVisible = true;
										}
									}}
								>
									<span class="state" style="font-size: 0.85rem;">{location.State}</span>
								</button>
							</p>
							<hr />
							<!-- <p class="state">
							<span class="index">{iState + 1}</span>
							<span class="state">{location.State}</span>
						</p> -->
						{/each}
					{/if}
				</div>
			</div>
		{/if}
	</details>
{/if}

<style>
	details {
		width: 190px;
		box-sizing: border-box;
		filter: drop-shadow(3px 3px 3px rgb(0.25 0.25 0.25 / 0.1));
		border-radius: 3px;
	}

	summary,
	.filter-tag,
	.category-label,
	.state {
		font-family: 'Barlow Condensed', sans-serif;
		font-weight: 500;
	}

	summary {
		cursor: pointer;
		font-size: 0.9rem;
		background-color: rgba(var(--red), 0.85);
		padding: 5px 7px;
		color: rgba(var(--white), 1);
		border-radius: 3px 3px 0 0;
		text-transform: uppercase;
	}

	/* space between arrow and text */
	summary::before {
		content: '\2008';
	}

	/* style arrow marker */
	summary::-webkit-details-marker {
		color: rgba(var(--white), 0.8);
	}
	summary::marker {
		color: rgba(var(--white), 0.8);
	}

	.content {
		/* padding: 6px 10px; */
		max-height: 200px;
		overflow-y: auto;
		background-color: rgba(var(--black), 0.9);
		color: rgba(var(--white), 1);
		border-radius: 0 0 3px 3px;
	}

	.list-container {
		padding: 5px 10px;
	}

	.tags-container {
		background-color: rgba(var(--black), 1);
		padding: 3px 5px;
	}

	/* filter tags */
	.filter-tag {
		display: inline-block;
		padding: 1px 6px 2px 3px;
		margin: 0 5px 0 0;
		border: 1px solid rgba(var(--white), 1);
		color: rgba(var(--white), 1);
		font-size: 0.7rem;
		border-radius: 10px;
		font-weight: 600;
		text-transform: uppercase;
	}

	p,
	p > button {
		font-size: 0.8rem;
		display: flex;
		align-items: center;
		column-gap: 3px;
	}

	.index {
		font-size: 0.7rem;
		color: rgba(var(--yellow-orange), 1);
	}

	.category-label {
		border-bottom: 1px solid rgba(var(--white), 0.5);
		font-size: 0.9rem;
		font-weight: bold;
		color: rgba(var(--yellow), 1);
		text-transform: uppercase;
	}

	.category-label:not(:first-child) {
		margin-top: 10px;
	}

	button {
		color: rgba(var(--white), 1);
	}

	.state {
		font-weight: 400;
		color: rgba(var(--yellow), 1);
	}

	/* scrollbar for list */
	.content::-webkit-scrollbar {
		width: 12px;
	}

	.content::-webkit-scrollbar-thumb {
		background-color: rgba(var(--yellow-orange), 0.75);
		border: 3px solid transparent;
		border-radius: 10px;
		background-clip: padding-box;
	}

	hr {
		margin: 2px 0 1px 0;
		border: 0.5px solid rgba(var(--white), 0.25);
	}

	/* mobile styles */
	@media (max-width: 600px) {
		.content {
			max-height: 175px;
		}
	}
</style>
