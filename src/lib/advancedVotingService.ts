import { BaseFirebaseService, type FirebaseResult, FirebaseError } from './services/baseFirebaseService.js';
import { database } from './firebase';
import { ref, push, set, get, update, onValue, off } from 'firebase/database';
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
	CreateData,
	UpdateData,
	GameType,
	ProposalStatus,
	ApplicationStatus,
	FinalVoteOption
} from './types';

export class AdvancedVotingService extends BaseFirebaseService {
	private static instance: AdvancedVotingService;
	
	public static getInstance(): AdvancedVotingService {
		if (!AdvancedVotingService.instance) {
			AdvancedVotingService.instance = new AdvancedVotingService();
		}
		return AdvancedVotingService.instance;
	}

	// === PROPOSAL MANAGEMENT ===
	
	async createProposal(proposal: CreateData<Proposal>): Promise<FirebaseResult<string>> {
		// Check for duplicates before creation
		const duplicateCheck = await this.checkDuplicateProposal(proposal.title, proposal.description);
		if (!duplicateCheck.success) {
			return duplicateCheck;
		}
		
		if (duplicateCheck.data) {
			return {
				success: false,
				error: new FirebaseError(
					'A similar proposal was submitted recently. Please wait before submitting again.',
					'DUPLICATE_PROPOSAL'
				)
			};
		}

		const proposalData: CreateData<Proposal> = {
			...proposal,
			status: 'pending' as ProposalStatus,
			upvotes: 0,
			upvotedBy: [],
			discussions: []
		};

		return this.createItem('proposals', proposalData);
	}

	private async checkDuplicateProposal(title: string, description: string): Promise<FirebaseResult<boolean>> {
		return this.executeOperation(async () => {
			const result = await this.getAllItems<Proposal>('proposals');
			if (!result.success) {
				throw result.error;
			}

			const proposals = result.data;
			const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
			
			return proposals.some(proposal => {
				if (proposal.createdAt > sevenDaysAgo) {
					const titleSimilarity = this.calculateSimilarity(title.toLowerCase(), proposal.title.toLowerCase());
					const descSimilarity = this.calculateSimilarity(description.toLowerCase(), proposal.description.toLowerCase());
					
					return titleSimilarity > 0.8 || descSimilarity > 0.8;
				}
				return false;
			});
		}, 'checkDuplicateProposal');
	}

	private calculateSimilarity(str1: string, str2: string): number {
		const longer = str1.length > str2.length ? str1 : str2;
		const shorter = str1.length > str2.length ? str2 : str1;
		
		if (longer.length === 0) return 1.0;
		
		const editDistance = this.levenshteinDistance(longer, shorter);
		return (longer.length - editDistance) / longer.length;
	}

	private levenshteinDistance(str1: string, str2: string): number {
		const matrix = [];
		
		for (let i = 0; i <= str2.length; i++) {
			matrix[i] = [i];
		}
		
		for (let j = 0; j <= str1.length; j++) {
			matrix[0][j] = j;
		}
		
		for (let i = 1; i <= str2.length; i++) {
			for (let j = 1; j <= str1.length; j++) {
				if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
					matrix[i][j] = matrix[i - 1][j - 1];
				} else {
					matrix[i][j] = Math.min(
						matrix[i - 1][j - 1] + 1,
						matrix[i][j - 1] + 1,
						matrix[i - 1][j] + 1
					);
				}
			}
		}
		
		return matrix[str2.length][str1.length];
	}

	async getProposals(): Promise<FirebaseResult<Proposal[]>> {
		const result = await this.getAllItems<Proposal>('proposals');
		if (!result.success) {
			return result;
		}

		// Sort by descending upvote count
		const sortedProposals = result.data.sort((a, b) => b.upvotes - a.upvotes);
		return { success: true, data: sortedProposals };
	}

	// === UPVOTE SYSTEM ===
	
	async upvoteProposal(proposalId: string, userId: string): Promise<void> {
		try {
			const proposalRef = ref(database, `proposals/${proposalId}`);
			const snapshot = await get(proposalRef);
			
			if (!snapshot.exists()) {
				throw new Error('Proposal not found');
			}
			
			const proposal = snapshot.val() as Proposal;
			
			if (proposal.upvotedBy.includes(userId)) {
				throw new Error('You have already upvoted this proposal');
			}
			
			await update(proposalRef, {
				upvotes: proposal.upvotes + 1,
				upvotedBy: [...proposal.upvotedBy, userId]
			});
		} catch (error) {
			throw error;
		}
	}

	async removeUpvote(proposalId: string, userId: string): Promise<void> {
		try {
			const proposalRef = ref(database, `proposals/${proposalId}`);
			const snapshot = await get(proposalRef);
			
			if (!snapshot.exists()) {
				throw new Error('Proposal not found');
			}
			
			const proposal = snapshot.val() as Proposal;
			
			if (!proposal.upvotedBy.includes(userId)) {
				throw new Error('You have not upvoted this proposal');
			}
			
			await update(proposalRef, {
				upvotes: proposal.upvotes - 1,
				upvotedBy: proposal.upvotedBy.filter(id => id !== userId)
			});
		} catch (error) {
			throw error;
		}
	}

	// === MONTHLY SELECTION ===
	
	async createMonthlySelection(topProposals: Proposal[], limit: number = 10): Promise<string> {
		try {
			const now = new Date();
			const month = now.getMonth() + 1;
			const year = now.getFullYear();
			
			// Check if selection already exists for this month
			const existingSelection = await this.getMonthlySelection(month, year);
			if (existingSelection) {
				throw new Error('Monthly selection already exists for this month');
			}
			
			const selectionRef = ref(database, 'monthlySelections');
			const newSelectionRef = push(selectionRef);
			const selectionId = newSelectionRef.key!;
			
			const endDate = new Date(year, month, 0).getTime(); // End of month
			
			const selection: MonthlySelection = {
				id: selectionId,
				month,
				year,
				proposals: topProposals.slice(0, limit).map(p => p.id),
				status: 'active',
				createdAt: Date.now(),
				endDate
			};
			
			await set(newSelectionRef, selection);
			
			// Create final votes for each selected proposal
			for (const proposal of topProposals.slice(0, limit)) {
				await this.createFinalVote(proposal);
			}
			
			return selectionId;
		} catch (error) {
			throw error;
		}
	}

	async getMonthlySelection(month: number, year: number): Promise<MonthlySelection | null> {
		try {
			const selectionsRef = ref(database, 'monthlySelections');
			const snapshot = await get(selectionsRef);
			
			if (!snapshot.exists()) return null;
			
			let foundSelection: MonthlySelection | null = null;
			snapshot.forEach((childSnapshot) => {
				const selection = childSnapshot.val() as MonthlySelection;
				if (selection.month === month && selection.year === year) {
					foundSelection = selection;
				}
			});
			
			return foundSelection;
		} catch (error) {
			return null;
		}
	}

	// === FINAL VOTING ===
	
	async createFinalVote(proposal: Proposal): Promise<string> {
		try {
			const finalVotesRef = ref(database, 'finalVotes');
			const newVoteRef = push(finalVotesRef);
			const voteId = newVoteRef.key!;
			
			const endDate = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
			
			const finalVote: FinalVote = {
				id: voteId,
				proposalId: proposal.id,
				title: proposal.title,
				description: proposal.description,
				game: proposal.game,
				createdBy: proposal.createdBy,
				createdAt: Date.now(),
				updatedAt: Date.now(),
				endDate,
				isActive: true,
				totalVotes: 0,
				options: [
					{ id: 'for', text: 'Pour', votes: 0 },
					{ id: 'abstain', text: 'Ne se prononce pas', votes: 0 },
					{ id: 'against', text: 'Contre', votes: 0 }
				]
			};
			
			await set(newVoteRef, finalVote);
			return voteId;
		} catch (error) {
			throw error;
		}
	}

	async voteFinal(voteId: string, optionId: 'for' | 'abstain' | 'against', userId: string): Promise<void> {
		try {
			// Check if user has already voted
			const userVoteRef = ref(database, `finalUserVotes/${userId}/${voteId}`);
			const userVoteSnapshot = await get(userVoteRef);
			
			if (userVoteSnapshot.exists()) {
				throw new Error('You have already voted for this final vote');
			}
			
			// Record user vote
			const userVote: UserVote = {
				voteId,
				optionId,
				votedAt: Date.now(),
				userId
			};
			
			await set(userVoteRef, userVote);
			
			// Update vote counter
			const voteRef = ref(database, `finalVotes/${voteId}`);
			const voteSnapshot = await get(voteRef);
			
			if (!voteSnapshot.exists()) {
				throw new Error('Final vote not found');
			}
			
			const vote = voteSnapshot.val() as FinalVote;
			const updatedOptions = vote.options.map(option => {
				if (option.id === optionId) {
					return { ...option, votes: option.votes + 1 };
				}
				return option;
			});
			
			await update(voteRef, {
				options: updatedOptions,
				totalVotes: vote.totalVotes + 1
			});
		} catch (error) {
			throw error;
		}
	}

	async getFinalVotes(): Promise<FinalVote[]> {
		try {
			const votesRef = ref(database, 'finalVotes');
			const snapshot = await get(votesRef);
			
			if (!snapshot.exists()) {
				return [];
			}
			
			const votes: FinalVote[] = [];
			snapshot.forEach((childSnapshot) => {
				const vote = childSnapshot.val() as FinalVote;
				if (vote.isActive && vote.endDate > Date.now()) {
					votes.push(vote);
				}
			});
			
			return votes.sort((a, b) => b.createdAt - a.createdAt);
		} catch (error) {
			throw error;
		}
	}

	// === DISCUSSIONS ===
	
	async addDiscussion(proposalId: string, authorId: string, authorName: string, content: string): Promise<string> {
		try {
			const discussionsRef = ref(database, `proposals/${proposalId}/discussions`);
			const newDiscussionRef = push(discussionsRef);
			const discussionId = newDiscussionRef.key!;
			
			const discussion: Discussion = {
				id: discussionId,
				proposalId,
				authorId,
				authorName,
				content: content.trim(),
				createdAt: Date.now(),
				replies: []
			};
			
			await set(newDiscussionRef, discussion);
			return discussionId;
		} catch (error) {
			throw error;
		}
	}

	async addDiscussionReply(discussionId: string, proposalId: string, authorId: string, authorName: string, content: string): Promise<string> {
		try {
			const repliesRef = ref(database, `proposals/${proposalId}/discussions/${discussionId}/replies`);
			const newReplyRef = push(repliesRef);
			const replyId = newReplyRef.key!;
			
			const reply: DiscussionReply = {
				id: replyId,
				discussionId,
				authorId,
				authorName,
				content: content.trim(),
				createdAt: Date.now()
			};
			
			await set(newReplyRef, reply);
			return replyId;
		} catch (error) {
			throw error;
		}
	}

	// === USER PROFILE MANAGEMENT ===
	
	async createUserProfile(user: { uid: string; email: string; displayName: string }): Promise<void> {
		try {
			const profileRef = ref(database, `userProfiles/${user.uid}`);
			const snapshot = await get(profileRef);
			
			if (snapshot.exists()) return; // Profile already exists
			
			const profile: UserProfile = {
				id: user.uid,
				uid: user.uid,
				email: user.email,
				displayName: user.displayName,
				role: 'member',
				joinedAt: Date.now(),
				lastActive: Date.now(),
				createdAt: Date.now(),
				updatedAt: Date.now()
			};
			
			await set(profileRef, profile);
		} catch (error) {
			throw error;
		}
	}

	async getUserProfile(userId: string): Promise<UserProfile | null> {
		try {
			const profileRef = ref(database, `userProfiles/${userId}`);
			const snapshot = await get(profileRef);
			
			if (snapshot.exists()) {
				return snapshot.val() as UserProfile;
			}
			
			return null;
		} catch (error) {
			return null;
		}
	}

	async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
		try {
			const profileRef = ref(database, `userProfiles/${userId}`);
			await update(profileRef, {
				...updates,
				lastActive: Date.now()
			});
		} catch (error) {
			throw error;
		}
	}

	// === REAL-TIME LISTENERS ===
	
	onProposalsChange(callback: (proposals: Proposal[]) => void): () => void {
		const proposalsRef = ref(database, 'proposals');
		
		const unsubscribe = onValue(proposalsRef, (snapshot) => {
			if (!snapshot.exists()) {
				callback([]);
				return;
			}
			
			const proposals: Proposal[] = [];
			snapshot.forEach((childSnapshot) => {
				proposals.push(childSnapshot.val() as Proposal);
			});
			
			callback(proposals.sort((a, b) => b.upvotes - a.upvotes));
		});
		
		return () => off(proposalsRef, 'value', unsubscribe);
	}

	onFinalVotesChange(callback: (votes: FinalVote[]) => void): () => void {
		const votesRef = ref(database, 'finalVotes');
		
		const unsubscribe = onValue(votesRef, (snapshot) => {
			if (!snapshot.exists()) {
				callback([]);
				return;
			}
			
			const votes: FinalVote[] = [];
			snapshot.forEach((childSnapshot) => {
				const vote = childSnapshot.val() as FinalVote;
				if (vote.isActive && vote.endDate > Date.now()) {
					votes.push(vote);
				}
			});
			
			callback(votes.sort((a, b) => b.createdAt - a.createdAt));
		});
		
		return () => off(votesRef, 'value', unsubscribe);
	}

	// === APPLICATION MANAGEMENT ===
	
	async createApplication(application: Omit<Application, 'id' | 'status' | 'totalVotes' | 'votes' | 'votedBy' | 'reviewComments'>): Promise<string> {
		try {
			// Check if user already has a pending application
			const existingApplication = await this.getUserApplication(application.applicantId);
			if (existingApplication && existingApplication.status === 'pending') {
				throw new Error('You already have a pending application');
			}

			const applicationsRef = ref(database, 'applications');
			const newApplicationRef = push(applicationsRef);
			const applicationId = newApplicationRef.key!;
			
			const reviewEndDate = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days review period
			
			const applicationData: Application = {
				...application,
				id: applicationId,
				status: 'pending',
				totalVotes: 0,
				votes: {
					accept: 0,
					reject: 0,
					abstain: 0
				},
				votedBy: [],
				reviewComments: [],
				reviewEndDate
			};
			
			await set(newApplicationRef, applicationData);
			return applicationId;
		} catch (error) {
			throw error;
		}
	}

	async getUserApplication(userId: string): Promise<Application | null> {
		try {
			const applicationsRef = ref(database, 'applications');
			const snapshot = await get(applicationsRef);
			
			if (!snapshot.exists()) return null;
			
			let userApplication: Application | null = null;
			snapshot.forEach((childSnapshot) => {
				const application = childSnapshot.val() as Application;
				if (application.applicantId === userId) {
					userApplication = application;
				}
			});
			
			return userApplication;
		} catch (error) {
			return null;
		}
	}

	async getApplications(): Promise<Application[]> {
		try {
			const applicationsRef = ref(database, 'applications');
			const snapshot = await get(applicationsRef);
			
			if (!snapshot.exists()) {
				return [];
			}
			
			const applications: Application[] = [];
			snapshot.forEach((childSnapshot) => {
				applications.push(childSnapshot.val() as Application);
			});
			
			return applications.sort((a, b) => b.createdAt - a.createdAt);
		} catch (error) {
			throw error;
		}
	}

	async getPendingApplications(): Promise<Application[]> {
		try {
			const applications = await this.getApplications();
			return applications.filter(app => app.status === 'pending' || app.status === 'under_review');
		} catch (error) {
			throw error;
		}
	}

	// === APPLICATION VOTING ===
	
	async voteOnApplication(applicationId: string, vote: 'accept' | 'reject' | 'abstain', voterId: string, comment?: string): Promise<void> {
		try {
			// Check if user has already voted
			const userVoteRef = ref(database, `applicationVotes/${voterId}/${applicationId}`);
			const userVoteSnapshot = await get(userVoteRef);
			
			if (userVoteSnapshot.exists()) {
				throw new Error('You have already voted on this application');
			}

			// Record user vote
			const applicationVote: ApplicationVote = {
				applicationId,
				voterId,
				vote,
				votedAt: Date.now(),
				comment
			};
			
			await set(userVoteRef, applicationVote);
			
			// Update application vote counts
			const applicationRef = ref(database, `applications/${applicationId}`);
			const applicationSnapshot = await get(applicationRef);
			
			if (!applicationSnapshot.exists()) {
				throw new Error('Application not found');
			}
			
			const application = applicationSnapshot.val() as Application;
			const updatedVotes = { ...application.votes };
			updatedVotes[vote] = updatedVotes[vote] + 1;
			
			await update(applicationRef, {
				votes: updatedVotes,
				totalVotes: application.totalVotes + 1,
				votedBy: [...application.votedBy, voterId]
			});

			// Check if review period should end
			await this.checkApplicationReviewStatus(applicationId);
		} catch (error) {
			throw error;
		}
	}

	private async checkApplicationReviewStatus(applicationId: string): Promise<void> {
		try {
			const applicationRef = ref(database, `applications/${applicationId}`);
			const snapshot = await get(applicationRef);
			
			if (!snapshot.exists()) return;
			
			const application = snapshot.val() as Application;
			const now = Date.now();
			
			// If review period has ended or we have enough votes (minimum 5 votes)
			if (now > application.reviewEndDate || application.totalVotes >= 5) {
				const acceptPercentage = (application.votes.accept / application.totalVotes) * 100;
				const rejectPercentage = (application.votes.reject / application.totalVotes) * 100;
				
				let newStatus: 'accepted' | 'rejected';
				if (acceptPercentage >= 60) {
					newStatus = 'accepted';
				} else if (rejectPercentage >= 60) {
					newStatus = 'rejected';
				} else {
					// If no clear majority, extend review period
					await update(applicationRef, {
						reviewEndDate: now + (3 * 24 * 60 * 60 * 1000) // 3 more days
					});
					return;
				}
				
				await update(applicationRef, {
					status: newStatus
				});
			}
		} catch (error) {
			// Silent error handling for review status
		}
	}

	// === APPLICATION COMMENTS ===
	
	async addApplicationComment(applicationId: string, authorId: string, authorName: string, content: string, type: 'general' | 'concern' | 'support'): Promise<string> {
		try {
			const commentsRef = ref(database, `applications/${applicationId}/reviewComments`);
			const newCommentRef = push(commentsRef);
			const commentId = newCommentRef.key!;
			
			const comment: ApplicationComment = {
				id: commentId,
				applicationId,
				authorId,
				authorName,
				content: content.trim(),
				createdAt: Date.now(),
				updatedAt: Date.now(),
				type
			};
			
			await set(newCommentRef, comment);
			return commentId;
		} catch (error) {
			throw error;
		}
	}

	// === REAL-TIME LISTENERS FOR APPLICATIONS ===
	
	onApplicationsChange(callback: (applications: Application[]) => void): () => void {
		const applicationsRef = ref(database, 'applications');
		
		const unsubscribe = onValue(applicationsRef, (snapshot) => {
			if (!snapshot.exists()) {
				callback([]);
				return;
			}
			
			const applications: Application[] = [];
			snapshot.forEach((childSnapshot) => {
				applications.push(childSnapshot.val() as Application);
			});
			
			callback(applications.sort((a, b) => b.createdAt - a.createdAt));
		});
		
		return () => off(applicationsRef, 'value', unsubscribe);
	}
}
