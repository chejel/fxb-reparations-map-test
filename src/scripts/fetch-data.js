import fs from 'fs';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.AIRTABLE_API_KEY;
const BASE_ID = process.env.AIRTABLE_BASE_ID || process.env.BASE_ID;
const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || process.env.TABLE_NAME;

async function fetchData() {
	const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;
	const params = {
		view: 'Internal view for mapping'
	};

	const { data } = await axios.get(url, {
		headers: { Authorization: `Bearer ${API_KEY}` },
		params
	});

	const records = data.records;

	const EXCLUDED_FIELDS = ['Last Modified'];

	// Filter out excluded fields
	function filterFields(fields) {
		const filtered = {};
		for (const [key, value] of Object.entries(fields)) {
			if (!EXCLUDED_FIELDS.includes(key)) {
				filtered[key] = value;
			}
		}
		return filtered;
	}

	const geojson = {
		type: 'FeatureCollection',
		lastUpdated: new Date().toISOString(),
		totalRecords: records.filter(
			(r) =>
				r.fields['Location'] &&
				r.fields['Geography'] &&
				r.fields['State'] &&
				r.fields['Status'] === 'Verified'
		).length,
		features: records
			.filter(
				(r) =>
					r.fields['Location'] &&
					r.fields['Geography'] &&
					r.fields['State'] &&
					r.fields['Status'] === 'Verified'
			)
			.map((r) => ({
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [+r.fields['Longitude'], +r.fields['Latitude']]
				},
				properties: filterFields(r.fields)
			}))
	};

	fs.writeFileSync('static/mapdata.json', JSON.stringify(geojson, null, 2));
	console.log('✅ Airtable data fetched and saved to mapdata.json');
	console.log(`Fetched ${geojson.features.length} records at ${geojson.lastUpdated}`);
}

fetchData().catch((err) => {
	console.error('❌ Error fetching data from Airtable:', err.message);
	process.exit(1);
});
