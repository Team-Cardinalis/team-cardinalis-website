<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import PageHead from '$lib/components/PageHead.svelte';
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';
	import AuthGuard from '$lib/components/AuthGuard.svelte';
	import { AdvancedVotingService } from '$lib/advancedVotingService';
	import { formatDate, getTimeRemaining } from '$lib/utils/dateUtils';
	import type { Application, ApplicationComment } from '$lib/types';
	import { page } from '$app/stores';
	import { user } from '$lib';
	import { ref, get } from 'firebase/database';
	import { database } from '$lib/firebase';

	const votingService = AdvancedVotingService.getInstance();
	let applications: Application[] = [];
	let userVotes: Map<string, string> = new Map();
	let isLoading = true;
	let error: string = '';
	let unsubscribe: (() => void) | null = null;
	let selectedApplication: Application | null = null;
	let commentContent = '';
	let commentType: 'general' | 'concern' | 'support' = 'general';

	$: gameFilter = $page.url.searchParams.get('game');

	onMount(() => {
		// Listen to real-time changes
		unsubscribe = votingService.onApplicationsChange(async (updatedApplications: Application[]) => {
			applications = updatedApplications;
			if ($user) {
				await loadUserVotes();
			}
		});

		return () => {
			if (unsubscribe) {
				unsubscribe();
			}
		};
	});

	async function loadUserVotes(): Promise<void> {
		if (!$user) return;

		const newUserVotes = new Map<string, string>();
		for (const application of applications) {
			try {
				const userVoteRef = ref(database, `applicationVotes/${$user.uid}/${application.id}`);
				const snapshot = await get(userVoteRef);
				if (snapshot.exists()) {
					const vote = snapshot.val();
					newUserVotes.set(application.id, vote.vote);
				}
			} catch (err) {
				console.error('Error loading user vote:', err);
			}
		}
		userVotes = newUserVotes;
	}

	async function handleVote(applicationId: string, vote: 'accept' | 'reject' | 'abstain'): Promise<void> {
		if (!$user) return;

		try {
			error = '';
			await votingService.voteOnApplication(applicationId, vote, $user.uid);
			await loadUserVotes();
		} catch (err: any) {
			error = err.message || 'Error voting on application';
		}
	}

	async function handleAddComment(): Promise<void> {
		if (!$user || !selectedApplication || !commentContent.trim()) return;

		try {
			error = '';
			const userProfile = await votingService.getUserProfile($user.uid);
			const authorName = userProfile?.displayName || $user.email || 'Anonymous';
			
			await votingService.addApplicationComment(
				selectedApplication.id,
				$user.uid,
				authorName,
				commentContent,
				commentType
			);
			
			commentContent = '';
		} catch (err: any) {
			error = err.message || 'Error adding comment';
		}
	}

	function hasUserVoted(applicationId: string): boolean {
		return userVotes.has(applicationId);
	}

	function getUserVote(applicationId: string): string | null {
		return userVotes.get(applicationId) || null;
	}

	function getVotePercentage(application: Application, voteType: 'accept' | 'reject' | 'abstain'): number {
		if (application.totalVotes === 0) return 0;
		return (application.votes[voteType] / application.totalVotes) * 100;
	}

	function getStatusColor(status: string): string {
		switch (status) {
			case 'pending': return '#FFC107';
			case 'under_review': return '#17A2B8';
			case 'accepted': return '#34C759';
			case 'rejected': return '#FF3B30';
			default: return 'var(--text-3)';
		}
	}

	function getStatusText(status: string): string {
		switch (status) {
			case 'pending': return 'Pending Review';
			case 'under_review': return 'Under Review';
			case 'accepted': return 'Accepted';
			case 'rejected': return 'Rejected';
			default: return status;
		}
	}

	$: filteredApplications = gameFilter 
		? applications.filter(app => app.game === gameFilter)
		: applications;
</script>

<PageHead 
	title="Application Reviews - Team Cardinalis"
	description="Review and vote on community applications"
/>

<div class="min-h-screen bg-black">
	<Navigation currentPage="dashboard" />
	
	<AuthGuard>
		<!-- Main Content -->
		<div class="container" style="padding-top: 120px; padding-bottom: var(--gap-8);">
			<div style="margin-bottom: var(--gap-6);">
				<h1 style="font-size: 2.5rem; font-weight: 700;">Application Reviews</h1>
				<p style="color: var(--text-2); font-size: 18px;">
					Review and vote on community applications for Team Cardinalis
				</p>
			</div>

			<!-- Filters -->
			<div style="margin-bottom: var(--gap-6);">
				<div style="display: flex; gap: var(--gap-3);">
					<a
						href="/dashboard/applications"
						class="badge {!gameFilter ? 'badge-active' : ''}"
					>
						All
					</a>
					<a
						href="/dashboard/applications?game=apex-legends"
						class="badge {gameFilter === 'apex-legends' ? 'badge-active' : ''}"
					>
						Apex Legends
					</a>
					<a
						href="/dashboard/applications?game=valorant"
						class="badge {gameFilter === 'valorant' ? 'badge-active' : ''}"
					>
						Valorant
					</a>
				</div>
			</div>

			{#if error}
				<div class="message-error">
					{error}
				</div>
			{/if}

			{#if isLoading}
				<div style="display: flex; justify-content: center; align-items: center; padding: var(--gap-8) 0;">
					<LoadingIndicator isLoading={true} size="large" />
				</div>
			{:else if filteredApplications.length === 0}
				<div style="text-align: center; padding: var(--gap-8) 0;">
					<div style="font-size: 4rem; margin-bottom: var(--gap-4);"></div>
					<h2 style="font-size: 2rem; font-weight: 600; margin-bottom: var(--gap-3);">No Applications</h2>
					<p style="color: var(--text-2); margin-bottom: var(--gap-5);">
						{#if gameFilter}
							No applications for {gameFilter === 'apex-legends' ? 'Apex Legends' : 'Valorant'} division
						{:else}
							No applications are currently pending review
						{/if}
					</p>
					<a href="/dashboard/apply" class="btn-primary btn-small">
						Submit Application
					</a>
				</div>
			{:else}
				<div style="display: flex; flex-direction: column; gap: var(--gap-4);">
					{#each filteredApplications as application (application.id)}
						<div class="card">
							<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--gap-4);">
								<div style="flex: 1;">
									<h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: var(--gap-1);">
										{application.applicantName}
									</h3>
									<p style="color: var(--text-2); margin-bottom: var(--gap-3);">
										{application.game === 'apex-legends' ? 'Apex Legends' : 'Valorant'} Division
									</p>
									<div style="display: flex; align-items: center; gap: var(--gap-3); font-size: 15px; color: var(--text-3);">
										<span>Applied on {formatDate(application.createdAt)}</span>
										<span>•</span>
										<span>Review ends {formatDate(application.reviewEndDate)}</span>
										<span>•</span>
										<span style="color: var(--text);">{getTimeRemaining(application.reviewEndDate)} remaining</span>
									</div>
								</div>
								<div style="text-align: right;">
									<div style="padding: 8px 16px; border-radius: var(--r-sm); font-weight: 500; background: rgba(255, 255, 255, 0.1); color: {getStatusColor(application.status)}; margin-bottom: var(--gap-2);">
										{getStatusText(application.status)}
									</div>
									<div style="font-size: 1.5rem; font-weight: 700; color: var(--text);">{application.totalVotes}</div>
									<div style="font-size: 15px; color: var(--text-3);">votes</div>
								</div>
							</div>

							<!-- Application Details -->
							<div style="margin-bottom: var(--gap-4);">
								<h4 style="margin-bottom: var(--gap-3);">Application Details</h4>
								<div style="display: flex; flex-direction: column; gap: var(--gap-3);">
									<div>
										<span style="font-weight: 500; color: var(--text-2);">Experience:</span>
										<p style="margin-top: var(--gap-1);">{application.experience}</p>
									</div>
									<div>
										<span style="font-weight: 500; color: var(--text-2);">Motivation:</span>
										<p style="margin-top: var(--gap-1);">{application.motivation}</p>
									</div>
									<div>
										<span style="font-weight: 500; color: var(--text-2);">Availability:</span>
										<p style="margin-top: var(--gap-1);">{application.availability}</p>
									</div>
									{#if application.additionalInfo}
										<div>
											<span style="font-weight: 500; color: var(--text-2);">Additional Information:</span>
											<p style="margin-top: var(--gap-1);">{application.additionalInfo}</p>
										</div>
									{/if}
								</div>
							</div>

							<!-- Vote Results -->
							{#if application.totalVotes > 0}
								<div style="margin-bottom: var(--gap-4);">
									<h4 style="margin-bottom: var(--gap-3);">Vote Results</h4>
									<div style="display: flex; gap: var(--gap-2);">
										<div style="flex: 1; padding: var(--gap-3); background: var(--surface); border-radius: var(--r-sm); border: 1px solid var(--divider);">
											<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--gap-1);">
												<span style="font-weight: 500; color: #34C759;">Accept</span>
												<span style="font-size: 15px; color: var(--text-3);">
													{application.votes.accept} ({getVotePercentage(application, 'accept').toFixed(1)}%)
												</span>
											</div>
											<div class="progress">
												<div
													class="progress-fill"
													style="width: {getVotePercentage(application, 'accept')}%; background: #34C759;"
												></div>
											</div>
										</div>
										<div style="flex: 1; padding: var(--gap-3); background: var(--surface); border-radius: var(--r-sm); border: 1px solid var(--divider);">
											<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--gap-1);">
												<span style="font-weight: 500; color: #FF3B30;">Reject</span>
												<span style="font-size: 15px; color: var(--text-3);">
													{application.votes.reject} ({getVotePercentage(application, 'reject').toFixed(1)}%)
												</span>
											</div>
											<div class="progress">
												<div
													class="progress-fill"
													style="width: {getVotePercentage(application, 'reject')}%; background: #FF3B30;"
												></div>
											</div>
										</div>
										<div style="flex: 1; padding: var(--gap-3); background: var(--surface); border-radius: var(--r-sm); border: 1px solid var(--divider);">
											<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--gap-1);">
												<span style="font-weight: 500; color: var(--text-3);">Abstain</span>
												<span style="font-size: 15px; color: var(--text-3);">
													{application.votes.abstain} ({getVotePercentage(application, 'abstain').toFixed(1)}%)
												</span>
											</div>
											<div class="progress">
												<div
													class="progress-fill"
													style="width: {getVotePercentage(application, 'abstain')}%; background: var(--text-3);"
												></div>
											</div>
										</div>
									</div>
								</div>
							{/if}

							<!-- Voting Actions -->
							{#if application.status === 'pending' || application.status === 'under_review'}
								<div style="margin-bottom: var(--gap-4);">
									<h4 style="margin-bottom: var(--gap-3);">Your Vote</h4>
									{#if hasUserVoted(application.id)}
										<div style="padding: var(--gap-3); background: rgba(52, 199, 89, 0.1); border-radius: var(--r-sm); border: 1px solid rgba(52, 199, 89, 0.2); text-align: center;">
											<span style="color: #34C759; font-size: 14px;">
												You voted: {getUserVote(application.id)?.toUpperCase()}
											</span>
										</div>
									{:else}
										<div style="display: flex; gap: var(--gap-3);">
											<button
												on:click={() => handleVote(application.id, 'accept')}
												class="btn-primary btn-small"
												style="flex: 1; background: #34C759;"
											>
												Accept
											</button>
											<button
												on:click={() => handleVote(application.id, 'reject')}
												class="btn-primary btn-small"
												style="flex: 1; background: #FF3B30;"
											>
												Reject
											</button>
											<button
												on:click={() => handleVote(application.id, 'abstain')}
												class="btn-secondary btn-small"
												style="flex: 1;"
											>
												Abstain
											</button>
										</div>
									{/if}
								</div>
							{/if}

							<!-- Comments Section -->
							<div style="border-top: 1px solid var(--divider); padding-top: var(--gap-4);">
								<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--gap-3);">
									<h4>Review Comments ({application.reviewComments.length})</h4>
									<button
										on:click={() => selectedApplication = selectedApplication?.id === application.id ? null : application}
										class="btn-secondary btn-small"
									>
										{selectedApplication?.id === application.id ? 'Hide' : 'Show'} Comments
									</button>
								</div>

								{#if selectedApplication?.id === application.id}
									<!-- Add Comment Form -->
									<div style="margin-bottom: var(--gap-4);">
										<div style="display: flex; gap: var(--gap-2); margin-bottom: var(--gap-2);">
											<select
												bind:value={commentType}
												class="input"
												style="flex: 0 0 auto; width: 120px;"
											>
												<option value="general">General</option>
												<option value="support">Support</option>
												<option value="concern">Concern</option>
											</select>
											<textarea
												bind:value={commentContent}
												rows="3"
												class="input"
												style="resize: none; flex: 1;"
												placeholder="Add a review comment..."
											></textarea>
										</div>
										<button
											on:click={handleAddComment}
											disabled={!commentContent.trim()}
											class="btn-primary btn-small"
										>
											Add Comment
										</button>
									</div>

									<!-- Comments List -->
									{#if application.reviewComments.length === 0}
										<p style="color: var(--text-3); font-style: italic;">No comments yet. Be the first to comment!</p>
									{:else}
										<div style="display: flex; flex-direction: column; gap: var(--gap-3);">
											{#each application.reviewComments as comment (comment.id)}
												<div style="background: var(--surface); border-radius: var(--r-sm); padding: var(--gap-3); border: 1px solid var(--divider);">
													<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--gap-2);">
														<div>
															<span style="font-weight: 500;">{comment.authorName}</span>
															<span style="color: var(--text-3); font-size: 14px; margin-left: var(--gap-2);">
																{formatDate(comment.createdAt)}
															</span>
															<span style="margin-left: var(--gap-2); padding: 2px 8px; border-radius: 12px; font-size: 12px; background: {
																comment.type === 'support' ? 'rgba(52, 199, 89, 0.2)' :
																comment.type === 'concern' ? 'rgba(255, 59, 48, 0.2)' :
																'rgba(255, 255, 255, 0.1)'
															}; color: {
																comment.type === 'support' ? '#34C759' :
																comment.type === 'concern' ? '#FF3B30' :
																'var(--text-2)'
															};">
																{comment.type}
															</span>
														</div>
													</div>
													<p style="margin: 0;">{comment.content}</p>
												</div>
											{/each}
										</div>
									{/if}
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</AuthGuard>
</div>
