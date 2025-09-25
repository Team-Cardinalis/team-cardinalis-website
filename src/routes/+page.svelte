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
			<div style="text-align: center; margin-top: var(--gap-6);">
				<a href="/apex-legends" class="btn-secondary" style="margin-right: var(--gap-3);">
					View Apex Results
				</a>
				<a href="/valorant" class="btn-secondary">
					View Valorant Results
				</a>
			</div>
		</div>
	</section>

	<!-- Divisions Overview -->
	<section class="section" style="background: var(--surface);">
		<div class="container">
			<div style="text-align: center; margin-bottom: var(--gap-7);">
				<h2 style="margin-bottom: var(--gap-3);">Our Divisions</h2>
				<p style="font-size: 20px;">Compete across multiple esports titles</p>
			</div>
			<div class="grid grid-2">
				<div class="card" style="position: relative; overflow: hidden;">
					<div style="position: absolute; top: var(--gap-4); right: var(--gap-4); font-size: 4rem; opacity: 0.1; color: var(--text);">A</div>
					<h3 style="font-size: 2rem; margin-bottom: var(--gap-3); color: var(--accent);">Apex Legends</h3>
					<p style="margin-bottom: var(--gap-4); font-size: 18px;">
						Battle royale excellence with strategic gameplay and team coordination in the ALGS competitive scene.
					</p>
					<div style="margin-bottom: var(--gap-3);">
						<div style="display: flex; align-items: center; gap: var(--gap-2); margin-bottom: var(--gap-1);">
							<span style="font-weight: 600;">12 Active Members</span>
						</div>
						<div style="display: flex; align-items: center; gap: var(--gap-2); margin-bottom: var(--gap-1);">
							<span style="font-weight: 600;">8 Tournaments Won</span>
						</div>
						<div style="display: flex; align-items: center; gap: var(--gap-2);">
							<span style="font-weight: 600;">#3 Regional Ranking</span>
						</div>
					</div>
					<a href="/apex-legends" class="btn-primary">
						Explore Division
					</a>
				</div>
				<div class="card" style="position: relative; overflow: hidden;">
					<div style="position: absolute; top: var(--gap-4); right: var(--gap-4); font-size: 4rem; opacity: 0.1; color: var(--text);">V</div>
					<h3 style="font-size: 2rem; margin-bottom: var(--gap-3); color: var(--accent);">Valorant</h3>
					<p style="margin-bottom: var(--gap-4); font-size: 18px;">
						Tactical 5v5 shooter competition with precise aim, strategy, and team communication in VCT.
					</p>
					<div style="margin-bottom: var(--gap-3);">
						<div style="display: flex; align-items: center; gap: var(--gap-2); margin-bottom: var(--gap-1);">
							<span style="font-weight: 600;">8 Active Members</span>
						</div>
						<div style="display: flex; align-items: center; gap: var(--gap-2); margin-bottom: var(--gap-1);">
							<span style="font-weight: 600;">5 Tournaments Won</span>
						</div>
						<div style="display: flex; align-items: center; gap: var(--gap-2);">
							<span style="font-weight: 600;">#7 Regional Ranking</span>
						</div>
					</div>
					<a href="/valorant" class="btn-primary">
						Explore Division
					</a>
				</div>
			</div>
		</div>
	</section>

	<!-- Community Section -->
	<CommunitySection user={$user} />

	<!-- Footer -->
	<Footer />
</div>