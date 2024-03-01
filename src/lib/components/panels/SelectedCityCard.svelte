<script>
	// Import stores
	import { reparationsData, selectedCity } from '$lib/stores.js';

	// Import components
	import StateMap from '$lib/components/StateMap.svelte';

	// Import icon components
	import XIcon from '$lib/components/icons/X.svelte';
	import CheckIcon from '$lib/components/icons/Check.svelte';
	import LinkIcon from '$lib/components/icons/Link.svelte';

	// Rename question variables
	$: cityData = $reparationsData
		?.map((city) => ({
			...city,
			properties: {
				City: city.properties.City,
				State: city.properties.State,
				Link: city.properties.Link,
				'Report released': city.properties['Has the city released a report on reparations?'],
				'Funding approved': city.properties['Has the city approved reparations funding?'],
				'Funding source': city.properties['Has the city decided where funding will come from?'],
				'Allocation started': city.properties['Has the city begun allocating reparations?'],
				'Direct payments':
					city.properties['Has the city determined if direct payments will be included?'],
				'Eligibility determined':
					city.properties['Has the city determined who is eligible to receive direct payments?']
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
<div class="city-info">
	{#each Object.entries(cityData.properties).filter((city) => city[0] !== 'City' && city[0] !== 'State' && city[0] !== 'Link') as city}
		<table class="question">
			<tr>
				<td
					>{#if city[1].includes('No')}
						<XIcon />
					{:else}
						<CheckIcon />
					{/if}</td
				>
				<td
					><p>
						<span class="question-bold">{city[0]}</span>: {city[1]}
					</p></td
				>
			</tr>
		</table>
	{/each}
</div>

<!-- Link -->
<div class="article-link">
	<LinkIcon /><span><span class="question-bold">Article</span>:</span>
	<a href={cityData.properties.Link}
		>{cityData.properties.Link.match(/^(?:https?:\/\/)?(?:www\.)?([^\/]+)/)[1]}</a
	>
</div>

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

	.article-link {
		display: flex;
		align-items: center;
		gap: 4px;
		background-color: #eee;
		padding: 0.5rem;
		border-radius: 4px;
		margin-bottom: 0.75rem;
	}

	.question {
		display: flex;
		column-gap: 5px;
		margin-bottom: 0.5rem;
	}

	.question-bold {
		font-weight: 600;
	}

	tr {
		display: flex;
		gap: 0;
	}

	.map-container {
		position: absolute;
		top: 210px;
		right: 10px;
		width: 25%;
	}

	hr {
		padding-bottom: 0.75rem;
	}
</style>
