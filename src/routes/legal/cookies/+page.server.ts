import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		title: 'Gestion des cookies - Team Cardinalis',
		description: 'Information sur l\'utilisation des cookies et traceurs sur le site Team Cardinalis'
	};
};
