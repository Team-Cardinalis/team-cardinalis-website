import { database } from './firebase';
import { ref, get } from 'firebase/database';
import { AdvancedVotingService } from './advancedVotingService';
import { VotingService } from './votingService';
import type { Application, Proposal, Vote, FinalVote, UserProfile } from './types';

export interface DashboardStats {
	// Community Overview
	totalMembers: number;
	activeMembers: number;
	newMembersThisMonth: number;
	
	// Voting Statistics
	totalVotes: number;
	activeVotes: number;
	totalProposals: number;
	pendingProposals: number;
	
	// Application Statistics
	totalApplications: number;
	pendingApplications: number;
	acceptedApplications: number;
	rejectedApplications: number;
	
	// Monthly Statistics
	monthlyProposals: number;
	monthlyUpvotes: number;
	monthlyVotes: number;
	
	// Recent Activity
	recentVotes: Vote[];
	recentProposals: Proposal[];
	recentApplications: Application[];
	
	// Top Performers
	topProposals: Proposal[];
	mostActiveMembers: (UserProfile & { activityScore: number })[];
}

export interface CommunityMetrics {
	engagementRate: number;
	votingParticipation: number;
	proposalSuccessRate: number;
	applicationAcceptanceRate: number;
	averageResponseTime: number;
}

export class DashboardService {
	private static instance: DashboardService;
	private votingService: AdvancedVotingService;
	private basicVotingService: VotingService;
	
	public static getInstance(): DashboardService {
		if (!DashboardService.instance) {
			DashboardService.instance = new DashboardService();
		}
		return DashboardService.instance;
	}
	
	constructor() {
		this.votingService = AdvancedVotingService.getInstance();
		this.basicVotingService = VotingService.getInstance();
	}
	
	async getDashboardStats(): Promise<DashboardStats> {
		try {
			// Check if user is authenticated
			const { auth } = await import('./firebase');
			if (!auth.currentUser) {
				throw new Error('User not authenticated');
			}
			
			
			// Get all data in parallel
			const [
				votes,
				proposals,
				applications,
				userProfiles,
				finalVotes
			] = await Promise.all([
				this.getAllVotes(),
				this.basicVotingService.getProposals(),
				this.votingService.getApplications(),
				this.getAllUserProfiles(),
				this.votingService.getFinalVotes()
			]);
			
			const now = Date.now();
			const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);
			
			// Calculate statistics
			const activeVotes = votes.filter((vote: Vote) => vote.isActive && vote.endDate > now);
			const pendingProposals = proposals.filter((p: Proposal) => p.status === 'pending');
			const pendingApplications = applications.filter((a: Application) => a.status === 'pending' || a.status === 'under_review');
			const acceptedApplications = applications.filter((a: Application) => a.status === 'accepted');
			const rejectedApplications = applications.filter((a: Application) => a.status === 'rejected');
			
			const monthlyProposals = proposals.filter((p: Proposal) => p.createdAt > oneMonthAgo);
			const monthlyUpvotes = monthlyProposals.reduce((sum: number, p: Proposal) => sum + p.upvotes, 0);
			const monthlyVotes = votes.filter((v: Vote) => v.createdAt > oneMonthAgo);
			
			const newMembersThisMonth = userProfiles.filter((u: UserProfile) => u.joinedAt > oneMonthAgo);
			const activeMembers = userProfiles.filter((u: UserProfile) => (now - u.lastActive) < (7 * 24 * 60 * 60 * 1000)); // Active in last 7 days
			
			// Get recent activity (last 10 items each)
			const recentVotes = votes
				.sort((a: Vote, b: Vote) => b.createdAt - a.createdAt)
				.slice(0, 10);
			
			const recentProposals = proposals
				.sort((a: Proposal, b: Proposal) => b.createdAt - a.createdAt)
				.slice(0, 10);
			
			const recentApplications = applications
				.sort((a: Application, b: Application) => b.createdAt - a.createdAt)
				.slice(0, 10);
			
			// Get top performers
			const topProposals = proposals
				.sort((a: Proposal, b: Proposal) => b.upvotes - a.upvotes)
				.slice(0, 5);
			
			// Calculate most active members based on actual participation
			const mostActiveMembers = await Promise.all(
				userProfiles.map(async (profile: UserProfile) => {
					const activity = await this.getMemberActivity(profile.uid);
					return {
						...profile,
						activityScore: activity.votesParticipated + activity.proposalsCreated + activity.applicationsReviewed
					};
				})
			);
			
			const sortedActiveMembers = mostActiveMembers
				.filter((member: UserProfile & { activityScore: number }) => member.activityScore > 0) // Only show members with actual activity
				.sort((a: UserProfile & { activityScore: number }, b: UserProfile & { activityScore: number }) => b.activityScore - a.activityScore)
				.slice(0, 5);
			
			return {
				totalMembers: userProfiles.length,
				activeMembers: activeMembers.length,
				newMembersThisMonth: newMembersThisMonth.length,
				
				totalVotes: votes.length,
				activeVotes: activeVotes.length,
				totalProposals: proposals.length,
				pendingProposals: pendingProposals.length,
				
				totalApplications: applications.length,
				pendingApplications: pendingApplications.length,
				acceptedApplications: acceptedApplications.length,
				rejectedApplications: rejectedApplications.length,
				
				monthlyProposals: monthlyProposals.length,
				monthlyUpvotes,
				monthlyVotes: monthlyVotes.length,
				
				recentVotes,
				recentProposals,
				recentApplications,
				
				topProposals,
				mostActiveMembers: sortedActiveMembers
			};
		} catch (error) {
			throw error;
		}
	}
	
	async getCommunityMetrics(): Promise<CommunityMetrics> {
		try {
			const stats = await this.getDashboardStats();
			
			// Calculate engagement rate (active members / total members)
			const engagementRate = stats.totalMembers > 0 
				? (stats.activeMembers / stats.totalMembers) * 100 
				: 0;
			
			// Calculate voting participation (members who voted / total members)
			const votingParticipation = stats.totalMembers > 0 
				? ((stats.totalVotes + stats.totalApplications) / stats.totalMembers) * 100 
				: 0;
			
			// Calculate proposal success rate (approved / total)
			const proposalSuccessRate = stats.totalProposals > 0 
				? ((stats.totalProposals - stats.pendingProposals) / stats.totalProposals) * 100 
				: 0;
			
			// Calculate application acceptance rate
			const applicationAcceptanceRate = stats.totalApplications > 0 
				? (stats.acceptedApplications / stats.totalApplications) * 100 
				: 0;
			
			// Calculate average response time (simplified - based on recent activity)
			const averageResponseTime = this.calculateAverageResponseTime(stats.recentVotes);
			
			return {
				engagementRate,
				votingParticipation,
				proposalSuccessRate,
				applicationAcceptanceRate,
				averageResponseTime
			};
		} catch (error) {
			throw error;
		}
	}
	
	private async getAllVotes(): Promise<Vote[]> {
		try {
			const votesRef = ref(database, 'votes');
			const snapshot = await get(votesRef);
			
			if (!snapshot.exists()) {
				return [];
			}
			
			const votes: Vote[] = [];
			snapshot.forEach((childSnapshot) => {
				votes.push(childSnapshot.val() as Vote);
			});
			
			return votes;
		} catch (error) {
			return [];
		}
	}
	
	private async getAllUserProfiles(): Promise<UserProfile[]> {
		try {
			const profilesRef = ref(database, 'userProfiles');
			const snapshot = await get(profilesRef);
			
			if (!snapshot.exists()) {
				return [];
			}
			
			const profiles: UserProfile[] = [];
			snapshot.forEach((childSnapshot) => {
				profiles.push(childSnapshot.val() as UserProfile);
			});
			
			return profiles;
		} catch (error) {
			return [];
		}
	}
	
	private calculateAverageResponseTime(recentVotes: Vote[]): number {
		if (recentVotes.length === 0) return 0;
		
		const totalResponseTime = recentVotes.reduce((sum, vote) => {
			// Simplified calculation - time between creation and first vote
			const timeToFirstVote = vote.totalVotes > 0 ? 24 * 60 * 60 * 1000 : 0; // 24 hours average
			return sum + timeToFirstVote;
		}, 0);
		
		return totalResponseTime / recentVotes.length / (1000 * 60 * 60); // Convert to hours
	}
	
	async getMemberActivity(userId: string): Promise<{
		votesParticipated: number;
		proposalsCreated: number;
		applicationsReviewed: number;
		lastActivity: number;
	}> {
		try {
			const [votes, proposals, applications] = await Promise.all([
				this.getAllVotes(),
				this.basicVotingService.getProposals(),
				this.votingService.getApplications()
			]);
			
			// Count user's actual participation
			const votesParticipated = votes.filter((vote: Vote) => 
				vote.createdBy === userId
			).length;
			
			const proposalsCreated = proposals.filter((p: Proposal) => p.createdBy === userId).length;
			
			// Count applications where user actually voted (not just reviewed)
			const applicationsReviewed = applications.filter((a: Application) => 
				a.votedBy && a.votedBy.includes(userId)
			).length;
			
			const userProfile = await this.votingService.getUserProfile(userId);
			const lastActivity = userProfile?.lastActive || 0;
			
			return {
				votesParticipated,
				proposalsCreated,
				applicationsReviewed,
				lastActivity
			};
		} catch (error) {
			throw error;
		}
	}
}
