import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		title: 'Privacy Policy - Team Cardinalis',
		description: 'Privacy policy and personal data protection in accordance with GDPR'
	};
};
