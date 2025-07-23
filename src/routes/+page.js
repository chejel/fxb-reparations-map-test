export const prerender = true;
export const ssr = false;

export async function load({ fetch }) {
	try {
		// Try relative path first
		const response = await fetch('./mapdata.json');

		if (!response.ok) {
			const text = await response.text();
			throw new Error(`HTTP ${response.status}: ${text}`);
		}

		const data = await response.json();

		return { data };
	} catch (error) {
		// console.error('Failed to load data:', error);
		return { data: { type: 'FeatureCollection', features: [] } };
	}
}
