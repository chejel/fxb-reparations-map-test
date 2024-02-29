<script>
	// Import stores
	import { reparationsData, selectedCity } from '$lib/stores.js';

	const tableData = $reparationsData?.map((feature) => {
		return {
			index: feature.properties.index + 1,
			City: feature.properties.City,
			State: feature.properties.State
		};
	});
</script>

<table cellpadding="0" cellspacing="0" border="0">
	<colgroup>
		<col style="width: 20px" />
		<col style="width: 180px" />
		<col style="width: auto" />
	</colgroup>
	<!-- <thead>
    <tr>
        <th scope="col">#</th>
        <th scope="col">City</th>
        <th scope="col">State</th>
    </tr></thead
> -->
	<tbody>
		{#each tableData as { index, City, State }}
			<tr>
				<td class="index">{index}</td>
				<td class="city">
					<button
						class:active={$selectedCity === City}
						on:click={() => {
							$selectedCity = City;
						}}>{City.split(',', 1)}</button
					>
				</td><td class="state">{State}</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	button {
		background-color: transparent;
		border: none;
		cursor: pointer;
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
		border-bottom: 1px solid #eee;
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
		color: #c70039;
	}
</style>
