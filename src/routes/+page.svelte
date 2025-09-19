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
		{ title: 'ALGS Championship Finals', opponent: 'Team Phoenix', result: 'Victory', score: '3-1', isVictory: true },
		{ title: 'VCT Masters', opponent: 'Shadow Gaming', result: 'Victory', score: '13-8', isVictory: true },
		{ title: 'Weekly Apex Cup', opponent: 'Elite Squad', result: 'Defeat', score: '1-2', isVictory: false },
		{ title: 'Valorant Challengers', opponent: 'Night Hawks', result: 'Victory', score: '13-7', isVictory: true }
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
				<div style="display: flex; flex-wrap: wrap; gap: var(--gap-3); justify-content: center;">
					<a href="/apex-legends" class="btn-primary btn-large">
						Apex Legends Division
					</a>
					<a href="/valorant" class="btn-secondary btn-large">
						Valorant Division
					</a>
					<a href="/careers" class="btn-secondary btn-large">
						Join Our Team
					</a>
					{#if $user}
						<a href="/dashboard" class="btn-primary">
							Dashboard
						</a>
					{:else}
						<a href="/auth/login" class="btn-secondary">
							Join Community
						</a>
					{/if}
				</div>
			</div>
		</div>
	</section>

	<!-- Values Section -->
	<section class="section">
		<div class="container">
			<div style="text-align: center; margin-bottom: var(--gap-7);">
				<h2 style="margin-bottom: var(--gap-3);">Our Values</h2>
				<p style="font-size: 20px;">Excellence, transparency and performance in competitive gaming</p>
			</div>
			<div class="grid grid-3">
				<div class="card">
					<div style="font-size: 2.5rem; margin-bottom: var(--gap-3); color: var(--text);">TEAM</div>
					<h3 style="margin-bottom: var(--gap-2);">Team Spirit</h3>
					<p>Strong collaboration and communication for optimal performance</p>
				</div>
				<div class="card">
					<div style="font-size: 2.5rem; margin-bottom: var(--gap-3); color: var(--text);">SKILL</div>
					<h3 style="margin-bottom: var(--gap-2);">Competitive Excellence</h3>
					<p>Continuous improvement and mastery of gaming techniques</p>
				</div>
				<div class="card">
					<div style="font-size: 2.5rem; margin-bottom: var(--gap-3); color: var(--text);">GROWTH</div>
					<h3 style="margin-bottom: var(--gap-2);">Professional Development</h3>
					<p>Supporting player development and career advancement</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Team Statistics -->
	<section class="section" style="background: var(--surface);">
		<div class="container">
			<div style="text-align: center; margin-bottom: var(--gap-7);">
				<h2 style="margin-bottom: var(--gap-3);">Team Performance</h2>
				<p style="font-size: 20px;">Overall statistics across all divisions</p>
			</div>
			<StatsGrid {stats} />
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