<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import PageHead from '$lib/components/PageHead.svelte';
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';
	import AuthGuard from '$lib/components/AuthGuard.svelte';
	import { AdvancedVotingService } from '$lib/advancedVotingService';
	import { formatDate, getTimeRemaining } from '$lib/utils/dateUtils';
	import type { FinalVote, UserVote } from '$lib/types';
	import { page } from '$app/stores';
	import { user } from '$lib';
	import { ref, get } from 'firebase/database';
	import { database } from '$lib/firebase';

	const votingService = AdvancedVotingService.getInstance();
	let finalVotes: FinalVote[] = [];
	let userVotes: Map<string, UserVote> = new Map();
	let isLoading = true;
	let error: string = '';
	let unsubscribe: (() => void) | null = null;

	$: gameFilter = $page.url.searchParams.get('game');

	onMount(() => {
		// Listen to real-time changes
		unsubscribe = votingService.onFinalVotesChange(async (updatedVotes: FinalVote[]) => {
			finalVotes = updatedVotes;
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

		const newUserVotes = new Map<string, UserVote>();
		for (const vote of finalVotes) {
			try {
				const userVoteRef = ref(database, `finalUserVotes/${$user.uid}/${vote.id}`);
				const snapshot = await get(userVoteRef);
				if (snapshot.exists()) {
					newUserVotes.set(vote.id, snapshot.val() as UserVote);
				}
			} catch (err) {
				console.error('Error loading user vote:', err);
			}
		}
		userVotes = newUserVotes;
	}

	async function handleVote(voteId: string, optionId: 'for' | 'abstain' | 'against'): Promise<void> {
		if (!$user) return;

		try {
			error = '';
			await votingService.voteFinal(voteId, optionId, $user.uid);
			await loadUserVotes();
		} catch (err: any) {
			error = err.message || 'Error during voting';
		}
	}

	function hasUserVoted(voteId: string): boolean {
		return userVotes.has(voteId);
	}

	function getUserVoteOption(voteId: string): string | null {
		const userVote = userVotes.get(voteId);
		return userVote ? userVote.optionId : null;
	}

	function getVotePercentage(vote: FinalVote, optionId: string): number {
		if (vote.totalVotes === 0) return 0;
		const option = vote.options.find(opt => opt.id === optionId);
		return option ? (option.votes / vote.totalVotes) * 100 : 0;
	}

	$: filteredVotes = gameFilter 
		? finalVotes.filter(vote => vote.game === gameFilter)
		: finalVotes;
</script>

<PageHead 
	title="Final Votes - Team Cardinalis"
	description="Participate in monthly final votes for top proposals"
/>

<div class="min-h-screen bg-black">
	<Navigation currentPage="dashboard" />
	
	<AuthGuard>
		<!-- Main Content -->
		<div class="container" style="padding-top: 120px; padding-bottom: var(--gap-8);">
			<div style="margin-bottom: var(--gap-6);">
				<h1 style="font-size: 2.5rem; font-weight: 700;">Monthly Final Votes</h1>
				<p style="color: var(--text-2); font-size: 18px;">
					Vote on the top proposals selected by the community this month
				</p>
			</div>

			<!-- Filters -->
			<div style="margin-bottom: var(--gap-6);">
				<div style="display: flex; gap: var(--gap-3);">
					<a
						href="/dashboard/final-votes"
						class="badge {!gameFilter ? 'badge-active' : ''}"
					>
						All
					</a>
					<a
						href="/dashboard/final-votes?game=apex-legends"
						class="badge {gameFilter === 'apex-legends' ? 'badge-active' : ''}"
					>
						Apex Legends
					</a>
					<a
						href="/dashboard/final-votes?game=valorant"
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
			{:else if filteredVotes.length === 0}
				<div style="text-align: center; padding: var(--gap-8) 0;">
					<div style="font-size: 4rem; margin-bottom: var(--gap-4);"></div>
					<h2 style="font-size: 2rem; font-weight: 600; margin-bottom: var(--gap-3);">No Final Votes</h2>
					<p style="color: var(--text-2); margin-bottom: var(--gap-5);">
						{#if gameFilter}
							No final votes for {gameFilter === 'apex-legends' ? 'Apex Legends' : 'Valorant'} this month
						{:else}
							No final votes are currently active. Check back at the end of the month.
						{/if}
					</p>
					<a href="/dashboard/proposals" class="btn-primary btn-small">
						View Proposals
					</a>
				</div>
			{:else}
				<div style="display: flex; flex-direction: column; gap: var(--gap-4);">
					{#each filteredVotes as vote (vote.id)}
						<div class="card">
							<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--gap-4);">
								<div style="flex: 1;">
									<h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: var(--gap-1);">{vote.title}</h3>
									<p style="color: var(--text-2); margin-bottom: var(--gap-3);">{vote.description}</p>
									<div style="display: flex; align-items: center; gap: var(--gap-3); font-size: 15px; color: var(--text-3);">
										<span>Created on {formatDate(vote.createdAt)}</span>
										<span>•</span>
										<span>Ends on {formatDate(vote.endDate)}</span>
										<span>•</span>
										<span style="color: var(--text);">{getTimeRemaining(vote.endDate)} remaining</span>
										{#if vote.game}
											<span>•</span>
											<span class="badge badge-active">
												{vote.game === 'apex-legends' ? 'Apex Legends' : 'Valorant'}
											</span>
										{/if}
									</div>
								</div>
								<div style="text-align: right;">
									<div style="font-size: 2rem; font-weight: 700; color: var(--text);">{vote.totalVotes}</div>
									<div style="font-size: 15px; color: var(--text-3);">total votes</div>
								</div>
							</div>

							<div style="display: flex; flex-direction: column; gap: var(--gap-2);">
								{#each vote.options as option (option.id)}
									<div style="display: flex; align-items: center; justify-content: space-between; padding: var(--gap-3); background: var(--surface); border-radius: var(--r-sm); border: 1px solid var(--divider);">
										<div style="flex: 1;">
											<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--gap-1);">
												<span style="font-weight: 500;">{option.text}</span>
												<span style="font-size: 15px; color: var(--text-3);">
													{option.votes} vote{option.votes > 1 ? 's' : ''} ({getVotePercentage(vote, option.id).toFixed(1)}%)
												</span>
											</div>
											<div class="progress">
												<div
													class="progress-fill"
													style="width: {getVotePercentage(vote, option.id)}%"
												></div>
											</div>
										</div>
										{#if !hasUserVoted(vote.id)}
											<button
												on:click={() => handleVote(vote.id, option.id)}
												class="btn-primary btn-small"
												style="margin-left: var(--gap-3);"
											>
												Vote
											</button>
										{:else if hasUserVoted(vote.id) && getUserVoteOption(vote.id) === option.id}
											<div style="margin-left: var(--gap-3); padding: 8px 16px; background: rgba(52, 199, 89, 0.1); color: #34C759; border-radius: var(--r-sm); border: 1px solid rgba(52, 199, 89, 0.2); font-size: 13px;">
												Your Vote
											</div>
										{/if}
									</div>
								{/each}
							</div>

							<!-- Vote Status -->
							{#if hasUserVoted(vote.id)}
								<div style="margin-top: var(--gap-3); padding: var(--gap-2); background: rgba(52, 199, 89, 0.1); border-radius: var(--r-sm); border: 1px solid rgba(52, 199, 89, 0.2); text-align: center;">
									<span style="color: #34C759; font-size: 14px;">You have voted on this proposal</span>
								</div>
							{:else}
								<div style="margin-top: var(--gap-3); padding: var(--gap-2); background: rgba(255, 193, 7, 0.1); border-radius: var(--r-sm); border: 1px solid rgba(255, 193, 7, 0.2); text-align: center;">
									<span style="color: #FFC107; font-size: 14px;">Your vote is required</span>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</AuthGuard>
</div>
