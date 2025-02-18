<script>
	export let checked = false;
</script>

<label for="state-toggle" class="toggle">
	<input id="state-toggle" name="state-toggle" type="checkbox" bind:checked role="switch" />
	<span class="switch"></span>
</label>
<span class="toggle-text">Sort by State</span>

<style>
	.toggle-text {
		margin-left: 0.2rem;
		font-family: 'Barlow Condensed', sans-serif;
		text-transform: uppercase;
		font-size: 0.8rem;
	}

	input[type='checkbox'] {
		visibility: hidden;
		width: 0;
		height: 0;
	}

	.toggle {
		position: relative;
		display: inline-block;
		width: 34px;
		height: 20px;
	}

	.switch {
		position: absolute;
		content: '';
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(var(--gray), 1);
		border-radius: 20px;
		-webkit-transition: 0.3s;
		transition: 0.3s;
		cursor: pointer;
		border: 1px solid rgba(var(--white), 1);
	}

	.switch:before {
		position: absolute;
		content: '';
		height: 14px;
		width: 14px;
		top: 2px;
		left: 3px;
		background-color: rgba(var(--white), 1);
		-webkit-transition: 0.4s;
		transition: 0.3s;
		border-radius: 50%;
	}

	input:checked + .switch {
		background-color: rgba(var(--green), 1);
	}

	input:checked + .switch:before {
		-webkit-transform: translateX(12px);
		-ms-transform: translateX(12px);
		transform: translateX(12px);
	}
</style>
