<script>
	// Import stores
	import { reparationsStateData, selectedState } from '$lib/stores.js';

	// Import components
	import StateMap from '$lib/components/panels/StateMap.svelte';

	const tableData = $reparationsStateData?.map((d) => d.Location);
</script>

<table cellpadding="0" cellspacing="0" border="0">
	<colgroup>
		<col style="width: 20px" />
		<col style="width: auto" />
		<!-- <col style="width: auto" /> -->
	</colgroup>
	<tbody>
		{#each tableData as State, index}
			<tr>
				<td class="index">{index + 1}</td>
				<td>
					<button
						class:active={$selectedState === State}
						class="state"
						style="font-size: 1rem; height: 50px;"
						on:click={() => {
							$selectedState = State;
						}}>{State} <StateMap stateName={State} /></button
					>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	button {
		font-size: 1rem;
		display: flex;
		align-items: center;
		width: 100%;
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
