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
	let selectedTab = $reparationsCityData;
	let citiesTab = true;
	let countiesTab = false;
	let statesTab = false;

	$: if (citiesTab === true) {
		selectedTab = $reparationsCityData;
	} else if (countiesTab === true) {
		selectedTab = $reparationsCountyData;
	} else if (statesTab === true) {
		selectedTab = $reparationsStateData;
	}

	// # with reports
	$: numReports = selectedTab
		?.filter((d) => d.properties['Has the location released a report on reparations?'])
		.filter((d) =>
			d.properties['Has the location released a report on reparations?'].includes('Yes')
		).length;

	// # with funding
	$: numFunding = selectedTab
		?.filter((d) => d.properties['Has the location approved reparations funding?'])
		.filter((d) =>
			d.properties['Has the location approved reparations funding?'].includes('Yes')
		).length;

	// # with funding source
	$: numSource = selectedTab
		?.filter((d) => d.properties['What is the potential funding source?'])
		.filter((d) => d.properties['What is the potential funding source?'].includes('Yes')).length;

	// # with allocation
	$: numAllocation = selectedTab
		?.filter((d) => d.properties['Has the location begun allocating reparations?'])
		.filter((d) =>
			d.properties['Has the location begun allocating reparations?'].includes('Yes')
		).length;

	// # with direct payments
	$: numDirect = selectedTab
		?.filter(
			(d) => d.properties['Has the location determined if direct payments will be included?']
		)
		.filter((d) =>
			d.properties['Has the location determined if direct payments will be included?'].includes(
				'Yes'
			)
		).length;

	// # with eligibility determined
	$: numEligibility = selectedTab
		?.filter(
			(d) => d.properties['Has the location determined who is eligible to receive direct payments?']
		)
		.filter((d) =>
			wordsIncluded.some((word) =>
				d.properties['Has the location determined who is eligible to receive direct payments?']
					.toLowerCase()
					.includes(word)
			)
		).length;

	// # with health
	$: numHealth = selectedTab
		?.filter((d) => d.properties['Is any of the funding addressing health?'])
		.filter((d) =>
			wordsIncluded.some((word) =>
				d.properties['Is any of the funding addressing health?'].toLowerCase().includes(word)
			)
		).length;
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
		}}
	>
		<span class="number top-number" style="color: rgba(var(--green), 1);">{numStates}</span>
		<span class="top-label">States</span>
	</button>
</div>

<table cellpadding="0" cellspacing="0" border="0">
	<colgroup>
		<col style="width: 20px" />
		<col style="width: auto" />
	</colgroup>
	<tbody>
		<!-- divider -->
		<tr>
			<td colspan="2">
				<hr class="outer" style="margin-top: 0;" />
			</td></tr
		>
		<!-- # with reports -->
		<tr>
			<td
				class="number"
				style={citiesTab
					? 'color: rgba(var(--red), 0.85)'
					: countiesTab
						? 'color: rgba(var(--dark-green), 0.75)'
						: 'color: rgba(var(--green), 1)'}>{numReports}</td
			>
			<td class="label">
				{citiesTab
					? numReports.length !== 1
						? 'cities'
						: 'city'
					: countiesTab
						? numReports.length !== 1
							? 'counties'
							: 'county'
						: numReports.length !== 1
							? 'states'
							: 'state'}
				{numReports.length !== 1 ? 'have' : 'has'} released a report</td
			>
		</tr>
		<!-- divider -->
		<tr>
			<td colspan="2">
				<hr />
			</td>
		</tr>

		<!-- # with funding -->
		<tr>
			<td
				class="number"
				style={citiesTab
					? 'color: rgba(var(--red), 0.85)'
					: countiesTab
						? 'color: rgba(var(--dark-green), 0.75)'
						: 'color: rgba(var(--green), 1)'}>{numFunding}</td
			>
			<td class="label">
				{citiesTab
					? numFunding !== 1
						? 'cities'
						: 'city'
					: countiesTab
						? numFunding !== 1
							? 'counties'
							: 'county'
						: numFunding !== 1
							? 'states'
							: 'state'}
				{numFunding !== 1 ? 'have' : 'has'} approved funding</td
			>
		</tr>
		<!-- divider -->
		<tr>
			<td colspan="2">
				<hr />
			</td>
		</tr>

		<!-- # with funding source -->
		<tr>
			<td
				class="number"
				style={citiesTab
					? 'color: rgba(var(--red), 0.85)'
					: countiesTab
						? 'color: rgba(var(--dark-green), 0.75)'
						: 'color: rgba(var(--green), 1)'}>{numSource}</td
			>
			<td class="label">
				{citiesTab
					? numSource !== 1
						? 'cities'
						: 'city'
					: countiesTab
						? numSource !== 1
							? 'counties'
							: 'county'
						: numSource !== 1
							? 'states'
							: 'state'}
				{numSource !== 1 ? 'have' : 'has'} a funding source</td
			>
		</tr>
		<!-- divider -->
		<tr>
			<td colspan="2">
				<hr />
			</td>
		</tr>

		<!-- # with allocation -->
		<tr>
			<td
				class="number"
				style={citiesTab
					? 'color: rgba(var(--red), 0.85)'
					: countiesTab
						? 'color: rgba(var(--dark-green), 0.75)'
						: 'color: rgba(var(--green), 1)'}>{numAllocation}</td
			>
			<td class="label">
				{citiesTab
					? numAllocation !== 1
						? 'cities'
						: 'city'
					: countiesTab
						? numAllocation !== 1
							? 'counties'
							: 'county'
						: numAllocation !== 1
							? 'states'
							: 'state'}
				{numAllocation !== 1 ? 'have' : 'has'} started allocating reparations</td
			>
		</tr>
		<!-- divider -->
		<tr>
			<td colspan="2">
				<hr />
			</td>
		</tr>

		<!-- # with direct payments -->
		<tr>
			<td
				class="number"
				style={citiesTab
					? 'color: rgba(var(--red), 0.85)'
					: countiesTab
						? 'color: rgba(var(--dark-green), 0.75)'
						: 'color: rgba(var(--green), 1)'}>{numDirect}</td
			>
			<td class="label">
				{citiesTab
					? numDirect !== 1
						? 'cities'
						: 'city'
					: countiesTab
						? numDirect !== 1
							? 'counties'
							: 'county'
						: numDirect !== 1
							? 'states'
							: 'state'}
				{numDirect !== 1 ? 'have' : 'has'} determined direct payments</td
			>
		</tr>
		<!-- divider -->
		<tr>
			<td colspan="2">
				<hr />
			</td>
		</tr>

		<!-- # with eligibility determined -->
		<tr>
			<td
				class="number"
				style={citiesTab
					? 'color: rgba(var(--red), 0.85)'
					: countiesTab
						? 'color: rgba(var(--dark-green), 0.75)'
						: 'color: rgba(var(--green), 1)'}>{numEligibility}</td
			>
			<td class="label">
				{citiesTab
					? numEligibility !== 1
						? 'cities'
						: 'city'
					: countiesTab
						? numEligibility !== 1
							? 'counties'
							: 'county'
						: numEligibility !== 1
							? 'states'
							: 'state'}
				{numEligibility !== 1 ? 'have' : 'has'} determined eligibility</td
			>
			<!-- <td class="label"> cities address eligibility</td> -->
		</tr>
		<!-- divider -->
		<tr>
			<td colspan="2">
				<hr />
			</td>
		</tr>

		<!-- # with health -->
		<tr>
			<td
				class="number"
				style={citiesTab
					? 'color: rgba(var(--red), 0.85)'
					: countiesTab
						? 'color: rgba(var(--dark-green), 0.75)'
						: 'color: rgba(var(--green), 1)'}>{numHealth}</td
			>
			<td class="label">
				{citiesTab
					? numHealth.length !== 1
						? 'cities'
						: 'city'
					: countiesTab
						? numHealth.length !== 1
							? 'counties'
							: 'county'
						: numHealth.length !== 1
							? 'states'
							: 'state'}
				{numHealth.length !== 1 ? 'address' : 'addresses'} health</td
			>
		</tr>
		<!-- divider -->
		<!-- <tr>
			<td colspan="2">
				<hr class="outer" />
			</td></tr
		> -->
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
