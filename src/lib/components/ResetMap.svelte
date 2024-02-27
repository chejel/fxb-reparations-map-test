<script>
	import { map } from '$lib/stores.js';
</script>

<button
	class="reset-map"
	on:click|stopPropagation={() => {
		$map.flyTo({
			center: [-95.7, 38.1],
			essential: true, // "this animation is considered essential with respect to prefers-reduced-motion"
			zoom: 3.75
		});

		// Add contiguous US bounding box
		// $map.fitBounds([
		// 	[-125, 23], // SW corner
		// 	[-66.7, 51.5] // NE corner
		// ]);
	}}><slot /></button
>

<style>
	button.reset-map {
		background-color: rgba(243, 185, 95, 0.9);
		border: 1px solid #f5a64c;
		cursor: pointer;
		color: #333;
		padding: 0.45rem 0.75rem;
		border-radius: 2px;
		font-size: 0.9rem;
		font-weight: 700;
		text-transform: uppercase;
	}
</style>
