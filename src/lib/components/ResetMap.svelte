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
		background-color: #fff;
		/* border: 1px solid #f5a64c; */
		border: 1px solid rgb(199, 127, 127);
		padding: 5px 6px;
		border-radius: 4px;
		font-size: 0.9rem;
		font-weight: 700;
		text-transform: uppercase;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 29px;
		height: 29px;
		box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.15);
	}
</style>
