import { database } from '../firebase';
import { ref, push, set, get, update, remove, onValue, off, type DatabaseReference, type DataSnapshot } from 'firebase/database';

/**
 * Custom Firebase error types
 */
export class FirebaseError extends Error {
	constructor(
		message: string,
		public readonly code: string,
		public readonly originalError?: unknown
	) {
		super(message);
		this.name = 'FirebaseError';
	}
}

/**
 * Firebase operation result with robust error handling
 */
export type FirebaseResult<T> = {
	success: true;
	data: T;
} | {
	success: false;
	error: FirebaseError;
};

/**
 * Configuration for Firebase queries
 */
export interface FirebaseQueryConfig {
	orderBy?: string;
	limitToLast?: number;
	equalTo?: string | number;
}

/**
 * Base Firebase service with robust error handling and common methods
 */
export abstract class BaseFirebaseService {
	protected readonly database = database;

	/**
	 * Creates a Firebase reference with error handling
	 */
	protected createRef(path: string): DatabaseReference {
		try {
			return ref(this.database, path);
		} catch (error) {
			throw new FirebaseError(
				`Failed to create reference for path: ${path}`,
				'REFERENCE_ERROR',
				error
			);
		}
	}

	/**
	 * Executes a Firebase operation with robust error handling
	 */
	protected async executeOperation<T>(
		operation: () => Promise<T>,
		operationName: string
	): Promise<FirebaseResult<T>> {
		try {
			const data = await operation();
			return { success: true, data };
		} catch (error: unknown) {
			const firebaseError = this.handleError(error, operationName);
			return { success: false, error: firebaseError };
		}
	}

	/**
	 * Handles Firebase errors consistently
	 */
	protected handleError(error: unknown, operationName: string): FirebaseError {
		if (error instanceof FirebaseError) {
			return error;
		}

		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		const errorCode = this.extractErrorCode(error);

		return new FirebaseError(
			`${operationName} failed: ${errorMessage}`,
			errorCode,
			error
		);
	}

	/**
	 * Extract Firebase error code
	 */
	private extractErrorCode(error: unknown): string {
		if (error && typeof error === 'object' && 'code' in error) {
			return String(error.code);
		}
		return 'UNKNOWN_ERROR';
	}

	/**
	 * Creates a new element in Firebase
	 */
	protected async createItem<T extends Record<string, unknown>>(
		path: string,
		data: Omit<T, 'id'>,
		generateId: boolean = true
	): Promise<FirebaseResult<string>> {
		return this.executeOperation(async () => {
			const ref = this.createRef(path);
			const newRef = generateId ? push(ref) : ref;
			const itemId = newRef.key || 'unknown';

			const itemData = {
				...data,
				id: itemId,
				createdAt: Date.now(),
				updatedAt: Date.now()
			} as unknown as T;

			await set(newRef, itemData);
			return itemId;
		}, 'createItem');
	}

	/**
	 * Retrieves an element by ID
	 */
	protected async getItemById<T>(path: string, id: string): Promise<FirebaseResult<T | null>> {
		return this.executeOperation(async () => {
			const itemRef = this.createRef(`${path}/${id}`);
			const snapshot = await get(itemRef);
			
			if (!snapshot.exists()) {
				return null;
			}

			return snapshot.val() as T;
		}, 'getItemById');
	}

	/**
	 * Retrieves all elements from a collection
	 */
	protected async getAllItems<T>(path: string): Promise<FirebaseResult<T[]>> {
		return this.executeOperation(async () => {
			const collectionRef = this.createRef(path);
			const snapshot = await get(collectionRef);
			
			if (!snapshot.exists()) {
				return [];
			}

			const items: T[] = [];
			snapshot.forEach((childSnapshot: DataSnapshot) => {
				items.push(childSnapshot.val() as T);
			});

			return items;
		}, 'getAllItems');
	}

	/**
	 * Updates an element
	 */
	protected async updateItem<T extends Record<string, unknown>>(
		path: string,
		id: string,
		updates: Partial<T>
	): Promise<FirebaseResult<void>> {
		return this.executeOperation(async () => {
			const itemRef = this.createRef(`${path}/${id}`);
			const updateData = {
				...updates,
				updatedAt: Date.now()
			};
			
			await update(itemRef, updateData);
		}, 'updateItem');
	}

	/**
	 * Deletes an element
	 */
	protected async deleteItem(path: string, id: string): Promise<FirebaseResult<void>> {
		return this.executeOperation(async () => {
			const itemRef = this.createRef(`${path}/${id}`);
			await remove(itemRef);
		}, 'deleteItem');
	}

	/**
	 * Listens to real-time changes
	 */
	protected onValueChange<T>(
		path: string,
		callback: (data: T[]) => void,
		config?: FirebaseQueryConfig
	): () => void {
		try {
			let queryRef = this.createRef(path);
			
			// Apply query configurations if necessary
			if (config) {
				// Note: Complex queries would require additional imports
				// For now, we use the base reference
			}

			const unsubscribe = onValue(queryRef, (snapshot: DataSnapshot) => {
				if (!snapshot.exists()) {
					callback([]);
					return;
				}

				const items: T[] = [];
				snapshot.forEach((childSnapshot: DataSnapshot) => {
					items.push(childSnapshot.val() as T);
				});

				callback(items);
			});

			return () => off(queryRef, 'value', unsubscribe);
		} catch (error) {
			return () => {}; // Return an empty function in case of error
		}
	}

	/**
	 * Checks if a user is authenticated
	 */
	protected async checkAuthentication(): Promise<FirebaseResult<string>> {
		return this.executeOperation(async () => {
			const { auth } = await import('../firebase');
			if (!auth.currentUser) {
				throw new FirebaseError('User not authenticated', 'AUTH_REQUIRED');
			}
			return auth.currentUser.uid;
		}, 'checkAuthentication');
	}

	/**
	 * Tests Firebase connection
	 */
	protected async testConnection(): Promise<FirebaseResult<boolean>> {
		return this.executeOperation(async () => {
			const testRef = this.createRef('test');
			await get(testRef);
			return true;
		}, 'testConnection');
	}
}
