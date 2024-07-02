<script>
	import topoStates from '$lib/data/states-10m.json'; // unprojected US state geometries
	import { onMount } from 'svelte';
	import { geoAlbersUsa, geoMercator, geoPath } from 'd3-geo';
	import { scaleSqrt } from 'd3-scale';
	import * as topojson from 'topojson-client';

	// Declare variables for map data
	let states = [];
	// let statesMesh = [];

	// Import stores
	import { statesMap } from '$lib/stores.js';

	// Declare variable for state selection
	export let cityCoords = null; // Get city data from SelectedCity
	export let stateName = null; // Get state name from StatesTable
	export let stateNameCard = null; // Get state name from SelectedStateCard

	// Load map data
	onMount(async () => {
		// states = topojson.feature(topoStates, topoStates.objects.states).features;
		// statesMesh = topojson.mesh(topoStates, topoStates.objects.states, (a, b) => a !== b);
		// nation = topojson.feature(topoStates, topoStates.objects.nation).features;
	});

	// SVG dimensions for displaying state
	let width = 975;
	let height = 1000;

	// Declaring variables for drawing state proportionally (i.e. not filling up the svg container)
	let selectedStateObj; // states data filtered to single selected state

	let projection; // dislaying state
	let path;
	let cx, cy; // displaying city

	$: viewBox = `0 0 ${width} ${height}`;

	// For radius of circle marking location of city on map:
	let radiusScale;

	// Filter states data to only selected city
	$: if (cityCoords) {
		// Filter states array from json to only state of selected state
		selectedStateObj = $statesMap?.features.find(
			(d) => d.properties.name === cityCoords.properties.State
		);

		// Scale for radius of circles marking location of city on map
		radiusScale = scaleSqrt().domain([0, 500]).range([1, 10]);
	}

	// Filter states data to only selected state
	$: if (stateName || stateNameCard) {
		selectedStateObj = $statesMap?.features.find(
			(d) => d.properties.name === stateName || d.properties.name === stateNameCard
		);
	}

	// Projection and path generator based on state map as a whole in order to get proportional sizes of individual states. This way, they don't fill up the svg container and end up with Texas and Massachusetts as the same size on the cards.
	const baseProjection = geoAlbersUsa();
	const basePath = geoPath(baseProjection);

	// Using the "base" projection, determine height of largest and smallest US states to get proportion scale
	let akHeightArr = [];
	let riHeightArr = [];
	let selStateHeightArr = []; // height of selected state (or state of selected city)

	let selStateHeight; // number determined via subtracting highest and lowest y-values of state boundary
	let stateHeightScale; // using d3-scale to map a proportional scale of state heights
	let heightMultiplier = stateName ? 90 : 375;

	// Once a city or state has been selected...
	$: if (selectedStateObj) {
		// base projections for largest and smallest states
		akHeightArr = basePath.bounds(
			$statesMap?.features.filter((d) => d.properties.name === 'Alaska')[0]
		);
		riHeightArr = basePath.bounds(
			$statesMap?.features.filter((d) => d.properties.name === 'Rhode Island')[0]
		);

		// boundaries of selected state
		selStateHeightArr = basePath.bounds(selectedStateObj);
		// height of selected state based on boundary y-values
		selStateHeight = selStateHeightArr[1][1] - selStateHeightArr[0][1];

		// set up proportional scale
		stateHeightScale = scaleSqrt()
			.domain([riHeightArr[1][1] - riHeightArr[0][1], akHeightArr[1][1] - akHeightArr[0][1]])
			.range([1, 2]);

		// set height of viewbox based on selected state (as way to center state in state table row)
		if (stateName || stateNameCard) height = stateHeightScale(selStateHeight) * heightMultiplier;

		// set up projection for displaying state on card
		// use different projection for Alaska
		if (selectedStateObj.properties.name === 'Alaska') {
			projection = geoAlbersUsa().fitSize(
				[width, stateHeightScale(selStateHeight) * heightMultiplier],
				selectedStateObj
			);
		} else {
			projection = geoMercator().fitSize(
				[width, stateHeightScale(selStateHeight) * heightMultiplier],
				selectedStateObj
			);
		}

		// Path generator: topojson coords -> svg paths
		path = geoPath(projection);
		if (cityCoords) {
			[cx, cy] = projection(cityCoords.geometry.coordinates);
		}
	}
</script>

<svg {viewBox}>
	<!-- Draw state -->
	{#if selectedStateObj}
		<g fill="#ffc17e">
			<path d={path(selectedStateObj)} aria-hidden="true" />
		</g>
	{/if}

	<!-- Add point to show selected city on state map -->
	{#if cityCoords}
		<circle {cx} {cy} r="25" opacity="1" fill="#333" fill-opacity="0.85" aria-hidden="true" />
	{/if}
</svg>
