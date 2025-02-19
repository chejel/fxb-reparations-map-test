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
	const wordsIncluded = ['yes', 'but'];

	// Conditional for selected geography tab (cities, counties, states)
	//let selectedTabData = $reparationsCityData;
	let citiesTab = true;
	let countiesTab = false;
	let statesTab = false;

	// $: selectedTabData = citiesTab
	// 	? $reparationsCityData
	// 	: countiesTab
	// 		? $reparationsCountyData
	// 		: $reparationsStateData;

	let numReports;
	filterByProperty($reparationsCityData);

	function filterByProperty(dataset) {
		numReports = dataset
			?.filter((d) => d.properties['Has the location released a report on reparations?'])
			.filter((d) =>
				['yes'].some((value) =>
					d.properties['Has the location released a report on reparations?']
						.toLowerCase()
						.includes(value)
				)
			).length;
	}

	//$: numReports = filterByProperty('Has the location released a report on reparations?', ['yes']);
	// $: numFunding = filterByProperty('Has the location approved reparations funding?', ['yes']);
	// $: numSource = filterByProperty('What is the potential funding source?', ['yes']);
	// $: numAllocation = filterByProperty('Has the location begun allocating reparations?', ['yes']);
	// $: numDirect = filterByProperty(
	// 	'Has the location determined if direct payments will be included?',
	// 	['yes']
	// );
	// $: numEligibility = filterByProperty(
	// 	'Has the location determined who is eligible to receive direct payments?',
	// 	wordsIncluded
	// );
	// $: numHealth = filterByProperty('Is any of the funding addressing health?', wordsIncluded);

	// Questions
	$: questions = [
		{ count: numReports, label: 'released a report' }
		// { count: numFunding, label: 'approved funding' },
		// { count: numSource, label: 'have a funding source' },
		// { count: numAllocation, label: 'started allocating reparations' },
		// { count: numDirect, label: 'determined direct payments' },
		// { count: numEligibility, label: 'determined eligibility' },
		// { count: numHealth, label: 'address health' }
	];

	// Tabs
	// const tabs = [
	// 	{
	// 		label: 'Cities',
	// 		count: numCities,
	// 		active: citiesTab,
	// 		color: 'rgba(var(--red), 0.85)',
	// 		borderColor: 'rgba(var(--red), 1)'
	// 	},
	// 	{
	// 		label: 'Counties',
	// 		count: numCounties,
	// 		active: countiesTab,
	// 		color: 'rgba(var(--dark-green), 0.75)',
	// 		borderColor: 'rgba(var(--green), 1)'
	// 	},
	// 	{
	// 		label: 'States',
	// 		count: numStates,
	// 		active: statesTab,
	// 		color: 'rgba(var(--green), 1)',
	// 		borderColor: 'rgba(var(--green), 1)'
	// 	}
	// ];
</script>

<!-- note about filters -->
<div class="filters-note">
	To see the locations of which the below criteria apply, toggle the respective filters on the map.
</div>

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
		<span class="number top-number" style="color: rgba(var(--red), 0.85);">{numCities}</span>
		<span class="top-label">Cities</span>
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
		<span class="number top-number" style="color: rgba(var(--dark-green), 0.75);"
			>{numCounties}</span
		>
		<span class="top-label">Counties</span>
	</button>

	<!-- States -->
	<button
		class:active={statesTab}
		style={statesTab ? 'border-top: 2px solid rgba(var(--green), 1)' : ''}
		on:click|stopPropagation={() => {
			citiesTab = false;
			countiesTab = false;
			statesTab = true;
			filterByProperty($reparationsStateData);
		}}
	>
		<span class="number top-number" style="color: rgba(var(--green), 1);">{numStates}</span>
		<span class="top-label">States</span>
	</button>
</div>

<!-- <div class="location-stats">
	{#each tabs as tab}
		<button
			class:active={citiesTab}
			style={citiesTab ? `border-top: 2px solid ${tab.borderColor}` : ''}
			on:click|stopPropagation={() => {
				// citiesTab = tab.label === 'Cities';
				// countiesTab = tab.label === 'Counties';
				// statesTab = tab.label === 'States';
				// console.log(tab.label);

				// if(tab.label === "Cities") {
				// 	selectedTabData = reparationsCityData;
				// } else if(tab.label === "Counties") {
				// 	selectedTabData = reparationsCountyData;
				// } else {
				// 	selectedTabData = reparationsStateData;
				// }
				tab.active === true;
				console.log(tab);
				if (!citiesTab && tab.label === 'Cities') {
					citiesTab = true;
					countiesTab = false;
					statesTab = false;
				} else if (tab.label === 'Counties') {
					citiesTab = false;
					countiesTab = true;
					statesTab = false;
				} else if (tab.label === 'States') {
					citiesTab = false;
					countiesTab = false;
					statesTab = true;
				}
				filterByProperty();
			}}
		>
			<span class="number top-number" style={`color: ${tab.color};`}>{tab.count}</span>
			<span class="top-label">{tab.label}</span>
		</button>
	{/each}
</div> -->

<table cellpadding="0" cellspacing="0" border="0">
	<colgroup>
		<col style="width: 20px" />
		<col style="width: auto" />
	</colgroup>
	<tbody>
		{#each questions as item}
			<!-- divider -->
			<tr>
				<td colspan="2">
					<hr class="outer" style="margin-top: 0;" />
				</td>
			</tr>
			<tr>
				<td
					class="number"
					style={citiesTab
						? 'color: rgba(var(--red), 0.85)'
						: countiesTab
							? 'color: rgba(var(--dark-green), 0.75)'
							: 'color: rgba(var(--green), 1)'}>{item.count}</td
				>
				<td class="label">
					{citiesTab
						? item.count !== 1
							? 'cities'
							: 'city'
						: countiesTab
							? item.count !== 1
								? 'counties'
								: 'county'
							: item.count !== 1
								? 'states'
								: 'state'}
					{item.count !== 1 ? 'have' : 'has'}
					{item.label}</td
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

	.top-number {
		font-size: 1.4rem;
		/* padding: 0 0.25rem 0 0; */
	}

	.label {
		font-size: 0.95rem;
		line-height: 1.1;
	}

	.top-label {
		font-size: 1.1rem;
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
