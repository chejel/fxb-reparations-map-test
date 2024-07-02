<script>
	// Import stores
	import { reparationsCityData, selectedCity } from '$lib/stores.js';

	// Import components
	import StateMap from '$lib/components/panels/StateMap.svelte';

	// Import icon components
	import XIcon from '$lib/components/icons/X.svelte';
	import CheckIcon from '$lib/components/icons/Check.svelte';
	import ArrowExpandIcon from '$lib/components/icons/ArrowExpand.svelte';

	// Rename question variables
	$: cityData = $reparationsCityData
		?.map((city) => ({
			...city,
			properties: {
				City: city.properties.Location,
				State: city.properties.State,
				'Report released': (() => {
					// if the field for the question is linked, the string appears in Markdown format ([text](link)) so code below extracts the text and link
					// and if the field has no value, the response is null
					const question = 'Has the location released a report on reparations?';
					const response = city.properties[question];
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
					const response = city.properties[question];
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
					const response = city.properties[question];
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
					const response = city.properties[question];
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
					const response = city.properties[question];
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
					const response = city.properties[question];
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
					const response = city.properties[question];
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
					const response = city.properties[question];
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
					const response = city.properties[question];
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
					const response = city.properties[question];
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
		.find((city) => city.properties.City === $selectedCity);
</script>

<!-- State icon -->
<div class="map-container">
	<StateMap cityCoords={cityData} />
</div>

<!-- State name -->
<div class="header">
	<h2>{cityData.properties.City.split(',', 1)}</h2>
	<span class="state-name">{cityData.properties.State}</span>
</div>

<hr />

<!-- City details -->

<table class="city-info">
	{#each Object.entries(cityData.properties).filter((city) => city[0] !== 'City' && city[0] !== 'State') as city}
		{#if city[0] !== 'Funding directed' && city[0] !== 'Other topics' && city[0] !== 'Additional notes'}
			<tr>
				<td>
					{#if city[1].response?.includes('No')}
						<XIcon />
					{:else}
						<CheckIcon />
					{/if}</td
				>
				<td
					><p class="qAndA">
						<span class="question-bold">
							{city[1].question}
						</span>
						<span class="response"
							>{#if city[1].link}
								{city[1].response}
								<a href={city[1].link} class="link-btn" aria-label="See related link"
									><ArrowExpandIcon /> Source</a
								>
							{:else}
								{city[1].response}
							{/if}
						</span>
					</p></td
				>
			</tr>
		{:else}
			<tr class="additional">
				<td>
					<p class="qAndA">
						<span class="question-bold">
							{city[1].question}
						</span>
						<span class="response"
							>{#if city[1].link}
								{city[1].response}
								<a href={city[1].link} class="link-btn" aria-label="See related link"
									><ArrowExpandIcon /> Source</a
								>
							{:else}
								{city[1].response}
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
	}

	.state-name {
		font-family: 'Barlow Condensed', sans-serif;
		text-transform: uppercase;
		font-size: 1rem;
		font-weight: 600;
		color: #fc915e;
	}

	.city-info {
		display: flex;
		flex-direction: column;
		/* column-gap: 5px; */
		/* margin-bottom: 0.5rem; */
	}

	.city-info > tr {
		margin-bottom: 0.9rem;
	}

	tr.additional {
		background-color: #eee;
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
		top: 220px;
		right: 40px;
		width: 25%;
		z-index: 1;
	}

	hr {
		padding-bottom: 0.75rem;
	}

	.qAndA {
		display: flex;
		flex-direction: column;
	}

	.response {
		display: flex;
		flex-direction: column;
		row-gap: 2px;
		margin-top: 1px;
	}

	.link-btn {
		display: flex;
		align-items: center;
		column-gap: 2px;
		text-transform: uppercase;
		text-decoration: none;
		font-size: 0.8rem;
		font-weight: 700;
	}
</style>
