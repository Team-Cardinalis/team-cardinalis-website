import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Auth pages don't need server-side data
	// Authentication is handled client-side
	return {};
};
