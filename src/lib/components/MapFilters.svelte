<script>
	// Stores
	import {
		map,
		reparationsData,
		selectedLocation,
		filteredLocations,
		toggleTags
	} from '$lib/stores.js';

	// Set variables for toggle
	let questionToggle;

	// Layers to filter based on toggle selections
	let layers = [
		'city-markers-layer',
		'city-labels-layer',
		'county-fill-layer',
		'county-border-layer',
		'county-labels-layer',
		'state-fill-layer',
		'state-border-layer'
	];

	// Generate list of locations based on applied filters/toggles:
	let filter;

	// Source: https://docs.mapbox.com/mapbox-gl-js/example/filter-features-within-map-view/
	function getUniqueFeatures(features, comparatorProperty) {
		const uniqueIds = new Set();
		const uniqueFeatures = [];
		for (const feature of features) {
			const id = feature.properties[comparatorProperty];
			if (!uniqueIds.has(id)) {
				uniqueIds.add(id);
				uniqueFeatures.push(feature);
			}
		}
		return uniqueFeatures;
	}

	function toggleFilter(question) {
		filter = filterQuestions(question);

		layers.forEach((layer) => $map?.setFilter(layer, filter));

		// delay querying rendered features to ensure the map has updated
		setTimeout(() => {
			const getRenderedFeatures = $map.queryRenderedFeatures({
				layers: ['city-markers-layer', 'county-fill-layer', 'state-fill-layer']
			});

			$filteredLocations = getUniqueFeatures(getRenderedFeatures, 'Location').map((d) => ({
				Location: d.properties.Location,
				State: d.properties.State,
				Geography: d.properties.Geography
			}));

			// Generate the respective toggle `labels` for the selected toggle `keywords`, based on the data object
			$toggleTags = question.map((q) =>
				q === 'approved'
					? 'funding'
					: q === 'allocating'
						? 'allocation'
						: q === 'included'
							? 'payments'
							: q === 'eligible'
								? 'eligibility'
								: q
			);
		}, 100);
	}

	// If filters are applied, shows text labels for any selected location (even if not part of filtered data)
	$: if ($filteredLocations) {
		const locationFilter = $selectedLocation
			? [
					'all',
					['==', ['get', 'Location'], $selectedLocation.Location],
					['==', ['get', 'State'], $selectedLocation.State]
				]
			: null;

		if ($selectedLocation?.Geography === 'City') {
			$map.setFilter('city-labels-layer', ['any', locationFilter, filter]);
		} else if ($selectedLocation?.Geography === 'County') {
			['county-labels-layer', 'county-fill-layer'].forEach((layer) => {
				$map.setFilter(layer, ['any', locationFilter, filter]);
			});
		} else {
			['city-labels-layer', 'county-labels-layer', 'county-fill-layer'].forEach((layer) => {
				$map.setFilter(layer, filter);
			});
		}
	}

	function filterQuestions(questions) {
		const words = ['Yes', 'Yes,', 'Pending']; // search for multiple words in the response field

		const generateFullQuestions = $reparationsData?.features
			.map((d) => Object.keys(d.properties))[0]
			.filter((column) => questions.some((question) => column.toLowerCase().includes(question)));

		const quesArrItems = generateFullQuestions.map((question) => {
			const conditions = words.map((word) => ['in', word, ['string', ['get', question]]]);
			return ['any'].concat(conditions);
		});

		return ['all'].concat(quesArrItems);
	}

	function resetFilter() {
		layers.forEach((layer) => $map.setFilter(layer, null));
		if ($filteredLocations) {
			$filteredLocations = null;
		}
	}

	const data = [
		{
			id: 1,
			label: 'Report released',
			toggleValue: 'reportReleased',
			keyword: 'report'
		},
		{
			id: 2,
			label: 'Funding approved',
			toggleValue: 'fundingApproved',
			keyword: 'approved'
		},
		// exclude questions without direct yes/no responses
		// {
		// 	id: 3,
		// 	label: 'Funding source',
		// 	toggleValue: 'fundingSource',
		// 	// question: 'What is the potential funding source?'
		// 	keyword: 'source'
		// },
		{
			id: 4,
			label: 'Allocation started',
			toggleValue: 'allocationStarted',
			keyword: 'allocating'
		},
		{
			id: 5,
			label: 'Direct payments',
			toggleValue: 'directPayments',
			keyword: 'included'
		},
		{
			id: 6,
			label: 'Eligibility determined',
			toggleValue: 'eligibility',
			keyword: 'eligible'
		},
		{
			id: 7,
			label: 'Health addressed',
			toggleValue: 'health',
			keyword: 'health'
		}
	];

	// Transition effect for accordion
	import { slide } from 'svelte/transition';
	let isOpen = false;
</script>

<!-- accordion -->
<details bind:open={isOpen}>
	<summary
		><span style="display: inline-flex; gap: 47px;"
			><span>Filter locations</span>
			{#if isOpen}
				<span style="color: pink;">✕</span>
			{/if}
		</span></summary
	>
	{#if isOpen}
		<div class="content" in:slide={{ duration: 750 }}>
			<p
				style="font-family: 'Barlow', sans-serif; font-weight: 700; font-size: 0.75rem; line-height: 1.15;padding: 0 5px;"
			>
				When multiple filters are applied, only the locations that match all selected criteria will
				be shown.
			</p>
			{#each data as { label, toggleValue, keyword }, i}
				<div class="single-toggle-switch">
					<!-- Toggle switch based on https://www.w3.org/WAI/ARIA/apg/patterns/switch/examples/switch-checkbox/ -->
					<label for={toggleValue} class="toggle">
						<input
							id={toggleValue}
							name={toggleValue}
							type="checkbox"
							role="switch"
							bind:group={questionToggle}
							value={keyword}
							on:change={() => {
								if (questionToggle.length > 0 && $map) {
									toggleFilter(questionToggle);
								} else {
									resetFilter();
								}

								// Clear any highlighted location on map:
								$map.setFilter('panel-city-selected-layer', ['==', 'Location', '']);
								$map.setFilter('panel-county-selected-layer', ['==', 'Location', '']);
								$map.setFilter('panel-county-selected-layer', ['==', 'State', '']);
								$map.setFilter('panel-state-selected-layer', ['==', 'State', '']);
								// Reset label colors:
								['city-labels-layer', 'county-labels-layer'].forEach((layer) => {
									$map.setPaintProperty(layer, 'text-color', '#333');
								});
							}}
						/><span class="toggle-container">
							<span class="toggle-switch">
								<span class="text" aria-hidden="true"
									>{#if questionToggle?.includes(keyword)}On
									{:else}Off{/if}</span
								>
								<span class="switch"></span>
							</span>
							<span class="toggle-text">{label}</span>
						</span></label
					>
				</div>
			{/each}
		</div>
	{/if}
</details>

<style>
	.single-toggle-switch {
		padding: 0 5px;
		margin-top: -9px;
	}

	label {
		/*padding: 0 6px; /* prevents jumping */
		/* border: 0 solid rgb(var(--blue), 0.75); */
		cursor: pointer;
		font-family: 'Barlow Condensed', sans-serif;
	}

	/* label:focus-within {
		padding: 4.5px 2px 4px 4px;
		border-width: 2px;
		border-radius: 10px;
	} */

	/* checkbox */
	input[role='switch'] {
		width: 0;
		height: 0;
	}

	.toggle-container {
		display: flex;
		align-items: center; /* Aligns spans to a uniform height */
		column-gap: 2px; /* Adds spacing between elements */
		padding: 0px;
		width: fit-content;
	}

	/* toggle-switch */
	label input[role='switch'] ~ .toggle-container > .toggle-switch {
		position: relative;
		/* top: 1px; */
		display: inline-block;
		border: 1px solid gray;
		background-color: rgba(var(--gray), 0.65);
		width: 40px;
		height: 20px;
		border-radius: 10px;
	}

	/* toggle-switch when switch checked */
	label input[role='switch']:checked ~ .toggle-container > .toggle-switch {
		background-color: rgba(var(--black), 1);
		opacity: 0.75;
	}

	/* switch */
	label input[role='switch'] ~ .toggle-container > .toggle-switch > .switch {
		position: relative;
		top: 1.5px;
		left: 2px;
		display: inline-block;
		border: 0.75px solid rgba(var(--black), 1);
		border-radius: 9px;
		width: 15px;
		height: 15px;
		background: white;
		-webkit-transition: 0.4s;
		transition: 0.4s;
	}

	@media screen and (max-device-width: 480px) {
		label input[role='switch'] ~ .toggle-container > .toggle-switch {
			width: 42px;
			height: 24px;
			border-radius: 20px;
		}

		label input[role='switch'] ~ .toggle-container > .toggle-switch > .switch {
			top: 2.5px;
			width: 17px;
			height: 17px;
		}

		details {
			margin-bottom: 1rem;
		}
	}

	/* switch checked, circle shifts */
	label input[role='switch']:checked ~ .toggle-container > .toggle-switch > .switch {
		left: 20px;
	}

	/* switch's on/off label */
	label input[role='switch'] ~ .toggle-container > .toggle-switch > .text {
		font-size: 0.7rem;
		text-transform: uppercase;
		position: absolute;
		top: 2px;
	}

	/* switch on/off label when not checked/off */
	label input[role='switch'] ~ .toggle-container > .toggle-switch > .text {
		left: auto;
		right: 4px;
	}

	/* switch on/off label when checked/on */
	label input[role='switch']:checked ~ .toggle-container > .toggle-switch > .text {
		left: 5px;
		right: auto;
		color: white;
	}

	/* focus outline */
	label input[role='switch']:focus-visible ~ .toggle-container {
		outline: 2px solid rgba(var(--blue), 1);
		outline-offset: 2px;
	}

	/* question description */
	.toggle-text {
		margin: 0 5px 0 3px;
		font-size: 0.8rem;
		font-weight: 500;
	}

	/* accordion styles from https://css-tricks.com/how-to-animate-the-details-element/ */
	details {
		box-sizing: border-box;
		background-color: rgba(var(--white), 0.75);
		border: 0.75px solid rgba(var(--black), 1);
		border-radius: 3px;
		width: 195px;
		filter: drop-shadow(3px 3px 3px rgb(0.25 0.25 0.25 / 0.1));
	}

	details > summary {
		padding: 0.5rem;
		background-color: rgba(var(--red), 0.95);
		color: white;
		font-weight: 600;
		cursor: pointer;
		font-family: 'Barlow Condensed', sans-serif;
		font-size: 1rem;
		text-transform: uppercase;
		border-radius: 3px 3px 0 0;
	}

	/* space between arrow and text */
	summary::before {
		content: '\2008';
	}

	/* style arrow marker */
	summary::-webkit-details-marker {
		color: rgba(var(--white), 0.9);
	}
	summary::marker {
		color: rgba(var(--white), 0.9);
	}

	details > .content {
		padding: 0.35rem;
	}
</style>
