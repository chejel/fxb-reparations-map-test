<script>
	// Import stores
	import { reparationsCityData, reparationsStateData } from '$lib/stores.js';

	// # of cities
	const numCities = $reparationsCityData?.length;

	// # of states
	const numStates = $reparationsStateData?.length;

	// # with reports
	const numReports = $reparationsCityData?.filter((d) =>
		d.properties['Has the city released a report on reparations?'].includes('Yes')
	).length;

	// # with funding
	const numFunding = $reparationsCityData?.filter((d) =>
		d.properties['Has the city approved reparations funding?'].includes('Yes')
	).length;

	// # with funding source
	const numSource = $reparationsCityData?.filter((d) =>
		d.properties['What is the potential funding source?'].includes('Yes')
	).length;

	// # with allocation
	const numAllocation = $reparationsCityData?.filter((d) =>
		d.properties['Has the city begun allocating reparations?'].includes('Yes')
	).length;

	// # with direct payments
	const numDirect = $reparationsCityData?.filter((d) =>
		d.properties['Has the city determined if direct payments will be included?'].includes('Yes')
	).length;

	// # with eligibility determined
	const numEligibility = $reparationsCityData?.filter((d) =>
		d.properties['Has the city determined who is eligible to receive direct payments?'].includes(
			'Yes'
		)
	).length;
</script>

<section class="location-stats">
	<div>
		<span class="number top-number">{numCities}</span> <span class="top-label">Cities</span>
	</div>
	<!-- <div>
		<span class="number top-number">{numCounties}</span> <span class="top-label">Counties</span>
	</div> -->
	<span style="font-size: 1.5rem; font-weight: 400; color: silver;">|</span>
	<div>
		<span class="number top-number" style="color: #588157;">{numStates}</span>
		<span class="top-label">States</span>
	</div>
</section>
<!-- divider -->

<hr style="border-top: 0.5px solid rgba(45, 45, 45, 0.75);" />

<table cellpadding="0" cellspacing="0" border="0">
	<colgroup>
		<col style="width: 20px" />
		<col style="width: auto" />
	</colgroup>
	<tbody>
		<!-- # of Cities -->
		<!-- <tr>
			<td class="number">{numCities}</td>
			<td class="label"> Cities</td>
		</tr> -->
		<!-- divider -->
		<!-- <tr>
			<td colspan="2">
				<hr />
			</td>
		</tr> -->
		<!-- # of Counties -->
		<!-- <tr>
			<td class="number">{numCounties}</td>
			<td class="label"> Counties</td>
		</tr> -->
		<!-- divider -->
		<!-- <tr>
			<td colspan="2">
				<hr />
			</td>
		</tr> -->
		<!-- # of States -->
		<!-- <tr>
			<td class="number">{numStates}</td>
			<td class="label"> States</td>
		</tr> -->

		<!-- note about filters -->
		<tr>
			<td colspan="2" class="filters-note"
				>To see the cities to which the following criteria apply, toggle the respective filters on
				the map.</td
			>
		</tr>

		<!-- # with reports -->
		<tr>
			<td class="number">{numReports}</td>
			<td class="label filters"> Cities have released a report</td>
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
			<td class="label filters"> Cities have approved funding</td>
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
			<td class="label filters"> Cities have a funding source</td>
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
			<td class="label filters"> Cities have started allocating</td>
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
			<td class="label filters"> Cities have determined direct payments</td>
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
			<td class="label filters"> Cities have determined eligibility</td>
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
		font-size: 1.4rem;
		color: var(--red);
		text-align: right;
		padding: 0 0.75rem 0 0;
	}

	.top-number {
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
		font-family: 'Barlow Condensed', sans-serif;
		font-size: 0.95rem;
	}
</style>
