import fs from 'fs';
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const API_KEY = process.env.AIRTABLE_API_KEY;
const BASE_ID = process.env.AIRTABLE_BASE_ID || process.env.BASE_ID;
const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || process.env.TABLE_NAME;

async function fetchData() {
	const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;
	const params = {
		view: 'Internal view for mapping'
	};

	const res = await axios.get(url, {
		headers: { Authorization: `Bearer ${API_KEY}` },
		params
	});

	// Define fields to exclude from public data
	const EXCLUDED_FIELDS = ['Last Modified'];

	// Function to filter out excluded fields
	function filterFields(fields) {
		const filtered = {};
		for (const [key, value] of Object.entries(fields)) {
			if (!EXCLUDED_FIELDS.includes(key)) {
				filtered[key] = value;
			}
		}
		return filtered;
	}

	// Transform data to match the API server format (GeoJSON)
	const geojson = {
		type: 'FeatureCollection',
		features: res.data.records
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
				properties: filterFields(r.fields) // Apply field filtering here
			}))
	};

	fs.writeFileSync('static/mapdata.json', JSON.stringify(geojson, null, 2));
	//console.log('Airtable data fetched and saved to mapdata.json');
}

fetchData().catch(() => {
	//console.error('Error fetching data from Airtable:', err.message);
	process.exit(1);
});
