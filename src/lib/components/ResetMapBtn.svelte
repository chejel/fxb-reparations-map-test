<script>
	import { map } from '$lib/stores.js';
	export let centerMapPt;
</script>

<button
	class="reset-map"
	on:click|stopPropagation={() => {
		$map.flyTo({
			center: [centerMapPt.lng, centerMapPt.lat],
			essential: true, // "this animation is considered essential with respect to prefers-reduced-motion"
			zoom: 3.75,
			pitch: 0,
			speed: 1,
			curve: 1
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
		border: 1px solid rgba(199, 127, 127, 1);
		padding: 5px 6px;
		border-radius: 4px;
		font-size: 0.9rem;
		font-weight: 700;
		text-transform: uppercase;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 30px;
		height: 30px;
		box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.15);
		margin-left: auto;
	}
</style>
