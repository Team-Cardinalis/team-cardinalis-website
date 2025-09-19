import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { auth } from '../firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';

export const user = writable<User | null>(null);
export const isLoading = writable<boolean>(true);

// Initialize auth state listener only on client side
if (browser) {
	onAuthStateChanged(auth, (userData) => {
		user.set(userData);
		isLoading.set(false);
	});
} else {
	// On server side, set loading to false immediately and user to null
	user.set(null);
	isLoading.set(false);
}
