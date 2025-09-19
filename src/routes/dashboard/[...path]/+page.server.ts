import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	// This will catch any unmatched routes under /dashboard/
	// and return a 404 error
	throw error(404, {
		message: `Dashboard page "${params.path}" not found. Available pages: propose, proposals, applications, final-votes, apply, account`
	});
};
