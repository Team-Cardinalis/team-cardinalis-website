import { describe, it, expect } from 'vitest';
import type {
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
} from '$lib/types';

describe('Type Definitions', () => {
	describe('BaseEntity', () => {
		it('should have required properties', () => {
			const entity: BaseEntity = {
				id: 'test-id',
				createdAt: Date.now(),
				updatedAt: Date.now()
			};

			expect(entity.id).toBe('test-id');
			expect(typeof entity.createdAt).toBe('number');
			expect(typeof entity.updatedAt).toBe('number');
		});
	});

	describe('Vote', () => {
		it('should have correct structure', () => {
			const vote: Vote = {
				id: 'vote-1',
				title: 'Test Vote',
				description: 'Test Description',
				game: 'apex-legends',
				options: [
					{ id: 'option-1', text: 'Yes', votes: 0 },
					{ id: 'option-2', text: 'No', votes: 0 }
				],
				createdBy: 'user-1',
				createdAt: Date.now(),
				updatedAt: Date.now(),
				endDate: Date.now() + 86400000,
				isActive: true,
				totalVotes: 0,
				status: 'proposal',
				upvotes: 0,
				discussions: []
			};

			expect(vote.id).toBe('vote-1');
			expect(vote.title).toBe('Test Vote');
			expect(vote.options).toHaveLength(2);
			expect(vote.isActive).toBe(true);
		});
	});

	describe('Proposal', () => {
		it('should have correct structure', () => {
			const proposal: Proposal = {
				id: 'proposal-1',
				title: 'Test Proposal',
				description: 'Test Description',
				game: 'valorant',
				createdBy: 'user-1',
				createdAt: Date.now(),
				updatedAt: Date.now(),
				upvotes: 5,
				upvotedBy: ['user-1', 'user-2'],
				status: 'pending',
				discussions: []
			};

			expect(proposal.id).toBe('proposal-1');
			expect(proposal.status).toBe('pending');
			expect(proposal.upvotes).toBe(5);
			expect(proposal.upvotedBy).toHaveLength(2);
		});
	});

	describe('Application', () => {
		it('should have correct structure', () => {
			const application: Application = {
				id: 'app-1',
				applicantId: 'user-1',
				applicantName: 'Test User',
				applicantEmail: 'test@example.com',
				game: 'apex-legends',
				experience: '2 years competitive experience',
				motivation: 'I want to join the team',
				availability: 'Full time',
				status: 'pending',
				createdAt: Date.now(),
				updatedAt: Date.now(),
				reviewEndDate: Date.now() + 604800000,
				totalVotes: 0,
				votes: {
					accept: 0,
					reject: 0,
					abstain: 0
				},
				votedBy: [],
				reviewComments: []
			};

			expect(application.id).toBe('app-1');
			expect(application.game).toBe('apex-legends');
			expect(application.status).toBe('pending');
			expect(application.votes.accept).toBe(0);
		});
	});

	describe('UserProfile', () => {
		it('should have correct structure', () => {
			const profile: UserProfile = {
				id: 'profile-1',
				uid: 'user-1',
				email: 'test@example.com',
				displayName: 'Test User',
				role: 'member',
				createdAt: Date.now(),
				updatedAt: Date.now(),
				joinedAt: Date.now(),
				lastActive: Date.now()
			};

			expect(profile.id).toBe('profile-1');
			expect(profile.email).toBe('test@example.com');
			expect(profile.role).toBe('member');
		});
	});

	describe('Type Aliases', () => {
		it('should validate GameType', () => {
			const validGames: GameType[] = ['apex-legends', 'valorant'];
			validGames.forEach(game => {
				expect(['apex-legends', 'valorant']).toContain(game);
			});
		});

		it('should validate VoteStatus', () => {
			const validStatuses: VoteStatus[] = ['proposal', 'final_vote', 'completed'];
			validStatuses.forEach(status => {
				expect(['proposal', 'final_vote', 'completed']).toContain(status);
			});
		});

		it('should validate ProposalStatus', () => {
			const validStatuses: ProposalStatus[] = ['pending', 'approved', 'rejected'];
			validStatuses.forEach(status => {
				expect(['pending', 'approved', 'rejected']).toContain(status);
			});
		});

		it('should validate ApplicationStatus', () => {
			const validStatuses: ApplicationStatus[] = ['pending', 'under_review', 'accepted', 'rejected'];
			validStatuses.forEach(status => {
				expect(['pending', 'under_review', 'accepted', 'rejected']).toContain(status);
			});
		});

		it('should validate UserRole', () => {
			const validRoles: UserRole[] = ['member', 'admin'];
			validRoles.forEach(role => {
				expect(['member', 'admin']).toContain(role);
			});
		});

		it('should validate ApplicationCommentType', () => {
			const validTypes: ApplicationCommentType[] = ['general', 'concern', 'support'];
			validTypes.forEach(type => {
				expect(['general', 'concern', 'support']).toContain(type);
			});
		});

		it('should validate FinalVoteOption', () => {
			const validOptions: FinalVoteOption[] = ['for', 'against', 'abstain'];
			validOptions.forEach(option => {
				expect(['for', 'against', 'abstain']).toContain(option);
			});
		});
	});

	describe('Utility Types', () => {
		it('should work with CreateData', () => {
			type TestEntity = {
				id: string;
				name: string;
				createdAt: number;
				updatedAt: number;
			};

			const createData: CreateData<TestEntity> = {
				name: 'Test'
			};

			expect(createData.name).toBe('Test');
			// id, createdAt, updatedAt should not be present in CreateData
			expect(createData).not.toHaveProperty('id');
			expect(createData).not.toHaveProperty('createdAt');
			expect(createData).not.toHaveProperty('updatedAt');
		});

		it('should work with UpdateData', () => {
			type TestEntity = {
				id: string;
				name: string;
				createdAt: number;
			};

			const updateData: UpdateData<TestEntity> = {
				name: 'Updated Test'
			};

			expect(updateData.name).toBe('Updated Test');
			// All properties should be optional
			expect(updateData).not.toHaveProperty('id');
			expect(updateData).not.toHaveProperty('createdAt');
		});

		it('should work with OperationResult', () => {
			const successResult: OperationResult<string> = {
				success: true,
				data: 'test-data'
			};

			const errorResult: OperationResult<string> = {
				success: false,
				error: 'test-error'
			};

			expect(successResult.success).toBe(true);
			expect(successResult.data).toBe('test-data');
			expect(errorResult.success).toBe(false);
			expect(errorResult.error).toBe('test-error');
		});
	});

	describe('DashboardStats', () => {
		it('should have correct structure', () => {
			const stats: DashboardStats = {
				totalMembers: 100,
				activeMembers: 50,
				newMembersThisMonth: 10,
				totalVotes: 25,
				activeVotes: 5,
				totalProposals: 15,
				pendingProposals: 3,
				totalApplications: 20,
				pendingApplications: 5,
				acceptedApplications: 10,
				rejectedApplications: 5,
				monthlyProposals: 8,
				monthlyUpvotes: 150,
				monthlyVotes: 200
			};

			expect(stats.totalMembers).toBe(100);
			expect(stats.activeMembers).toBe(50);
			expect(stats.totalVotes).toBe(25);
			expect(stats.totalProposals).toBe(15);
			expect(stats.totalApplications).toBe(20);
		});
	});
});
