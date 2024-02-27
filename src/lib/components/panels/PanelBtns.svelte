<script>
	// Import icon components
	import InfoIcon from '$lib/components/icons/Info.svelte';
	import ListIcon from '$lib/components/icons/List.svelte';

	// Set props
	export let aboutPanelVisible;
	export let listPanelVisible;
</script>

<div class="btn-container">
	<button
		class:active={aboutPanelVisible}
		on:click={() => {
			aboutPanelVisible = true;
			listPanelVisible = false;
		}}><InfoIcon />About</button
	>
	<button
		class:active={listPanelVisible}
		on:click={() => {
			listPanelVisible = true;
			aboutPanelVisible = false;
		}}><ListIcon />Places</button
	>
	<button><ListIcon />Profiles</button>
</div>

<style>
	.btn-container {
		display: flex;
		border-bottom: 3px solid #eee;
		/* width: 100%; */
	}

	button {
		font-family: 'Barlow Condensed';
		background-color: #fff;
		color: black;
		font-size: 1.1rem;
		font-weight: 600;
		text-transform: uppercase;
		border: none;
		padding: 10px 0;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 5px;
		flex: 1 1 0px; /* make buttons equal width */
	}

	button:not(:last-child) {
		border-right: 1px solid #eee;
	}

	.active {
		/* background-color: #fefaf2; */
		box-shadow: inset 0px -3px 0px 0px #ffab4d;
		font-weight: 700;
		cursor: auto;
	}
</style>
