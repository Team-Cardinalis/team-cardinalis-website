import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Home page doesn't need server-side data
	// All functionality is client-side
	return {};
};
