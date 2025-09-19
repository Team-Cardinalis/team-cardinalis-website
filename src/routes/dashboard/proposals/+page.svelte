<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import PageHead from '$lib/components/PageHead.svelte';
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';
	import AuthGuard from '$lib/components/AuthGuard.svelte';
	import { AdvancedVotingService } from '$lib/advancedVotingService';
	import { formatDate } from '$lib/utils/dateUtils';
	import type { Proposal, Discussion, UserProfile, GameType } from '$lib/types';
	import { page } from '$app/stores';
	import { user } from '$lib';

	const votingService = AdvancedVotingService.getInstance();
	let proposals: Proposal[] = [];
	let userProfiles: Map<string, UserProfile> = new Map();
	let isLoading = true;
	let error: string = '';
	let unsubscribe: (() => void) | null = null;
	let showNewProposal = false;

	// New proposal form
	let newTitle = '';
	let newDescription = '';
	let newGame = '';
	let isSubmitting = false;

	// Discussion form
	let selectedProposal: Proposal | null = null;
	let discussionContent = '';
	let replyContent = '';
	let selectedDiscussion: Discussion | null = null;

	$: gameFilter = $page.url.searchParams.get('game');

	onMount(() => {
		// Listen to real-time changes
		unsubscribe = votingService.onProposalsChange(async (updatedProposals: Proposal[]) => {
			proposals = updatedProposals;
			await loadUserProfiles();
		});

		return () => {
			if (unsubscribe) {
				unsubscribe();
			}
		};
	});

	async function loadUserProfiles(): Promise<void> {
		const profiles = new Map<string, UserProfile>();
		for (const proposal of proposals) {
			if (!profiles.has(proposal.createdBy)) {
				const profile = await votingService.getUserProfile(proposal.createdBy);
				if (profile) {
					profiles.set(proposal.createdBy, profile);
				}
			}
		}
		userProfiles = profiles;
	}

	async function handleUpvote(proposalId: string): Promise<void> {
		if (!$user) return;

		try {
			error = '';
			await votingService.upvoteProposal(proposalId, $user.uid);
		} catch (err: any) {
			error = err.message || 'Error upvoting proposal';
		}
	}

	async function handleRemoveUpvote(proposalId: string): Promise<void> {
		if (!$user) return;

		try {
			error = '';
			await votingService.removeUpvote(proposalId, $user.uid);
		} catch (err: any) {
			error = err.message || 'Error removing upvote';
		}
	}

	async function handleNewProposal(): Promise<void> {
		if (!$user) return;

		if (!newTitle.trim() || !newDescription.trim()) {
			error = 'Title and description are required';
			return;
		}

		isSubmitting = true;
		error = '';

		try {
			await votingService.createProposal({
				title: newTitle.trim(),
				description: newDescription.trim(),
				game: newGame as GameType || undefined,
				createdBy: $user.uid,
				status: 'pending' as const,
				upvotes: 0,
				upvotedBy: [],
				discussions: []
			});

			newTitle = '';
			newDescription = '';
			newGame = '';
			showNewProposal = false;
		} catch (err: any) {
			error = err.message || 'Error creating proposal';
		} finally {
			isSubmitting = false;
		}
	}

	async function handleAddDiscussion(): Promise<void> {
		if (!$user || !selectedProposal || !discussionContent.trim()) return;

		try {
			error = '';
			const userProfile = await votingService.getUserProfile($user.uid);
			const authorName = userProfile?.displayName || $user.email || 'Anonymous';
			
			await votingService.addDiscussion(
				selectedProposal.id,
				$user.uid,
				authorName,
				discussionContent
			);
			
			discussionContent = '';
		} catch (err: any) {
			error = err.message || 'Error adding discussion';
		}
	}

	async function handleAddReply(): Promise<void> {
		if (!$user || !selectedProposal || !selectedDiscussion || !replyContent.trim()) return;

		try {
			error = '';
			const userProfile = await votingService.getUserProfile($user.uid);
			const authorName = userProfile?.displayName || $user.email || 'Anonymous';
			
			await votingService.addDiscussionReply(
				selectedDiscussion.id,
				selectedProposal.id,
				$user.uid,
				authorName,
				replyContent
			);
			
			replyContent = '';
		} catch (err: any) {
			error = err.message || 'Error adding reply';
		}
	}

	function hasUserUpvoted(proposal: Proposal): boolean {
		return $user ? proposal.upvotedBy.includes($user.uid) : false;
	}

	function getUserProfile(userId: string): UserProfile | undefined {
		return userProfiles.get(userId);
	}

	$: filteredProposals = gameFilter 
		? proposals.filter(proposal => proposal.game === gameFilter)
		: proposals;
</script>

<PageHead 
	title="Community Proposals - Team Cardinalis"
	description="View and discuss community proposals"
/>

<div class="min-h-screen bg-black">
	<Navigation currentPage="dashboard" />
	
	<AuthGuard>
		<!-- Main Content -->
		<div class="container" style="padding-top: 120px; padding-bottom: var(--gap-8);">
			<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--gap-6);">
				<h1 style="font-size: 2.5rem; font-weight: 700;">Community Proposals</h1>
				<button
					on:click={() => showNewProposal = !showNewProposal}
					class="btn-primary btn-small"
				>
					{showNewProposal ? 'Cancel' : 'New Proposal'}
				</button>
			</div>

			<!-- Filters -->
			<div style="margin-bottom: var(--gap-6);">
				<div style="display: flex; gap: var(--gap-3);">
					<a
						href="/dashboard/proposals"
						class="badge {!gameFilter ? 'badge-active' : ''}"
					>
						All
					</a>
					<a
						href="/dashboard/proposals?game=apex-legends"
						class="badge {gameFilter === 'apex-legends' ? 'badge-active' : ''}"
					>
						Apex Legends
					</a>
					<a
						href="/dashboard/proposals?game=valorant"
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

			<!-- New Proposal Form -->
			{#if showNewProposal}
				<div class="card" style="margin-bottom: var(--gap-6);">
					<h3 style="margin-bottom: var(--gap-4);">Create New Proposal</h3>
					<form on:submit|preventDefault={handleNewProposal}>
						<div style="margin-bottom: var(--gap-4);">
							<label for="title" style="display: block; font-weight: 500; margin-bottom: var(--gap-1);">
								Title *
							</label>
							<input
								id="title"
								type="text"
								bind:value={newTitle}
								class="input"
								placeholder="Proposal title..."
								disabled={isSubmitting}
							/>
						</div>

						<div style="margin-bottom: var(--gap-4);">
							<label for="description" style="display: block; font-weight: 500; margin-bottom: var(--gap-1);">
								Description *
							</label>
							<textarea
								id="description"
								bind:value={newDescription}
								rows="4"
								class="input"
								style="resize: none;"
								placeholder="Describe your proposal..."
								disabled={isSubmitting}
							></textarea>
						</div>

						<div style="margin-bottom: var(--gap-4);">
							<label for="game" style="display: block; font-weight: 500; margin-bottom: var(--gap-1);">
								Game (optional)
							</label>
							<select
								id="game"
								bind:value={newGame}
								class="input"
								disabled={isSubmitting}
							>
								<option value="">General proposal</option>
								<option value="apex-legends">Apex Legends</option>
								<option value="valorant">Valorant</option>
							</select>
						</div>

						<div style="display: flex; justify-content: flex-end; gap: var(--gap-3);">
							<button
								type="button"
								on:click={() => showNewProposal = false}
								class="btn-secondary btn-small"
								disabled={isSubmitting}
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={isSubmitting}
								class="btn-primary"
							>
								{#if isSubmitting}
									<LoadingIndicator isLoading={true} size="small" />
									Creating...
								{:else}
									Create Proposal
								{/if}
							</button>
						</div>
					</form>
				</div>
			{/if}

			{#if isLoading}
				<div style="display: flex; justify-content: center; align-items: center; padding: var(--gap-8) 0;">
					<LoadingIndicator isLoading={true} size="large" />
				</div>
			{:else if filteredProposals.length === 0}
				<div style="text-align: center; padding: var(--gap-8) 0;">
					<div style="font-size: 4rem; margin-bottom: var(--gap-4);"></div>
					<h2 style="font-size: 2rem; font-weight: 600; margin-bottom: var(--gap-3);">No Proposals Yet</h2>
					<p style="color: var(--text-2); margin-bottom: var(--gap-5);">
						{#if gameFilter}
							No proposals for {gameFilter === 'apex-legends' ? 'Apex Legends' : 'Valorant'} yet
						{:else}
							Be the first to propose an idea for the community
						{/if}
					</p>
					<button
						on:click={() => showNewProposal = true}
						class="btn-primary btn-small"
					>
						Create First Proposal
					</button>
				</div>
			{:else}
				<div style="display: flex; flex-direction: column; gap: var(--gap-4);">
					{#each filteredProposals as proposal (proposal.id)}
						<div class="card">
							<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--gap-4);">
								<div style="flex: 1;">
									<h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: var(--gap-1);">{proposal.title}</h3>
									<p style="color: var(--text-2); margin-bottom: var(--gap-3);">{proposal.description}</p>
									<div style="display: flex; align-items: center; gap: var(--gap-3); font-size: 15px; color: var(--text-3);">
										<span>By {getUserProfile(proposal.createdBy)?.displayName || 'Anonymous'}</span>
										<span>•</span>
										<span>{formatDate(proposal.createdAt)}</span>
										{#if proposal.game}
											<span>•</span>
											<span class="badge badge-active">
												{proposal.game === 'apex-legends' ? 'Apex Legends' : 'Valorant'}
											</span>
										{/if}
									</div>
								</div>
								<div style="text-align: right;">
									<div style="font-size: 2rem; font-weight: 700; color: var(--text);">{proposal.upvotes}</div>
									<div style="font-size: 15px; color: var(--text-3);">upvotes</div>
								</div>
							</div>

							<div style="display: flex; gap: var(--gap-3); margin-bottom: var(--gap-4);">
								{#if hasUserUpvoted(proposal)}
									<button
										on:click={() => handleRemoveUpvote(proposal.id)}
										class="btn-secondary btn-small"
									>
										Remove Upvote
									</button>
								{:else}
									<button
										on:click={() => handleUpvote(proposal.id)}
										class="btn-primary btn-small"
									>
										Upvote
									</button>
								{/if}
								<button
									on:click={() => selectedProposal = selectedProposal?.id === proposal.id ? null : proposal}
									class="btn-secondary btn-small"
								>
									Discuss ({proposal.discussions.length})
								</button>
							</div>

							<!-- Discussions Section -->
							{#if selectedProposal?.id === proposal.id}
								<div style="border-top: 1px solid var(--divider); padding-top: var(--gap-4);">
									<h4 style="margin-bottom: var(--gap-3);">Discussions</h4>
									
									<!-- Add Discussion Form -->
									<div style="margin-bottom: var(--gap-4);">
										<textarea
											bind:value={discussionContent}
											rows="3"
											class="input"
											style="resize: none; margin-bottom: var(--gap-2);"
											placeholder="Add a comment..."
										></textarea>
										<button
											on:click={handleAddDiscussion}
											disabled={!discussionContent.trim()}
											class="btn-primary btn-small"
										>
											Add Comment
										</button>
									</div>

									<!-- Discussions List -->
									{#if proposal.discussions.length === 0}
										<p style="color: var(--text-3); font-style: italic;">No discussions yet. Be the first to comment!</p>
									{:else}
										<div style="display: flex; flex-direction: column; gap: var(--gap-3);">
											{#each proposal.discussions as discussion (discussion.id)}
												<div style="background: var(--surface); border-radius: var(--r-sm); padding: var(--gap-3); border: 1px solid var(--divider);">
													<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--gap-2);">
														<div>
															<span style="font-weight: 500;">{discussion.authorName}</span>
															<span style="color: var(--text-3); font-size: 14px; margin-left: var(--gap-2);">
																{formatDate(discussion.createdAt)}
															</span>
														</div>
														<button
															on:click={() => selectedDiscussion = selectedDiscussion?.id === discussion.id ? null : discussion}
															class="btn-secondary btn-small"
															style="font-size: 12px; padding: 4px 8px;"
														>
															Reply ({discussion.replies.length})
														</button>
													</div>
													<p style="margin-bottom: var(--gap-2);">{discussion.content}</p>
													
													<!-- Replies -->
													{#if selectedDiscussion?.id === discussion.id}
														<div style="margin-top: var(--gap-3); padding-top: var(--gap-3); border-top: 1px solid var(--divider);">
															{#if discussion.replies.length === 0}
																<p style="color: var(--text-3); font-style: italic; margin-bottom: var(--gap-2);">No replies yet.</p>
															{:else}
																<div style="display: flex; flex-direction: column; gap: var(--gap-2); margin-bottom: var(--gap-3);">
																	{#each discussion.replies as reply (reply.id)}
																		<div style="background: var(--bg); border-radius: var(--r-sm); padding: var(--gap-2); border: 1px solid var(--divider);">
																			<div style="display: flex; justify-content: space-between; margin-bottom: var(--gap-1);">
																				<span style="font-weight: 500; font-size: 14px;">{reply.authorName}</span>
																				<span style="color: var(--text-3); font-size: 12px;">
																					{formatDate(reply.createdAt)}
																				</span>
																			</div>
																			<p style="font-size: 14px;">{reply.content}</p>
																		</div>
																	{/each}
																</div>
															{/if}
															
															<!-- Add Reply Form -->
															<textarea
																bind:value={replyContent}
																rows="2"
																class="input"
																style="resize: none; margin-bottom: var(--gap-2); font-size: 14px;"
																placeholder="Reply to this comment..."
															></textarea>
															<button
																on:click={handleAddReply}
																disabled={!replyContent.trim()}
																class="btn-primary btn-small"
																style="font-size: 12px; padding: 4px 8px;"
															>
																Reply
															</button>
														</div>
													{/if}
												</div>
											{/each}
										</div>
									{/if}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</AuthGuard>
</div>
