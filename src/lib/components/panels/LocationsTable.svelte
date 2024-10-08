<script>
	// Import stores
	import {
		citiesPanelVisible,
		countiesPanelVisible,
		statesPanelVisible,
		reparationsCityData,
		reparationsCountyData,
		reparationsStateData,
		selectedLocation
	} from '$lib/stores.js';

	// Prop for sorting by state toggle
	export let sortByState;

	// Import components
	import StateMap from '$lib/components/panels/StateMap.svelte';

	// Data for table order, sorted based on state of sortByStateVisible
	$: tableData = (
		$citiesPanelVisible
			? $reparationsCityData
			: $countiesPanelVisible
				? $reparationsCountyData
				: $reparationsStateData
	)?.map((feature) => {
		return {
			Location: feature.properties.Location,
			Geography: feature.properties.Geography,
			State: feature.properties.State
		};
	});

	$: tableDataSort = !sortByState
		? tableData.sort((a, b) => a['Location'].localeCompare(b['Location']))
		: tableData.sort((a, b) => a['State'].localeCompare(b['State']));
</script>

<table cellpadding="0" cellspacing="0" border="0">
	<colgroup>
		<col style="width: 30px" />
		{#if !$statesPanelVisible}<col style="width: 180px" />{/if}
		<col style="width: auto" />
	</colgroup>
	<thead>
		<tr
			><th scope="column"></th>
			<th scope="column"
				>{#if $citiesPanelVisible}City{:else if $countiesPanelVisible}County{:else}State{/if}</th
			>
			{#if !$statesPanelVisible}<th scope="column">State</th>{/if}
		</tr>
	</thead>
	<tbody>
		{#each tableDataSort as { Location, Geography, State }, index}
			<tr>
				<td class="index">{index + 1}</td>
				{#if $citiesPanelVisible || $countiesPanelVisible}
					<td>
						<button
							class:active={$selectedLocation}
							on:click={() => {
								selectedLocation.set({ Location, Geography, State });
							}}
						>
							{#if $countiesPanelVisible}
								{Location} County
							{:else}
								{Location}
							{/if}
						</button>
					</td>
					<td class="state">
						{State}
					</td>
				{:else if $statesPanelVisible}
					<td class:states={$statesPanelVisible}>
						<button
							class:active={$selectedLocation}
							class="state"
							style="position: relative; font-size: 1rem; height: 50px; display: flex; align-items: center; width: 90%;"
							on:click={() => {
								selectedLocation.set({ Location, Geography, State });
							}}
							>{State}
							<span style="position: absolute; right: 0; width: 85%">
								<StateMap stateNameTable={State} />
							</span>
						</button>
					</td>
				{/if}
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
		text-align: left;
	}

	th {
		background-color: rgb(254, 183, 70);
		padding: 0.25rem 0;
		font-family: 'Barlow Condensed', sans-serif;
		text-transform: uppercase;
		font-size: 0.85rem;
		font-weight: 800;
		/* Sticky table header */
		position: sticky;
		top: 0;
		box-shadow: 0 1px 2px -1px rgba(0, 0, 0, 0.4);
	}

	tr:not(:last-child) td {
		border-bottom: 1px solid var(--divider-gray);
	}

	tr:hover {
		background-color: rgba(254, 183, 70, 0.1);
	}

	/* index numbers */
	tr td:first-child {
		padding: 0 0.5rem;
		text-align: right;
	}

	td {
		padding: 0.2rem 0;
	}

	/* additional padding for states table */
	td.states {
		padding: 0.25rem 0;
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
