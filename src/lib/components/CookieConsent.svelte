<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	interface CookiePreferences {
		necessary: boolean;
		functional: boolean;
		analytical: boolean;
	}

	let showBanner = false;
	let showPreferences = false;
	let preferences: CookiePreferences = {
		necessary: true, // Always true, cannot be disabled
		functional: false,
		analytical: false
	};

	onMount(() => {
		if (browser) {
			checkCookieConsent();
		}
	});

	function checkCookieConsent(): void {
		const consent = localStorage.getItem('cookieConsent');
		if (!consent) {
			showBanner = true;
		} else {
			preferences = JSON.parse(consent);
		}
	}

	function acceptAll(): void {
		preferences = {
			necessary: true,
			functional: true,
			analytical: true
		};
		savePreferences();
		showBanner = false;
	}

	function rejectNonEssential(): void {
		preferences = {
			necessary: true,
			functional: false,
			analytical: false
		};
		savePreferences();
		showBanner = false;
	}

	function savePreferences(): void {
		if (browser) {
			localStorage.setItem('cookieConsent', JSON.stringify(preferences));
			// Apply cookie preferences here
			applyCookiePreferences();
		}
	}

	function applyCookiePreferences(): void {
		// Enable/disable Google Analytics based on analytical preference
		if (preferences.analytical) {
			// Enable Google Analytics
			console.log('Analytics enabled');
		} else {
			// Disable Google Analytics
			console.log('Analytics disabled');
		}

		// Apply other cookie preferences as needed
		if (preferences.functional) {
			console.log('Functional cookies enabled');
		} else {
			console.log('Functional cookies disabled');
		}
	}

	function openPreferences(): void {
		showPreferences = true;
	}

	function closePreferences(): void {
		showPreferences = false;
	}

	function saveCustomPreferences(): void {
		savePreferences();
		showPreferences = false;
		showBanner = false;
	}
</script>

<!-- Cookie Consent Banner -->
{#if showBanner}
	<div class="cookie-banner" style="
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: var(--surface-elevated);
		border-top: 1px solid var(--divider);
		padding: var(--gap-4);
		z-index: 10000;
		backdrop-filter: blur(10px);
	">
		<div class="container" style="max-width: 1200px;">
			<div style="display: flex; align-items: center; gap: var(--gap-4);">
				<div style="flex: 1;">
					<h3 style="margin: 0 0 var(--gap-2) 0; color: var(--text); font-size: 18px;">
						Cookie Usage
					</h3>
					<p style="margin: 0; color: var(--text-2); font-size: 14px; line-height: 1.5;">
						We use cookies to improve your experience on our site. 
						Some are necessary for functionality, others help us analyze site usage.
					</p>
				</div>
				<div style="display: flex; gap: var(--gap-2); flex-shrink: 0;">
					<button 
						on:click={rejectNonEssential}
						class="btn-secondary btn-small"
					>
						Reject
					</button>
					<button 
						on:click={openPreferences}
						class="btn-secondary btn-small"
					>
						Customize
					</button>
					<button 
						on:click={acceptAll}
						class="btn-primary btn-small"
					>
						Accept All
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Cookie Preferences Modal -->
{#if showPreferences}
	<div class="cookie-modal" style="
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.8);
		z-index: 10001;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--gap-4);
	">
		<div class="cookie-preferences" style="
			background: var(--surface-elevated);
			border-radius: var(--r-lg);
			padding: var(--gap-6);
			max-width: 600px;
			width: 100%;
			max-height: 80vh;
			overflow-y: auto;
		">
			<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--gap-4);">
				<h2 style="margin: 0; color: var(--text); font-size: 24px;">
					Cookie Preferences
				</h2>
				<button 
					on:click={closePreferences}
					style="
						background: none;
						border: none;
						color: var(--text-3);
						font-size: 24px;
						cursor: pointer;
						padding: var(--gap-1);
					"
				>
					×
				</button>
			</div>

			<div style="margin-bottom: var(--gap-6);">
				<p style="color: var(--text-2); margin-bottom: var(--gap-4);">
					You can customize your cookie preferences by category. 
					Strictly necessary cookies cannot be disabled.
				</p>

				<!-- Necessary Cookies -->
				<div style="margin-bottom: var(--gap-4);">
					<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--gap-2);">
						<h3 style="margin: 0; color: var(--text);">Strictly Necessary Cookies</h3>
						<input 
							type="checkbox" 
							checked={preferences.necessary} 
							disabled
							style="transform: scale(1.2);"
						/>
					</div>
					<p style="color: var(--text-2); font-size: 14px; margin: 0;">
						Essential for site functionality (authentication, security, basic preferences).
					</p>
				</div>

				<!-- Functional Cookies -->
				<div style="margin-bottom: var(--gap-4);">
					<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--gap-2);">
						<h3 style="margin: 0; color: var(--text);">Functional Cookies</h3>
						<input 
							type="checkbox" 
							bind:checked={preferences.functional}
							style="transform: scale(1.2);"
						/>
					</div>
					<p style="color: var(--text-2); font-size: 14px; margin: 0;">
						Improve your experience (theme, language, interface preferences).
					</p>
				</div>

				<!-- Analytical Cookies -->
				<div style="margin-bottom: var(--gap-4);">
					<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--gap-2);">
						<h3 style="margin: 0; color: var(--text);">Analytical Cookies</h3>
						<input 
							type="checkbox" 
							bind:checked={preferences.analytical}
							style="transform: scale(1.2);"
						/>
					</div>
					<p style="color: var(--text-2); font-size: 14px; margin: 0;">
						Help us understand site usage (Google Analytics).
					</p>
				</div>
			</div>

			<div style="display: flex; gap: var(--gap-3); justify-content: flex-end;">
				<button 
					on:click={closePreferences}
					class="btn-secondary"
				>
					Cancel
				</button>
				<button 
					on:click={saveCustomPreferences}
					class="btn-primary"
				>
					Save
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.cookie-banner {
		animation: slideUp 0.3s ease-out;
	}

	.cookie-modal {
		animation: fadeIn 0.3s ease-out;
	}

	.cookie-preferences {
		animation: scaleIn 0.3s ease-out;
	}

	@keyframes slideUp {
		from {
			transform: translateY(100%);
		}
		to {
			transform: translateY(0);
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes scaleIn {
		from {
			transform: scale(0.9);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	@media (max-width: 768px) {
		.cookie-banner .container > div {
			flex-direction: column;
			align-items: stretch;
		}

		.cookie-banner .container > div > div:last-child {
			justify-content: center;
		}
	}
</style>
