<script>
	// Import stores
	import { reparationsCityData, reparationsCountyData, reparationsStateData } from '$lib/stores.js';

	// # of cities
	const numCities = $reparationsCityData?.length;

	// # of counties
	const numCounties = $reparationsCountyData?.length;

	// # of states
	const numStates = $reparationsStateData?.length;

	// filter for multiple words in the response string
	//const wordsIncluded = ['yes', 'but'];

	// Designating the selected geography tab (cities, counties, states)
	let citiesTab = true;
	let countiesTab = false;
	let statesTab = false;

	// Variables for each question
	let numReports;
	let numFunding;
	let numSource;
	let numAllocation;
	let numDirect;
	let numEligibility;
	let numHealth;

	// Function to return number of locations that apply for each question
	filterByProperty($reparationsCityData);

	function filterByProperty(dataset) {
		// numReports
		numReports = dataset
			?.filter((d) => d.properties['Has the location released a report on reparations?'])
			.filter((d) =>
				['yes'].some((value) =>
					d.properties['Has the location released a report on reparations?']
						.toLowerCase()
						.includes(value)
				)
			).length;

		// numFunding
		numFunding = dataset
			?.filter((d) => d.properties['Has the location approved reparations funding?'])
			.filter((d) =>
				['yes'].some((value) =>
					d.properties['Has the location approved reparations funding?']
						.toLowerCase()
						.includes(value)
				)
			).length;

		// numSource
		numSource = dataset
			?.filter((d) => d.properties['What is the potential funding source?'])
			.filter((d) =>
				['yes'].some((value) =>
					d.properties['What is the potential funding source?'].toLowerCase().includes(value)
				)
			).length;

		numAllocation = dataset
			?.filter((d) => d.properties['Has the location begun allocating reparations?'])
			.filter((d) =>
				['yes'].some((value) =>
					d.properties['Has the location begun allocating reparations?']
						.toLowerCase()
						.includes(value)
				)
			).length;

		numDirect = dataset
			?.filter(
				(d) => d.properties['Has the location determined if direct payments will be included?']
			)
			.filter((d) =>
				['yes'].some((value) =>
					d.properties['Has the location determined if direct payments will be included?']
						.toLowerCase()
						.includes(value)
				)
			).length;

		numEligibility = dataset
			?.filter(
				(d) =>
					d.properties['Has the location determined who is eligible to receive direct payments?']
			)
			.filter((d) =>
				['yes'].some((value) =>
					d.properties['Has the location determined who is eligible to receive direct payments?']
						.toLowerCase()
						.includes(value)
				)
			).length;

		numHealth = dataset
			?.filter((d) => d.properties['Is any of the funding addressing health?'])
			.filter((d) =>
				['yes'].some((value) =>
					d.properties['Is any of the funding addressing health?'].toLowerCase().includes(value)
				)
			).length;

		return {
			numReports,
			numFunding,
			numSource,
			numAllocation,
			numDirect,
			numEligibility,
			numHealth
		};
	}

	// Questions
	$: questions = [
		{ count: numReports, label: 'released a report' },
		{ count: numFunding, label: 'approved funding' },
		{ count: numSource, label: 'a funding source' },
		{ count: numAllocation, label: 'started allocating reparations' },
		{ count: numDirect, label: 'determined direct payments' },
		{ count: numEligibility, label: 'determined eligibility' },
		{ count: numHealth, label: 'health' }
	];
</script>

<!-- note about filters -->
<div class="filters-note">
	To see the locations of which the below criteria apply, toggle the respective filters on the map.
</div>

<!-- tabs -->
<div class="location-stats">
	<!-- Cities -->
	<button
		class:active={citiesTab}
		style={citiesTab ? 'border-top: 2px solid rgba(var(--red), 1)' : ''}
		on:click|stopPropagation={() => {
			citiesTab = true;
			countiesTab = false;
			statesTab = false;
			filterByProperty($reparationsCityData);
		}}
	>
		<span class="number tab-num" style="color: rgba(var(--red), 0.85);">{numCities}</span>
		<span class="tab-text">Cities</span>
	</button>

	<!-- Counties -->
	<button
		class:active={countiesTab}
		style={countiesTab ? 'border-top: 2px solid rgba(var(--green), 1)' : ''}
		on:click|stopPropagation={() => {
			citiesTab = false;
			countiesTab = true;
			statesTab = false;
			filterByProperty($reparationsCountyData);
		}}
	>
		<span class="number tab-num" style="color: rgba(var(--dark-green), 0.75);">{numCounties}</span>
		<span class="tab-text">Counties</span>
	</button>

	<!-- States -->
	<button
		class:active={statesTab}
		class="tab"
		style={statesTab ? 'border-top: 2px solid rgba(var(--green), 1)' : ''}
		on:click|stopPropagation={() => {
			citiesTab = false;
			countiesTab = false;
			statesTab = true;
			filterByProperty($reparationsStateData);
		}}
	>
		<span class="number tab-num" style="color: rgba(var(--green), 1);">{numStates}</span>
		<span class="tab-text">States</span>
	</button>
</div>

<table cellpadding="0" cellspacing="0" border="0">
	<colgroup>
		<col style="width: 20px" />
		<col style="width: auto" />
	</colgroup>
	<tbody>
		{#each questions as question}
			<!-- divider -->
			<tr>
				<td colspan="2">
					<hr class="outer" style="margin-top: 0;" />
				</td>
			</tr>

			<!-- tab: count of locations for each geography type -->
			<tr>
				<td
					class="number"
					style={citiesTab
						? 'color: rgba(var(--red), 0.85)'
						: countiesTab
							? 'color: rgba(var(--dark-green), 0.75)'
							: 'color: rgba(var(--green), 1)'}>{question.count}</td
				>

				<!-- text referring to questions -->
				<td class="question">
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
					{question.label}</td
				>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	.location-stats {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.location-stats button {
		display: flex;
		align-items: center;
		padding: 2px 10px;
		flex-grow: 1;
		background-color: rgba(var(--gray), 0.5);
		border-top: 2px solid rgba(var(--white), 1);
	}

	.location-stats button:not(:first-child),
	.location-stats button:not(:last-child) {
		border-left: 1px solid rgba(var(--white), 1);
	}

	.location-stats button:hover {
		background-color: rgba(var(--light-gray), 0.85);
	}

	.location-stats button.active {
		cursor: auto;
		background-color: rgba(var(--white), 1);
	}

	table {
		width: 100%;
	}

	td:not(:first-child) {
		vertical-align: middle;
		padding: 5px 0;
	}

	.number {
		font-size: 1.2rem;
		text-align: right;
		padding: 0 0.5rem 0 0;
	}

	td.number {
		text-align: left;
		padding: 0 0 0 3px;
	}

	.tab-num {
		font-size: 1.4rem;
		/* padding: 0 0.25rem 0 0; */
	}

	.tab-text {
		font-size: 1.1rem;
		/* font-family: 'Barlow Condensed', sans-serif; */
	}

	.question {
		font-size: 0.95rem;
		line-height: 1.1;
	}

	hr {
		margin-top: 0.1rem;
		margin-bottom: 0.1rem;
	}

	hr.outer {
		margin-top: 0.25rem;
		border-top: 0.5px solid rgba(var(--black), 0.75);
	}

	.filters-note {
		padding-bottom: 10px;
		font-size: 0.8rem;
	}
</style>
