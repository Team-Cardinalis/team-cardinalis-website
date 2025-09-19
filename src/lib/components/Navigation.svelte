<script lang="ts">
	import { onMount } from 'svelte';
	import { user, isLoading } from '$lib';
	import { signOut } from 'firebase/auth';
	import { auth } from '$lib/firebase';

	export let currentPage: string = '';

	let navElement: HTMLElement;
	let logoutButton: HTMLElement;

	onMount(() => {
		function handleScroll(): void {
			if (navElement) {
				if (window.scrollY > 50) {
					navElement.classList.add('scrolled');
				} else {
					navElement.classList.remove('scrolled');
				}
			}
		}

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	function handleLogoutHover(): void {
		if (logoutButton) {
			logoutButton.style.color = '#ff3b30';
		}
	}

	function handleLogoutLeave(): void {
		if (logoutButton) {
			logoutButton.style.color = 'var(--text-2)';
		}
	}

	async function handleSignOut(): Promise<void> {
		try {
			await signOut(auth);
		} catch (error) {
			// Silent error handling for logout
		}
	}
</script>

<nav class="nav-main" bind:this={navElement}>
	<div class="container">
		<div style="display: flex; align-items: center; height: 60px;">
			<div style="display: flex; align-items: center; gap: var(--gap-5);">
				<a href="/" style="display: flex; align-items: center; text-decoration: none;">
					<img 
						src="/favicon.svg" 
						alt="Team Cardinalis" 
						style="width: 32px; height: 32px; border-radius: 8px;"
					/>
				</a>
				<div style="display: flex; gap: var(--gap-4); align-items: center;">
					<a 
						href="/apex-legends" 
						style="color: {currentPage === 'apex-legends' ? 'var(--text)' : 'var(--text-2)'}; text-decoration: none; font-size: 14px; transition: color 0.2s ease; {currentPage === 'apex-legends' ? 'font-weight: 500;' : ''}"
						on:mouseenter={(e) => {
							const target = e.target as HTMLElement;
							if (target) target.style.color = 'var(--text)';
						}}
						on:mouseleave={(e) => {
							const target = e.target as HTMLElement;
							if (target) target.style.color = currentPage === 'apex-legends' ? 'var(--text)' : 'var(--text-2)';
						}}
					>
						Apex Legends
					</a>
					<a 
						href="/valorant" 
						style="color: {currentPage === 'valorant' ? 'var(--text)' : 'var(--text-2)'}; text-decoration: none; font-size: 14px; transition: color 0.2s ease; {currentPage === 'valorant' ? 'font-weight: 500;' : ''}"
						on:mouseenter={(e) => {
							const target = e.target as HTMLElement;
							if (target) target.style.color = 'var(--text)';
						}}
						on:mouseleave={(e) => {
							const target = e.target as HTMLElement;
							if (target) target.style.color = currentPage === 'valorant' ? 'var(--text)' : 'var(--text-2)';
						}}
					>
						Valorant
					</a>
					<a 
						href="/careers" 
						style="color: {currentPage === 'careers' ? 'var(--text)' : 'var(--text-2)'}; text-decoration: none; font-size: 14px; transition: color 0.2s ease; {currentPage === 'careers' ? 'font-weight: 500;' : ''}"
						on:mouseenter={(e) => {
							const target = e.target as HTMLElement;
							if (target) target.style.color = 'var(--text)';
						}}
						on:mouseleave={(e) => {
							const target = e.target as HTMLElement;
							if (target) target.style.color = currentPage === 'careers' ? 'var(--text)' : 'var(--text-2)';
						}}
					>
						Careers
					</a>
				</div>
			</div>
			<div style="display: flex; align-items: center; gap: var(--gap-3); flex: 1; justify-content: flex-end;">
				{#if $isLoading}
					<div style="width: 24px; height: 24px; background: var(--text-2); border-radius: 50%;"></div>
				{:else if $user}
					<div style="display: flex; align-items: center; gap: var(--gap-3);">
						<a 
							href="/dashboard" 
							title="Dashboard"
							aria-label="Dashboard"
							class="header-icon"
							style="border: none; background: transparent; color: var(--text-2); padding: 8px; transition: color 0.3s ease;"
							on:mouseenter={(e) => {
								const target = e.target as HTMLElement;
								if (target) target.style.color = 'white';
							}}
							on:mouseleave={(e) => {
								const target = e.target as HTMLElement;
								if (target) target.style.color = 'var(--text-2)';
							}}
						>
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
								<circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</a>
						<button
							bind:this={logoutButton}
							on:click={handleSignOut}
							on:mouseenter={handleLogoutHover}
							on:mouseleave={handleLogoutLeave}
							title="Logout"
							aria-label="Logout"
							class="logout-icon"
							style="border: none; background: transparent; color: var(--text-2); padding: 8px; transition: color 0.3s ease;"
						>
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
								<path d="M16 17L21 12L16 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
								<path d="M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</button>
					</div>
				{:else}
					<a href="/auth/login" class="btn-primary">Sign In</a>
				{/if}
			</div>
		</div>
	</div>
</nav>
