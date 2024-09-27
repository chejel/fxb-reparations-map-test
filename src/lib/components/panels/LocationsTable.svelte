<script>
	// Import stores
	import {
		reparationsCityData,
		citiesPanelVisible,
		reparationsCountyData,
		selectedLocation
	} from '$lib/stores.js';

	// Prop for sorting by state toggle
	export let sortByState;

	// Data for table order, sorted based on state of sortByStateVisible
	$: tableData = ($citiesPanelVisible ? $reparationsCityData : $reparationsCountyData)?.map(
		(feature) => {
			return {
				Location: feature.properties.Location,
				Geography: feature.properties.Geography,
				State: feature.properties.State
			};
		}
	);

	$: tableDataSort = !sortByState
		? tableData.sort((a, b) => a['Location'].localeCompare(b['Location']))
		: tableData.sort((a, b) => a['State'].localeCompare(b['State']));
</script>

<table cellpadding="0" cellspacing="0" border="0">
	<colgroup>
		<col style="width: 20px" />
		<col style="width: 180px" />
		<col style="width: auto" />
	</colgroup>
	<tbody>
		{#each tableDataSort as { Location, Geography, State }, index}
			<tr>
				<td class="index">{index + 1}</td>
				<td class="city">
					<button
						class:active={$selectedLocation}
						on:click={() => {
							selectedLocation.set({ Location, Geography, State });
						}}
					>
						{Location}
						<!-- Location.split(',', 1) for "Amherst, MA" -->
					</button>
				</td><td class="state">{State}</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	button {
		font-size: 1rem;
	}

	/* Table */
	table {
		width: 100%;
	}

	td {
		padding: 0.15rem 0;
	}

	tr:not(:last-child) td {
		border-bottom: 1px solid var(--divider-gray);
	}

	/* index numbers */
	tr td:first-child {
		padding: 0 0.5rem;
		text-align: right;
	}

	.index,
	.state {
		font-family: 'Barlow Condensed', sans-serif;
		text-transform: uppercase;
		font-size: 0.8rem;
		font-weight: 600;
	}

	.index {
		color: var(--red);
	}

	/* for touch screens */
	@media (hover: none) {
		button {
			color: #333;
		}
	}
</style>
