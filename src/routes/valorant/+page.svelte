<script lang="ts">
	import Navigation from '$lib/components/Navigation.svelte';
	import PageHead from '$lib/components/PageHead.svelte';
	import StatsGrid from '$lib/components/StatsGrid.svelte';
	import MatchList from '$lib/components/MatchList.svelte';
	import CommunitySection from '$lib/components/CommunitySection.svelte';
	import { user } from '$lib';

	const stats = [
		{ value: '8', label: 'Active Members' },
		{ value: '5', label: 'Tournaments Won' },
		{ value: '89', label: 'Victories' },
		{ value: '#7', label: 'Regional Ranking' }
	];

	const matches = [
		{ title: 'EVC European Championship 2024', opponent: '', result: 'Participation', score: '', isVictory: true },
		{ title: 'Valorant Premier Contenders 2024', opponent: '', result: 'Participation', score: '', isVictory: true },
		{ title: 'Weekly Community Tournament', opponent: 'Night Hawks', result: 'Victory', score: '13-7', isVictory: true }
	];
</script>

<PageHead 
	title="Valorant - Team Cardinalis"
	description="Team Cardinalis Valorant division - Competitions, results and community"
/>

<div class="min-h-screen bg-black">
	<Navigation currentPage="valorant" />

	<!-- Hero Section -->
	<section class="hero">
		<div class="container">
			<div>
				<h1 style="margin-bottom: var(--gap-4);">Valorant</h1>
				<p style="font-size: 20px; margin-bottom: var(--gap-5); max-width: 56ch; margin-left: auto; margin-right: auto;">
					Valorant Division - Strategic decision system operational
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

		<CommunitySection game="valorant" user={$user} />

	<!-- Footer -->
	<footer class="footer">
		<div class="container">
			<p>© 2024 Team Cardinalis - Valorant Division</p>
		</div>
	</footer>
</div>