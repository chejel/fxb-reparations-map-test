<script>
	// Import icon components
	import CloseIcon from '$lib/components/icons/Close.svelte';

	// Sidebar components
	import PanelBtns from '$lib/components/panels/PanelBtns.svelte';
	import AboutPanel from '$lib/components/panels/About.svelte';
	import PlacesPanel from '$lib/components/panels/PlacesBtnGrp.svelte';

	// Import stores
	import { aboutPanelVisible, listPanelVisible } from '$lib/stores.js';

	// Set state of sidebar
	export let sidebarVisible;

	// Import transition
	import { fade } from 'svelte/transition';
</script>

<!-- Header -->
<header>
	<h1>Black Reparations Map</h1>
	<p class="subheader">Where the Conversations Have Started</p>
</header>

<!-- About + Places buttons -->
<PanelBtns />

<!-- Body -->
{#if $aboutPanelVisible}
	<div class="panel-body" in:fade>
		<AboutPanel />
	</div>
{:else if $listPanelVisible}
	<div class="panel-body" in:fade>
		<PlacesPanel />
	</div>
{/if}

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
		padding: 1rem 1rem 0.5rem;

		/* Source: https://uigradients.com */
		background: #ffb347; /* older browsers */
		background: -webkit-linear-gradient(to top, #f4d948, #ffb347); /* Chrome 10-25, Safari 5.1-6 */
		background: linear-gradient(
			to top,
			#f4d948,
			/* #ffd23f, #ffcc33 */ #ffb347
		); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
	}

	.subheader {
		font-family: 'Outfit', sans-serif;
		font-size: 1rem;
	}

	.panel-body {
		padding: 1rem;
		/* background-color: rgba(252, 231, 204, 0.5); */
		/* background-color: rgba(236, 194, 122, 0.2); */
		background-color: rgba(251, 244, 226, 1);
		max-height: calc(100svh - 2rem);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	button.close-button {
		position: absolute;
		top: 4px;
		right: 4px;
		z-index: 100;
	}
</style>
