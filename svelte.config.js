import adapter from '@sveltejs/adapter-static';

export default {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: null,
			precompress: false,
			strict: false
		}),
		paths: {
			base: '/fxb-rwjf-reparations-efforts-map'
		}
	}
};
