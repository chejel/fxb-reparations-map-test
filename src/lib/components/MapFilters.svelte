<script>
	// Stores
	import { map } from '$lib/stores.js';

	// Set variables for toggle
	let questionToggle;

	function toggleFilter(question) {
		$map.setFilter('cities-layer', filterQuestions(question));
		$map.setFilter('cities-labels', filterQuestions(question));

		function filterQuestions(questions) {
			const words = ['Yes', 'but']; // search for multiple words in the response field
			const quesArrItems = questions.map((question) => {
				const conditions = words.map((word) => ['in', word, ['string', ['get', question]]]);
				return ['any'].concat(conditions);
			});
			return ['all'].concat(quesArrItems);
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
			question: 'Has the location released a report on reparations?'
		},
		{
			id: 2,
			name: 'Funding approved',
			toggleValue: 'fundingApproved',
			question: 'Has the location approved reparations funding?'
		},
		{
			id: 3,
			name: 'Funding source',
			toggleValue: 'fundingSource',
			question: 'What is the potential funding source?'
		},
		{
			id: 4,
			name: 'Allocation started',
			toggleValue: 'allocationStarted',
			question: 'Has the location begun allocating reparations?'
		},
		{
			id: 5,
			name: 'Direct payments',
			toggleValue: 'directPayments',
			question: 'Has the location determined if direct payments will be included?'
		},
		{
			id: 6,
			name: 'Eligibility determined',
			toggleValue: 'eligibility',
			question: 'Has the location determined who is eligible to receive direct payments?'
		},
		{
			id: 7,
			name: 'Health addressed',
			toggleValue: 'health',
			question: 'Is any of the funding addressing health?'
		}
	];

	import { slide } from 'svelte/transition';
	let isOpen = false;
</script>

<!-- accordion -->
<details bind:open={isOpen}>
	<summary>Filter cities</summary>
	{#if isOpen}
		<div in:slide out:slide>
			{#each data as { name, toggleValue, question }}
				<div class="single-toggle-container">
					<!-- Toggle switch based on https://www.w3.org/WAI/ARIA/apg/patterns/switch/examples/switch-checkbox/ -->
					<label
						for={toggleValue}
						class="toggle"
						aria-label={questionToggle
							? questionToggle.includes(question)
								? `Hide cities with ${toggleValue}`
								: `Show cities with ${toggleValue}`
							: `Show cities with ${toggleValue}`}
					>
						<input
							type="checkbox"
							role="switch"
							id={toggleValue}
							bind:group={questionToggle}
							value={question}
							on:change={() => {
								if (questionToggle.length) {
									toggleFilter(questionToggle);
								} else {
									resetFilter();
								}
							}}
						/><span class="toggle-state">
							<span class="toggle-container">
								<span class="text" aria-hidden="true"
									>{#if questionToggle?.includes(question)}On
									{:else}Off{/if}</span
								>
								<span class="switch"></span>
							</span>
							<span class="toggle-text">{name}</span>
						</span></label
					>
				</div>
			{/each}
		</div>
	{/if}
</details>

<style>
	.single-toggle-container {
		padding: 0.1rem 0;
	}
	label {
		/* display: block; */
		padding: 4px 4px 6px 6px; /* prevents jumping */
		border: 0 solid rgba(71, 147, 175, 0.75);
		/* border-radius: 5px; */
		cursor: pointer;
		/* font-family: 'Roboto Condensed', 'sans-serif;'; */
		font-family: 'Barlow Condensed', sans-serif;
	}

	label:focus-within {
		padding: 2px 2px 4px 4px;
		border-width: 2px;
		border-radius: 10px;
	}

	.toggle-text {
		margin-left: 3px;
		margin-right: 5px;
		font-size: 0.8rem;
		font-weight: 500;
	}
	/* .toggle-state {
		display: flex;
		align-items: center;
		column-gap: 4px;
	} */

	/* checkbox */
	input[role='switch'] {
		width: 0;
		height: 0;
	}

	/* toggle-container */
	label input[role='switch'] ~ .toggle-state > .toggle-container {
		position: relative;
		top: 0px;
		display: inline-block;
		border: 0.75px solid #333;
		background-color: #dbdada;
		width: 40px;
		height: 21px;
		border-radius: 10px;
	}

	/* toggle-container when switch checked */
	label input[role='switch']:checked ~ .toggle-state > .toggle-container {
		background-color: var(--yellow);
	}

	/* switch */
	label input[role='switch'] ~ .toggle-state > .toggle-container > .switch {
		position: relative;
		top: 2.5px;
		left: 2px;
		display: inline-block;
		border: 0.75px solid #333;
		border-radius: 9px;
		width: 15px;
		height: 15px;
		background: white;
		-webkit-transition: 0.4s;
		transition: 0.4s;
	}

	/* switch checked, circle shifts */
	label input[role='switch']:checked ~ .toggle-state > .toggle-container > .switch {
		left: 22px;
	}

	/* switch's on/off label */
	label input[role='switch'] ~ .toggle-state > .toggle-container > .text {
		font-size: 0.7rem;
		text-transform: uppercase;
		position: absolute;
		top: 3px;
		/* left: auto;
		right: 3px; */
	}

	/* switch on/off label when not checked/off */
	label input[role='switch'] ~ .toggle-state > .toggle-container > .text {
		left: auto;
		right: 3px;
	}

	/* switch on/off label when checked/on */
	label input[role='switch']:checked ~ .toggle-state > .toggle-container > .text {
		left: 5px;
		right: auto;
		color: var(--white);
	}

	/* input:checked + .switch:before {
		-webkit-transform: translateX(12px);
		-ms-transform: translateX(12px);
		transform: translateX(12px);
	} */

	/* accordion */
	/* accordion styles from https://css-tricks.com/how-to-animate-the-details-element/ */
	details {
		box-sizing: border-box;
		background-color: var(--alice-blue-light);
		width: 160px;
	}

	details > summary {
		padding: 0.5rem;
		background-color: var(--blue-gray);
		font-weight: 600;
		cursor: pointer;
		font-family: 'Barlow Condensed', sans-serif;
		font-size: 1rem;
		text-transform: uppercase;
	}

	/* space between arrow and text */
	summary::before {
		content: '\2008';
	}

	/* style arrow marker */
	summary::-webkit-details-marker {
		color: var(--red);
	}
	summary::marker {
		color: var(--red);
	}
	/* 
	details[open] > summary:before {
		transform: rotate(90deg);
	} */

	/* details > .content {
		font-size: 0.8rem;
		padding: 0.75rem;
	} */
</style>
