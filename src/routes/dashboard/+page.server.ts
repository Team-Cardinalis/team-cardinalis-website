import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	// Dashboard requires authentication, but we can't check Firebase auth on server side
	// So we'll let the client-side AuthGuard handle the authentication check
	// This prevents server-side errors during SSR
	
	return {
		// No server-side data needed for dashboard
		// All data loading happens client-side after authentication
	};
};
