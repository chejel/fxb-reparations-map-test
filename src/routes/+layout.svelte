<script>
	// Import stylesheet
	import '../app.css';

	import { map, reparationsData } from '$lib/stores.js';

	// Create promise that resolves when map and data have loaded
	let dataLoaded = Promise.all([$map, $reparationsData]);
</script>

<svelte:head>
	<title>Black Reparations Map | FXB Center for Health & Human Rights</title>
	<!-- <meta property="og:title" content="Reparations Map" />
	<meta property="og:description" content="Interactive map of locations considering reparations in the U.S." />
	<meta property="og:url" content="" />
	<meta property="og:image" content="" />
	<meta property="og:site_name" content="Reparations Map" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Reparations Map" />
	<meta name="twitter:description" content="Interactive map of locations considering reparations in the U.S." />
	<meta name="twitter:site" content="" />
	<meta name="twitter:image" content="" />
	<meta name="twitter:creator" content="" /> -->
</svelte:head>

{#await dataLoaded}
	<div class="page-container">
		<div class="text-container">Loading...</div>
	</div>
{:then}
	<slot />
{/await}

<style>
	.page-container {
		display: block;
		height: 100vh;
	}
	.text-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 80vh;
	}
</style>
