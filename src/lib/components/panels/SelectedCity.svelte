<script>
	// Import stores
	import { reparationsData, citiesPanelVisible, selectedCity } from '$lib/stores.js';

	// Import icon components
	import USStatesSVG from '$lib/components/icons/USStatesSVG.svelte';
	import XIcon from '$lib/components/icons/X.svelte';
	import CheckIcon from '$lib/components/icons/Check.svelte';

	// City data
	$: cityData = $reparationsData?.find((city) => city.properties.City === $selectedCity);
	$: stateAbbr = cityData.properties.City.split(', ')[1]; // to get svg icon
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
	<h2>{cityData.properties.City.split(',', 1)}</h2>
	<span class="state-name">{cityData.properties.State}</span>
</div>
<hr />
<div class="question">
	{#if cityData.properties['Has the city released a report on reparations?'].includes('No')}
		<XIcon />
	{:else}
		<CheckIcon />
	{/if}
	<p>
		<span class="question-bold">Report released</span>: {cityData.properties[
			'Has the city released a report on reparations?'
		]}
	</p>
</div>

<div class="question">
	{#if cityData.properties['Has the city approved reparations funding?'].includes('No')}
		<XIcon />
	{:else}
		<CheckIcon />
	{/if}
	<p>
		<span class="question-bold">Funding approved</span>: {cityData.properties[
			'Has the city approved reparations funding?'
		]}
	</p>
</div>

<div class="question">
	{#if cityData.properties['Has the city decided where funding will come from?'].includes('No')}
		<XIcon />
	{:else}
		<CheckIcon />
	{/if}
	<p>
		<span class="question-bold">Funding source</span>: {cityData.properties[
			'Has the ciy decided where funding will come from?'
		]}
	</p>
</div>

<div class="question">
	{#if cityData.properties['Has the city begun allocating reparations?'].includes('No')}
		<XIcon />
	{:else}
		<CheckIcon />
	{/if}
	<p>
		<span class="question-bold">Allocations started</span>: {cityData.properties[
			'Has the city begun allocating reparations?'
		]}
	</p>
</div>

<div class="question">
	{#if cityData.properties['Has the city determined if direct payments will be included?'].includes('No')}
		<XIcon />
	{:else}
		<CheckIcon />
	{/if}
	<p>
		<span class="question-bold">Direct payments determined</span>: {cityData.properties[
			'Has the city determined if direct payments will be included?'
		]}
	</p>
</div>

<div class="question">
	{#if cityData.properties['Has the city determined who is eligible to receive direct payments?'].includes('N/A')}
		<XIcon />
	{:else}
		<CheckIcon />
	{/if}
	<p>
		<span class="question-bold">Eligibility determined</span>: {cityData.properties[
			'Has the city determined who is eligible to receive direct payments?'
		]}
	</p>
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

	.question {
		display: flex;
		align-items: flex-start;
		column-gap: 5px;
		margin-bottom: 0.5rem;
	}

	.question-bold {
		font-weight: 600;
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
