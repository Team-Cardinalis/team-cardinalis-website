/**
 * Base types for all entities
 */
export interface BaseEntity {
	id: string;
	createdAt: number;
	updatedAt: number;
}

/**
 * Supported game types
 */
export type GameType = 'apex-legends' | 'valorant';

/**
 * Vote statuses
 */
export type VoteStatus = 'proposal' | 'final_vote' | 'completed';

/**
 * Proposal statuses
 */
export type ProposalStatus = 'pending' | 'approved' | 'rejected';

/**
 * Application statuses
 */
export type ApplicationStatus = 'pending' | 'under_review' | 'accepted' | 'rejected';

/**
 * User roles
 */
export type UserRole = 'member' | 'admin';

/**
 * Application comment types
 */
export type ApplicationCommentType = 'general' | 'concern' | 'support';

/**
 * Final vote options
 */
export type FinalVoteOption = 'for' | 'abstain' | 'against';

/**
 * Vote with robust type management
 */
export interface Vote extends BaseEntity {
	title: string;
	description: string;
	game?: GameType;
	options: VoteOption[];
	createdBy: string;
	endDate: number;
	isActive: boolean;
	totalVotes: number;
	upvotes: number;
	discussions: Discussion[];
	status: VoteStatus;
}

export interface VoteOption {
	id: string;
	text: string;
	votes: number;
}

export interface UserVote {
	voteId: string;
	optionId: string;
	votedAt: number;
	userId: string;
}

/**
 * Proposition avec gestion robuste des types
 */
export interface Proposal extends BaseEntity {
	title: string;
	description: string;
	game?: GameType;
	createdBy: string;
	status: ProposalStatus;
	votes?: Vote;
	upvotes: number;
	upvotedBy: string[];
	discussions: Discussion[];
}

export interface Discussion {
	id: string;
	proposalId: string;
	authorId: string;
	authorName: string;
	content: string;
	createdAt: number;
	replies: DiscussionReply[];
}

export interface DiscussionReply {
	id: string;
	discussionId: string;
	authorId: string;
	authorName: string;
	content: string;
	createdAt: number;
}

/**
 * Profil utilisateur avec gestion robuste des types
 */
export interface UserProfile extends BaseEntity {
	uid: string;
	email: string;
	displayName: string;
	avatar?: string;
	role: UserRole;
	joinedAt: number;
	lastActive: number;
}

export interface MonthlySelection {
	id: string;
	month: number;
	year: number;
	proposals: string[];
	status: 'active' | 'completed';
	createdAt: number;
	endDate: number;
}

/**
 * Vote final avec gestion robuste des types
 */
export interface FinalVote extends BaseEntity {
	proposalId: string;
	title: string;
	description: string;
	game?: GameType;
	createdBy: string;
	endDate: number;
	isActive: boolean;
	totalVotes: number;
	options: [
		{ id: 'for'; text: 'Pour'; votes: number },
		{ id: 'abstain'; text: 'Ne se prononce pas'; votes: number },
		{ id: 'against'; text: 'Contre'; votes: number }
	];
}

/**
 * Application avec gestion robuste des types
 */
export interface Application extends BaseEntity {
	applicantId: string;
	applicantName: string;
	applicantEmail: string;
	game: GameType;
	experience: string;
	motivation: string;
	availability: string;
	additionalInfo?: string;
	status: ApplicationStatus;
	reviewEndDate: number;
	totalVotes: number;
	votes: {
		accept: number;
		reject: number;
		abstain: number;
	};
	votedBy: string[];
	reviewComments: ApplicationComment[];
}

/**
 * Commentaire d'application avec gestion robuste des types
 */
export interface ApplicationComment extends BaseEntity {
	applicationId: string;
	authorId: string;
	authorName: string;
	content: string;
	type: ApplicationCommentType;
}

/**
 * Vote d'application avec gestion robuste des types
 */
export interface ApplicationVote {
	applicationId: string;
	voterId: string;
	vote: 'accept' | 'reject' | 'abstain';
	votedAt: number;
	comment?: string;
}

/**
 * Utility types for Firebase operations
 */
export type CreateData<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateData<T> = Partial<Omit<T, 'id' | 'createdAt'>>;

/**
 * Types for operation results
 */
export interface OperationResult<T> {
	success: boolean;
	data?: T;
	error?: string;
}

/**
 * Types for dashboard statistics
 */
export interface DashboardStats {
	totalMembers: number;
	activeMembers: number;
	newMembersThisMonth: number;
	totalVotes: number;
	activeVotes: number;
	totalProposals: number;
	pendingProposals: number;
	totalApplications: number;
	pendingApplications: number;
	acceptedApplications: number;
	rejectedApplications: number;
	monthlyProposals: number;
	monthlyUpvotes: number;
	monthlyVotes: number;
}
