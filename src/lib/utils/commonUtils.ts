/**
 * Common utilities for formats and validations
 */

import type { GameType } from '../types';

/**
 * Date and time formats
 */
export class DateFormatters {
	/**
	 * Formats a timestamp to readable date
	 */
	static formatDate(timestamp: number): string {
		return new Date(timestamp).toLocaleDateString('en-US', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	/**
	 * Calculates remaining time until a date
	 */
	static getTimeRemaining(endDate: number): string {
		const now = Date.now();
		const remaining = endDate - now;
		
		if (remaining <= 0) return 'Ended';
		
		const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
		const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
		
		if (days > 0) return `${days}d ${hours}h`;
		if (hours > 0) return `${hours}h ${minutes}m`;
		return `${minutes}m`;
	}

	/**
	 * Formats a relative timestamp (X time ago)
	 */
	static formatRelativeTime(timestamp: number): string {
		const now = Date.now();
		const diff = now - timestamp;
		
		if (diff < 60000) { // Less than 1 minute
			return 'Just now';
		} else if (diff < 3600000) { // Less than 1 hour
			const minutes = Math.floor(diff / 60000);
			return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
		} else if (diff < 86400000) { // Less than 1 day
			const hours = Math.floor(diff / 3600000);
			return `${hours} hour${hours > 1 ? 's' : ''} ago`;
		} else {
			return new Date(timestamp).toLocaleString('en-US');
		}
	}
}

/**
 * Form validators
 */
export class FormValidators {
	/**
	 * Validates that a field is not empty
	 */
	static required(value: string, fieldName: string): string | null {
		if (!value || !value.trim()) {
			return `${fieldName} is required`;
		}
		return null;
	}

	/**
	 * Validates minimum text length
	 */
	static minLength(value: string, minLength: number, fieldName: string): string | null {
		if (value.length < minLength) {
			return `${fieldName} must be at least ${minLength} characters`;
		}
		return null;
	}

	/**
	 * Validates maximum text length
	 */
	static maxLength(value: string, maxLength: number, fieldName: string): string | null {
		if (value.length > maxLength) {
			return `${fieldName} must be no more than ${maxLength} characters`;
		}
		return null;
	}

	/**
	 * Validates an email
	 */
	static email(value: string): string | null {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(value)) {
			return 'Invalid email format';
		}
		return null;
	}

	/**
	 * Validates multiple fields at once
	 */
	static validateFields(fields: Array<{ value: string; rules: Array<(value: string) => string | null> }>): string[] {
		const errors: string[] = [];
		
		for (const field of fields) {
			for (const rule of field.rules) {
				const error = rule(field.value);
				if (error) {
					errors.push(error);
					break; // Stop at first error for this field
				}
			}
		}
		
		return errors;
	}
}

/**
 * Utilities for colors and icons
 */
export class UIHelpers {
	/**
	 * Gets the icon for an error type
	 */
	static getErrorIcon(type: string): string {
		const iconMap: Record<string, string> = {
			'AUTHENTICATION': 'AUTH',
			'NETWORK': 'NET',
			'VALIDATION': 'WARN',
			'FIREBASE': 'FIRE',
			'UNKNOWN': 'ERR'
		};
		return iconMap[type] || 'ERR';
	}

	/**
	 * Gets the color for an error type
	 */
	static getErrorColor(type: string): string {
		const colorMap: Record<string, string> = {
			'AUTHENTICATION': '#ff6b6b',
			'NETWORK': '#4ecdc4',
			'VALIDATION': '#ffe66d',
			'FIREBASE': '#ff8c42',
			'UNKNOWN': '#ff6b6b'
		};
		return colorMap[type] || '#ff6b6b';
	}

	/**
	 * Gets the icon for an HTTP status code
	 */
	static getStatusIcon(status: number): string {
		const iconMap: Record<number, string> = {
			400: 'WARNING',
			401: 'LOCK',
			403: 'BLOCK',
			404: 'SEARCH',
			500: 'ERROR',
			502: 'NETWORK',
			503: 'TIMEOUT'
		};
		return iconMap[status] || 'ERROR';
	}

	/**
	 * Gets the color for an HTTP status code
	 */
	static getStatusColor(status: number): string {
		const colorMap: Record<number, string> = {
			400: '#FFC107',
			401: '#17A2B8',
			403: '#DC3545',
			404: '#6C757D',
			500: '#DC3545',
			502: '#FFC107',
			503: '#17A2B8'
		};
		return colorMap[status] || '#DC3545';
	}
}

/**
 * Game utilities
 */
export class GameHelpers {
	/**
	 * Get the full name of a game
	 */
	static getGameName(gameType: string): string {
		const gameMap: Record<string, string> = {
			'apex-legends': 'Apex Legends',
			'valorant': 'Valorant'
		};
		return gameMap[gameType] || gameType;
	}

	/**
	 * Gets the community title for a game
	 */
	static getCommunityTitle(gameType?: GameType): string {
		if (gameType === 'apex-legends') return 'Apex Legends Community Decisions';
		if (gameType === 'valorant') return 'Valorant Community Decisions';
		return 'Community Decisions';
	}

	/**
	 * Gets the community description for a game
	 */
	static getCommunityDescription(gameType?: GameType): string {
		if (gameType) {
			return `Access to voting system for ${this.getGameName(gameType)} team`;
		}
		return 'Access to voting system and decision proposals';
	}

	/**
	 * Gets the vote button text for a game
	 */
	static getVoteButtonText(gameType?: GameType): string {
		if (gameType === 'apex-legends') return 'Active Apex Votes';
		if (gameType === 'valorant') return 'Active Valorant Votes';
		return 'Active Votes';
	}
}

/**
 * Utilities for URLs
 */
export class URLHelpers {
	/**
	 * Builds a URL with query parameters
	 */
	static buildUrl(basePath: string, params: Record<string, string | undefined>): string {
		const filteredParams = Object.entries(params)
			.filter(([_, value]) => value !== undefined && value !== '')
			.map(([key, value]) => `${key}=${encodeURIComponent(value!)}`)
			.join('&');
		
		return filteredParams ? `${basePath}?${filteredParams}` : basePath;
	}

	/**
	 * Gets the dashboard URL with a game filter
	 */
	static getDashboardUrl(gameType?: GameType): string {
		return this.buildUrl('/dashboard', { game: gameType });
	}

	/**
	 * Get the proposal URL with a game filter
	 */
	static getProposeUrl(gameType?: GameType): string {
		return this.buildUrl('/dashboard/propose', { game: gameType });
	}
}
