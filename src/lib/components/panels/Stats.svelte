<script>
	// Import stores
	import {
		reparationsCityData,
		reparationsCountyData,
		reparationsStateData,
		selectedLocation,
		map,
		aboutPanelVisible,
		listPanelVisible
	} from '$lib/stores.js';

	// # of cities
	const numCities = $reparationsCityData?.length;

	// # of counties
	const numCounties = $reparationsCountyData?.length;

	// # of states
	const numStates = $reparationsStateData?.length;

	// Designating the selected geography tab (cities, counties, states)
	let citiesTab = true;
	let countiesTab = false;
	let statesTab = false;

	// Variables for dataset filtered by locations that apply for each question
	let reportsFiltered,
		fundingApprovedFiltered,
		sourceFiltered,
		allocationFiltered,
		directFiltered,
		eligibilityFiltered,
		directedFiltered,
		healthFiltered;

	// Function to return number of locations that apply for each question
	filterByProperty($reparationsCityData);

	function filterByProperty(dataset) {
		// instead of hardcoding question, search for ques containing specific words in case wording of ques changes
		const filters = [
			'report',
			'approved',
			'source',
			'allocating',
			'included',
			'eligible',
			'directed',
			'health'
		];

		[
			reportsFiltered,
			fundingApprovedFiltered,
			sourceFiltered,
			allocationFiltered,
			directFiltered,
			eligibilityFiltered,
			directedFiltered,
			healthFiltered
		] = filters.map((filter) =>
			dataset?.filter((d) => {
				const response = d.properties[
					Object.keys(d.properties).find((key) => key.toLowerCase().includes(filter))
				]
					?.toString()
					.toLowerCase()
					.trim();

				// exclude response if it contains "no", "n/a" and anything that may or may not come after it
				return response && !/^(no|n\/a|na)([\s.,!?;:].*)?$/i.test(response);
			})
		);

		return {
			reportsFiltered,
			fundingApprovedFiltered,
			sourceFiltered,
			allocationFiltered,
			directFiltered,
			eligibilityFiltered,
			directedFiltered,
			healthFiltered
		};
	}

	// Questions
	$: questions = [
		{ count: reportsFiltered.length, filteredData: reportsFiltered, label: 'released a report' },
		{
			count: fundingApprovedFiltered.length,
			filteredData: fundingApprovedFiltered,
			label: 'approved funding'
		},
		{ count: sourceFiltered.length, filteredData: sourceFiltered, label: 'a funding source' },
		{
			count: allocationFiltered.length,
			filteredData: allocationFiltered,
			label: 'started allocating reparations'
		},
		{
			count: directFiltered.length,
			filteredData: directFiltered,
			label: 'include direct payments'
		},
		{
			count: eligibilityFiltered.length,
			filteredData: eligibilityFiltered,
			label: 'determined eligibility'
		},
		{
			count: directedFiltered.length,
			filteredData: directedFiltered,
			label: 'designated funds'
		},
		{ count: healthFiltered.length, filteredData: healthFiltered, label: 'health' }
	];

	// Zoom to AK or HI when state or location in state is selected
	function flyTo(state) {
		if (state === 'Hawaii') {
			$map.fitBounds([
				[-154.80833743387433, 22.23238695135951],
				[-160.24970712717126, 18.91727560534605]
			]);
		} else if (state === 'Alaska') {
			$map.fitBounds([
				[-155.95894737171596, 71.5388],
				[-115.02205262828487, 51.214183]
			]);
		}
	}

	const centerMapPt = { lng: -95.7, lat: 38.1 };
</script>

<!-- note about filters -->
<div class="filters-note">
	You can also toggle the corresponding map filters to see all the cities, counties and states that
	match the criteria.
	<!-- To see the locations that meet the criteria below, toggle the respective filters on the map. -->
</div>

<!-- tabs -->
<div class="tabs-container">
	<!-- Cities -->
	<button
		class:active={citiesTab}
		style={citiesTab
			? 'border-top: 3px solid rgba(var(--red), 1); border-left: 0.5px solid rgba(var(--red), 1); border-right: 0.5px solid rgba(var(--red), 1);'
			: ''}
		on:click|stopPropagation={() => {
			citiesTab = true;
			countiesTab = false;
			statesTab = false;
			filterByProperty($reparationsCityData);
		}}
	>
		<span class="tab-num" style={citiesTab ? 'color: rgba(var(--red), 0.85);' : ''}
			>{numCities}</span
		>
		<span class="tab-text">Cities</span>
	</button>

	<!-- Counties -->
	<button
		class:active={countiesTab}
		style={countiesTab
			? 'border-top: 3px solid rgba(var(--dark-green), 1); border-left: 0.5px solid rgba(var(--dark-green), 1); border-right: 0.5px solid rgba(var(--dark-green), 1);'
			: ''}
		on:click|stopPropagation={() => {
			citiesTab = false;
			countiesTab = true;
			statesTab = false;
			filterByProperty($reparationsCountyData);
		}}
	>
		<span class="tab-num" style={countiesTab ? 'color: rgba(var(--dark-green), 0.75)' : ''}
			>{numCounties}</span
		>
		<span class="tab-text">Counties</span>
	</button>

	<!-- States -->
	<button
		class:active={statesTab}
		style={statesTab
			? 'border-top: 3px solid rgba(var(--green), 1); border-left: 0.5px solid rgba(var(--green), 1); border-right: 0.5px solid rgba(var(--green), 1);'
			: ''}
		on:click|stopPropagation={() => {
			citiesTab = false;
			countiesTab = false;
			statesTab = true;
			filterByProperty($reparationsStateData);
		}}
	>
		<span class="tab-num" style={statesTab ? 'color: rgba(var(--green), 1)' : ''}>{numStates}</span>
		<span class="tab-text">States</span>
	</button>
</div>

<div
	class="stats-container"
	style={citiesTab
		? 'border: 0.5px solid rgba(var(--red), 1)'
		: countiesTab
			? 'border: 0.5px solid rgba(var(--dark-green), 0.75)'
			: 'border: 0.5px solid rgba(var(--green), 0.85)'}
>
	{#each questions as question, index}
		<details class="stat">
			<!-- count of locations for each geography type -->
			<summary
				style={index !== questions.length - 1
					? 'border-bottom: 1px solid rgba(var(--gray), 0.5);'
					: ''}
			>
				<span
					class="number"
					style={citiesTab
						? 'color: rgba(var(--red), 0.85)'
						: countiesTab
							? 'color: rgba(var(--dark-green), 0.75)'
							: 'color: rgba(var(--green), 1)'}>{question.count}</span
				>

				<!-- text referring to questions -->
				<span class="question">
					{citiesTab
						? question.count !== 1
							? 'cities'
							: 'city'
						: countiesTab
							? question.count !== 1
								? 'counties'
								: 'county'
							: question.count !== 1
								? 'states'
								: 'state'}
					<!-- For funding source question, using has/have -->
					{#if question.label === 'a funding source'}
						{question.count !== 1 ? 'have' : 'has'}
					{/if}
					<!-- For health question, using address(es) -->
					{#if question.label === 'health'}
						{question.count !== 1 ? 'address' : 'addresses'}
					{/if}
					{question.label}

					<!-- arrow icon -->
					{#if question.count > 0}
						<span class="arrow-down-icon" aria-hidden="true">▼</span>
					{/if}
				</span>
			</summary>

			{#if question.count > 0}
				<div class="stat-locations">
					<ul>
						{#each question.filteredData as location}
							<li class={citiesTab ? 'city-color' : countiesTab ? 'county-color' : 'state-color'}>
								<button
									on:click={() => {
										selectedLocation.set({
											Location: location.properties.Location,
											Geography: location.properties.Geography,
											State: location.properties.State
										});

										listPanelVisible.set(true);
										aboutPanelVisible.set(false);

										// If state is AK or HI, zoom to state
										if (
											location.properties.State === 'Alaska' ||
											location.properties.State === 'Hawaii'
										) {
											flyTo(location.properties.State);
										} else {
											$map.flyTo({
												center: [centerMapPt.lng, centerMapPt.lat],
												essential: true,
												zoom: 3.75,
												pitch: 0,
												speed: 1,
												curve: 1
											});
										}
									}}
								>
									{#if !statesTab}{location.properties.Location}{:else}{location.properties[
											'Original location name'
										]}{/if}
									{#if !statesTab}, {location.properties.State}{/if}
								</button>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</details>
	{/each}
</div>

<style>
	/* tabs */
	.tabs-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		/* border-bottom: 0.5px solid rgba(var(--black), 0.75); */
	}

	.tabs-container button {
		display: flex;
		align-items: center;
		column-gap: 5px;
		padding: 2px 10px;
		flex-grow: 1;
		background-color: rgba(var(--gray), 0.5);
		border-top: 2px solid rgba(var(--white), 1);
		text-transform: uppercase;
		font-family: 'Barlow Condensed', sans-serif;
		color: rgba(var(--black), 0.65);
	}

	.tabs-container button:not(:first-child),
	.tabs-container button:not(:last-child) {
		border-left: 1px solid rgba(var(--white), 1);
	}

	.tabs-container button:hover {
		background-color: rgba(var(--light-gray), 0.85);
	}

	.tabs-container button.active {
		cursor: auto;
		background-color: rgba(var(--white), 1);
		font-weight: 600;
		color: rgba(var(--black), 1);
	}

	.tabs-container > button .tab-num {
		font-size: 1.5rem;
		/* padding: 0 0.25rem 0 0; */
	}

	.tabs-container > button .tab-text {
		font-size: 1.1rem;
		font-family: 'Barlow Condensed', sans-serif;
	}

	/* stats */
	.stats-container {
		width: 100%;
	}

	summary {
		width: 100%;
		border: none;
		display: flex;
		align-items: center;
		cursor: pointer;
		padding: 3px 5px 3px 5px;
		column-gap: 5px;
		background-color: rgba(var(--white), 1);
	}

	summary:hover {
		background-color: rgba(var(--white), 1);
	}

	summary > .number {
		font-size: 1.2rem;
		text-align: right;
		/* width: 25px; */

		flex: 0 0 25px;
	}

	summary > .question {
		font-size: 0.95rem;
		line-height: 1.1;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	summary > .question > .arrow-down-icon {
		font-size: 10px;
		color: rgba(var(--black), 0.4);
	}

	details > div.stat-locations {
		background-color: rgba(var(--light-gray), 0.5);
		border-bottom: 1px solid rgba(var(--gray), 0.75);
		padding: 3px 0;
		box-shadow: 0 2px 2px -1px inset rgba(var(--gray), 0.25);
	}

	details > .stat-locations ul {
		padding: 0 30px;
		font-size: 0.85rem;
		list-style-type: circle;
	}

	details > .stat-locations ul > li.city-color::marker {
		color: rgba(var(--red), 1);
	}

	details > .stat-locations ul > li.county-color::marker {
		color: rgba(var(--dark-green), 1);
	}

	details > .stat-locations ul > li.state-color::marker {
		color: rgba(var(--green), 1);
	}

	.filters-note {
		padding-bottom: 10px;
		font-size: 0.8rem;
	}
</style>
