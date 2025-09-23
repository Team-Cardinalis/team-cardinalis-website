import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: { 
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false,
			strict: false
		}),
		alias: {
			$lib: 'src/lib'
		},
		// Configuration for static deployment
		paths: {
			base: '',
			relative: false
		},
		// Force prerendering for all pages
		prerender: {
			handleHttpError: 'warn',
			entries: ['*']
		}
	}
};

export default config;
