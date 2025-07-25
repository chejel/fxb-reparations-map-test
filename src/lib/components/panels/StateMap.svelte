<script>
	import { geoAlbersUsa, geoMercator, geoPath } from 'd3-geo';
	import { scaleSqrt } from 'd3-scale';

	// Import stores
	import { statesMap, reparationsCountyData } from '$lib/stores.js';

	// Declare variable for state selection
	export let locationData = null; // Get data from selected location
	export let locationType = null; // City or county
	export let stateNameTable = null; // Get state name from table
	export let stateNameCard = null; // Get state name from card

	// SVG dimensions for displaying state
	export let width = 975,
		height = 1000;

	// Declaring variables for drawing state proportionally (i.e. not filling up the svg container)
	let selectedStateObj; // states data filtered to single selected state
	let selectedCountyObj; // counties data filtered to single selected county

	let projection; // dislaying state
	let path;
	let cx, cy; // displaying city

	$: viewBox = `0 -9 ${width} ${height}`;

	// For radius of circle marking location of city on map:
	let radiusScale;

	// Filter states data to only state containing selected city or county
	$: if (locationData) {
		// Filter states array from json to only state of selected state
		selectedStateObj = $statesMap?.features.find(
			(d) => d.properties.name === locationData.properties.State
		);

		// Scale for radius of circles marking location of city on map
		radiusScale = scaleSqrt().domain([0, 500]).range([1, 10]);
	}

	// Filter states data to only selected state
	$: if (stateNameTable || stateNameCard) {
		selectedStateObj = $statesMap?.features.find(
			(d) => d.properties.name === stateNameTable || d.properties.name === stateNameCard
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
	let heightMultiplier = stateNameTable ? 100 : 375; // adjust for states appearing on panel table (vs. card)

	// Once a city, county or state has been selected...
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
		if (stateNameTable || stateNameCard)
			height = stateHeightScale(selStateHeight) * heightMultiplier + 10;

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

		if (locationType === 'City') {
			[cx, cy] = projection(locationData.geometry.coordinates);
		}
	}

	// When county is selected, generate state map showing only that county
	// by narrowing down $reparationsCountyData (which contains geometry data) to selected county only
	$: if (locationType === 'County') {
		selectedCountyObj = $reparationsCountyData?.find(
			(d) =>
				d.properties.Location === locationData.properties.Location &&
				d.properties.State === locationData.properties.State
		);
	}

	// If selecting a city, clear any selected county
	$: if (locationType === 'City') {
		selectedCountyObj = null;
	}
</script>

<svg {viewBox}>
	<!-- Draw state -->
	{#if selectedStateObj}
		<g fill="rgba(var(--light-orange), 0.95)" stroke="rgba(var(--red), 0.75)" stroke-width="1.5">
			<path
				d={path(selectedStateObj)}
				aria-hidden="true"
				style="filter: drop-shadow(5px 5px 5px rgb(0.25 0.25 0.25 / 0.1));"
			/>
		</g>
	{/if}

	{#if selectedCountyObj}
		<g fill="rgba(var(--black), 1)" opacity="0.75" stroke="white" stroke-width="3">
			<path d={path(selectedCountyObj)} aria-hidden="true" />
		</g>
	{/if}

	<!-- Add point to show selected city on state map -->
	{#if locationType === 'City'}
		<circle
			{cx}
			{cy}
			r="40"
			opacity="1"
			fill="rgba(var(--black), 1)"
			fill-opacity="0.85"
			stroke="white"
			stroke-width="7"
			aria-hidden="true"
		/>
	{/if}
</svg>
