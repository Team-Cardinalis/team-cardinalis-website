<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let currentYear = new Date().getFullYear();
	let isVisible = false;

	onMount(() => {
		if (browser) {
			isVisible = true;
		}
	});

	const socialLinks = [
		{
			name: 'Twitter',
			url: 'https://twitter.com/teamcardinalis',
			icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z'
		},
		{
			name: 'Discord',
			url: 'https://discord.gg/teamcardinalis',
			icon: 'M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z'
		},
		{
			name: 'YouTube',
			url: 'https://youtube.com/@teamcardinalis',
			icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'
		},
		{
			name: 'Twitch',
			url: 'https://twitch.tv/teamcardinalis',
			icon: 'M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z'
		}
	];

	const quickLinks = [
		{ name: 'Home', url: '/' },
		{ name: 'Apex Legends', url: '/apex-legends' },
		{ name: 'Valorant', url: '/valorant' },
		{ name: 'Careers', url: '/careers' },
		{ name: 'Dashboard', url: '/dashboard' }
	];

	const legalLinks = [
		{ name: 'Legal Notice', url: '/legal/mentions-legales' },
		{ name: 'Privacy Policy', url: '/legal/politique-confidentialite' },
		{ name: 'Cookies', url: '/legal/cookies' }
	];

	const contactInfo = {
		email: 'contact@teamcardinalis.com',
		discord: 'discord.gg/teamcardinalis',
		address: 'France'
	};
</script>

{#if isVisible}
	<footer class="footer" style="
		background: var(--surface);
		border-top: 1px solid var(--divider);
		padding: var(--gap-8) 0 var(--gap-6) 0;
		margin-top: var(--gap-8);
	">
		<div class="container">
			<!-- Main Footer Content -->
			<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--gap-6); margin-bottom: var(--gap-6);">
				
				<!-- Brand Section -->
				<div style="display: flex; flex-direction: column; gap: var(--gap-3);">
					<div style="display: flex; align-items: center; gap: var(--gap-3);">
						<img 
							src="/favicon.svg" 
							alt="Team Cardinalis" 
							style="width: 40px; height: 40px; border-radius: 8px;"
						/>
						<div>
							<h3 style="margin: 0; color: var(--text); font-size: 20px; font-weight: 600;">
								Team Cardinalis
							</h3>
							<p style="margin: 0; color: var(--text-2); font-size: 14px;">
								Professional esports association
							</p>
						</div>
					</div>
					<p style="color: var(--text-2); font-size: 14px; line-height: 1.6; margin: 0;">
						Competitive excellence in esports. Join our community of professional players 
						and participate in our democratic decision-making system.
					</p>
					
					<!-- Social Links -->
					<div style="display: flex; gap: var(--gap-2);">
						{#each socialLinks as social}
							<a 
								href={social.url} 
								target="_blank" 
								rel="noopener noreferrer"
								title={social.name}
								aria-label={social.name}
								style="
									display: flex;
									align-items: center;
									justify-content: center;
									width: 40px;
									height: 40px;
									background: var(--surface-elevated);
									border: 1px solid var(--divider);
									border-radius: 10px;
									color: var(--text-2);
									transition: all 0.2s ease;
									text-decoration: none;
								"
								on:mouseenter={(e) => {
									const target = e.target as HTMLElement;
									if (target) {
										target.style.background = 'var(--accent)';
										target.style.color = 'white';
										target.style.transform = 'translateY(-2px)';
									}
								}}
								on:mouseleave={(e) => {
									const target = e.target as HTMLElement;
									if (target) {
										target.style.background = 'var(--surface-elevated)';
										target.style.color = 'var(--text-2)';
										target.style.transform = 'translateY(0)';
									}
								}}
							>
								<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
									<path d={social.icon} />
								</svg>
							</a>
						{/each}
					</div>
				</div>

				<!-- Quick Links -->
				<div>
					<h4 style="margin: 0 0 var(--gap-3) 0; color: var(--text); font-size: 16px; font-weight: 600;">
						Navigation
					</h4>
					<ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: var(--gap-2);">
						{#each quickLinks as link}
							<li>
								<a 
									href={link.url}
									style="
										color: var(--text-2);
										text-decoration: none;
										font-size: 14px;
										transition: color 0.2s ease;
									"
									on:mouseenter={(e) => {
										const target = e.target as HTMLElement;
										if (target) target.style.color = 'var(--accent)';
									}}
									on:mouseleave={(e) => {
										const target = e.target as HTMLElement;
										if (target) target.style.color = 'var(--text-2)';
									}}
								>
									{link.name}
								</a>
							</li>
						{/each}
					</ul>
				</div>

				<!-- Contact Info -->
				<div>
					<h4 style="margin: 0 0 var(--gap-3) 0; color: var(--text); font-size: 16px; font-weight: 600;">
						Contact
					</h4>
					<div style="display: flex; flex-direction: column; gap: var(--gap-2);">
						<div style="display: flex; align-items: center; gap: var(--gap-2);">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
								<polyline points="22,6 12,13 2,6"/>
							</svg>
							<a 
								href="mailto:{contactInfo.email}"
								style="color: var(--text-2); text-decoration: none; font-size: 14px; transition: color 0.2s ease;"
								on:mouseenter={(e) => {
									const target = e.target as HTMLElement;
									if (target) target.style.color = 'var(--accent)';
								}}
								on:mouseleave={(e) => {
									const target = e.target as HTMLElement;
									if (target) target.style.color = 'var(--text-2)';
								}}
							>
								{contactInfo.email}
							</a>
						</div>
						<div style="display: flex; align-items: center; gap: var(--gap-2);">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
								<path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
							</svg>
							<span style="color: var(--text-2); font-size: 14px;">
								{contactInfo.discord}
							</span>
						</div>
						<div style="display: flex; align-items: center; gap: var(--gap-2);">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
								<circle cx="12" cy="10" r="3"/>
							</svg>
							<span style="color: var(--text-2); font-size: 14px;">
								{contactInfo.address}
							</span>
						</div>
					</div>
				</div>

				<!-- Legal Links -->
				<div>
					<h4 style="margin: 0 0 var(--gap-3) 0; color: var(--text); font-size: 16px; font-weight: 600;">
						Legal
					</h4>
					<ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: var(--gap-2);">
						{#each legalLinks as link}
							<li>
								<a 
									href={link.url}
									style="
										color: var(--text-2);
										text-decoration: none;
										font-size: 14px;
										transition: color 0.2s ease;
									"
									on:mouseenter={(e) => {
										const target = e.target as HTMLElement;
										if (target) target.style.color = 'var(--accent)';
									}}
									on:mouseleave={(e) => {
										const target = e.target as HTMLElement;
										if (target) target.style.color = 'var(--text-2)';
									}}
								>
									{link.name}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			</div>

			<!-- Bottom Bar -->
			<div style="
				padding-top: var(--gap-4);
				border-top: 1px solid var(--divider);
				display: flex;
				justify-content: space-between;
				align-items: center;
				flex-wrap: wrap;
				gap: var(--gap-3);
			">
				<div style="display: flex; align-items: center; gap: var(--gap-4); flex-wrap: wrap;">
					<p style="margin: 0; color: var(--text-3); font-size: 14px;">
						© {currentYear} Team Cardinalis. All rights reserved.
					</p>
					<div style="display: flex; align-items: center; gap: var(--gap-2);">
						<span style="color: var(--text-3); font-size: 12px;">Made with</span>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="color: #ff6b6b;">
							<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
						</svg>
						<span style="color: var(--text-3); font-size: 12px;">in France</span>
					</div>
				</div>
				
				<div style="display: flex; align-items: center; gap: var(--gap-2);">
					<span style="color: var(--text-3); font-size: 12px;">Powered by</span>
					<div style="display: flex; align-items: center; gap: var(--gap-1);">
						<img 
							src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjRkY2QjZCIi8+Cjwvc3ZnPgo=" 
							alt="Svelte" 
							style="width: 16px; height: 16px;"
						/>
						<span style="color: var(--text-3); font-size: 12px;">Svelte</span>
					</div>
					<span style="color: var(--text-3); font-size: 12px;">•</span>
					<div style="display: flex; align-items: center; gap: var(--gap-1);">
						<img 
							src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjRkZDQTI4Ii8+Cjwvc3ZnPgo=" 
							alt="Firebase" 
							style="width: 16px; height: 16px;"
						/>
						<span style="color: var(--text-3); font-size: 12px;">Firebase</span>
					</div>
				</div>
			</div>
		</div>
	</footer>
{/if}

<style>
	.footer {
		animation: fadeInUp 0.6s ease-out;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 768px) {
		.footer .container > div:first-child {
			grid-template-columns: 1fr;
			gap: var(--gap-4);
		}

		.footer .container > div:last-child {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--gap-2);
		}
	}
</style>
