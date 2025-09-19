/**
 * Interfaces TypeScript pour les composants Svelte
 */

import type { User } from 'firebase/auth';
import type { GameType, UserRole } from '../types';

/**
 * Interface for statistics displayed in StatsGrid
 */
export interface StatItem {
	value: string | number;
	label: string;
}

/**
 * Interface for matches displayed in MatchList
 */
export interface MatchItem {
	title: string;
	opponent: string;
	result: string;
	score: string;
	isVictory: boolean;
}

/**
 * Interface pour les props du composant CommunitySection
 */
export interface CommunitySectionProps {
	game?: GameType;
	user: User | null;
}

/**
 * Interface pour les props du composant DashboardLayout
 */
export interface DashboardLayoutProps {
	title: string;
	description: string;
	isLoading?: boolean;
	error?: string;
	showErrorDisplay?: boolean;
}

/**
 * Interface pour les props du composant FormLayout
 */
export interface FormLayoutProps {
	title: string;
	description?: string;
	isSubmitting?: boolean;
	submitText?: string;
	cancelText?: string;
	cancelUrl?: string;
	error?: string;
	success?: string;
}

/**
 * Interface pour les props du composant LoadingIndicator
 */
export interface LoadingIndicatorProps {
	isLoading: boolean;
	size?: 'small' | 'medium' | 'large';
	message?: string;
	showMessage?: boolean;
}

/**
 * Interface pour les props du composant PageHead
 */
export interface PageHeadProps {
	title: string;
	description: string;
}

/**
 * Interface pour les props du composant Navigation
 */
export interface NavigationProps {
	currentPage?: string;
}

/**
 * Interface pour les props du composant AuthGuard
 */
export interface AuthGuardProps {
	redirectTo?: string;
}

/**
 * Interface pour les props du composant ErrorDisplay
 */
export interface ErrorDisplayProps {
	showErrors?: boolean;
	maxErrors?: number;
	autoHide?: boolean;
	hideDelay?: number;
}

/**
 * Types pour les formulaires
 */
export interface VoteFormData {
	title: string;
	description: string;
	game: string;
	duration: number;
	options: string[];
}

export interface ProposalFormData {
	title: string;
	description: string;
	game: string;
}

export interface ApplicationFormData {
	game: GameType;
	experience: string;
	motivation: string;
	availability: string;
	additionalInfo?: string;
}

export interface UserProfileFormData {
	displayName: string;
	email: string;
	role: UserRole;
}

/**
 * Types for component states
 */
export interface ComponentState {
	isLoading: boolean;
	error: string;
	success: string;
}

export interface FormState extends ComponentState {
	isSubmitting: boolean;
}

/**
 * Types for event callbacks
 */
export type EventCallback<T = void> = (event: T) => void;
export type AsyncEventCallback<T = void> = (event: T) => Promise<void>;

/**
 * Types for form handlers
 */
export type FormSubmitHandler = () => Promise<void>;
export type FormCancelHandler = () => void;
export type FormValidationHandler<T> = (data: T) => string[];

/**
 * Types for filters and parameters
 */
export interface GameFilter {
	game?: GameType;
}

export interface PaginationParams {
	page?: number;
	limit?: number;
	offset?: number;
}

export interface SortParams {
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
}

/**
 * Types for operation results
 */
export interface ComponentResult<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
}

/**
 * Types pour les stores Svelte
 */
export interface StoreState<T> {
	value: T;
	loading: boolean;
	error: string | null;
}

/**
 * Types pour les props des pages
 */
export interface PageProps {
	params: Record<string, string>;
	url: URL;
	route: {
		id: string | null;
	};
	data: Record<string, unknown>;
}
