import { AdvancedVotingService } from './advancedVotingService';

const votingService = AdvancedVotingService.getInstance();

export async function createMonthlySelection(): Promise<void> {
	try {
		
		// Get all proposals
		const proposalsResult = await votingService.getProposals();
		if (!proposalsResult.success) {
			throw proposalsResult.error;
		}
		
		const proposals = proposalsResult.data;
		// Filter proposals from the last month
		const oneMonthAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
		const recentProposals = proposals.filter((proposal: any) => proposal.createdAt > oneMonthAgo);
		
		// Sort by upvotes (descending)
		const topProposals = recentProposals.sort((a: any, b: any) => b.upvotes - a.upvotes);
		
		// Select top proposals (default: top 10, but can be configured)
		const selectedProposals = topProposals.slice(0, 10);
		
		if (selectedProposals.length === 0) {
			return;
		}
		
		// Create monthly selection
		const selectionId = await votingService.createMonthlySelection(selectedProposals, 10);
		
	} catch (error) {
		throw error;
	}
}

// Function to run monthly selection (can be called from admin panel or cron job)
export async function runMonthlySelection(): Promise<void> {
	const now = new Date();
	const month = now.getMonth() + 1;
	const year = now.getFullYear();
	
	// Check if selection already exists for this month
	const existingSelection = await votingService.getMonthlySelection(month, year);
	if (existingSelection) {
		return;
	}
	
	await createMonthlySelection();
}

// Function to get monthly statistics
export async function getMonthlyStats(): Promise<{
	totalProposals: number;
	totalUpvotes: number;
	topProposal: any;
	averageUpvotes: number;
}> {
	try {
		const proposalsResult = await votingService.getProposals();
		if (!proposalsResult.success) {
			throw proposalsResult.error;
		}
		
		const proposals = proposalsResult.data;
		const oneMonthAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
		const recentProposals = proposals.filter((proposal: any) => proposal.createdAt > oneMonthAgo);
		
		const totalProposals = recentProposals.length;
		const totalUpvotes = recentProposals.reduce((sum: number, proposal: any) => sum + proposal.upvotes, 0);
		const topProposal = recentProposals.length > 0 ? recentProposals[0] : null;
		const averageUpvotes = totalProposals > 0 ? totalUpvotes / totalProposals : 0;
		
		return {
			totalProposals,
			totalUpvotes,
			topProposal,
			averageUpvotes
		};
	} catch (error) {
		throw error;
	}
}
