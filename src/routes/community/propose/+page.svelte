<script lang="ts">
	import { onMount } from 'svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import PageHead from '$lib/components/PageHead.svelte';
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';
	import AuthGuard from '$lib/components/AuthGuard.svelte';
	import { VotingService } from '$lib/votingService';
	import type { GameType } from '$lib/types';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { user } from '$lib';

	const votingService = VotingService.getInstance();
	let isLoading = true;
	let isSubmitting = false;
	let error: string = '';
	let success: string = '';

	let title: string = '';
	let description: string = '';
	let game: string = '';
	let duration: number = 7; // days
	let options: string[] = ['Yes', 'No'];

	$: gameFilter = $page.url.searchParams.get('game');

	onMount(() => {
		isLoading = false;
		
		// Pre-fill game if specified in URL
		if (gameFilter) {
			game = gameFilter;
		}
	});

	function addOption(): void {
		if (options.length < 10) {
			options = [...options, ''];
		}
	}

	function removeOption(index: number): void {
		if (options.length > 2) {
			options = options.filter((_, i) => i !== index);
		}
	}

	function updateOption(index: number, value: string): void {
		options = options.map((option, i) => i === index ? value : option);
	}

	async function handleSubmit(): Promise<void> {
		if (!$user) {
			goto('/auth/login');
			return;
		}

		// Validation
		if (!title.trim()) {
			error = 'Title is required';
			return;
		}
		if (!description.trim()) {
			error = 'Description is required';
			return;
		}
		if (options.some(option => !option.trim())) {
			error = 'All options must be filled';
			return;
		}
		if (options.length < 2) {
			error = 'At least 2 options are required';
			return;
		}

		isSubmitting = true;
		error = '';
		success = '';

		try {
			const endDate = Date.now() + (duration * 24 * 60 * 60 * 1000);
			
			const voteOptions = options.map((text, index) => ({
				id: `option_${index}`,
				text: text.trim(),
				votes: 0
			}));

			const vote = {
				title: title.trim(),
				description: description.trim(),
				game: (game as GameType) || undefined,
				options: voteOptions,
				createdBy: $user.uid,
				createdAt: Date.now(),
				updatedAt: Date.now(),
				endDate,
				isActive: true,
				status: 'proposal' as const,
				upvotes: 0,
				discussions: []
			};

			await votingService.createVote(vote);
			
			success = 'Your proposal has been created successfully!';
			
			// Redirect to votes after 2 seconds
			setTimeout(() => {
				goto('/community/votes');
			}, 2000);
			
		} catch (err: any) {
			error = err.message || 'Error creating proposal';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<PageHead 
	title="Propose Decision - Team Cardinalis"
	description="Create a community vote to make an important decision"
/>

<div class="min-h-screen bg-black">
	<Navigation currentPage="" />
	
	<AuthGuard>
		<!-- Main Content -->
		<div class="container" style="padding-top: 120px; padding-bottom: var(--gap-8);">
			<div style="margin-bottom: var(--gap-6);">
				<h1 style="font-size: 2.5rem; font-weight: 700; margin-bottom: var(--gap-3);">Propose Decision</h1>
				<p style="color: var(--text-2); font-size: 20px;">
					Create a community vote to make an important decision regarding Team Cardinalis.
				</p>
			</div>

			{#if isLoading}
				<div style="display: flex; justify-content: center; align-items: center; padding: var(--gap-8) 0;">
					<LoadingIndicator isLoading={true} size="large" />
				</div>
			{:else}
				<div class="card" style="max-width: 600px;">
					<form on:submit|preventDefault={handleSubmit}>
						<!-- Title -->
						<div style="margin-bottom: var(--gap-4);">
							<label for="title" style="display: block; font-weight: 500; margin-bottom: var(--gap-1);">
								Proposal Title *
							</label>
							<input
								id="title"
								type="text"
								bind:value={title}
								class="input"
								placeholder="Ex: Change Apex Legends training schedule"
								disabled={isSubmitting}
							/>
						</div>

						<!-- Description -->
						<div style="margin-bottom: var(--gap-4);">
							<label for="description" style="display: block; font-weight: 500; margin-bottom: var(--gap-1);">
								Description *
							</label>
							<textarea
								id="description"
								bind:value={description}
								rows="4"
								class="input"
								style="resize: none;"
								placeholder="Describe in detail your proposal and the reasons why it should be adopted..."
								disabled={isSubmitting}
							></textarea>
						</div>

						<!-- Game concerned -->
						<div style="margin-bottom: var(--gap-4);">
							<label for="game" style="display: block; font-weight: 500; margin-bottom: var(--gap-1);">
								Game concerned (optional)
							</label>
							<select
								id="game"
								bind:value={game}
								class="input"
								disabled={isSubmitting}
							>
								<option value="">General decision</option>
								<option value="apex-legends">Apex Legends</option>
								<option value="valorant">Valorant</option>
							</select>
						</div>

						<!-- Vote duration -->
						<div style="margin-bottom: var(--gap-4);">
							<label for="duration" style="display: block; font-weight: 500; margin-bottom: var(--gap-1);">
								Vote duration (in days)
							</label>
							<select
								id="duration"
								bind:value={duration}
								class="input"
								disabled={isSubmitting}
							>
								<option value={1}>1 day</option>
								<option value={3}>3 days</option>
								<option value={7}>7 days</option>
								<option value={14}>14 days</option>
								<option value={30}>30 days</option>
							</select>
						</div>

						<!-- Vote options -->
						<div style="margin-bottom: var(--gap-5);">
							<div style="display: block; font-weight: 500; margin-bottom: var(--gap-3);">
								Vote Options *
							</div>
							<div style="display: flex; flex-direction: column; gap: var(--gap-2);">
								{#each options as option, index (index)}
									<div style="display: flex; align-items: center; gap: var(--gap-2);">
										<input
											type="text"
											bind:value={options[index]}
											on:input={(e) => updateOption(index, (e.target as HTMLInputElement)?.value || '')}
											class="input"
											style="flex: 1;"
											placeholder="Option {index + 1}"
											disabled={isSubmitting}
										/>
									{#if options.length > 2}
										<button
											type="button"
											on:click={() => removeOption(index)}
											class="btn-secondary btn-small"
											style="padding: 8px;"
											disabled={isSubmitting}
										>
											Remove
										</button>
									{/if}
									</div>
								{/each}
							</div>
							{#if options.length < 10}
								<button
									type="button"
									on:click={addOption}
									class="btn-secondary btn-small"
									style="margin-top: var(--gap-3);"
									disabled={isSubmitting}
								>
									+ Add Option
								</button>
							{/if}
						</div>

						{#if error}
							<div class="message-error">
								{error}
							</div>
						{/if}

						{#if success}
							<div class="message-success">
								{success}
							</div>
						{/if}

						<div style="display: flex; justify-content: space-between; gap: var(--gap-3);">
							<a
								href="/community/votes"
								class="btn-secondary btn-small"
							>
								Cancel
							</a>
							<button
								type="submit"
								disabled={isSubmitting}
								class="btn-primary"
							>
							{#if isSubmitting}
								<LoadingIndicator isLoading={true} size="small" />
									Creating...
								{:else}
									Create Vote
								{/if}
							</button>
						</div>
					</form>
				</div>
			{/if}
		</div>
	</AuthGuard>
</div>