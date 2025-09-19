<script lang="ts">
	import { onMount } from 'svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import PageHead from '$lib/components/PageHead.svelte';
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';
	import AuthGuard from '$lib/components/AuthGuard.svelte';
	import { AdvancedVotingService } from '$lib/advancedVotingService';
	import { formatDate } from '$lib/utils/dateUtils';
	import type { Application } from '$lib/types';
	import { user } from '$lib';

	const votingService = AdvancedVotingService.getInstance();
	let existingApplication: Application | null = null;
	let isLoading = true;
	let isSubmitting = false;
	let error: string = '';
	let success: string = '';

	// Application form
	let game: 'apex-legends' | 'valorant' = 'apex-legends';
	let experience = '';
	let motivation = '';
	let availability = '';
	let additionalInfo = '';

	onMount(async () => {
		if ($user) {
			await loadExistingApplication();
		}
	});

	async function loadExistingApplication(): Promise<void> {
		if (!$user) return;

		try {
			isLoading = true;
			existingApplication = await votingService.getUserApplication($user.uid);
		} catch (err: any) {
			error = err.message || 'Error loading application';
		} finally {
			isLoading = false;
		}
	}

	async function submitApplication(): Promise<void> {
		if (!$user) return;

		// Validation
		if (!experience.trim()) {
			error = 'Experience is required';
			return;
		}
		if (!motivation.trim()) {
			error = 'Motivation is required';
			return;
		}
		if (!availability.trim()) {
			error = 'Availability is required';
			return;
		}

		isSubmitting = true;
		error = '';
		success = '';

		try {
				await votingService.createApplication({
					applicantId: $user.uid,
					applicantName: $user.displayName || $user.email || 'Anonymous',
					applicantEmail: $user.email || '',
					game,
					experience: experience.trim(),
					motivation: motivation.trim(),
					availability: availability.trim(),
					additionalInfo: additionalInfo.trim() || undefined,
					createdAt: Date.now(),
					updatedAt: Date.now(),
					reviewEndDate: Date.now() + (7 * 24 * 60 * 60 * 1000)
				});

			success = 'Your application has been submitted successfully! The community will review it within 7 days.';
			
			// Clear form
			experience = '';
			motivation = '';
			availability = '';
			additionalInfo = '';
			
			// Reload existing application
			await loadExistingApplication();
		} catch (err: any) {
			error = err.message || 'Error submitting application';
		} finally {
			isSubmitting = false;
		}
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

	function formatReviewEndDate(timestamp: number): string {
		return new Date(timestamp).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<PageHead 
	title="Career - Team Cardinalis"
	description="Apply to join Team Cardinalis esports organization"
/>

<div class="min-h-screen bg-black">
	<Navigation currentPage="career" />
	
	<AuthGuard>
		<!-- Main Content -->
		<div class="container" style="padding-top: 120px; padding-bottom: var(--gap-8);">
			<div style="margin-bottom: var(--gap-6);">
				<h1 style="font-size: 2.5rem; font-weight: 700;">Career</h1>
				<p style="color: var(--text-2); font-size: 18px;">
					Apply to become a member of our esports organization
				</p>
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

			{#if isLoading}
				<div style="display: flex; justify-content: center; align-items: center; padding: var(--gap-8) 0;">
					<LoadingIndicator isLoading={true} size="large" />
				</div>
			{:else if existingApplication}
				<!-- Existing Application Status -->
				<div class="card" style="margin-bottom: var(--gap-6);">
					<h3 style="margin-bottom: var(--gap-4);">Your Application Status</h3>
					
					<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--gap-4);">
						<div style="flex: 1;">
							<h4 style="font-size: 1.25rem; font-weight: 600; margin-bottom: var(--gap-2);">
								{existingApplication.game === 'apex-legends' ? 'Apex Legends' : 'Valorant'} Division
							</h4>
							<p style="color: var(--text-2); margin-bottom: var(--gap-3);">
								Submitted on {formatDate(existingApplication.createdAt)}
							</p>
							<div style="display: flex; align-items: center; gap: var(--gap-3); font-size: 15px;">
								<span style="color: var(--text-3);">Review ends:</span>
								<span>{formatReviewEndDate(existingApplication.reviewEndDate)}</span>
							</div>
						</div>
						<div style="text-align: right;">
							<div style="padding: 8px 16px; border-radius: var(--r-sm); font-weight: 500; background: rgba(255, 255, 255, 0.1); color: {getStatusColor(existingApplication.status)};">
								{getStatusText(existingApplication.status)}
							</div>
						</div>
					</div>

					<!-- Vote Results -->
					{#if existingApplication.totalVotes > 0}
						<div style="margin-top: var(--gap-4); padding-top: var(--gap-4); border-top: 1px solid var(--divider);">
							<h5 style="margin-bottom: var(--gap-3);">Community Vote Results</h5>
							<div style="display: flex; gap: var(--gap-4);">
								<div style="flex: 1; text-align: center;">
									<div style="font-size: 1.5rem; font-weight: 700; color: #34C759;">{existingApplication.votes.accept}</div>
									<div style="font-size: 14px; color: var(--text-3);">Accept</div>
								</div>
								<div style="flex: 1; text-align: center;">
									<div style="font-size: 1.5rem; font-weight: 700; color: #FF3B30;">{existingApplication.votes.reject}</div>
									<div style="font-size: 14px; color: var(--text-3);">Reject</div>
								</div>
								<div style="flex: 1; text-align: center;">
									<div style="font-size: 1.5rem; font-weight: 700; color: var(--text-3);">{existingApplication.votes.abstain}</div>
									<div style="font-size: 14px; color: var(--text-3);">Abstain</div>
								</div>
							</div>
						</div>
					{/if}

					<!-- Application Details -->
					<div style="margin-top: var(--gap-4); padding-top: var(--gap-4); border-top: 1px solid var(--divider);">
						<h5 style="margin-bottom: var(--gap-3);">Your Application</h5>
						<div style="display: flex; flex-direction: column; gap: var(--gap-3);">
							<div>
								<span style="font-weight: 500; color: var(--text-2);">Experience:</span>
								<p style="margin-top: var(--gap-1);">{existingApplication.experience}</p>
							</div>
							<div>
								<span style="font-weight: 500; color: var(--text-2);">Motivation:</span>
								<p style="margin-top: var(--gap-1);">{existingApplication.motivation}</p>
							</div>
							<div>
								<span style="font-weight: 500; color: var(--text-2);">Availability:</span>
								<p style="margin-top: var(--gap-1);">{existingApplication.availability}</p>
							</div>
							{#if existingApplication.additionalInfo}
								<div>
									<span style="font-weight: 500; color: var(--text-2);">Additional Information:</span>
									<p style="margin-top: var(--gap-1);">{existingApplication.additionalInfo}</p>
								</div>
							{/if}
						</div>
					</div>
				</div>

				<!-- Information about the process -->
				<div class="card" style="background: rgba(10, 132, 255, 0.1); border: 1px solid rgba(10, 132, 255, 0.2);">
					<h4 style="color: var(--accent); margin-bottom: var(--gap-2);">Application Process</h4>
					<p style="color: var(--text-2); margin-bottom: var(--gap-2);">
						Your application is being reviewed by the community. Here's how it works:
					</p>
					<ul style="color: var(--text-2); font-size: 14px; margin-left: var(--gap-4);">
						<li>Community members vote on your application (Accept/Reject/Abstain)</li>
						<li>Review period lasts 7 days from submission</li>
						<li>Minimum 5 votes required for decision</li>
						<li>60% majority needed for acceptance or rejection</li>
						<li>You'll be notified of the final decision</li>
					</ul>
				</div>
			{:else}
				<!-- Application Form -->
				<div class="card" style="max-width: 600px;">
					<h3 style="margin-bottom: var(--gap-4);">Application Form</h3>
					
					<form on:submit|preventDefault={submitApplication}>
						<!-- Game Selection -->
						<div style="margin-bottom: var(--gap-4);">
							<label for="game" style="display: block; font-weight: 500; margin-bottom: var(--gap-1);">
								Division *
							</label>
							<select
								id="game"
								bind:value={game}
								class="input"
								disabled={isSubmitting}
							>
								<option value="apex-legends">Apex Legends</option>
								<option value="valorant">Valorant</option>
							</select>
						</div>

						<!-- Experience -->
						<div style="margin-bottom: var(--gap-4);">
							<label for="experience" style="display: block; font-weight: 500; margin-bottom: var(--gap-1);">
								Gaming Experience *
							</label>
							<textarea
								id="experience"
								bind:value={experience}
								rows="4"
								class="input"
								style="resize: none;"
								placeholder="Describe your gaming experience, achievements, rank, etc..."
								disabled={isSubmitting}
							></textarea>
						</div>

						<!-- Motivation -->
						<div style="margin-bottom: var(--gap-4);">
							<label for="motivation" style="display: block; font-weight: 500; margin-bottom: var(--gap-1);">
								Why do you want to join Team Cardinalis? *
							</label>
							<textarea
								id="motivation"
								bind:value={motivation}
								rows="4"
								class="input"
								style="resize: none;"
								placeholder="Tell us about your motivation, goals, and what you can bring to the team..."
								disabled={isSubmitting}
							></textarea>
						</div>

						<!-- Availability -->
						<div style="margin-bottom: var(--gap-4);">
							<label for="availability" style="display: block; font-weight: 500; margin-bottom: var(--gap-1);">
								Availability *
							</label>
							<textarea
								id="availability"
								bind:value={availability}
								rows="3"
								class="input"
								style="resize: none;"
								placeholder="When are you available for practice, tournaments, and team activities?"
								disabled={isSubmitting}
							></textarea>
						</div>

						<!-- Additional Info -->
						<div style="margin-bottom: var(--gap-5);">
							<label for="additionalInfo" style="display: block; font-weight: 500; margin-bottom: var(--gap-1);">
								Additional Information (optional)
							</label>
							<textarea
								id="additionalInfo"
								bind:value={additionalInfo}
								rows="3"
								class="input"
								style="resize: none;"
								placeholder="Any additional information you'd like to share..."
								disabled={isSubmitting}
							></textarea>
						</div>

						<button
							type="submit"
							disabled={isSubmitting}
							class="btn-primary btn-large"
							style="width: 100%;"
						>
							{#if isSubmitting}
								<LoadingIndicator isLoading={true} size="small" />
								Submitting...
							{:else}
								Submit Application
							{/if}
						</button>
					</form>
				</div>

				<!-- Information about the process -->
				<div class="card" style="margin-top: var(--gap-6); background: rgba(10, 132, 255, 0.1); border: 1px solid rgba(10, 132, 255, 0.2);">
					<h4 style="color: var(--accent); margin-bottom: var(--gap-2);">Application Process</h4>
					<p style="color: var(--text-2); margin-bottom: var(--gap-2);">
						Here's how our community-driven application process works:
					</p>
					<ul style="color: var(--text-2); font-size: 14px; margin-left: var(--gap-4);">
						<li><strong>Submit:</strong> Fill out the application form above</li>
						<li><strong>Review:</strong> Community members review and vote on your application</li>
						<li><strong>Voting:</strong> Members vote Accept, Reject, or Abstain</li>
						<li><strong>Decision:</strong> 60% majority determines acceptance or rejection</li>
						<li><strong>Timeline:</strong> Review period lasts 7 days</li>
						<li><strong>Notification:</strong> You'll be informed of the final decision</li>
					</ul>
				</div>
			{/if}
		</div>
	</AuthGuard>
</div>
