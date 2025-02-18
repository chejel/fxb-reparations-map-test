<script>
	export let geoType;
	export let text;
</script>

<div class="legend-item">
	<svg width="15" height="15" xmlns="http://www.w3.org/2000/svg">
		<!-- City -->
		{#if geoType === 'city'}
			<circle r="5" cx="8" cy="8" stroke="white" stroke-width="1.5" fill="rgba(var(--red), 1)" />

			<!-- County -->
		{:else if geoType == 'county'}
			<rect
				width="12"
				height="12"
				x="2"
				y="2"
				stroke="rgba(var(--dark-green), 1)"
				stroke-width="1"
				fill="rgba(var(--dark-green), 0.75)"
			/>

			<!-- State -->
		{:else}
			<rect
				width="12"
				height="12"
				x="2"
				y="2"
				stroke="rgba(var(--dark-green), 1)"
				stroke-width="1"
				fill="rgba(var(--green), 0.25)"
			/>
		{/if}
	</svg>
	{text}
</div>

<style>
	.legend-item {
		display: flex;
		align-items: center;
		gap: 6px;
		font-family: 'Barlow', sans-serif;
		font-weight: 500;
	}
</style>
