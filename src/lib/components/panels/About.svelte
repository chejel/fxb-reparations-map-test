<script>
	// Import components
	import Stats from '$lib/components/panels/Stats.svelte';
	// import Legend from '$lib/components/panels/Legend.svelte';
	import MapMarkerIcon from '$lib/components/icons/MapMarker.svelte';

	// Import icon components
	import MarkerIcon from '$lib/components/icons/MapMarker.svelte';
	import StatsIcon from '$lib/components/icons/Stats.svelte';

	// Import stores
	import { reparationsCityData } from '$lib/stores.js';
</script>

<!-- Intro text -->
<section aria-label="Introduction" class="introduction">
	<div class="about">
		<p>
			The FXB Center’s <strong>National Black Reparations Map</strong> is an interactive tool that
			tracks the progress of reparation conversations, i.e., research, policy development, and
			enactment of reparations policy at the state, city, and local county level across the United
			States. Reparations for the African American community seek redress for slavery, redlining,
			mass incarceration, and other anti-black policies in the United States. Our research focuses
			on
			<a href="/" target="_blank"><strong>Making the Health Case for Reparations</strong></a>, and
			this map supports that work by tracking where reparations are being passed to address health
			disparities within the Black American community.
		</p>

		<p>
			The <a href="https://airtable.com/appVAaDUbHug6JBVT/shrc7vnOjje5jmgBF" target="_blank"
				><strong>Black Reparations Directory</strong></a
			> also accompanies the interactive map where you can find more information and links to the reparations
			work happening within state, city, and local governments.
		</p>

		<p>This project was made possible through funding from the Robert Wood Johnson Foundation.</p>

		<div
			style="background-color: rgba(var(--gray), 0.5); padding: 0.6rem 0.75rem; font-size: 0.8rem; border-radius: 1px;"
		>
			To add a location to the map, please <a
				href="https://airtable.com/appVAaDUbHug6JBVT/shrsYhYfRAMFTt9Cw"
				target="_blank"><strong>complete this submission form</strong></a
			>. Once approved, it will be added to the map and directory.
		</div>
	</div>
	<!-- <hr /> -->
	<div class="directions">
		<span class="card-header" style="background-color: transparent; padding: 0;"
			><MapMarkerIcon />Directions</span
		>
		<hr />
		<ul style="padding-left: 1rem;">
			<li>
				Select a <span style="color: rgba(var(--red), 1); font-weight: 700;">city</span>,
				<span style="color: rgba(var(--dark-green), 0.75); font-weight: 700;">county</span> or
				<span style="color: rgba(var(--green), 1); font-weight: 700;">state</span>
				on the map to see more information about reparations efforts at the location.
			</li>
			<li>
				Zoom in or double click on the map to see any geographic names that do not initially appear.
			</li>
			<li>
				To see a list of all the locations represented on the map, select the <span
					style="font-family: 'Barlow Condensed', sans-serif; text-transform: uppercase; font-weight: 500; background-color: rgba(var(--light-gray), 1); padding: 0px 5px; border-radius: 1px; border: 0.5px solid rgba(var(--black), 1);"
					>List of Locations</span
				>
				tab above.
			</li>
		</ul>
	</div>
</section>

<section aria-label="Legend and data stats">
	<!-- Stats card -->
	{#if $reparationsCityData}
		<div class="card">
			<!-- header -->
			<p class="card-header"><StatsIcon /> Locations Represented</p>

			<!-- stats -->
			<div class="stats-table">
				<Stats />
			</div>
		</div>
	{/if}
</section>

<style>
	.about > p {
		margin-bottom: 0.75rem;
	}

	.about,
	.card {
		margin: 1rem;
	}

	.directions {
		padding: 1rem;
		margin-top: 2rem;
		margin-bottom: 2rem;
		background-color: rgba(var(--white), 0.75);
	}

	.directions > ul {
		list-style-position: outside;
		padding-left: 0.5rem;
	}

	.directions > ul > li {
		margin: 5px;
	}

	/* stats */
	.card-header {
		font-family: 'Barlow Condensed', sans-serif;
		font-size: 1rem;
		text-transform: uppercase;
		font-weight: 600;
		background-color: rgba(var(--gray), 0.35);
		padding: 0.6rem 0.75rem;
		display: flex;
		gap: 5px;
	}

	.stats-table {
		/* margin-top: 0.5rem; */
		padding: 0.5rem 0.75rem;
	}
</style>
