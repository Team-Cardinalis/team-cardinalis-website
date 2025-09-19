<script lang="ts">
	import { onMount } from 'svelte';
	import PageHead from '$lib/components/PageHead.svelte';
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';
	import { auth, googleProvider } from '$lib/firebase';
	import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { user } from '$lib';

	let error: string = '';
	let isGoogleLoading: boolean = false;

	onMount(() => {
		const unsubscribe = onAuthStateChanged(auth, (userData) => {
			if (userData) {
				goto('/');
			}
		});

		return () => unsubscribe();
	});

	async function handleGoogleLogin(): Promise<void> {
		isGoogleLoading = true;
		error = '';

		try {
			const result = await signInWithPopup(auth, googleProvider);
			goto('/');
		} catch (err: any) {
			
			switch (err.code) {
				case 'auth/popup-closed-by-user':
					error = 'Login cancelled by user';
					break;
				case 'auth/popup-blocked':
					error = 'Popup blocked by browser. Please allow popups for this site.';
					break;
				case 'auth/cancelled-popup-request':
					error = 'Login cancelled';
					break;
				case 'auth/network-request-failed':
					error = 'Network error. Please check your internet connection.';
					break;
				case 'auth/too-many-requests':
					error = 'Too many failed attempts. Please try again later.';
					break;
				case 'auth/operation-not-allowed':
					error = 'Google authentication is not enabled. Please contact support.';
					break;
				case 'auth/unauthorized-domain':
					error = 'This domain is not authorized for authentication.';
					break;
				default:
					error = `Login failed: ${err.message || 'Unknown error'}`;
			}
		} finally {
			isGoogleLoading = false;
		}
	}
</script>

<PageHead 
	title="Login - Team Cardinalis"
	description="Sign in to access the community voting system"
/>

<div class="min-h-screen bg-black flex items-center justify-center" style="padding: var(--gap-4);">
	<div style="width: 100%; max-width: 400px;">
		<!-- Logo -->
		<div style="text-align: center; margin-bottom: var(--gap-6);">
			<h1 style="font-size: 2rem; font-weight: 600; color: var(--text); margin-bottom: var(--gap-1);">Team Cardinalis</h1>
			<p style="color: var(--text-2);">Login required</p>
		</div>

		<!-- Login Form -->
		<div class="card">
			<div style="text-align: center; margin-bottom: var(--gap-5);">
				<h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: var(--gap-1);">
					Login
				</h2>
				<p style="color: var(--text-2);">
					Access to community voting system
				</p>
			</div>

			{#if error}
				<div class="message-error">
					{error}
				</div>
			{/if}

			<!-- Google Login Button -->
			<button
				on:click={handleGoogleLogin}
				disabled={isGoogleLoading}
				class="btn-primary btn-large"
				style="width: 100%; justify-content: center;"
			>
				{#if isGoogleLoading}
					<LoadingIndicator isLoading={true} size="small" />
					Connecting...
				{:else}
					<svg style="width: 20px; height: 20px;" viewBox="0 0 24 24">
						<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
						<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
						<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
						<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
					</svg>
					Sign in with Google
				{/if}
			</button>

			<div style="margin-top: var(--gap-4); text-align: center;">
				<p style="color: var(--text-3); font-size: 15px;">
					Only Google authentication is authorized
				</p>
			</div>
		</div>

		<!-- Back to home -->
		<div style="text-align: center; margin-top: var(--gap-5);">
			<a href="/" style="color: var(--text-3); text-decoration: none; font-size: 15px;">
				← Back to home
			</a>
		</div>
	</div>
</div>