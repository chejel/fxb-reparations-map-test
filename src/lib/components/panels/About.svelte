<script>
	// Import components
	import Stats from '$lib/components/panels/Stats.svelte';

	// Import icon components
	import StatsIcon from '$lib/components/icons/Stats.svelte';

	// Import stores
	import { reparationsData } from '$lib/stores.js';
</script>

<section class="introduction">
	<p>
		Viverra aliquet eget sit amet tellus cras adipiscing. Nullam ac tortor vitae purus. Mauris
		rhoncus aenean vel elit. Et tortor consequat id porta nibh venenatis. Et magnis dis parturient
		montes nascetur ridiculus mus. Dictumst quisque sagittis purus sit. Eget arcu dictum varius
		duis.
	</p>
</section>
{#if $reparationsData}
	<section class="card">
		<p class="card-header"><StatsIcon /> Represented</p>
		<!-- <hr /> -->
		<div class="stats-table">
			<Stats />
		</div>
	</section>
{/if}

<style>
	.card-header {
		font-family: 'Barlow Condensed', sans-serif;
		font-size: 1rem;
		text-transform: uppercase;
		font-weight: 600;
		background-color: rgba(234, 230, 230, 0.7);
		padding: 0.6rem 0.75rem;
		display: flex;
		gap: 5px;
	}

	.stats-table {
		/* margin-top: 0.5rem; */
		padding: 0.5rem 0.75rem;
	}

	/* hr {
		border-top: 1px solid rgba(45, 45, 45, 0.35);
	} */
</style>
