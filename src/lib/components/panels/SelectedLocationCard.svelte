<script>
	// Import stores
	import {
		selectedLocation,
		reparationsCityData,
		reparationsCountyData,
		reparationsStateData,
		cardScroll,
		map
	} from '$lib/stores.js';

	// Import components
	import StateMap from '$lib/components/panels/StateMap.svelte';

	// Import icon components
	import XIcon from '$lib/components/icons/X.svelte';
	import CheckIcon from '$lib/components/icons/Check.svelte';
	import LinkIcon from '$lib/components/icons/Link.svelte';

	let data;
	$: if ($selectedLocation.Geography === 'City') {
		data = $reparationsCityData;
	} else if ($selectedLocation.Geography === 'County') {
		data = $reparationsCountyData;
	} else if ($selectedLocation.Geography === 'State') {
		data = $reparationsStateData;
	}

	$: locationData = data
		?.map((location) => ({
			...location,
			properties: {
				Location: location.properties.Location,
				'Full County Name': location.properties['Full County Name'],
				Geography: location.properties.Geography,
				State: location.properties.State,
				...[
					'Has the location released a report on reparations?',
					'Has the location approved reparations funding?',
					'What is the potential funding source?',
					'Has the location begun allocating reparations?',
					'Has the location determined if direct payments will be included?',
					'Has the location determined who is eligible to receive direct payments?',
					'Is any of the funding addressing health?',
					'Where is funding directed?',
					'What other topic areas included in the reparation approach?',
					'Additional Notes'
				].reduce((acc, question) => {
					const response = location.properties[question];
					const link = response?.includes('[') ? response.match(/\[(.*?)\]\((.*?)\)/)?.[2] : null;

					acc[question] = {
						question: question,
						response: response
							? response?.includes('[')
								? response.match(/\[(.*?)\]\((.*?)\)/)?.[1]
								: response.trim()
							: null,
						link: link
					};
					return acc;
				}, {})
			}
		}))
		.find(
			(location) =>
				location.properties.Location === $selectedLocation.Location &&
				location.properties.State === $selectedLocation.State
		);

	// Scroll to top of card when loading a location
	// Otherwise, if scrolling to bottom of a card and then loading a new location via selection of location on map, the new card will remain at the same bottom position
	import { onMount } from 'svelte';
	let sectionRef;
	onMount(() => {
		sectionRef = document.querySelector('.header');
	});

	// When location is selected on panel, highlight on map
	$: if ($selectedLocation?.Geography === 'City') {
		$map.setFilter('panel-city-selected-layer', [
			'any',
			['==', $selectedLocation.Location, ['get', 'Location']]
			// Use `==` for single values, `in` for arrays
		]);
	} else if ($selectedLocation?.Geography === 'County') {
		$map.setFilter('panel-county-selected-layer', [
			'all',
			['==', $selectedLocation.Location, ['get', 'Location']],
			['==', $selectedLocation.State, ['get', 'State']]
		]);
	} else if ($selectedLocation?.Geography === 'State') {
		$map.setFilter('panel-state-selected-layer', [
			'any',
			['==', $selectedLocation.State, ['get', 'State']]
		]);
	}

	function scrollToTop() {
		if (sectionRef) {
			sectionRef.scrollIntoView({ behavior: 'smooth' });
		}
	}

	$: $cardScroll, scrollToTop();
</script>

<!-- State icon -->
<div class="map-container">
	<StateMap
		{locationData}
		locationType={$selectedLocation.Geography}
		stateNameCard={$selectedLocation.State}
	/>
</div>

<!-- State name -->
<div class="header">
	<!-- Card header if city -->
	{#if locationData.properties.Geography === 'City'}
		<h2>{locationData.properties.Location}</h2>
		<!-- Add state name -->
		<span class="state-name">{locationData.properties.State}</span>
		<!-- Card header if county -->
	{:else if locationData.properties.Geography === 'County'}
		<h2>
			{locationData.properties['Full County Name']}
			<!-- Add state name -->
			<span class="state-name">{locationData.properties.State}</span>
		</h2>
		<!-- Card header if state -->
	{:else}
		<h2>{locationData.properties.Location}</h2>
	{/if}
</div>

<hr />

<!-- Location details -->
<table class="location-info">
	{#each Object.entries(locationData.properties).filter((location) => location[0] !== 'Location' && location[0] !== 'Geography' && location[0] !== 'State' && location[0] !== 'Full County Name') as location}
		{#if location[0] !== 'Where is funding directed?' && location[0] !== 'What other topic areas included in the reparation approach?' && location[0] !== 'Additional Notes'}
			<tbody>
				<tr class="qAndA">
					<td>
						{#if location[1].response?.includes('No')}
							<XIcon />
						{:else}
							<CheckIcon />
						{/if}</td
					>
					<td
						><p>
							<span class="question-bold">
								{location[1].question}
							</span>
							<span class="response"
								>{#if location[1].link}
									{location[1].response}
									<a href={location[1].link} class="source-btn" aria-label="See related link"
										><LinkIcon />Source</a
									>
								{:else}
									{location[1].response}
								{/if}
							</span>
						</p></td
					>
				</tr>
			</tbody>
		{:else}
			<tbody>
				<tr class="additional">
					<td>
						<p>
							<span class="question-bold">
								{location[1].question}
							</span>
							<span class="response"
								>{#if location[1].link}
									{location[1].response}
									<a href={location[1].link} class="source-btn" aria-label="See related link"
										><LinkIcon />Source</a
									>
								{:else}
									{location[1].response}
								{/if}
							</span>
						</p>
					</td>
				</tr>
			</tbody>
		{/if}
	{/each}
</table>

<style>
	.header {
		display: flex;
		align-items: baseline;
		gap: 8px;
		padding: 0.75rem 0.75rem 0;
	}

	.state-name {
		font-family: 'Barlow Condensed', sans-serif;
		text-transform: uppercase;
		font-size: 1rem;
		font-weight: 600;
		color: #fc915e;
	}

	.location-info {
		display: flex;
		flex-direction: column;
	}

	/* .location-info > tr {
		margin-bottom: 0.9rem;
	} */

	.qAndA {
		padding: 0 0.75rem;
	}

	.qAndA:last-child {
		padding-bottom: 0.75rem;
	}

	.response {
		display: flex;
		flex-wrap: wrap;
		row-gap: 3px;
		column-gap: 5px;
		/* display: inline-flex;
		flex-wrap: wrap;
		row-gap: 3px;
		column-gap: 5px; */
	}

	tr.additional {
		background-color: #eeeeee; /* #f6f5f2; /* #faf3f3; /* #fff1f1; /* #fdf3f4; /* #f1f1f1; */
		width: 100%;
		margin-bottom: 0;
		padding-top: 1rem;
		padding-right: 1rem;
		padding-left: 1rem;
	}

	tr.additional:last-child {
		padding-bottom: 1rem;
	}

	.question-bold {
		font-weight: 500;
		line-height: 1.15;
		font-family: 'Barlow Condensed', sans-serif;
	}

	tr {
		display: flex;
		gap: 0;
	}

	.map-container {
		position: absolute;
		top: 200px;
		right: 40px;
		width: 25%;
		z-index: 1;
	}

	hr {
		padding-bottom: 0.75rem;
	}
</style>
