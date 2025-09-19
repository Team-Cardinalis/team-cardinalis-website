// Protected routes configuration
export const protectedRoutes = [
	'/dashboard/votes',
	'/dashboard/propose',
	'/dashboard/proposals',
	'/dashboard/final-votes',
	'/dashboard/account',
	'/dashboard/apply',
	'/dashboard/applications'
];

// Routes that require authentication
export const authRequiredRoutes = [
	'/dashboard'
];

// Check if a route requires authentication
export function isProtectedRoute(pathname: string): boolean {
	return protectedRoutes.some(route => pathname.startsWith(route)) ||
		   authRequiredRoutes.some(route => pathname.startsWith(route));
}

// Get default redirect route
export function getDefaultRedirectRoute(): string {
	return '/auth/login';
}
