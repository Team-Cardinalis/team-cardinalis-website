<script lang="ts">
	import Navigation from '$lib/components/Navigation.svelte';
	import PageHead from '$lib/components/PageHead.svelte';
	import StatsGrid from '$lib/components/StatsGrid.svelte';
	import MatchList from '$lib/components/MatchList.svelte';
	import CommunitySection from '$lib/components/CommunitySection.svelte';
	import { user } from '$lib';

	const stats = [
		{ value: '12', label: 'Active Members' },
		{ value: '8', label: 'Tournaments Won' },
		{ value: '156', label: 'Victories' },
		{ value: '#3', label: 'Regional Ranking' }
	];

	const matches = [
		{ title: 'ALGS Pro League', opponent: 'Team Phoenix', result: 'Victory', score: '15-8', isVictory: true },
		{ title: 'Championship Series', opponent: 'Elite Gaming', result: 'Defeat', score: '12-18', isVictory: false },
		{ title: 'Weekly Tournament', opponent: 'Storm Riders', result: 'Victory', score: '20-5', isVictory: true }
	];
</script>

<PageHead 
	title="Apex Legends - Team Cardinalis"
	description="Team Cardinalis Apex Legends division - Competitions, results and community"
/>

<div class="min-h-screen bg-black">
	<Navigation currentPage="apex-legends" />

	<!-- Hero Section -->
	<section class="hero">
		<div class="container">
			<div>
				<h1 style="margin-bottom: var(--gap-4);">Apex Legends</h1>
				<p style="font-size: 20px; margin-bottom: var(--gap-5); max-width: 56ch; margin-left: auto; margin-right: auto;">
					Apex Legends Division - Strategic decision system operational
				</p>
			</div>
		</div>
	</section>

	<!-- Team Stats -->
	<section class="section">
		<div class="container">
			<div style="text-align: center; margin-bottom: var(--gap-7);">
				<h2 style="margin-bottom: var(--gap-3);">Team Statistics</h2>
				<p style="font-size: 20px;">Team performance and results</p>
			</div>
			<StatsGrid {stats} />
		</div>
	</section>

	<!-- Recent Matches -->
	<section class="section" style="background: var(--surface);">
		<div class="container">
			<div style="text-align: center; margin-bottom: var(--gap-7);">
				<h2 style="margin-bottom: var(--gap-3);">Recent Matches</h2>
				<p style="font-size: 20px;">Latest team results</p>
			</div>
			<MatchList {matches} />
		</div>
	</section>

		<CommunitySection game="apex-legends" user={$user} />

	<!-- Footer -->
	<footer class="footer">
		<div class="container">
			<p>© 2024 Team Cardinalis - Apex Legends Division</p>
		</div>
	</footer>
</div>