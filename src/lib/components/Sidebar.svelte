<script>
	// Import icon components
	import CloseIcon from '$lib/components/icons/Close.svelte';

	// Sidebar components
	import PanelBtns from '$lib/components/panels/PanelBtns.svelte';
	import AboutPanel from '$lib/components/panels/About.svelte';
	import PlacesPanel from '$lib/components/panels/Places.svelte';

	// Import stores
	import { aboutPanelVisible, listPanelVisible } from '$lib/stores.js';

	// Set state of sidebar
	export let sidebarVisible;
</script>

<!-- Header -->
<header>
	<h1>Black Reparations Map</h1>
	<p class="subheader">Where the Conversations Have Started</p>
</header>

<!-- About + Places buttons -->
<!-- <PanelBtns bind:aboutPanelVisible bind:listPanelVisible /> -->
<PanelBtns />

<!-- Body -->
<div class="panel-body">
	{#if $aboutPanelVisible}
		<AboutPanel />
	{:else if $listPanelVisible}
		<PlacesPanel />
	{/if}
</div>

<!-- Close button -->
<button
	class="close-button"
	aria-label="Close"
	on:click|stopPropagation={() => {
		sidebarVisible = false;
	}}><CloseIcon /></button
>

<style>
	header {
		/* box-shadow: inset 0px -4px 66px rgba(0, 0, 0, 0.1); */
		background: #02aab0; /* fallback for old browsers */
		background: -webkit-linear-gradient(to top, #00cdac, #02aab0); /* Chrome 10-25, Safari 5.1-6 */
		background: linear-gradient(
			to top,
			#00cdac,
			#02aab0
		); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

		background: #2193b0; /* fallback for old browsers */
		background: -webkit-linear-gradient(to top, #6dd5ed, #2193b0); /* Chrome 10-25, Safari 5.1-6 */
		background: linear-gradient(
			to top,
			#6dd5ed,
			#2193b0
		); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

		background: #ff7e5f; /* fallback for old browsers */
		background: -webkit-linear-gradient(to top, #feb47b, #ff7e5f); /* Chrome 10-25, Safari 5.1-6 */
		background: linear-gradient(
			to top,
			#feb47b,
			#ff7e5f
		); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

		background: #ffb347; /* fallback for old browsers */
		background: -webkit-linear-gradient(to top, #ffcc33, #ffb347); /* Chrome 10-25, Safari 5.1-6 */
		background: linear-gradient(
			to top,
			#ffcc33,
			#ffb347
		); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

		padding: 1rem;
	}

	.subheader {
		font-family: 'Barlow', sans-serif;
		font-size: 1.2rem;
	}

	.panel-body {
		padding: 1rem;
		/* background-color: rgba(252, 231, 204, 0.5); */
		background-color: rgba(236, 194, 122, 0.2);
	}

	.close-button {
		position: absolute;
		top: 4px;
		right: 4px;
		background-color: transparent;
		border: 0;
		cursor: pointer;
		z-index: 100;
	}
</style>
