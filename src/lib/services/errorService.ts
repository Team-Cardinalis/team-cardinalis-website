import { writable } from 'svelte/store';
import { FirebaseError } from './baseFirebaseService.js';

/**
 * Application error types
 */
export enum ErrorType {
	NETWORK = 'NETWORK_ERROR',
	AUTHENTICATION = 'AUTHENTICATION_ERROR',
	VALIDATION = 'VALIDATION_ERROR',
	FIREBASE = 'FIREBASE_ERROR',
	UNKNOWN = 'UNKNOWN_ERROR'
}

/**
 * Interface for application errors
 */
export interface AppError {
	type: ErrorType;
	message: string;
	code?: string;
	details?: unknown;
	timestamp: number;
	userId?: string;
}

/**
 * Global store for error management
 */
export const errorStore = writable<AppError[]>([]);

/**
 * Centralized error management service
 */
export class ErrorService {
	private static instance: ErrorService;
	private maxErrors = 50; // Limit of stored errors

	public static getInstance(): ErrorService {
		if (!ErrorService.instance) {
			ErrorService.instance = new ErrorService();
		}
		return ErrorService.instance;
	}

	/**
	 * Adds an error to the store
	 */
	addError(error: Omit<AppError, 'timestamp'>): void {
		const appError: AppError = {
			...error,
			timestamp: Date.now()
		};

		errorStore.update(errors => {
			const newErrors = [appError, ...errors].slice(0, this.maxErrors);
			return newErrors;
		});

		// Log to console in development
		if (import.meta.env.DEV) {
			console.error('Application Error:', appError);
		}
	}

	/**
	 * Converts a FirebaseError to AppError
	 */
	fromFirebaseError(firebaseError: FirebaseError, userId?: string): AppError {
		return {
			type: ErrorType.FIREBASE,
			message: firebaseError.message,
			code: firebaseError.code,
			details: firebaseError.originalError,
			timestamp: Date.now(),
			userId
		};
	}

	/**
	 * Converts a JavaScript Error to AppError
	 */
	fromJavaScriptError(error: Error, userId?: string): AppError {
		return {
			type: ErrorType.UNKNOWN,
			message: error.message,
			code: error.name,
			details: error.stack,
			timestamp: Date.now(),
			userId
		};
	}

	/**
	 * Creates a validation error
	 */
	createValidationError(message: string, details?: unknown): AppError {
		return {
			type: ErrorType.VALIDATION,
			message,
			details,
			timestamp: Date.now()
		};
	}

	/**
	 * Creates an authentication error
	 */
	createAuthError(message: string, userId?: string): AppError {
		return {
			type: ErrorType.AUTHENTICATION,
			message,
			timestamp: Date.now(),
			userId
		};
	}

	/**
	 * Creates a network error
	 */
	createNetworkError(message: string, details?: unknown): AppError {
		return {
			type: ErrorType.NETWORK,
			message,
			details,
			timestamp: Date.now()
		};
	}

	/**
	 * Removes an error by index
	 */
	removeError(index: number): void {
		errorStore.update(errors => {
			const newErrors = [...errors];
			newErrors.splice(index, 1);
			return newErrors;
		});
	}

	/**
	 * Removes all errors
	 */
	clearErrors(): void {
		errorStore.set([]);
	}

	/**
	 * Removes old errors (older than 24h)
	 */
	clearOldErrors(): void {
		const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
		
		errorStore.update(errors => 
			errors.filter(error => error.timestamp > oneDayAgo)
		);
	}

	/**
	 * Gets errors by type
	 */
	getErrorsByType(type: ErrorType): AppError[] {
		let errors: AppError[] = [];
		errorStore.subscribe(errorsList => {
			errors = errorsList.filter(error => error.type === type);
		})();
		return errors;
	}

	/**
	 * Gets recent errors (last 24h)
	 */
	getRecentErrors(): AppError[] {
		const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
		let errors: AppError[] = [];
		errorStore.subscribe(errorsList => {
			errors = errorsList.filter(error => error.timestamp > oneDayAgo);
		})();
		return errors;
	}

	/**
	 * Checks if there are critical errors
	 */
	hasCriticalErrors(): boolean {
		let hasCritical = false;
		errorStore.subscribe(errors => {
			hasCritical = errors.some(error => 
				error.type === ErrorType.AUTHENTICATION || 
				error.type === ErrorType.FIREBASE
			);
		})();
		return hasCritical;
	}
}

/**
 * Hook to use error service in components
 */
export function useErrorService() {
	const errorService = ErrorService.getInstance();
	
	return {
		addError: errorService.addError.bind(errorService),
		fromFirebaseError: errorService.fromFirebaseError.bind(errorService),
		fromJavaScriptError: errorService.fromJavaScriptError.bind(errorService),
		createValidationError: errorService.createValidationError.bind(errorService),
		createAuthError: errorService.createAuthError.bind(errorService),
		createNetworkError: errorService.createNetworkError.bind(errorService),
		removeError: errorService.removeError.bind(errorService),
		clearErrors: errorService.clearErrors.bind(errorService),
		clearOldErrors: errorService.clearOldErrors.bind(errorService),
		getErrorsByType: errorService.getErrorsByType.bind(errorService),
		getRecentErrors: errorService.getRecentErrors.bind(errorService),
		hasCriticalErrors: errorService.hasCriticalErrors.bind(errorService)
	};
}

/**
 * Utility function to handle errors in Svelte components
 */
export function handleAsyncError<T>(
	operation: () => Promise<T>,
	errorHandler?: (error: AppError) => void
): Promise<T | null> {
	return operation()
		.then(result => result)
		.catch(error => {
			const errorService = ErrorService.getInstance();
			let appError: AppError;

			if (error instanceof FirebaseError) {
				appError = errorService.fromFirebaseError(error);
			} else if (error instanceof Error) {
				appError = errorService.fromJavaScriptError(error);
			} else {
				appError = errorService.createValidationError(
					'An unexpected error occurred',
					error
				);
			}

			errorService.addError(appError);
			
			if (errorHandler) {
				errorHandler(appError);
			}

			return null;
		});
}
