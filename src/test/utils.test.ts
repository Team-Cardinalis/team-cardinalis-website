import { describe, it, expect } from 'vitest';
import { DateFormatters, FormValidators, UIHelpers, GameHelpers, URLHelpers } from '$lib/utils/commonUtils';

describe('DateFormatters', () => {
	describe('formatDate', () => {
		it('should format timestamp correctly', () => {
			const timestamp = 1640995200000; // 2022-01-01
			const result = DateFormatters.formatDate(timestamp);
			expect(result).toContain('January');
			expect(result).toContain('2022');
		});

		it('should handle current timestamp', () => {
			const now = Date.now();
			const result = DateFormatters.formatDate(now);
			expect(result).toBeDefined();
			expect(typeof result).toBe('string');
		});
	});

	describe('getTimeRemaining', () => {
		it('should calculate time remaining correctly', () => {
			const futureTime = Date.now() + 24 * 60 * 60 * 1000; // 1 day from now
			const result = DateFormatters.getTimeRemaining(futureTime);
			expect(result).toContain('d');
		});

		it('should handle past time', () => {
			const pastTime = Date.now() - 1000; // 1 second ago
			const result = DateFormatters.getTimeRemaining(pastTime);
			expect(result).toBe('Ended');
		});
	});

	describe('formatRelativeTime', () => {
		it('should format timestamp for display', () => {
			const timestamp = Date.now();
			const result = DateFormatters.formatRelativeTime(timestamp);
			expect(result).toBeDefined();
			expect(typeof result).toBe('string');
		});
	});
});

describe('FormValidators', () => {
	describe('email', () => {
		it('should validate correct email', () => {
			expect(FormValidators.email('test@example.com')).toBeNull();
			expect(FormValidators.email('user.name+tag@domain.co.uk')).toBeNull();
		});

		it('should reject invalid email', () => {
			expect(FormValidators.email('invalid-email')).toBe('Invalid email format');
			expect(FormValidators.email('@domain.com')).toBe('Invalid email format');
			expect(FormValidators.email('user@')).toBe('Invalid email format');
		});
	});

	describe('required', () => {
		it('should validate non-empty strings', () => {
			expect(FormValidators.required('test', 'Field')).toBeNull();
			expect(FormValidators.required('   test   ', 'Field')).toBeNull();
		});

		it('should reject empty or whitespace strings', () => {
			expect(FormValidators.required('', 'Field')).toBe('Field is required');
			expect(FormValidators.required('   ', 'Field')).toBe('Field is required');
		});
	});

	describe('minLength', () => {
		it('should validate minimum length', () => {
			expect(FormValidators.minLength('test', 3, 'Field')).toBeNull();
			expect(FormValidators.minLength('test', 4, 'Field')).toBeNull();
		});

		it('should reject strings below minimum length', () => {
			expect(FormValidators.minLength('te', 3, 'Field')).toBe('Field must be at least 3 characters');
			expect(FormValidators.minLength('', 1, 'Field')).toBe('Field must be at least 1 characters');
		});
	});
});

describe('UIHelpers', () => {
	describe('getErrorIcon', () => {
		it('should return correct icons for error types', () => {
			expect(UIHelpers.getErrorIcon('AUTHENTICATION')).toBe('AUTH');
			expect(UIHelpers.getErrorIcon('NETWORK')).toBe('NET');
			expect(UIHelpers.getErrorIcon('VALIDATION')).toBe('WARN');
			expect(UIHelpers.getErrorIcon('FIREBASE')).toBe('FIRE');
			expect(UIHelpers.getErrorIcon('UNKNOWN')).toBe('ERR');
		});

		it('should return default icon for unknown type', () => {
			expect(UIHelpers.getErrorIcon('UNKNOWN_TYPE')).toBe('ERR');
		});
	});

	describe('getErrorColor', () => {
		it('should return correct colors for error types', () => {
			expect(UIHelpers.getErrorColor('AUTHENTICATION')).toBe('#ff6b6b');
			expect(UIHelpers.getErrorColor('NETWORK')).toBe('#4ecdc4');
			expect(UIHelpers.getErrorColor('VALIDATION')).toBe('#ffe66d');
			expect(UIHelpers.getErrorColor('FIREBASE')).toBe('#ff8c42');
			expect(UIHelpers.getErrorColor('UNKNOWN')).toBe('#ff6b6b');
		});
	});

	describe('getStatusIcon', () => {
		it('should return correct icons for status codes', () => {
			expect(UIHelpers.getStatusIcon(400)).toBe('WARNING');
			expect(UIHelpers.getStatusIcon(401)).toBe('LOCK');
			expect(UIHelpers.getStatusIcon(403)).toBe('BLOCK');
			expect(UIHelpers.getStatusIcon(404)).toBe('SEARCH');
			expect(UIHelpers.getStatusIcon(500)).toBe('ERROR');
		});

		it('should return default icon for unknown status', () => {
			expect(UIHelpers.getStatusIcon(999)).toBe('ERROR');
		});
	});
});

describe('GameHelpers', () => {
	describe('getCommunityTitle', () => {
		it('should return correct titles for game types', () => {
			expect(GameHelpers.getCommunityTitle('apex-legends')).toBe('Apex Legends Community Decisions');
			expect(GameHelpers.getCommunityTitle('valorant')).toBe('Valorant Community Decisions');
		});

		it('should return default title for undefined game', () => {
			expect(GameHelpers.getCommunityTitle(undefined)).toBe('Community Decisions');
		});
	});

	describe('getCommunityDescription', () => {
		it('should return correct descriptions for game types', () => {
			expect(GameHelpers.getCommunityDescription('apex-legends')).toContain('Apex Legends');
			expect(GameHelpers.getCommunityDescription('valorant')).toContain('Valorant');
		});

		it('should return default description for undefined game', () => {
			expect(GameHelpers.getCommunityDescription(undefined)).toContain('voting system');
		});
	});

	describe('getVoteButtonText', () => {
		it('should return correct button text for game types', () => {
			expect(GameHelpers.getVoteButtonText('apex-legends')).toBe('Active Apex Votes');
			expect(GameHelpers.getVoteButtonText('valorant')).toBe('Active Valorant Votes');
		});

		it('should return default text for undefined game', () => {
			expect(GameHelpers.getVoteButtonText(undefined)).toBe('Active Votes');
		});
	});
});

describe('URLHelpers', () => {
	describe('getDashboardUrl', () => {
		it('should return correct dashboard URLs for game types', () => {
			expect(URLHelpers.getDashboardUrl('apex-legends')).toBe('/dashboard?game=apex-legends');
			expect(URLHelpers.getDashboardUrl('valorant')).toBe('/dashboard?game=valorant');
		});

		it('should return default dashboard URL for undefined game', () => {
			expect(URLHelpers.getDashboardUrl(undefined)).toBe('/dashboard');
		});
	});

	describe('getProposeUrl', () => {
		it('should return correct propose URLs for game types', () => {
			expect(URLHelpers.getProposeUrl('apex-legends')).toBe('/dashboard/propose?game=apex-legends');
			expect(URLHelpers.getProposeUrl('valorant')).toBe('/dashboard/propose?game=valorant');
		});

		it('should return default propose URL for undefined game', () => {
			expect(URLHelpers.getProposeUrl(undefined)).toBe('/dashboard/propose');
		});
	});
});
