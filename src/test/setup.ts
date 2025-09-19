import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Firebase
vi.mock('firebase/auth', () => ({
	signInWithPopup: vi.fn(),
	signOut: vi.fn(),
	onAuthStateChanged: vi.fn(),
	getAuth: vi.fn(() => ({
		currentUser: null,
		onAuthStateChanged: vi.fn()
	})),
	GoogleAuthProvider: vi.fn()
}));

vi.mock('firebase/database', () => ({
	ref: vi.fn(),
	push: vi.fn(),
	set: vi.fn(),
	get: vi.fn(),
	update: vi.fn(),
	onValue: vi.fn(),
	off: vi.fn()
}));

vi.mock('firebase/app', () => ({
	initializeApp: vi.fn()
}));

// Mock SvelteKit stores
vi.mock('$app/stores', () => ({
	page: {
		subscribe: vi.fn(() => () => {}),
		url: new URL('http://localhost:3000')
	}
}));

vi.mock('$app/navigation', () => ({
	goto: vi.fn(),
	beforeNavigate: vi.fn(),
	afterNavigate: vi.fn()
}));

// Mock environment variables
Object.defineProperty(import.meta, 'env', {
	value: {
		DEV: false,
		PROD: true,
		MODE: 'test'
	}
});

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn()
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn()
}));
