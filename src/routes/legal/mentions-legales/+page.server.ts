import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		title: 'Legal Notice - Team Cardinalis',
		description: 'Legal notice of the Team Cardinalis website in accordance with LCEN law'
	};
};
