import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Page careers is publicly accessible - no authentication required
	return {
		title: 'Careers - Team Cardinalis',
		description: 'Join Team Cardinalis and be part of the future of competitive esports. Explore career opportunities in professional gaming, coaching, content creation, and more.'
	};
};
