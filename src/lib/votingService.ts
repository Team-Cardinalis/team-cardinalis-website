import { database } from './firebase';
import { ref, push, set, get, update, remove, onValue, off } from 'firebase/database';
import type { Vote, VoteOption, UserVote, Proposal } from './types';

export class VotingService {
	private static instance: VotingService;
	
	public static getInstance(): VotingService {
		if (!VotingService.instance) {
			VotingService.instance = new VotingService();
		}
		return VotingService.instance;
	}

	// Create a new vote
	async createVote(vote: Omit<Vote, 'id' | 'totalVotes'>): Promise<string> {
		try {
			const votesRef = ref(database, 'votes');
			const newVoteRef = push(votesRef);
			const voteId = newVoteRef.key!;
			
			const voteData: Vote = {
				...vote,
				id: voteId,
				totalVotes: 0
			};
			
			await set(newVoteRef, voteData);
			return voteId;
		} catch (error) {
			throw error;
		}
	}

	// Retrieve all active votes
	async getActiveVotes(): Promise<Vote[]> {
		try {
			const votesRef = ref(database, 'votes');
			const snapshot = await get(votesRef);
			
			if (!snapshot.exists()) {
				return [];
			}
			
			const votes: Vote[] = [];
			snapshot.forEach((childSnapshot) => {
				const vote = childSnapshot.val() as Vote;
				if (vote.isActive && vote.endDate > Date.now()) {
					votes.push(vote);
				}
			});
			
			return votes.sort((a, b) => b.createdAt - a.createdAt);
		} catch (error) {
			throw error;
		}
	}

	// Vote for an option
	async vote(voteId: string, optionId: string, userId: string): Promise<void> {
		try {
			// Check if user has already voted
			const userVoteRef = ref(database, `userVotes/${userId}/${voteId}`);
			const userVoteSnapshot = await get(userVoteRef);
			
			if (userVoteSnapshot.exists()) {
				throw new Error('You have already voted for this poll');
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
			const voteRef = ref(database, `votes/${voteId}`);
			const voteSnapshot = await get(voteRef);
			
			if (!voteSnapshot.exists()) {
				throw new Error('Vote not found');
			}
			
			const vote = voteSnapshot.val() as Vote;
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

	// Check if user has voted
	async hasUserVoted(voteId: string, userId: string): Promise<boolean> {
		try {
			const userVoteRef = ref(database, `userVotes/${userId}/${voteId}`);
			const snapshot = await get(userVoteRef);
			return snapshot.exists();
		} catch (error) {
			return false;
		}
	}

	// Retrieve user vote
	async getUserVote(voteId: string, userId: string): Promise<UserVote | null> {
		try {
			const userVoteRef = ref(database, `userVotes/${userId}/${voteId}`);
			const snapshot = await get(userVoteRef);
			
			if (snapshot.exists()) {
				return snapshot.val() as UserVote;
			}
			
			return null;
		} catch (error) {
			return null;
		}
	}

	// Create proposal
	async createProposal(proposal: Omit<Proposal, 'id'>): Promise<string> {
		try {
			const proposalsRef = ref(database, 'proposals');
			const newProposalRef = push(proposalsRef);
			const proposalId = newProposalRef.key!;
			
			const proposalData: Proposal = {
				...proposal,
				id: proposalId
			};
			
			await set(newProposalRef, proposalData);
			return proposalId;
		} catch (error) {
			throw error;
		}
	}

	// Retrieve all proposals
	async getProposals(): Promise<Proposal[]> {
		try {
			const proposalsRef = ref(database, 'proposals');
			const snapshot = await get(proposalsRef);
			
			if (!snapshot.exists()) {
				return [];
			}
			
			const proposals: Proposal[] = [];
			snapshot.forEach((childSnapshot) => {
				proposals.push(childSnapshot.val() as Proposal);
			});
			
			return proposals.sort((a, b) => b.createdAt - a.createdAt);
		} catch (error) {
			throw error;
		}
	}

	// Listen to real-time changes
	onVotesChange(callback: (votes: Vote[]) => void): () => void {
		const votesRef = ref(database, 'votes');
		
		const unsubscribe = onValue(votesRef, (snapshot) => {
			if (!snapshot.exists()) {
				callback([]);
				return;
			}
			
			const votes: Vote[] = [];
			snapshot.forEach((childSnapshot) => {
				const vote = childSnapshot.val() as Vote;
				if (vote.isActive && vote.endDate > Date.now()) {
					votes.push(vote);
				}
			});
			
			callback(votes.sort((a, b) => b.createdAt - a.createdAt));
		});
		
		return () => off(votesRef, 'value', unsubscribe);
	}
}
