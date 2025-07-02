export const prerender = true;

export async function load({ fetch }) {
	try {
		const response = await fetch('/fxb-rwjf-reparations-efforts-map/api');

		if (!response.ok) {
			const text = await response.text();
			throw new Error(`HTTP ${response.status}: ${text}`);
		}

		const data = await response.json();

		return { data };
	} catch (error) {
		return { data: { type: 'FeatureCollection', features: [] } };
	}
}
