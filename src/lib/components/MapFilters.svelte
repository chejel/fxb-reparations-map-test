<script>
	// Stores
	import { map } from '$lib/stores.js';

	// Set variables for toggle
	let questionToggle;

	function toggleFilter(question) {
		// includes, but is no limited to, "Yes" in response
		//$map.setFilter('cities-layer', ['in', 'Yes', ['string', ['get', question[0]]]]);
		$map.setFilter('cities-layer', filterQuestions(question));
		$map.setFilter('cities-labels', filterQuestions(question));

		function filterQuestions(question) {
			const quesArrItem = question.map((question) => ['in', 'Yes', ['string', ['get', question]]]);
			return ['all'].concat(quesArrItem);
		}
	}

	function resetFilter() {
		if ($map) {
			$map.setFilter('cities-layer', null);
			$map.setFilter('cities-labels', null);
		}
	}

	const data = [
		{
			id: 1,
			name: 'Report released',
			toggleValue: 'reportReleased',
			question: 'Has the city released a report on reparations?'
		},
		{
			id: 2,
			name: 'Funding approved',
			toggleValue: 'fundingApproved',
			question: 'Has the city approved reparations funding?'
		},
		{
			id: 3,
			name: 'Funding source',
			toggleValue: 'fundingSource',
			question: 'Has the city decided where funding will come from?'
		},
		{
			id: 4,
			name: 'Allocation started',
			toggleValue: 'allocationStarted',
			question: 'Has the city begun allocating reparations?'
		},
		{
			id: 5,
			name: 'Direct payments',
			toggleValue: 'directPayments',
			question: 'Has the city determined if direct payments will be included?'
		},
		{
			id: 6,
			name: 'Eligibility determined',
			toggleValue: 'eligibility',
			question: 'Has the city determined who is eligible to receive direct payments?'
		}
	];
</script>

{#each data as { name, toggleValue, question }}
	<div class="single-toggle-container">
		<label for={toggleValue} class="toggle">
			<input
				id={toggleValue}
				type="checkbox"
				bind:group={questionToggle}
				value={question}
				on:change={() => {
					if (questionToggle.length) {
						toggleFilter(questionToggle);
					} else {
						resetFilter();
					}
				}}
			/>
			<span class="switch"></span>
		</label>
		<span class="toggle-text">{name}</span>
	</div>
{/each}

<style>
	.single-toggle-container {
		display: flex;
		column-gap: 3px;
	}

	.toggle-text {
		font-family: 'Barlow Condensed', sans-serif;
		margin-left: 0.2rem;
		font-size: 0.9rem;
		font-weight: 500;
	}

	input[type='checkbox'] {
		visibility: hidden;
		width: 0;
		height: 0;
	}

	.toggle {
		position: relative;
		display: inline-block;
		width: 34px;
		height: 20px;
	}

	.switch {
		position: absolute;
		content: '';
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #dbdada; /* #ccc; */
		border-radius: 20px;
		-webkit-transition: 0.3s;
		transition: 0.3s;
		cursor: pointer;
		border: 0.5px solid #333;
	}

	.switch:before {
		position: absolute;
		content: '';
		height: 14px;
		width: 14px;
		top: 2px;
		left: 3px;
		background-color: #fff;
		border: 0.5px solid #333;
		-webkit-transition: 0.4s;
		transition: 0.3s;
		border-radius: 50%;
	}

	input:checked + .switch {
		background-color: var(--green); /* #40679e; */
	}

	input:checked + .switch:before {
		-webkit-transform: translateX(12px);
		-ms-transform: translateX(12px);
		transform: translateX(12px);
	}
</style>
