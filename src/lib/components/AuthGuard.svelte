<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { user, isLoading, getDefaultRedirectRoute } from '$lib';
	import LoadingIndicator from './LoadingIndicator.svelte';

	export let redirectTo: string = getDefaultRedirectRoute();

	onMount(() => {
		// Only run client-side authentication checks
		if (browser) {
			// Wait for authentication state to be determined
			if (!$isLoading && !$user) {
				goto(redirectTo);
			}
		}
	});

	// React to authentication state changes (client-side only)
	$: if (browser && !$isLoading && !$user) {
		goto(redirectTo);
	}
</script>

{#if $isLoading}
	<div style="display: flex; justify-content: center; align-items: center; min-height: 50vh;">
		<LoadingIndicator isLoading={true} size="large" />
	</div>
{:else if $user}
	<slot />
{:else}
	<div style="display: flex; justify-content: center; align-items: center; min-height: 50vh;">
		<div style="text-align: center;">
			<h2 style="margin-bottom: var(--gap-3);">Authentication Required</h2>
			<p style="color: var(--text-2); margin-bottom: var(--gap-4);">
				You need to be logged in to access this page.
			</p>
			<a href={redirectTo} class="btn-primary">
				Sign In
			</a>
		</div>
	</div>
{/if}
