import { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME } from '$env/static/private';
import Airtable from 'airtable';
import { error } from '@sveltejs/kit';

export async function load() {
	const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

	const data = [];

	try {
		const airtablePromise = base(AIRTABLE_TABLE_NAME)
			.select({
				view: 'Internal view for mapping'
			})
			.eachPage(function page(records, fetchNextPage) {
				records.forEach(function (record) {
					data.push(record.fields);
				});

				fetchNextPage();
			});

		await airtablePromise;
	} catch (err) {
		throw error(
			err.statusCode,
			`Something went wrong with the data.`
			// `${err.error}: ${err.message}`
		);
	}

	return {
		airtableRecords: data
	};
}
