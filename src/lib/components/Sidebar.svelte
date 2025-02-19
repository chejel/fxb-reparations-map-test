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
	<div class="header-title">
		<h1>Black Reparations Map</h1>
		<p class="subheader">Where the Conversations Have Started</p>
	</div>

	<!-- About + Places buttons -->
	<PanelBtns />
</header>

<!-- Body -->
{#if $aboutPanelVisible}
	<main class="panel-body panel-about" in:fade>
		<AboutPanel />
	</main>
{:else if $listPanelVisible}
	<main class="panel-body panel-list" in:fade>
		<PlacesPanel />
	</main>
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
		/* Source: https://uigradients.com */
		background: #ffb347; /* older browsers */
		background: -webkit-linear-gradient(to top, #f4d948, #ffb347); /* Chrome 10-25, Safari 5.1-6 */
		background: linear-gradient(
			to top,
			#f4d948,
			/* #ffd23f, #ffcc33 */ #ffb347
		); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
	}

	.header-title {
		padding: 1rem 1rem 0.5rem;
	}

	.subheader {
		font-family: 'Outfit', sans-serif;
		font-size: 1rem;
	}

	.panel-body {
		padding: 1rem;
		background-color: rgb(var(--beige), 1);
		max-height: calc(100svh - 2rem);
	}

	.panel-about {
		overflow-y: auto;
	}

	.panel-list {
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
