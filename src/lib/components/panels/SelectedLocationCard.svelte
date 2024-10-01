<script>
	// Import stores
	import {
		selectedLocation,
		reparationsCityData,
		reparationsCountyData,
		reparationsStateData,
		cardScroll
	} from '$lib/stores.js';

	// Import components
	import StateMap from '$lib/components/panels/StateMap.svelte';

	// Import icon components
	import XIcon from '$lib/components/icons/X.svelte';
	import CheckIcon from '$lib/components/icons/Check.svelte';
	import LinkIcon from '$lib/components/icons/Link.svelte';

	// Rename question variables

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
				Geography: location.properties.Geography,
				State: location.properties.State,
				'Report released': (() => {
					// if the field for the question is linked, the string appears in Markdown format ([text](link)) so code below extracts the text and link
					// and if the field has no value, the response is null
					const question = 'Has the location released a report on reparations?';
					const response = location.properties[question];
					const link = response?.includes('[') ? response.match(/\[(.*?)\]\((.*?)\)/)?.[2] : null;

					return {
						question: question,
						response: response
							? response?.includes('[')
								? response.match(/\[(.*?)\]\((.*?)\)/)?.[1]
								: response.trim()
							: null,
						link: link
					};
				})(),
				'Funding approved': (() => {
					const question = 'Has the location approved reparations funding?';
					const response = location.properties[question];
					const link = response?.includes('[') ? response.match(/\[(.*?)\]\((.*?)\)/)?.[2] : null;

					return {
						question: question,
						response: response
							? response?.includes('[')
								? response.match(/\[(.*?)\]\((.*?)\)/)?.[1]
								: response.trim()
							: null,
						link: link
					};
				})(),
				'Funding source': (() => {
					const question = 'What is the potential funding source?';
					const response = location.properties[question];
					const link = response?.includes('[') ? response.match(/\[(.*?)\]\((.*?)\)/)?.[2] : null;

					return {
						question: question,
						response: response
							? response?.includes('[')
								? response.match(/\[(.*?)\]\((.*?)\)/)?.[1]
								: response.trim()
							: null,
						link: link
					};
				})(),
				'Allocation started': (() => {
					const question = 'Has the location begun allocating reparations?';
					const response = location.properties[question];
					const link = response?.includes('[') ? response.match(/\[(.*?)\]\((.*?)\)/)?.[2] : null;

					return {
						question: question,
						response: response
							? response?.includes('[')
								? response.match(/\[(.*?)\]\((.*?)\)/)?.[1]
								: response.trim()
							: null,
						link: link
					};
				})(),
				'Direct payments': (() => {
					const question = 'Has the location determined if direct payments will be included?';
					const response = location.properties[question];
					const link = response?.includes('[') ? response.match(/\[(.*?)\]\((.*?)\)/)?.[2] : null;

					return {
						question: question,
						response: response
							? response?.includes('[')
								? response.match(/\[(.*?)\]\((.*?)\)/)?.[1]
								: response.trim()
							: null,
						link: link
					};
				})(),
				'Eligibility determined': (() => {
					const question =
						'Has the location determined who is eligible to receive direct payments?';
					const response = location.properties[question];
					const link = response?.includes('[') ? response.match(/\[(.*?)\]\((.*?)\)/)?.[2] : null;

					return {
						question: question,
						response: response
							? response?.includes('[')
								? response.match(/\[(.*?)\]\((.*?)\)/)?.[1]
								: response.trim()
							: null,
						link: link
					};
				})(),
				'Health addressed': (() => {
					const question = 'Is any of the funding addressing health?';
					const response = location.properties[question];
					const link = response?.includes('[') ? response.match(/\[(.*?)\]\((.*?)\)/)?.[2] : null;

					return {
						question: question,
						response: response
							? response?.includes('[')
								? response.match(/\[(.*?)\]\((.*?)\)/)?.[1]
								: response.trim()
							: null,
						link: link
					};
				})(),
				'Funding directed': (() => {
					const question = 'Where is funding directed?';
					const response = location.properties[question];
					const link = response?.includes('[') ? response.match(/\[(.*?)\]\((.*?)\)/)?.[2] : null;

					return {
						question: question,
						response: response
							? response?.includes('[')
								? response.match(/\[(.*?)\]\((.*?)\)/)?.[1]
								: response.trim()
							: null,
						link: link
					};
				})(),
				'Other topics': (() => {
					const question = 'What other topic areas included in the reparation approach?';
					const response = location.properties[question];
					const link = response?.includes('[') ? response.match(/\[(.*?)\]\((.*?)\)/)?.[2] : null;

					return {
						question: question,
						response: response
							? response?.includes('[')
								? response.match(/\[(.*?)\]\((.*?)\)/)?.[1]
								: response.trim()
							: null,
						link: link
					};
				})(),
				'Additional notes': (() => {
					const question = 'Additional Notes';
					const response = location.properties[question];
					const link = response?.includes('[') ? response.match(/\[(.*?)\]\((.*?)\)/)?.[2] : null;

					return {
						question: question,
						response: response
							? response?.includes('[')
								? response.match(/\[(.*?)\]\((.*?)\)/)?.[1]
								: response.trim()
							: null,
						link: link
					};
				})()
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
	<h2>
		{locationData.properties.Location}
		{locationData.properties.Geography === 'County' ? 'County' : ''}
	</h2>
	<span class="state-name">{locationData.properties.State}</span>
</div>

<hr />

<!-- Location details -->
<table class="location-info">
	{#each Object.entries(locationData.properties).filter((location) => location[0] !== 'Location' && location[0] !== 'Geography' && location[0] !== 'State') as location}
		{#if location[0] !== 'Funding directed' && location[0] !== 'Other topics' && location[0] !== 'Additional notes'}
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
		{:else}
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

	.location-info > tr {
		margin-bottom: 0.9rem;
	}

	.qAndA {
		padding: 0 0.75rem;
	}

	.qAndA:last-child {
		padding-bottom: 0.75rem;
	}

	.response {
		display: block;
	}

	tr.additional {
		background-color: #faf3f3; /* #fff1f1; /* #fdf3f4; /* #f1f1f1; */
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
