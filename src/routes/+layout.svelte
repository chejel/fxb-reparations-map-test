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
		<p>Loading...</p>
		<div class="loader"></div>
	</div>
{:then}
	<slot />
{/await}

<style>
	.page-container {
		display: block;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 80vh;
	}

	p {
		margin: 8px;
	}

	/* loader */
	.loader {
		height: 20px;
		width: 20px;
		border-radius: 100%;
		border: 3px solid;
		border-color: #eee #eee rgb(255, 171, 77) #eee;
		animation: spin 2s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
