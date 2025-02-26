<script>
	// Stores
	import { map } from '$lib/stores.js';

	// Set variables for toggle
	let questionToggle;

	// Layers to filter based on toggle selections
	const layers = [
		'city-markers-layer',
		'city-labels-layer',
		'county-fill-layer',
		'county-border-layer',
		'county-labels-layer',
		'state-fill-layer',
		'state-border-layer'
	];

	function toggleFilter(question) {
		const filter = filterQuestions(question);
		layers.forEach((layer) => $map.setFilter(layer, filter));
	}

	function filterQuestions(questions) {
		const words = ['Yes', 'but']; // search for multiple words in the response field
		const quesArrItems = questions.map((question) => {
			const conditions = words.map((word) => ['in', word, ['string', ['get', question]]]);
			return ['any'].concat(conditions);
		});
		return ['all'].concat(quesArrItems);
	}

	function resetFilter() {
		if ($map) {
			layers.forEach((layer) => $map.setFilter(layer, null));
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

	// Transition effect for accordion
	import { slide } from 'svelte/transition';
	let isOpen = false;
</script>

<!-- accordion -->
<details bind:open={isOpen}>
	<summary>Filter locations</summary>
	{#if isOpen}
		<div class="content" in:slide={{ duration: 750 }}>
			<p
				style="font-family: 'Barlow', sans-serif; font-weight: 700; font-size: 0.75rem; line-height: 1.15;padding: 0 5px;"
			>
				Applying a filter will show all cities, counties and states that meet the criteria.
			</p>
			{#each data as { name, toggleValue, question }}
				<div class="single-toggle-switch">
					<!-- Toggle switch based on https://www.w3.org/WAI/ARIA/apg/patterns/switch/examples/switch-checkbox/ -->
					<label for={toggleValue} class="toggle">
						<input
							id={toggleValue}
							name={toggleValue}
							type="checkbox"
							role="switch"
							bind:group={questionToggle}
							value={question}
							on:change={() => {
								if (questionToggle.length) {
									toggleFilter(questionToggle);
								} else {
									resetFilter();
								}
							}}
						/><span class="toggle-container">
							<span class="toggle-switch">
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
	.single-toggle-switch {
		padding: 0 5px;
		margin-top: -7px;
	}

	label {
		/*padding: 0 6px; /* prevents jumping */
		/* border: 0 solid rgb(var(--blue), 0.75); */
		cursor: pointer;
		font-family: 'Barlow Condensed', sans-serif;
	}

	/* label:focus-within {
		padding: 4.5px 2px 4px 4px;
		border-width: 2px;
		border-radius: 10px;
	} */

	/* checkbox */
	input[role='switch'] {
		width: 0;
		height: 0;
	}

	.toggle-container {
		display: flex;
		align-items: center; /* Aligns spans to a uniform height */
		column-gap: 2px; /* Adds spacing between elements */
		padding: 0px;
		width: fit-content;
	}

	/* toggle-switch */
	label input[role='switch'] ~ .toggle-container > .toggle-switch {
		position: relative;
		/* top: 1px; */
		display: inline-block;
		border: 1px solid gray;
		background-color: rgba(var(--gray), 0.65);
		width: 40px;
		height: 20px;
		border-radius: 10px;
	}

	/* toggle-switch when switch checked */
	label input[role='switch']:checked ~ .toggle-container > .toggle-switch {
		background-color: rgba(var(--black), 1);
		opacity: 0.75;
	}

	/* switch */
	label input[role='switch'] ~ .toggle-container > .toggle-switch > .switch {
		position: relative;
		top: 1.5px;
		left: 2px;
		display: inline-block;
		border: 0.75px solid rgba(var(--black), 1);
		border-radius: 9px;
		width: 15px;
		height: 15px;
		background: white;
		-webkit-transition: 0.4s;
		transition: 0.4s;
	}

	@media screen and (max-device-width: 480px) {
		label input[role='switch'] ~ .toggle-container > .toggle-switch {
			width: 42px;
			height: 24px;
			border-radius: 20px;
		}

		label input[role='switch'] ~ .toggle-container > .toggle-switch > .switch {
			top: 2.5px;
			width: 17px;
			height: 17px;
		}

		details {
			margin-bottom: 1rem;
		}
	}

	/* switch checked, circle shifts */
	label input[role='switch']:checked ~ .toggle-container > .toggle-switch > .switch {
		left: 20px;
	}

	/* switch's on/off label */
	label input[role='switch'] ~ .toggle-container > .toggle-switch > .text {
		font-size: 0.7rem;
		text-transform: uppercase;
		position: absolute;
		top: 2px;
	}

	/* switch on/off label when not checked/off */
	label input[role='switch'] ~ .toggle-container > .toggle-switch > .text {
		left: auto;
		right: 4px;
	}

	/* switch on/off label when checked/on */
	label input[role='switch']:checked ~ .toggle-container > .toggle-switch > .text {
		left: 5px;
		right: auto;
		color: white;
	}

	/* focus outline */
	label input[role='switch']:focus-visible ~ .toggle-container {
		outline: 2px solid rgba(var(--blue), 1);
		outline-offset: 2px;
	}

	/* question description */
	.toggle-text {
		margin: 0 5px 0 3px;
		font-size: 0.8rem;
		font-weight: 500;
	}

	/* accordion styles from https://css-tricks.com/how-to-animate-the-details-element/ */
	details {
		box-sizing: border-box;
		background-color: rgba(var(--white), 0.75);
		border: 0.75px solid rgba(var(--black), 1);
		border-radius: 3px;
		width: 195px;
		filter: drop-shadow(3px 3px 3px rgb(0.25 0.25 0.25 / 0.1));
	}

	details > summary {
		padding: 0.5rem;
		background-color: rgba(var(--red), 0.95);
		color: white;
		font-weight: 600;
		cursor: pointer;
		font-family: 'Barlow Condensed', sans-serif;
		font-size: 1rem;
		text-transform: uppercase;
		border-radius: 3px 3px 0 0;
	}

	/* space between arrow and text */
	summary::before {
		content: '\2008';
	}

	/* style arrow marker */
	summary::-webkit-details-marker {
		/* color: var(--red); */
		color: white;
	}
	summary::marker {
		/* color: var(--red); */
		color: white;
	}

	details > .content {
		padding: 0.35rem;
	}
</style>
