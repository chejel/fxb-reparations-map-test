<script>
	// Import stores
	import { reparationsCityData, selectedCity } from '$lib/stores.js';

	// Import components
	import StateMap from '$lib/components/panels/StateMap.svelte';

	// Import icon components
	import XIcon from '$lib/components/icons/X.svelte';
	import CheckIcon from '$lib/components/icons/Check.svelte';
	import LinkIcon from '$lib/components/icons/Link.svelte';

	// Rename question variables
	$: cityData = $reparationsCityData
		?.map((city) => ({
			...city,
			properties: {
				City: city.properties.Location,
				State: city.properties.State,
				'Report released': city.properties['Has the city released a report on reparations?'],
				'Funding approved': city.properties['Has the city approved reparations funding?'],
				'Funding source': city.properties['What is the potential funding source?'],
				'Allocation started': city.properties['Has the city begun allocating reparations?'],
				'Direct payments':
					city.properties['Has the city determined if direct payments will be included?'],
				'Eligibility determined':
					city.properties['Has the city determined who is eligible to receive direct payments?'],
				'Funding addresses health': city.properties['Is any of the funding addressing health?'],
				'Funding directed to': city.properties['Where is funding directed?'],
				'Other topics included':
					city.properties['What other topic areas included in the reparation approach?'],
				'Additional notes': city.properties['Additional Notes']
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
<!-- && city[0] !== 'Link' -->
<div class="city-info">
	{#each Object.entries(cityData.properties).filter((city) => city[0] !== 'City' && city[0] !== 'State') as city}
		<table class="questions">
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
<!-- <div class="article-link">
	<LinkIcon /><span><span class="question-bold">Article</span>:</span>
	<a href={cityData.properties.Link}
		>{cityData.properties.Link.match(/^(?:https?:\/\/)?(?:www\.)?([^\/]+)/)[1]}</a
	>
</div> -->

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
		position: relative;
		z-index: 2;
	}

	.questions {
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
		top: 200px;
		right: 10px;
		width: 25%;
		z-index: 1;
	}

	hr {
		padding-bottom: 0.75rem;
	}
</style>
