import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	// This will catch any unmatched routes under /community/
	// and redirect to dashboard since community was renamed
	throw error(404, {
		message: `Community page "${params.path}" not found. The community section has been moved to the dashboard.`
	});
};
