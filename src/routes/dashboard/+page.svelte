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
	let activeTab = 'overview';

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

	function setActiveTab(tab: string): void {
		activeTab = tab;
	}

	const tabs = [
		{ id: 'overview', label: 'Overview' },
		{ id: 'votes', label: 'Votes' },
		{ id: 'proposals', label: 'Proposals' },
		{ id: 'applications', label: 'Applications' },
		{ id: 'community', label: 'Community' },
		{ id: 'account', label: 'Account' }
	];
</script>

<PageHead 
	title="Dashboard - Team Cardinalis"
	description="Central hub for community governance and democratic decision-making"
/>

<div class="min-h-screen bg-black">
	<Navigation currentPage="dashboard" />
	
	<AuthGuard>
		<!-- Main Content -->
		<div class="dashboard-container">
			<!-- Header -->
			<div class="dashboard-header">
				<div class="header-content">
					<h1>Dashboard</h1>
					<p>Community governance and democratic decision-making</p>
				</div>
				<button
					on:click={loadDashboardData}
					disabled={isLoading}
					class="refresh-btn"
				>
					{#if isLoading}
						<LoadingIndicator isLoading={true} size="small" />
					{:else}
						Refresh
					{/if}
				</button>
			</div>

			{#if error}
				<div class="error-state">
					<h3>Dashboard Status</h3>
					<p>{error}</p>
					<div class="error-actions">
						<button on:click={loadDashboardData} class="btn-primary">
							Retry
						</button>
						<a href="/auth/login" class="btn-secondary">
							Sign In Again
						</a>
					</div>
				</div>
			{/if}

			{#if isLoading}
				<div class="loading-state">
					<LoadingIndicator isLoading={true} size="large" />
				</div>
			{:else}
				<!-- Tab Navigation -->
				<div class="tab-navigation">
					{#each tabs as tab}
						<button
							class="tab-button"
							class:active={activeTab === tab.id}
							on:click={() => setActiveTab(tab.id)}
						>
							<span class="tab-label">{tab.label}</span>
							{#if tab.id === 'proposals' && stats?.pendingProposals}
								<span class="tab-badge">{stats.pendingProposals}</span>
							{/if}
							{#if tab.id === 'applications' && stats?.pendingApplications}
								<span class="tab-badge">{stats.pendingApplications}</span>
							{/if}
						</button>
					{/each}
				</div>

				<!-- Tab Content -->
				<div class="tab-content">
					{#if activeTab === 'overview'}
						{#if stats && metrics}
							<!-- Key Metrics -->
							<div class="metrics-grid">
								<div class="metric-item">
									<div class="metric-value">{formatNumber(stats.totalMembers)}</div>
									<div class="metric-label">Total Members</div>
								</div>
								<div class="metric-item">
									<div class="metric-value">{formatNumber(stats.activeVotes)}</div>
									<div class="metric-label">Active Votes</div>
								</div>
								<div class="metric-item">
									<div class="metric-value">{formatNumber(stats.pendingProposals)}</div>
									<div class="metric-label">Pending Proposals</div>
								</div>
								<div class="metric-item">
									<div class="metric-value">{formatNumber(stats.pendingApplications)}</div>
									<div class="metric-label">Pending Applications</div>
								</div>
							</div>

							<!-- Community Health -->
							<div class="health-section">
								<h2>Community Health</h2>
								<div class="health-metrics">
									<div class="health-item">
										<div class="health-header">
											<span class="health-label">Engagement Rate</span>
											<span class="health-value" style="color: {getMetricColor(metrics.engagementRate)};">
												{metrics.engagementRate.toFixed(1)}%
											</span>
										</div>
										<div class="health-bar">
											<div class="health-fill" style="width: {metrics.engagementRate}%; background: {getMetricColor(metrics.engagementRate)};"></div>
										</div>
									</div>
									<div class="health-item">
										<div class="health-header">
											<span class="health-label">Vote Participation</span>
											<span class="health-value" style="color: {getMetricColor(metrics.votingParticipation)};">
												{metrics.votingParticipation.toFixed(1)}%
											</span>
										</div>
										<div class="health-bar">
											<div class="health-fill" style="width: {metrics.votingParticipation}%; background: {getMetricColor(metrics.votingParticipation)};"></div>
										</div>
									</div>
									<div class="health-item">
										<div class="health-header">
											<span class="health-label">Application Acceptance</span>
											<span class="health-value" style="color: {getMetricColor(metrics.applicationAcceptanceRate)};">
												{metrics.applicationAcceptanceRate.toFixed(1)}%
											</span>
										</div>
										<div class="health-bar">
											<div class="health-fill" style="width: {metrics.applicationAcceptanceRate}%; background: {getMetricColor(metrics.applicationAcceptanceRate)};"></div>
										</div>
									</div>
								</div>
							</div>
						{/if}
					{:else if activeTab === 'votes'}
						<div class="tab-section">
							<div class="section-header">
								<h2>Voting System</h2>
								<a href="/dashboard/propose" class="btn-primary">
									Create New Vote
								</a>
							</div>
							
							{#if stats?.activeVotes === 0}
								<div class="empty-state">
									<p>No active votes at the moment</p>
									<span>Be the first to create a community vote!</span>
								</div>
							{:else}
								<div class="activity-list">
									{#each (stats?.recentVotes || []).slice(0, 10) as vote}
										<div class="activity-item">
											<div class="activity-content">
												<h4>{vote.title}</h4>
												<p>{vote.description}</p>
												<div class="activity-meta">
													<span>Created: {formatDate(vote.createdAt)}</span>
													<span>Ends: {getTimeRemaining(vote.endDate)}</span>
													<span>Votes: {vote.totalVotes || 0}</span>
												</div>
											</div>
											<div class="activity-status" style="color: {getStatusColor(vote.isActive ? 'active' : 'completed')};">
												{vote.isActive ? 'Active' : 'Completed'}
											</div>
										</div>
									{/each}
								</div>
							{/if}
						</div>
					{:else if activeTab === 'proposals'}
						<div class="tab-section">
							<div class="section-header">
								<h2>Community Proposals</h2>
								<a href="/dashboard/propose" class="btn-primary">
									Create Proposal
								</a>
							</div>
							
							{#if stats?.recentProposals.length === 0}
								<div class="empty-state">
									<p>No proposals yet</p>
									<span>Start a discussion with your first proposal!</span>
								</div>
							{:else}
								<div class="activity-list">
									{#each (stats?.recentProposals || []).slice(0, 10) as proposal}
										<div class="activity-item">
											<div class="activity-content">
												<h4>{proposal.title}</h4>
												<p>{proposal.description}</p>
												<div class="activity-meta">
													<span>Created: {formatDate(proposal.createdAt)}</span>
													<span>Upvotes: {proposal.upvotes}</span>
													<span>Discussions: {proposal.discussions?.length || 0}</span>
												</div>
											</div>
											<div class="activity-status" style="color: {getStatusColor(proposal.status)};">
												{proposal.status}
											</div>
										</div>
									{/each}
								</div>
							{/if}
						</div>
					{:else if activeTab === 'applications'}
						<div class="tab-section">
							<div class="section-header">
								<h2>Team Applications</h2>
								<a href="/dashboard/apply" class="btn-primary">
									Apply to Team
								</a>
							</div>
							
							{#if stats?.recentApplications.length === 0}
								<div class="empty-state">
									<p>No applications yet</p>
									<span>Applications will appear here as they are submitted.</span>
								</div>
							{:else}
								<div class="activity-list">
									{#each (stats?.recentApplications || []).slice(0, 10) as application}
										<div class="activity-item">
											<div class="activity-content">
												<h4>{application.game} Application</h4>
												<p>{application.motivation}</p>
												<div class="activity-meta">
													<span>Applied: {formatDate(application.createdAt)}</span>
													<span>Experience: {application.experience}</span>
												</div>
											</div>
											<div class="activity-status" style="color: {getStatusColor(application.status)};">
												{application.status}
											</div>
										</div>
									{/each}
								</div>
							{/if}
						</div>
					{:else if activeTab === 'community'}
						<div class="tab-section">
							<div class="section-header">
								<h2>Community Members</h2>
								<span class="member-count">{stats?.totalMembers || 0} members</span>
							</div>
							
							{#if stats?.mostActiveMembers.length === 0}
								<div class="empty-state">
									<p>No community data available</p>
									<span>Community information will appear here.</span>
								</div>
							{:else}
								<div class="community-grid">
									{#each (stats?.mostActiveMembers || []).slice(0, 12) as member}
										<div class="member-card">
											<div class="member-avatar">
												{member.displayName.charAt(0).toUpperCase()}
											</div>
											<div class="member-info">
												<h4>{member.displayName}</h4>
												<p>{member.role}</p>
												<span class="activity-score">Activity: {member.activityScore}</span>
											</div>
										</div>
									{/each}
								</div>
							{/if}
						</div>
					{:else if activeTab === 'account'}
						<div class="tab-section">
							<div class="section-header">
								<h2>Account Settings</h2>
							</div>
							
							<div class="account-settings">
								<div class="setting-group">
									<h3>Profile Information</h3>
									<div class="setting-item">
										<span class="setting-label">Display Name</span>
										<span>{$user?.displayName || 'Not set'}</span>
									</div>
									<div class="setting-item">
										<span class="setting-label">Email</span>
										<span>{$user?.email || 'Not set'}</span>
									</div>
									<div class="setting-item">
										<span class="setting-label">Member Since</span>
										<span>{$user?.metadata?.creationTime ? formatDate(new Date($user.metadata.creationTime).getTime()) : 'Unknown'}</span>
									</div>
								</div>
								
								<div class="setting-group">
									<h3>Quick Actions</h3>
									<div class="action-buttons">
										<a href="/dashboard/account" class="btn-secondary">Edit Profile</a>
										<a href="/dashboard/apply" class="btn-secondary">Apply to Team</a>
										<button class="btn-secondary" on:click={() => {}}>Export Data</button>
									</div>
								</div>
							</div>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</AuthGuard>
</div>

<style>
	.dashboard-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 120px var(--gap-4) var(--gap-8);
	}

	.dashboard-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: var(--gap-8);
		padding-bottom: var(--gap-6);
		border-bottom: 1px solid var(--divider);
	}

	.header-content h1 {
		font-size: 3rem;
		font-weight: 600;
		margin-bottom: var(--gap-2);
		color: var(--text);
	}

	.header-content p {
		font-size: 18px;
		color: var(--text-2);
		margin: 0;
	}

	.refresh-btn {
		background: transparent;
		border: 1px solid var(--divider);
		color: var(--text-2);
		padding: var(--gap-2) var(--gap-3);
		border-radius: var(--r-sm);
		font-size: 14px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.refresh-btn:hover {
		border-color: var(--divider-medium);
		color: var(--text);
	}

	.error-state {
		text-align: center;
		padding: var(--gap-6);
		margin-bottom: var(--gap-6);
		border: 1px solid rgba(255, 59, 48, 0.2);
		border-radius: var(--r-sm);
		background: rgba(255, 59, 48, 0.05);
	}

	.error-state h3 {
		color: #ff3b30;
		margin-bottom: var(--gap-2);
	}

	.error-state p {
		color: var(--text-2);
		margin-bottom: var(--gap-4);
	}

	.error-actions {
		display: flex;
		gap: var(--gap-3);
		justify-content: center;
	}

	.loading-state {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: var(--gap-8) 0;
	}

	.tab-navigation {
		display: flex;
		gap: var(--gap-1);
		margin-bottom: var(--gap-6);
		padding-bottom: var(--gap-4);
		border-bottom: 1px solid var(--divider);
		overflow-x: auto;
	}

	.tab-button {
		display: flex;
		align-items: center;
		gap: var(--gap-2);
		padding: var(--gap-3) var(--gap-4);
		border: none;
		background: transparent;
		color: var(--text-2);
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		border-radius: var(--r-sm);
		transition: all 0.2s ease;
		white-space: nowrap;
		position: relative;
	}

	.tab-button:hover {
		color: var(--text);
		background: var(--surface);
	}

	.tab-button.active {
		color: var(--text);
		background: var(--surface-elevated);
		border: 1px solid var(--divider);
	}

	.tab-label {
		font-size: 14px;
	}

	.tab-badge {
		background: var(--accent);
		color: white;
		font-size: 11px;
		font-weight: 600;
		padding: 2px 6px;
		border-radius: 10px;
		min-width: 18px;
		text-align: center;
	}

	.tab-content {
		min-height: 400px;
	}

	.tab-section {
		animation: fadeIn 0.3s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.metrics-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--gap-6);
		margin-bottom: var(--gap-8);
	}

	.metric-item {
		text-align: center;
		padding: var(--gap-4) 0;
	}

	.metric-value {
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--text);
		margin-bottom: var(--gap-1);
		line-height: 1;
	}

	.metric-label {
		font-size: 14px;
		color: var(--text-2);
		font-weight: 500;
	}

	.health-section {
		margin-bottom: var(--gap-8);
	}

	.health-section h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: var(--gap-5);
		color: var(--text);
	}

	.health-metrics {
		display: flex;
		flex-direction: column;
		gap: var(--gap-4);
	}

	.health-item {
		padding: var(--gap-4) 0;
		border-bottom: 1px solid var(--divider);
	}

	.health-item:last-child {
		border-bottom: none;
	}

	.health-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--gap-2);
	}

	.health-label {
		font-weight: 500;
		color: var(--text-2);
		font-size: 14px;
	}

	.health-value {
		font-size: 15px;
		font-weight: 600;
	}

	.health-bar {
		height: 4px;
		background: var(--surface);
		border-radius: 2px;
		overflow: hidden;
	}

	.health-fill {
		height: 100%;
		border-radius: 2px;
		transition: width 0.3s ease;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--gap-6);
		padding-bottom: var(--gap-3);
		border-bottom: 1px solid var(--divider);
	}

	.section-header h2 {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--text);
		margin: 0;
	}

	.empty-state {
		text-align: center;
		padding: var(--gap-6);
		color: var(--text-3);
	}

	.empty-state p {
		font-style: italic;
		margin-bottom: var(--gap-1);
	}

	.empty-state span {
		font-size: 14px;
	}

	.activity-list {
		display: flex;
		flex-direction: column;
		gap: var(--gap-4);
	}

	.activity-item {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: var(--gap-4) 0;
		border-bottom: 1px solid var(--divider);
	}

	.activity-item:last-child {
		border-bottom: none;
	}

	.activity-content {
		flex: 1;
	}

	.activity-content h4 {
		font-size: 1rem;
		font-weight: 600;
		color: var(--text);
		margin-bottom: var(--gap-1);
	}

	.activity-content p {
		color: var(--text-2);
		font-size: 14px;
		margin-bottom: var(--gap-2);
		line-height: 1.4;
	}

	.activity-meta {
		display: flex;
		gap: var(--gap-3);
		font-size: 12px;
		color: var(--text-3);
		flex-wrap: wrap;
	}

	.activity-status {
		font-size: 14px;
		font-weight: 500;
		margin-left: var(--gap-3);
	}

	.community-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: var(--gap-4);
	}

	.member-card {
		display: flex;
		align-items: center;
		gap: var(--gap-3);
		padding: var(--gap-4);
		border: 1px solid var(--divider);
		border-radius: var(--r-sm);
		background: var(--surface);
		transition: all 0.2s ease;
	}

	.member-card:hover {
		border-color: var(--divider-medium);
		background: var(--surface-elevated);
	}

	.member-avatar {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: var(--accent);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 18px;
		font-weight: 600;
		flex-shrink: 0;
	}

	.member-info {
		flex: 1;
		min-width: 0;
	}

	.member-info h4 {
		font-size: 16px;
		font-weight: 600;
		color: var(--text);
		margin-bottom: var(--gap-1);
	}

	.member-info p {
		font-size: 14px;
		color: var(--text-2);
		margin-bottom: var(--gap-1);
	}

	.activity-score {
		font-size: 12px;
		color: var(--text-3);
	}

	.member-count {
		font-size: 14px;
		color: var(--text-2);
		font-weight: 500;
	}

	.account-settings {
		display: flex;
		flex-direction: column;
		gap: var(--gap-6);
	}

	.setting-group {
		padding: var(--gap-4) 0;
		border-bottom: 1px solid var(--divider);
	}

	.setting-group:last-child {
		border-bottom: none;
	}

	.setting-group h3 {
		font-size: 18px;
		font-weight: 600;
		color: var(--text);
		margin-bottom: var(--gap-4);
	}

	.setting-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--gap-3) 0;
		border-bottom: 1px solid var(--divider);
	}

	.setting-item:last-child {
		border-bottom: none;
	}

	.setting-label {
		font-size: 14px;
		color: var(--text-2);
		font-weight: 500;
	}

	.setting-item span {
		font-size: 14px;
		color: var(--text);
	}

	.action-buttons {
		display: flex;
		gap: var(--gap-3);
		flex-wrap: wrap;
	}

	@media (max-width: 768px) {
		.dashboard-container {
			padding: 100px var(--gap-3) var(--gap-6);
		}

		.dashboard-header {
			flex-direction: column;
			gap: var(--gap-4);
			align-items: flex-start;
		}

		.header-content h1 {
			font-size: 2rem;
		}

		.tab-navigation {
			gap: var(--gap-1);
			padding-bottom: var(--gap-3);
		}

		.tab-button {
			padding: var(--gap-2) var(--gap-3);
			font-size: 13px;
		}

		.metrics-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: var(--gap-4);
		}

		.section-header {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--gap-3);
		}

		.activity-item {
			flex-direction: column;
			gap: var(--gap-2);
		}

		.activity-status {
			margin-left: 0;
			align-self: flex-start;
		}

		.activity-meta {
			flex-direction: column;
			gap: var(--gap-1);
		}

		.community-grid {
			grid-template-columns: 1fr;
		}

		.member-card {
			padding: var(--gap-3);
		}

		.action-buttons {
			flex-direction: column;
		}
	}

	@media (max-width: 480px) {
		.metrics-grid {
			grid-template-columns: 1fr;
		}

		.metric-value {
			font-size: 2rem;
		}
	}
</style>