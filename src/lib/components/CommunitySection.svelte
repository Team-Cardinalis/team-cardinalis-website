<script lang="ts">
	import type { GameType } from '$lib/types';
	import type { User } from 'firebase/auth';
	import { GameHelpers, URLHelpers } from '$lib/utils/commonUtils';

	export let game: GameType | undefined = undefined;
	export let user: User | null = null;

	// Calculate values once to avoid recalculations
	$: gameTitle = GameHelpers.getCommunityTitle(game);
	$: gameDescription = GameHelpers.getCommunityDescription(game);
	$: voteButtonText = GameHelpers.getVoteButtonText(game);
	$: dashboardUrl = URLHelpers.getDashboardUrl(game);
	$: proposeUrl = URLHelpers.getProposeUrl(game);
</script>

{#if user}
	<section class="section">
		<div class="container">
			<div style="text-align: center;">
				<h2 style="margin-bottom: var(--gap-3);">
					{gameTitle}
				</h2>
				<p style="font-size: 20px; margin-bottom: var(--gap-5);">
					{gameDescription}
				</p>
				<div style="display: flex; flex-wrap: wrap; gap: var(--gap-3); justify-content: center;">
					<a href={dashboardUrl} class="btn-primary">
						{voteButtonText}
					</a>
					<a href={proposeUrl} class="btn-secondary btn-small">
						Propose Decision
					</a>
				</div>
			</div>
		</div>
	</section>
{:else}
	<section class="section">
		<div class="container">
			<div style="text-align: center;">
				<h2 style="margin-bottom: var(--gap-3);">
					{gameTitle}
				</h2>
				<p style="font-size: 20px; margin-bottom: var(--gap-5);">
					Sign in to access the voting system and participate in community decisions
				</p>
				<div style="display: flex; justify-content: center;">
					<a href="/auth/login" class="btn-primary">
						Sign In to Vote
					</a>
				</div>
			</div>
		</div>
	</section>
{/if}
