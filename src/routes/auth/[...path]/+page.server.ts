import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	// This will catch any unmatched routes under /auth/
	// and return a 404 error
	throw error(404, {
		message: `Auth page "${params.path}" not found. Available pages: login`
	});
};
