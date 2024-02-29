<script>
	// Import stores
	import { reparationsData, citiesPanelVisible, selectedCity } from '$lib/stores.js';

	// Import icon components
	import USStatesSVG from '$lib/components/icons/USStatesSVG.svelte';
	import XIcon from '$lib/components/icons/X.svelte';
	import CheckIcon from '$lib/components/icons/Check.svelte';

	// Rename question variables
	$: cityData = $reparationsData
		?.map((city) => ({
			City: city.properties.City,
			State: city.properties.State,
			'Report released': city.properties['Has the city released a report on reparations?'],
			'Funding approved': city.properties['Has the city approved reparations funding?'],
			'Funding source': city.properties['Has the city decided where funding will come from?'],
			'Allocation started': city.properties['Has the city begun allocating reparations?'],
			'Direct payments':
				city.properties['Has the city determined if direct payments will be included?'],
			'Eligibility determined':
				city.properties['Has the city determined who is eligible to receive direct payments?']
		}))
		.find((city) => city.City === $selectedCity);

	$: stateAbbr = cityData.City.split(', ')[1]; // to get svg icon
</script>

<!-- 
	US State SVG Defs
	Source: https://github.com/coryetzkorn/state-svg-defs
-->
<USStatesSVG />
<div class="state-svg-bg">
	<svg class="icon" viewBox="0 0 18 18">
		<use xlink:href="#icon-state-{stateAbbr}"></use>
	</svg>
</div>

<div class="header">
	<h2>{cityData.City.split(',', 1)}</h2>
	<span class="state-name">{cityData.State}</span>
</div>
<hr />
{#each Object.entries(cityData).filter((city) => city[0] !== 'City' && city[0] !== 'State') as city}
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

	.question {
		display: flex;
		align-items: flex-start;
		column-gap: 5px;
		margin-bottom: 0.5rem;
	}

	.question-bold {
		font-weight: 600;
	}

	tr {
		display: flex;
		gap: 4px;
	}

	/* state icon */
	.state-svg-bg {
		position: absolute;
		top: -15px;
		right: -10px;
	}
	.icon {
		fill: rgba(255, 171, 77, 0.75);
		stroke-width: 0.45;
		stroke: rgba(255, 171, 77, 1);
		width: 8em;
		height: 8em;
		display: block;
		margin: 0 auto;
	}

	hr {
		padding-bottom: 0.75rem;
	}
</style>
