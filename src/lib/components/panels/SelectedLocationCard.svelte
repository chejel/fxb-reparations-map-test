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
				'Original location name': location.properties['Original location name'],
				Location: location.properties['Location'],
				'Full County Name': location.properties['Full County Name'],
				Geography: location.properties.Geography,
				State: location.properties.State,
				...[
					'Has the location released a report on reparations?',
					'Has the location approved reparations funding?',
					'What is the potential or current funding source?',
					'Has the location begun allocating reparations?',
					'Will direct payments be included?',
					'Has the location determined who is eligible to receive direct payments?',
					'Is any of the funding addressing health?',
					'Where is funding directed?',
					'Additional Notes'
				].reduce((acc, question) => {
					const response = location.properties[question];
					const link = response?.includes('[') ? response.match(/\[(.*?)\]\((.*?)\)/)?.[2] : null;

					acc[question] = {
						question: question,
						fullResponse: response,
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

	import { marked } from 'marked';
</script>

<!-- State icon -->
<div class="map-container">
	<StateMap
		{locationData}
		locationType={$selectedLocation.Geography}
		stateNameCard={$selectedLocation.State}
	/>
</div>

<!-- Location details -->
<table class="location-info">
	<thead>
		<tr>
			<th scope="col">
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
						<!-- Add anything after state name -->
						<span class="state-name">
							{#if locationData.properties['Original location name']?.includes('(')}
								{locationData.properties['Original location name'].match(/\((.*?)\)/)?.[1]}
							{:else}
								{''}
							{/if}
						</span>
					{/if}
				</div>
				<hr /></th
			>
		</tr>
	</thead>
	<tbody>
		{#each Object.entries(locationData.properties).filter((location) => location[0] !== 'Original location name' && location[0] !== 'Location' && location[0] !== 'Geography' && location[0] !== 'State' && location[0] !== 'Full County Name') as location}
			{#if location[0] !== 'Where is funding directed?' && location[0] !== 'Additional Notes'}
				<tr class="qAndA">
					<!-- icon -->
					<td>
						{#if location[1].response?.includes('No')}
							<XIcon />
						{:else}
							<CheckIcon />
						{/if}</td
					>

					<!-- Q&A -->
					<td
						><p>
							<span class="question-bold">
								{location[1].question}
							</span>
							<span class="response">
								{#if location[1].response}
									{@html marked.parse(location[1].fullResponse)}

									<!-- {#if location[1].link}
										<span>
											{location[1].response}
											&nbsp;<a
												href={location[1].link}
												class="source-btn"
												target="_blank"
												aria-label="Open source link in new window"><LinkIcon />Source</a
											>
										</span>
									{:else}
										{location[1].response}
									{/if} -->
								{:else}
									N/A
								{/if}
							</span>
						</p></td
					>
				</tr>
			{:else}
				<tr class="additional">
					<td>
						<p>
							<!-- additional question -->
							<span class="question-bold">
								{location[1].question}
							</span>

							<!-- additional answer -->
							<span class="response">
								{#if location[1].response}
									{#if location[1].link}
										<span
											>{location[1].response}&nbsp;
											<a
												href={location[1].link}
												class="source-btn"
												target="_blank"
												aria-label="Open source link in new window"><LinkIcon />Source</a
											></span
										>
									{:else}
										{location[1].response}
									{/if}
								{:else}
									N/A
								{/if}
							</span>
						</p>
					</td>
				</tr>
			{/if}
		{/each}
	</tbody>
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
		color: rgba(var(--salmon), 1);
	}

	.location-info {
		display: flex;
		flex-direction: column;
	}

	.qAndA {
		padding: 0.5rem 0.75rem;
	}

	.qAndA:last-child {
		padding-bottom: 0.75rem;
	}

	.response {
		display: flex;
		/* flex-wrap: wrap;
		row-gap: 3px;
		column-gap: 5px; */
	}

	thead {
		position: sticky;
		top: 0;
		z-index: 2;
		background-color: rgba(254, 250, 246, 0.9);
	}

	th {
		width: 100%;
	}

	tr {
		display: flex;
		gap: 0;
	}

	tr.additional {
		background-color: rgba(var(--light-gray), 1);
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

	.map-container {
		position: absolute;
		top: 100px;
		right: 40px;
		width: 20%;
		z-index: 10;
	}

	hr {
		margin-bottom: 0.75rem;
	}
</style>
