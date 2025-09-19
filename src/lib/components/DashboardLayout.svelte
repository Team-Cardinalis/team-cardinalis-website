<script lang="ts">
	import Navigation from '$lib/components/Navigation.svelte';
	import PageHead from '$lib/components/PageHead.svelte';
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';
	import AuthGuard from '$lib/components/AuthGuard.svelte';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';

	let { 
		title, 
		description, 
		isLoading = false, 
		error = '', 
		showErrorDisplay = true,
		children 
	} = $props();
</script>

<PageHead {title} {description} />

<div class="min-h-screen bg-black">
	<Navigation currentPage="dashboard" />
	
	{#if showErrorDisplay}
		<ErrorDisplay />
	{/if}
	
	<AuthGuard>
		<!-- Main Content -->
		<div class="container" style="padding-top: 120px; padding-bottom: var(--gap-8);">
			{#if isLoading}
				<div style="display: flex; justify-content: center; align-items: center; padding: var(--gap-8) 0;">
					<LoadingIndicator isLoading={true} size="large" message="Loading dashboard data..." />
				</div>
			{:else if error}
				<div class="message-error">
					{error}
				</div>
			{:else}
				{@render children()}
			{/if}
		</div>
	</AuthGuard>
</div>
