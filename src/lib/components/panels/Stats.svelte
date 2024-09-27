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

	// # with reports
	const numReports = $reparationsCityData
		?.filter((d) => d.properties['Has the location released a report on reparations?'])
		.filter((d) =>
			d.properties['Has the location released a report on reparations?'].includes('Yes')
		).length;

	// # with funding
	const numFunding = $reparationsCityData
		?.filter((d) => d.properties['Has the location approved reparations funding?'])
		.filter((d) =>
			d.properties['Has the location approved reparations funding?'].includes('Yes')
		).length;

	// # with funding source
	const numSource = $reparationsCityData
		?.filter((d) => d.properties['What is the potential funding source?'])
		.filter((d) => d.properties['What is the potential funding source?'].includes('Yes')).length;

	// # with allocation
	const numAllocation = $reparationsCityData
		?.filter((d) => d.properties['Has the location begun allocating reparations?'])
		.filter((d) =>
			d.properties['Has the location begun allocating reparations?'].includes('Yes')
		).length;

	// # with direct payments
	const numDirect = $reparationsCityData
		?.filter(
			(d) => d.properties['Has the location determined if direct payments will be included?']
		)
		.filter((d) =>
			d.properties['Has the location determined if direct payments will be included?'].includes(
				'Yes'
			)
		).length;

	// # with eligibility determined
	const numEligibility = $reparationsCityData
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
	const numHealth = $reparationsCityData
		?.filter((d) => d.properties['Is any of the funding addressing health?'])
		.filter((d) =>
			wordsIncluded.some((word) =>
				d.properties['Is any of the funding addressing health?'].toLowerCase().includes(word)
			)
		).length;
</script>

<section class="location-stats">
	<div>
		<span class="number top-number">{numCities}</span> <span class="top-label">Cities</span>
	</div>
	<span style="font-size: 1.5rem; font-weight: 400; color: silver;">|</span>
	<div>
		<span class="number top-number" style="color: #588157;">{numCounties}</span>
		<span class="top-label">Counties</span>
	</div>
	<span style="font-size: 1.5rem; font-weight: 400; color: silver;">|</span>
	<div>
		<span class="number top-number" style="color: #588157;">{numStates}</span>
		<span class="top-label">States</span>
	</div>
</section>

<table cellpadding="0" cellspacing="0" border="0">
	<colgroup>
		<col style="width: 20px" />
		<col style="width: auto" />
	</colgroup>
	<tbody>
		<!-- divider -->
		<tr>
			<td colspan="2">
				<hr style="margin-bottom: 1rem; border-top: 0.5px solid rgba(45, 45, 45, 0.75);" />
			</td></tr
		>
		<!-- # with reports -->
		<tr>
			<td class="number">{numReports}</td>
			<td class="label"> cities have released a report</td>
		</tr>
		<!-- divider -->
		<tr>
			<td colspan="2">
				<hr />
			</td>
		</tr>

		<!-- # with funding -->
		<tr>
			<td class="number">{numFunding}</td>
			<td class="label"> cities have approved funding</td>
		</tr>
		<!-- divider -->
		<tr>
			<td colspan="2">
				<hr />
			</td>
		</tr>

		<!-- # with funding source -->
		<tr>
			<td class="number">{numSource}</td>
			<td class="label"> cities have a funding source</td>
		</tr>
		<!-- divider -->
		<tr>
			<td colspan="2">
				<hr />
			</td>
		</tr>

		<!-- # with allocation -->
		<tr>
			<td class="number">{numAllocation}</td>
			<td class="label"> cities have started allocating reparations</td>
		</tr>
		<!-- divider -->
		<tr>
			<td colspan="2">
				<hr />
			</td>
		</tr>

		<!-- # with direct payments -->
		<tr>
			<td class="number">{numDirect}</td>
			<td class="label"> cities have determined direct payments</td>
		</tr>
		<!-- divider -->
		<tr>
			<td colspan="2">
				<hr />
			</td>
		</tr>

		<!-- # with eligibility determined -->
		<tr>
			<td class="number">{numEligibility}</td>
			<td class="label"> cities have determined eligibility</td>
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
			<td class="number">{numHealth}</td>
			<td class="label"> cities address health</td>
		</tr>
		<!-- divider -->
		<tr>
			<td colspan="2">
				<hr style="margin-top: 1rem; border-top: 0.5px solid rgba(45, 45, 45, 0.75);" />
			</td></tr
		>
		<!-- note about filters -->
		<tr>
			<td colspan="2" class="filters-note"
				>To see the cities to which the above criteria apply, toggle the respective filters on the
				map.</td
			>
		</tr>
	</tbody>
</table>

<style>
	.location-stats {
		display: flex;
		/* justify-content: space-between; */
		align-items: center;
		gap: 15px;
		padding-bottom: 0.5rem;
	}

	.location-stats div {
		display: flex;
		align-items: center;
		gap: 3px;
	}

	table {
		width: 100%;
	}

	td {
		vertical-align: middle;
	}

	.number {
		font-size: 1.2rem;
		color: var(--red);
		text-align: right;
		padding: 0 0.5rem 0 0;
	}

	.top-number {
		font-size: 1.4rem;
		padding: 0 0.25rem 0 0;
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

	.filters-note {
		padding-top: 0.75rem;
		padding-bottom: 0.5rem;
		font-size: 0.8rem;
	}
</style>
