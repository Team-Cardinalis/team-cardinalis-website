import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Game pages don't need server-side data
	// All functionality is client-side
	return {};
};
