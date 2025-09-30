<script lang="ts">
	import Navigation from '$lib/components/Navigation.svelte';
	import PageHead from '$lib/components/PageHead.svelte';
	import StatsGrid from '$lib/components/StatsGrid.svelte';
	import MatchList from '$lib/components/MatchList.svelte';
	import CommunitySection from '$lib/components/CommunitySection.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { user } from '$lib';

	const stats = [
		{ value: '20', label: 'Active Members' },
		{ value: '13', label: 'Tournaments Won' },
		{ value: '245', label: 'Total Victories' },
		{ value: '#2', label: 'Overall Ranking' }
	];

	const recentMatches = [
		{ title: 'ALGS Global Series 2024', opponent: '', result: '', score: '', isVictory: true },
		{ title: 'EVC European Championship 2024', opponent: '', result: '', score: '', isVictory: true },
		{ title: 'ALGS Global Series 2023', opponent: '', result: '', score: '', isVictory: true },
		{ title: 'Valorant Premier Contenders 2024', opponent: '', result: '', score: '', isVictory: true }
	];
</script>

<PageHead 
	title="Home - Team Cardinalis"
	description="Professional esports association focused on competitive gaming excellence"
/>

<div class="min-h-screen bg-black">
	<Navigation currentPage="" />

	<!-- Hero Section -->
	<section class="hero">
		<div class="container">
			<div style="text-align: center;">
				<h1 style="margin-bottom: var(--gap-4); font-size: clamp(48px, 8vw, 80px);">Team Cardinalis</h1>
				<p style="font-size: 24px; margin-bottom: var(--gap-6); max-width: 64ch; margin-left: auto; margin-right: auto; color: var(--text-2);">
					Professional esports association focused on competitive gaming excellence and team performance across multiple titles
				</p>
			</div>
		</div>
	</section>

	<!-- Recent Matches -->
	<section class="section">
		<div class="container">
			<div style="text-align: center; margin-bottom: var(--gap-7);">
				<h2 style="margin-bottom: var(--gap-3);">Recent Matches</h2>
				<p style="font-size: 20px;">Latest results from both Apex Legends and Valorant divisions</p>
			</div>
			<MatchList matches={recentMatches} />
		</div>
	</section>

	<!-- Our Divisions -->
	<section class="section" style="padding: var(--gap-6) 0;">
		<div class="container">
			<div style="text-align: center; margin-bottom: var(--gap-5);">
				<h2 style="margin-bottom: var(--gap-2);">Our Divisions</h2>
				<p style="font-size: 18px; color: var(--text-2); max-width: 40ch; margin: 0 auto;">
					Two elite esports divisions competing at the highest level
				</p>
			</div>
			
			<div class="divisions-compact">
				<!-- Apex Legends Division -->
				<div class="division-compact">
					<div class="division-info">
						<h3>Apex Legends</h3>
						<p>Battle royale excellence in the ALGS circuit</p>
						<div class="division-meta-compact">
							<span>12 Members</span>
							<span>#3 Regional</span>
						</div>
					</div>
					<a href="/apex-legends" class="btn-primary">Explore</a>
				</div>

				<!-- Valorant Division -->
				<div class="division-compact">
					<div class="division-info">
						<h3>Valorant</h3>
						<p>Tactical 5v5 combat in the VCT scene</p>
						<div class="division-meta-compact">
							<span>8 Members</span>
							<span>#7 Regional</span>
						</div>
					</div>
					<a href="/valorant" class="btn-primary">Explore</a>
				</div>
			</div>
		</div>
	</section>

	<!-- Community Section -->
	<CommunitySection user={$user} />

	<!-- Footer -->
	<Footer />
</div>

<style>
	.divisions-compact {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: var(--gap-4);
		max-width: 900px;
		margin: 0 auto;
	}

	.division-compact {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--gap-4);
		border: 1px solid var(--divider);
		border-radius: var(--r-sm);
		background: var(--surface);
	}

	.division-info {
		flex: 1;
	}

	.division-compact h3 {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text);
		margin: 0 0 var(--gap-1) 0;
	}

	.division-compact p {
		font-size: 14px;
		color: var(--text-2);
		margin: 0 0 var(--gap-2) 0;
		line-height: 1.4;
	}

	.division-meta-compact {
		display: flex;
		gap: var(--gap-3);
	}

	.division-meta-compact span {
		font-size: 12px;
		color: var(--text-3);
	}

	@media (max-width: 768px) {
		.divisions-compact {
			grid-template-columns: 1fr;
			gap: var(--gap-3);
		}

		.division-compact {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--gap-3);
		}

		.division-compact .btn-primary {
			align-self: flex-end;
		}
	}
</style>