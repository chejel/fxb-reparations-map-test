<script>
	// Import stores
	import {
		citiesPanelVisible,
		countiesPanelVisible,
		statesPanelVisible,
		reparationsCityData,
		reparationsCountyData,
		reparationsStateData,
		selectedLocation,
		map
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
			OrigLocName: feature.properties['Original location name'],
			Location: feature.properties.Location,
			Geography: feature.properties.Geography,
			State: feature.properties.State,
			...($countiesPanelVisible && { fullCountyName: feature.properties['Full County Name'] })
		};
	});

	$: tableDataSort = !sortByState
		? tableData.sort((a, b) => a['Location'].localeCompare(b['Location']))
		: tableData.sort((a, b) => a['State'].localeCompare(b['State']));

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

<table cellpadding="0" cellspacing="0" border="0">
	<colgroup>
		<col style="width: 30px" />
		{#if !$statesPanelVisible}<col style="width: 180px" />{/if}
		<col style="width: auto" />
	</colgroup>
	<thead>
		<tr
			><th scope="col" />
			<th scope="col"
				>{#if $citiesPanelVisible}City{:else if $countiesPanelVisible}County{:else}State{/if}</th
			>
			{#if !$statesPanelVisible}<th scope="col">State</th>{/if}
		</tr>
	</thead>
	<tbody>
		{#each tableDataSort as { OrigLocName, Location, fullCountyName, Geography, State }, index}
			<tr>
				<td class="index">{index + 1}</td>
				{#if $citiesPanelVisible || $countiesPanelVisible}
					<td>
						<button
							class:active={$selectedLocation}
							on:click={() => {
								selectedLocation.set({ Location, Geography, State });

								// If state is AK or HI, zoom to state
								if (State === 'Alaska' || State === 'Hawaii') {
									flyTo(State);
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
							{#if $countiesPanelVisible}
								{fullCountyName}
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
							>{#if OrigLocName === Location}
								{Location}
							{:else}
								<!-- ex. Texas (Episcopal Diocese)-->
								{Location}
								<span style="font-weight: 400; text-transform: capitalize; margin-left: 5px;">
									{OrigLocName.replace(Location, '')}</span
								>
							{/if}
							<span style="position: absolute; right: 0; width: 25%;">
								<StateMap stateNameTable={State} width={250} height={400} />
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
		text-align: left;
	}

	/* Table */
	table {
		width: 100%;
		text-align: left;
		border-collapse: collapse;
	}

	/* Sticky table header */
	thead {
		position: sticky;
		top: 0;
		z-index: 2;
	}

	th {
		background-color: rgb(var(--yellow-orange), 0.85);
		padding: 0.25rem 0;
		font-family: 'Barlow Condensed', sans-serif;
		text-transform: uppercase;
		font-size: 0.85rem;
		font-weight: 800;
		box-shadow: 0 1px 2px -1px rgba(var(--black), 0.4);
	}

	tr:not(:last-child) td {
		border-bottom: 1px solid rgba(var(--gray), 0.65);
	}

	tr:hover {
		background-color: rgba(var(--yellow-orange), 0.1);
	}

	/* index numbers */
	td:first-child {
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
		color: rgba(var(--red), 1);
	}

	/* for touch screens */
	@media (hover: none) {
		button {
			color: rgb(var(--black));
		}
	}
</style>
