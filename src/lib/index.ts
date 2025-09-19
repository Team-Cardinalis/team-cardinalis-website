// Export all components
export { default as Navigation } from './components/Navigation.svelte';
export { default as PageHead } from './components/PageHead.svelte';
export { default as LoadingIndicator } from './components/LoadingIndicator.svelte';
export { default as StatsGrid } from './components/StatsGrid.svelte';
export { default as MatchList } from './components/MatchList.svelte';
export { default as CommunitySection } from './components/CommunitySection.svelte';
export { default as AuthGuard } from './components/AuthGuard.svelte';
export { default as ErrorDisplay } from './components/ErrorDisplay.svelte';
export { default as DashboardLayout } from './components/DashboardLayout.svelte';
export { default as FormLayout } from './components/FormLayout.svelte';
export { default as Footer } from './components/Footer.svelte';

// Export stores
export { user, isLoading } from './stores/auth';
export { errorStore } from './services/errorService';

// Export utilities
export { formatDate, getTimeRemaining } from './utils/dateUtils';
export { DateFormatters, FormValidators, UIHelpers, GameHelpers, URLHelpers } from './utils/commonUtils';

// Export services
export { VotingService } from './votingService';
export { AdvancedVotingService } from './advancedVotingService';
export { DashboardService } from './dashboardService';
export { BaseFirebaseService, FirebaseError } from './services/baseFirebaseService.js';
export { ErrorService, useErrorService, handleAsyncError, ErrorType } from './services/errorService';

// Export types
export type { 
	Vote, 
	VoteOption, 
	UserVote, 
	Proposal, 
	Discussion, 
	DiscussionReply, 
	UserProfile, 
	MonthlySelection, 
	FinalVote, 
	Application, 
	ApplicationComment, 
	ApplicationVote,
	BaseEntity,
	GameType,
	VoteStatus,
	ProposalStatus,
	ApplicationStatus,
	UserRole,
	ApplicationCommentType,
	FinalVoteOption,
	CreateData,
	UpdateData,
	OperationResult,
	DashboardStats
} from './types';

// Export component types
export type {
	StatItem,
	MatchItem,
	CommunitySectionProps,
	DashboardLayoutProps,
	FormLayoutProps,
	LoadingIndicatorProps,
	PageHeadProps,
	NavigationProps,
	AuthGuardProps,
	ErrorDisplayProps,
	VoteFormData,
	ProposalFormData,
	ApplicationFormData,
	UserProfileFormData,
	ComponentState,
	FormState,
	EventCallback,
	AsyncEventCallback,
	FormSubmitHandler,
	FormCancelHandler,
	FormValidationHandler,
	GameFilter,
	PaginationParams,
	SortParams,
	ComponentResult,
	StoreState,
	PageProps
} from './types/components';

// Export auth configuration
export { isProtectedRoute, getDefaultRedirectRoute } from './authConfig';
