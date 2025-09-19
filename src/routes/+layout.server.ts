import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url }) => {
	// Server-side layout load
	// We can't access Firebase auth on server side, so we'll let client handle it
	// This prevents SSR errors when accessing user stores
	
	return {
		// No server-side data needed
		// All authentication and data loading happens client-side
		url: url.pathname
	};
};
