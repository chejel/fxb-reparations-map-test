import { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME } from '$env/static/private';
import Airtable from 'airtable';

export async function GET() {
	try {
		const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
		const records = await base(AIRTABLE_TABLE_NAME)
			.select({ view: 'Internal view for mapping' })
			.all();
		const geojson = {
			type: 'FeatureCollection',
			features: records
				.filter((r) => r.fields['Location'] && r.fields['Geography'] && r.fields['State'])
				.map((r) => ({
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: [+r.fields['Longitude'], +r.fields['Latitude']]
					},
					properties: {
						...r.fields
					}
				}))
		};

		return new Response(JSON.stringify(geojson), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		return new Response(
			JSON.stringify({
				error: 'Failed to fetch data',
				message: err.message
			}),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}
}
