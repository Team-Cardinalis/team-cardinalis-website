<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import PageHead from '$lib/components/PageHead.svelte';
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';
	import AuthGuard from '$lib/components/AuthGuard.svelte';
	import { DashboardService } from '$lib/dashboardService';
	import { formatDate, getTimeRemaining } from '$lib/utils/dateUtils';
	import type { DashboardStats, CommunityMetrics } from '$lib/dashboardService';
	import { user } from '$lib';

	const dashboardService = DashboardService.getInstance();
	let stats: DashboardStats | null = null;
	let metrics: CommunityMetrics | null = null;
	let isLoading = true;
	let error: string = '';
	let refreshInterval: NodeJS.Timeout | null = null;

	onMount(() => {
		loadDashboardData();
		
		// Auto-refresh every 30 seconds
		refreshInterval = setInterval(() => {
			loadDashboardData();
		}, 30000);

		return () => {
			if (refreshInterval) {
				clearInterval(refreshInterval);
			}
		};
	});

	async function loadDashboardData(): Promise<void> {
		try {
			isLoading = true;
			error = '';
			
			// Wait for user to be authenticated
			if (!$user) {
				throw new Error('User not authenticated');
			}

			// Load dashboard data
			const [dashboardStats, communityMetrics] = await Promise.all([
				dashboardService.getDashboardStats(),
				dashboardService.getCommunityMetrics()
			]);
			
		} catch (err: any) {
			error = err.message || 'Failed to load dashboard data';
			
			// Create fallback data
			stats = {
				totalMembers: 0,
				activeMembers: 0,
				newMembersThisMonth: 0,
				totalVotes: 0,
				activeVotes: 0,
				totalProposals: 0,
				pendingProposals: 0,
				totalApplications: 0,
				pendingApplications: 0,
				acceptedApplications: 0,
				rejectedApplications: 0,
				monthlyProposals: 0,
				monthlyUpvotes: 0,
				monthlyVotes: 0,
				recentVotes: [],
				recentProposals: [],
				recentApplications: [],
				topProposals: [],
				mostActiveMembers: []
			};
			
			metrics = {
				engagementRate: 0,
				votingParticipation: 0,
				proposalSuccessRate: 0,
				applicationAcceptanceRate: 0,
				averageResponseTime: 0
			};
		} finally {
			isLoading = false;
		}
	}

	function refreshData(): void {
		loadDashboardData();
	}

	function formatNumber(num: number): string {
		if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
		if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
		return num.toString();
	}

	function getStatusColor(status: string): string {
		switch (status) {
			case 'pending': return '#FFC107';
			case 'under_review': return '#17A2B8';
			case 'accepted': return '#34C759';
			case 'rejected': return '#FF3B30';
			case 'active': return '#34C759';
			case 'completed': return '#6C757D';
			default: return 'var(--text-3)';
		}
	}

	function getMetricColor(value: number): string {
		if (value >= 80) return '#34C759';
		if (value >= 60) return '#FFC107';
		return '#FF3B30';
	}
</script>

<PageHead 
	title="Dashboard - Team Cardinalis"
	description="Central hub for community governance and democratic decision-making"
/>

<div class="min-h-screen bg-black">
	<Navigation currentPage="dashboard" />
	
	<AuthGuard>
		<!-- Main Content -->
		<div class="container" style="padding-top: 120px; padding-bottom: var(--gap-8);">
			<!-- Header -->
			<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--gap-6);">
				<div>
					<h1 style="font-size: 2.5rem; font-weight: 700;">Dashboard</h1>
					<p style="color: var(--text-2); font-size: 18px;">
						Central hub for all community governance and democratic decision-making
					</p>
				</div>
				<button
					on:click={loadDashboardData}
					disabled={isLoading}
					class="btn-secondary btn-small"
				>
					{#if isLoading}
						<LoadingIndicator isLoading={true} size="small" />
					{:else}
						Refresh
					{/if}
				</button>
			</div>

			{#if error}
				<div class="message-error" style="margin-bottom: var(--gap-6);">
					<h3 style="margin-bottom: var(--gap-2);">Dashboard Status</h3>
					<p style="margin-bottom: var(--gap-3);">{error}</p>
					<div style="display: flex; gap: var(--gap-3);">
						<button on:click={loadDashboardData} class="btn-primary btn-small">
							Retry
						</button>
						<a href="/auth/login" class="btn-secondary btn-small">
							Sign In Again
						</a>
					</div>
				</div>
			{/if}

			{#if isLoading}
				<div style="display: flex; justify-content: center; align-items: center; padding: var(--gap-8) 0;">
					<LoadingIndicator isLoading={true} size="large" />
				</div>
			{:else}
				<!-- Democratic Hub -->
				<div class="card" style="margin-bottom: var(--gap-6);">
					<h3 style="margin-bottom: var(--gap-4);">Democratic Hub</h3>
					<p style="color: var(--text-2); margin-bottom: var(--gap-4);">
						Access all democratic features and community governance tools
					</p>
					
					<!-- Action Buttons Grid -->
					<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--gap-3);">
						<a href="/dashboard/propose" class="btn-primary">
							Create Vote
						</a>
						<a href="/dashboard/proposals" class="btn-secondary">
							Proposals {stats?.pendingProposals ? `(${stats.pendingProposals})` : ''}
						</a>
						<a href="/dashboard/applications" class="btn-secondary">
							Applications {stats?.pendingApplications ? `(${stats.pendingApplications})` : ''}
						</a>
						<a href="/dashboard/final-votes" class="btn-secondary">
							Final Votes
						</a>
						<a href="/dashboard/account" class="btn-secondary">
							My Account
						</a>
					</div>
				</div>

				{#if stats && metrics}
					<!-- Dashboard Content -->
					<!-- Overview Metrics -->
					<div class="grid grid-4" style="margin-bottom: var(--gap-6);">
						<div class="card" style="text-align: center;">
							<h3 style="font-size: 1.2rem; color: var(--text-2); margin-bottom: var(--gap-2);">Total Members</h3>
							<p style="font-size: 2.5rem; font-weight: 700; color: var(--text);">{formatNumber(stats.totalMembers)}</p>
						</div>
						<div class="card" style="text-align: center;">
							<h3 style="font-size: 1.2rem; color: var(--text-2); margin-bottom: var(--gap-2);">Active Votes</h3>
							<p style="font-size: 2.5rem; font-weight: 700; color: var(--text);">{formatNumber(stats.activeVotes)}</p>
						</div>
						<div class="card" style="text-align: center;">
							<h3 style="font-size: 1.2rem; color: var(--text-2); margin-bottom: var(--gap-2);">Pending Proposals</h3>
							<p style="font-size: 2.5rem; font-weight: 700; color: var(--text);">{formatNumber(stats.pendingProposals)}</p>
						</div>
						<div class="card" style="text-align: center;">
							<h3 style="font-size: 1.2rem; color: var(--text-2); margin-bottom: var(--gap-2);">Pending Applications</h3>
							<p style="font-size: 2.5rem; font-weight: 700; color: var(--text);">{formatNumber(stats.pendingApplications)}</p>
						</div>
					</div>

					<!-- Community Health Metrics -->
					<div class="card" style="margin-bottom: var(--gap-6);">
						<h3 style="margin-bottom: var(--gap-4);">Community Health Metrics</h3>
						<div class="grid grid-3">
							<div style="padding: var(--gap-3); background: var(--surface-elevated); border-radius: var(--r-sm); border: 1px solid var(--divider);">
								<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--gap-1);">
									<span style="font-weight: 500; color: var(--text-2);">Engagement Rate</span>
									<span style="font-size: 15px; color: {getMetricColor(metrics.engagementRate)};">
										{metrics.engagementRate.toFixed(1)}%
									</span>
								</div>
								<div class="progress">
									<div
										class="progress-fill"
										style="width: {metrics.engagementRate}%; background: {getMetricColor(metrics.engagementRate)};"
									></div>
								</div>
							</div>
							<div style="padding: var(--gap-3); background: var(--surface-elevated); border-radius: var(--r-sm); border: 1px solid var(--divider);">
								<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--gap-1);">
									<span style="font-weight: 500; color: var(--text-2);">Vote Participation</span>
									<span style="font-size: 15px; color: {getMetricColor(metrics.votingParticipation)};">
										{metrics.votingParticipation.toFixed(1)}%
									</span>
								</div>
								<div class="progress">
									<div
										class="progress-fill"
										style="width: {metrics.votingParticipation}%; background: {getMetricColor(metrics.votingParticipation)};"
									></div>
								</div>
							</div>
							<div style="padding: var(--gap-3); background: var(--surface-elevated); border-radius: var(--r-sm); border: 1px solid var(--divider);">
								<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--gap-1);">
									<span style="font-weight: 500; color: var(--text-2);">Application Acceptance</span>
									<span style="font-size: 15px; color: {getMetricColor(metrics.applicationAcceptanceRate)};">
										{metrics.applicationAcceptanceRate.toFixed(1)}%
									</span>
								</div>
								<div class="progress">
									<div
										class="progress-fill"
										style="width: {metrics.applicationAcceptanceRate}%; background: {getMetricColor(metrics.applicationAcceptanceRate)};"
									></div>
								</div>
							</div>
						</div>
					</div>

					<!-- Active Votes -->
					<div class="card" style="margin-bottom: var(--gap-6);">
						<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--gap-3);">
							<h3>Active Votes</h3>
							<a href="/dashboard/propose" class="btn-primary btn-small">
								Create New Vote
							</a>
						</div>
						{#if stats.activeVotes === 0}
							<div style="text-align: center; padding: var(--gap-4); color: var(--text-3);">
								<p style="font-style: italic;">No active votes at the moment</p>
								<p style="font-size: 14px; margin-top: var(--gap-2);">
									Be the first to create a community vote!
								</p>
							</div>
						{:else}
							<div style="display: flex; flex-direction: column; gap: var(--gap-3);">
								{#each stats.recentVotes.slice(0, 5) as vote}
									<div style="padding: var(--gap-3); background: var(--surface-elevated); border-radius: var(--r-sm); border: 1px solid var(--divider);">
										<div style="display: flex; justify-content: space-between; align-items: flex-start;">
											<div style="flex: 1;">
												<h4 style="margin-bottom: var(--gap-1); font-weight: 600;">{vote.title}</h4>
												<p style="color: var(--text-2); font-size: 14px; margin-bottom: var(--gap-2);">
													{vote.description}
												</p>
												<div style="display: flex; gap: var(--gap-3); font-size: 12px; color: var(--text-3);">
													<span>Created: {formatDate(vote.createdAt)}</span>
													<span>Ends: {getTimeRemaining(vote.endDate)}</span>
													<span>Votes: {vote.totalVotes || 0}</span>
												</div>
											</div>
											<div style="text-align: right;">
												<div style="font-size: 14px; color: {getStatusColor(vote.isActive ? 'active' : 'completed')};">
													{vote.isActive ? 'Active' : 'Completed'}
												</div>
											</div>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>

					<!-- Recent Proposals -->
					<div class="card" style="margin-bottom: var(--gap-6);">
						<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--gap-3);">
							<h3>Recent Proposals</h3>
							<a href="/dashboard/proposals" class="btn-secondary btn-small">
								View All
							</a>
						</div>
						{#if stats.recentProposals.length === 0}
							<div style="text-align: center; padding: var(--gap-4); color: var(--text-3);">
								<p style="font-style: italic;">No proposals yet</p>
								<p style="font-size: 14px; margin-top: var(--gap-2);">
									Start a discussion with your first proposal!
								</p>
							</div>
						{:else}
							<div style="display: flex; flex-direction: column; gap: var(--gap-3);">
								{#each stats.recentProposals.slice(0, 5) as proposal}
									<div style="padding: var(--gap-3); background: var(--surface-elevated); border-radius: var(--r-sm); border: 1px solid var(--divider);">
										<div style="display: flex; justify-content: space-between; align-items: flex-start;">
											<div style="flex: 1;">
												<h4 style="margin-bottom: var(--gap-1); font-weight: 600;">{proposal.title}</h4>
												<p style="color: var(--text-2); font-size: 14px; margin-bottom: var(--gap-2);">
													{proposal.description}
												</p>
												<div style="display: flex; gap: var(--gap-3); font-size: 12px; color: var(--text-3);">
													<span>Created: {formatDate(proposal.createdAt)}</span>
													<span>Upvotes: {proposal.upvotes}</span>
													<span>Discussions: {proposal.discussions?.length || 0}</span>
												</div>
											</div>
											<div style="text-align: right;">
												<div style="font-size: 14px; color: {getStatusColor(proposal.status)};">
													{proposal.status}
												</div>
											</div>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>

					<!-- Recent Applications -->
					<div class="card">
						<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--gap-3);">
							<h3>Recent Applications</h3>
							<a href="/dashboard/applications" class="btn-secondary btn-small">
								View All
							</a>
						</div>
						{#if stats.recentApplications.length === 0}
							<div style="text-align: center; padding: var(--gap-4); color: var(--text-3);">
								<p style="font-style: italic;">No applications yet</p>
								<p style="font-size: 14px; margin-top: var(--gap-2);">
									Applications will appear here as they are submitted.
								</p>
							</div>
						{:else}
							<div style="display: flex; flex-direction: column; gap: var(--gap-3);">
								{#each stats.recentApplications.slice(0, 5) as application}
									<div style="padding: var(--gap-3); background: var(--surface-elevated); border-radius: var(--r-sm); border: 1px solid var(--divider);">
										<div style="display: flex; justify-content: space-between; align-items: flex-start;">
											<div style="flex: 1;">
												<h4 style="margin-bottom: var(--gap-1); font-weight: 600;">{application.game} Application</h4>
												<p style="color: var(--text-2); font-size: 14px; margin-bottom: var(--gap-2);">
													{application.motivation}
												</p>
												<div style="display: flex; gap: var(--gap-3); font-size: 12px; color: var(--text-3);">
													<span>Applied: {formatDate(application.createdAt)}</span>
													<span>Experience: {application.experience}</span>
												</div>
											</div>
											<div style="text-align: right;">
												<div style="font-size: 14px; color: {getStatusColor(application.status)};">
													{application.status}
												</div>
											</div>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				{/if}
			{/if}
		</div>
	</AuthGuard>
</div>