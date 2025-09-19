import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Applications page doesn't need server-side data
	// All functionality is client-side after authentication
	return {};
};
