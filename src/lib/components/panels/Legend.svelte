<script>
	export let geoType;
	export let text;
</script>

<div class="legend-item">
	<svg width="15" height="15" xmlns="http://www.w3.org/2000/svg">
		{#if geoType === 'city'}
			<circle r="5" cx="8" cy="8" stroke="white" stroke-width="1.5" fill="var(--red)" />
		{:else}
			<rect
				width="12"
				height="12"
				x="2"
				y="2"
				stroke="#2b4518"
				stroke-width="1"
				fill="rgba(120, 148, 97, 0.15)"
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
		font-family: 'Barlow Condensed', sans-serif;
		font-weight: 500;
	}
</style>
