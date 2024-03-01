<script>
	import topoCounties from '$lib/data/counties-albers-10m.json';
	import { onMount } from 'svelte';
	import { geoAlbersUsa, geoPath } from 'd3-geo';
	import { scaleSqrt } from 'd3-scale';
	import * as topojson from 'topojson-client';

	// Declare variables for map </div>data
	let counties = [];
	let states = [];
	let statesMesh = [];
	// Declare variable for state selection
	let selectedFeature;
	export let cityCoords = null; // Get city data from SelectedCity

	// Load map data
	onMount(async () => {
		counties = topojson.feature(topoCounties, topoCounties.objects.counties).features;
		states = topojson.feature(topoCounties, topoCounties.objects.states).features;
		statesMesh = topojson.mesh(topoCounties, topoCounties.objects.states, (a, b) => a !== b);
		//nation = topojson.feature(topoCounties, topoCounties.objects.nation).features;
	});

	// Add projection for overlaying point data
	const projection = geoAlbersUsa().scale(1300).translate([487.5, 305]);

	// Path generator: topojson coords -> svg paths
	const path = geoPath().projection(null);

	//export let selectedState;

	let viewBox = '0 0 975 610';
	let x0, y0, x1, y1;

	let selectedStateObj;
	let selectedStateName;
	let cx, cy; // for location of city on state map
	// for radius of circle marking location of city on map:
	let radiusScale;
	let yBoundsRadius;

	$: if (cityCoords) {
		// Filter states array from json to only state of selected state
		selectedStateObj = states.find((d) => d.properties.name === cityCoords.properties.State);

		// And from there, get the name of the state
		selectedStateName = selectedStateObj?.properties.name;

		if (selectedStateObj) {
			// Adding conditionals to account for differences in state sizes
			const padding =
				selectedStateName === 'Vermont' || selectedStateName === 'Illinois'
					? '30'
					: selectedStateName === 'Rhode Island'
						? '10'
						: '10';
			[[x0, y0], [x1, y1]] = path.bounds(selectedStateObj);
			viewBox = `${x0 - padding} ${y0 - padding} ${x1 - x0 + 2 * padding} ${y1 - y0 + 2 * padding}`;

			// Scale for radius of circles marking location of city on map
			radiusScale = scaleSqrt().domain([0, 500]).range([1, 10]);
			[cx, cy] = projection(cityCoords.geometry.coordinates);
			yBoundsRadius =
				selectedStateName === 'Rhode Island' ? radiusScale(y1 - y0) / 2 : radiusScale(y1 - y0);
		}
	}
</script>

<svg {viewBox}>
	<!-- Draw state -->
	<g fill="#ffc17e">
		{#each [selectedStateObj] as feature}
			<path d={path(feature)} on:click={() => (selectedFeature = feature)} aria-hidden="true" />
		{/each}
	</g>

	<!-- Add point to show selected city on state map -->
	{#if cityCoords}
		<circle
			{cx}
			{cy}
			r={yBoundsRadius}
			opacity="1"
			fill="#333"
			fill-opacity="0.85"
			aria-hidden="true"
		/>
	{/if}
</svg>
