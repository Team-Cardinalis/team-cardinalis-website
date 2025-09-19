<script lang="ts">
	import { onMount } from 'svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import PageHead from '$lib/components/PageHead.svelte';
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';
	import AuthGuard from '$lib/components/AuthGuard.svelte';
	import { AdvancedVotingService } from '$lib/advancedVotingService';
	import { formatDate } from '$lib/utils/dateUtils';
	import type { UserProfile } from '$lib/types';
	import { user } from '$lib';

	const votingService = AdvancedVotingService.getInstance();
	let userProfile: UserProfile | null = null;
	let isLoading = true;
	let isSaving = false;
	let error: string = '';
	let success: string = '';

	// Profile form
	let displayName = '';
	let email = '';
	let role = 'member';

	onMount(async () => {
		if ($user) {
			await loadUserProfile();
		}
	});

	async function loadUserProfile(): Promise<void> {
		if (!$user) return;

		try {
			isLoading = true;
			userProfile = await votingService.getUserProfile($user.uid);
			
			if (userProfile) {
				displayName = userProfile.displayName;
				email = userProfile.email;
				role = userProfile.role;
			} else {
				// Create profile if it doesn't exist
				await votingService.createUserProfile({
					uid: $user.uid,
					email: $user.email || '',
					displayName: $user.displayName || $user.email || 'Anonymous'
				});
				await loadUserProfile();
			}
		} catch (err: any) {
			error = err.message || 'Error loading profile';
		} finally {
			isLoading = false;
		}
	}

	async function saveProfile(): Promise<void> {
		if (!$user || !userProfile) return;

		if (!displayName.trim()) {
			error = 'Display name is required';
			return;
		}

		isSaving = true;
		error = '';
		success = '';

		try {
			await votingService.updateUserProfile($user.uid, {
				displayName: displayName.trim(),
				email: email.trim(),
				role: role as 'member' | 'admin'
			});

			success = 'Profile updated successfully!';
			await loadUserProfile();
		} catch (err: any) {
			error = err.message || 'Error updating profile';
		} finally {
			isSaving = false;
		}
	}

	function formatJoinDate(timestamp: number): string {
		return new Date(timestamp).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function formatLastActive(timestamp: number): string {
		const now = Date.now();
		const diff = now - timestamp;
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		
		if (days === 0) return 'Today';
		if (days === 1) return 'Yesterday';
		if (days < 7) return `${days} days ago`;
		if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
		return `${Math.floor(days / 30)} months ago`;
	}
</script>

<PageHead 
	title="My Account - Team Cardinalis"
	description="Manage your account settings and profile"
/>

<div class="min-h-screen bg-black">
	<Navigation currentPage="dashboard" />
	
	<AuthGuard>
		<!-- Main Content -->
		<div class="container" style="padding-top: 120px; padding-bottom: var(--gap-8);">
			<div style="margin-bottom: var(--gap-6);">
				<h1 style="font-size: 2.5rem; font-weight: 700;">My Account</h1>
				<p style="color: var(--text-2); font-size: 18px;">Manage your profile and account settings</p>
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
			{:else if userProfile}
				<div class="grid grid-2" style="gap: var(--gap-6);">
					<!-- Profile Information -->
					<div class="card">
						<h3 style="margin-bottom: var(--gap-4);">Profile Information</h3>
						
						<form on:submit|preventDefault={saveProfile}>
							<div style="margin-bottom: var(--gap-4);">
								<label for="displayName" style="display: block; font-weight: 500; margin-bottom: var(--gap-1);">
									Display Name *
								</label>
								<input
									id="displayName"
									type="text"
									bind:value={displayName}
									class="input"
									placeholder="Your display name"
									disabled={isSaving}
								/>
							</div>

							<div style="margin-bottom: var(--gap-4);">
								<label for="email" style="display: block; font-weight: 500; margin-bottom: var(--gap-1);">
									Email Address
								</label>
								<input
									id="email"
									type="email"
									bind:value={email}
									class="input"
									placeholder="your.email@example.com"
									disabled={isSaving}
								/>
							</div>

							<div style="margin-bottom: var(--gap-5);">
								<label for="role" style="display: block; font-weight: 500; margin-bottom: var(--gap-1);">
									Role
								</label>
								<select
									id="role"
									bind:value={role}
									class="input"
									disabled={isSaving}
								>
									<option value="member">Member</option>
									<option value="admin">Admin</option>
								</select>
							</div>

							<button
								type="submit"
								disabled={isSaving}
								class="btn-primary"
							>
								{#if isSaving}
									<LoadingIndicator isLoading={true} size="small" />
									Saving...
								{:else}
									Save Changes
								{/if}
							</button>
						</form>
					</div>

					<!-- Account Statistics -->
					<div class="card">
						<h3 style="margin-bottom: var(--gap-4);">Account Statistics</h3>
						
						<div style="display: flex; flex-direction: column; gap: var(--gap-3);">
							<div style="display: flex; justify-content: space-between; align-items: center; padding: var(--gap-2) 0; border-bottom: 1px solid var(--divider);">
								<span style="color: var(--text-2);">User ID</span>
								<span style="font-family: monospace; font-size: 12px; color: var(--text-3);">
									{userProfile.uid.substring(0, 8)}...
								</span>
							</div>
							
							<div style="display: flex; justify-content: space-between; align-items: center; padding: var(--gap-2) 0; border-bottom: 1px solid var(--divider);">
								<span style="color: var(--text-2);">Member Since</span>
								<span>{formatJoinDate(userProfile.joinedAt)}</span>
							</div>
							
							<div style="display: flex; justify-content: space-between; align-items: center; padding: var(--gap-2) 0; border-bottom: 1px solid var(--divider);">
								<span style="color: var(--text-2);">Last Active</span>
								<span>{formatLastActive(userProfile.lastActive)}</span>
							</div>
							
							<div style="display: flex; justify-content: space-between; align-items: center; padding: var(--gap-2) 0; border-bottom: 1px solid var(--divider);">
								<span style="color: var(--text-2);">Account Status</span>
								<span style="color: #34C759; font-weight: 500;">Active</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Privacy Notice -->
				<div class="card" style="margin-top: var(--gap-6); background: rgba(10, 132, 255, 0.1); border: 1px solid rgba(10, 132, 255, 0.2);">
					<h4 style="color: var(--accent); margin-bottom: var(--gap-2);">Privacy & Vote Anonymity</h4>
					<p style="color: var(--text-2); margin-bottom: var(--gap-2);">
						Your votes are completely anonymous and cannot be traced back to your account. 
						Only your profile information (display name, email) is stored for community interactions.
					</p>
					<p style="color: var(--text-2); font-size: 14px;">
						• Vote records are stored separately from your profile<br/>
						• No personal information is linked to your voting choices<br/>
						• Only aggregate vote counts are visible to other users
					</p>
				</div>

				<!-- Account Actions -->
				<div class="card" style="margin-top: var(--gap-4);">
					<h4 style="margin-bottom: var(--gap-3);">Account Actions</h4>
					<div style="display: flex; gap: var(--gap-3);">
						<a href="/dashboard/proposals" class="btn-secondary btn-small">
							View My Proposals
						</a>
						<a href="/dashboard" class="btn-secondary btn-small">
							Back to Dashboard
						</a>
					</div>
				</div>
			{/if}
		</div>
	</AuthGuard>
</div>
