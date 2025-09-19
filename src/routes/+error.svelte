<script lang="ts">
	import { page } from '$app/stores';
	import Navigation from '$lib/components/Navigation.svelte';
	import PageHead from '$lib/components/PageHead.svelte';
	import { UIHelpers } from '$lib/utils/commonUtils';

	$: status = $page.status;
	$: errorMessage = $page.error?.message || 'An unexpected error occurred';
	$: errorStack = ($page.error as any)?.stack;

	function getErrorTitle(status: number): string {
		switch (status) {
			case 400:
				return 'Bad Request';
			case 401:
				return 'Unauthorized';
			case 403:
				return 'Forbidden';
			case 404:
				return 'Page Not Found';
			case 500:
				return 'Internal Server Error';
			case 502:
				return 'Bad Gateway';
			case 503:
				return 'Service Unavailable';
			default:
				return 'Error';
		}
	}

	function getErrorDescription(status: number): string {
		switch (status) {
			case 400:
				return 'The request was invalid or cannot be served.';
			case 401:
				return 'You need to be authenticated to access this resource.';
			case 403:
				return 'You do not have permission to access this resource.';
			case 404:
				return 'The page you are looking for does not exist.';
			case 500:
				return 'Something went wrong on our end. Please try again later.';
			case 502:
				return 'The server received an invalid response from another server.';
			case 503:
				return 'The service is temporarily unavailable.';
			default:
				return 'An unexpected error occurred.';
		}
	}
</script>

<PageHead 
	title="{getErrorTitle(status)} - Team Cardinalis"
	description="An error occurred while loading the page"
/>

<div class="min-h-screen bg-black">
	<Navigation currentPage="" />
	
	<!-- Error Content -->
	<div class="container" style="padding-top: 120px; padding-bottom: var(--gap-8);">
		<div style="display: flex; flex-direction: column; align-items: center; text-align: center; min-height: 60vh; justify-content: center;">
			<!-- Error Icon -->
			<div style="font-size: 4rem; margin-bottom: var(--gap-4);">
				{UIHelpers.getStatusIcon(status)}
			</div>
			
			<!-- Error Code -->
			<div style="font-size: 6rem; font-weight: 700; color: {UIHelpers.getStatusColor(status)}; margin-bottom: var(--gap-2);">
				{status}
			</div>
			
			<!-- Error Title -->
			<h1 style="font-size: 2.5rem; font-weight: 600; margin-bottom: var(--gap-3);">
				{getErrorTitle(status)}
			</h1>
			
			<!-- Error Description -->
			<p style="font-size: 18px; color: var(--text-2); margin-bottom: var(--gap-4); max-width: 600px;">
				{getErrorDescription(status)}
			</p>
			
			<!-- Error Message (if available) -->
			{#if errorMessage && errorMessage !== getErrorDescription(status)}
				<div class="card" style="margin-bottom: var(--gap-4); max-width: 600px; background: var(--surface-elevated); border: 1px solid {UIHelpers.getStatusColor(status)};">
					<p style="color: var(--text-2); font-size: 16px; margin: 0;">
						<strong>Details:</strong> {errorMessage}
					</p>
				</div>
			{/if}
			
			<!-- Action Buttons -->
			<div style="display: flex; flex-wrap: wrap; gap: var(--gap-3); justify-content: center;">
				<button 
					on:click={() => window.history.back()} 
					class="btn-secondary btn-large"
				>
					Go Back
				</button>
				
				<a href="/" class="btn-primary btn-large">
					Home Page
				</a>
				
				{#if status === 401}
					<a href="/auth/login" class="btn-primary btn-large">
						Sign In
					</a>
				{/if}
				
				{#if status === 404}
					<a href="/dashboard" class="btn-secondary btn-large">
						Dashboard
					</a>
				{/if}
			</div>
			
			<!-- Help Section -->
			<div class="card" style="margin-top: var(--gap-6); max-width: 600px; background: var(--surface-elevated);">
				<h3 style="margin-bottom: var(--gap-3); color: var(--accent);">Need Help?</h3>
				<p style="color: var(--text-2); margin-bottom: var(--gap-3);">
					If this error persists, please try the following:
				</p>
				<div style="text-align: left;">
					<ul style="color: var(--text-2); margin: 0; padding-left: var(--gap-4);">
						<li style="margin-bottom: var(--gap-1);">Refresh the page</li>
						<li style="margin-bottom: var(--gap-1);">Check your internet connection</li>
						<li style="margin-bottom: var(--gap-1);">Clear your browser cache</li>
						<li style="margin-bottom: var(--gap-1);">Try again in a few minutes</li>
					</ul>
				</div>
			</div>
			
			<!-- Debug Info (only in development) -->
			{#if import.meta.env.DEV && errorStack}
				<details class="card" style="margin-top: var(--gap-4); max-width: 800px; text-align: left;">
					<summary style="cursor: pointer; font-weight: 600; margin-bottom: var(--gap-2);">
						Debug Information (Development Only)
					</summary>
					<pre style="background: var(--surface); padding: var(--gap-3); border-radius: var(--r-sm); overflow-x: auto; font-size: 12px; color: var(--text-3); margin: 0;">
{errorStack}
					</pre>
				</details>
			{/if}
		</div>
	</div>
</div>
