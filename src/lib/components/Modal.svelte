<script>
	export let isLandscapeMode;

	let dialog; // HTMLDialogElement

	$: if (dialog && isLandscapeMode) dialog.showModal();
</script>

<!-- Source: https://svelte.dev/examples/modal -->
<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog bind:this={dialog}>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div>
		<slot />
	</div>
</dialog>

<style>
	dialog {
		margin: auto;
		background-color: #333;
		color: white;
		border-radius: 3px;
		border: none;
		text-align: center;
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.4);
	}

	dialog > div {
		padding: 1rem;
	}
</style>
