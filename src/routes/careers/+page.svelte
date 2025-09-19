<script lang="ts">
	import Navigation from '$lib/components/Navigation.svelte';
	import PageHead from '$lib/components/PageHead.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { user } from '$lib';

	// Career opportunities data
	const careerOpportunities = [
		{
			id: 'voting-coordinator',
			title: 'Voting Coordinator',
			game: 'Community',
			location: 'Remote/Online',
			type: 'Part-time',
			experience: 'Intermediate',
			description: 'Manage and coordinate community voting processes, ensuring fair and transparent democratic decision-making.',
			requirements: [
				'Experience in community management or governance',
				'Strong organizational and communication skills',
				'Understanding of democratic processes',
				'Attention to detail and fairness',
				'Ability to work with diverse community members'
			],
			benefits: [
				'Flexible working hours',
				'Competitive hourly rate',
				'Work with passionate community members',
				'Professional development opportunities',
				'Remote work flexibility'
			],
			status: 'Open'
		},
		{
			id: 'proposal-reviewer',
			title: 'Proposal Reviewer',
			game: 'Community',
			location: 'Remote/Online',
			type: 'Part-time',
			experience: 'Intermediate',
			description: 'Review and evaluate community proposals, providing constructive feedback and ensuring quality standards.',
			requirements: [
				'Strong analytical and critical thinking skills',
				'Experience in project evaluation or review',
				'Excellent written communication abilities',
				'Understanding of community needs and goals',
				'Impartial and objective decision-making'
			],
			benefits: [
				'Flexible schedule',
				'Competitive compensation',
				'Work on meaningful community initiatives',
				'Skill development in evaluation and analysis',
				'Remote work environment'
			],
			status: 'Open'
		},
		{
			id: 'community-moderator',
			title: 'Community Moderator',
			game: 'Community',
			location: 'Remote/Online',
			type: 'Part-time',
			experience: 'Intermediate',
			description: 'Moderate community discussions and voting sessions, ensuring respectful and productive interactions.',
			requirements: [
				'Experience in online community moderation',
				'Strong conflict resolution skills',
				'Understanding of community guidelines',
				'Excellent communication and diplomacy',
				'Availability during peak community hours'
			],
			benefits: [
				'Flexible working hours',
				'Competitive hourly rate',
				'Work with engaged community members',
				'Professional development in moderation',
				'Remote work flexibility'
			],
			status: 'Open'
		},
		{
			id: 'voting-analyst',
			title: 'Voting Data Analyst',
			game: 'Community',
			location: 'Remote/Online',
			type: 'Part-time',
			experience: 'Advanced',
			description: 'Analyze voting patterns and community engagement data to improve democratic processes and decision-making.',
			requirements: [
				'Experience in data analysis and statistics',
				'Proficiency in data visualization tools',
				'Understanding of democratic systems',
				'Strong analytical and problem-solving skills',
				'Experience with survey and polling data'
			],
			benefits: [
				'Flexible schedule',
				'Competitive compensation',
				'Work with meaningful community data',
				'Professional development in analytics',
				'Remote work environment'
			],
			status: 'Open'
		}
	];

	function getStatusColor(status: string): string {
		switch (status) {
			case 'Open': return '#34C759';
			case 'Closed': return '#FF3B30';
			case 'Coming Soon': return '#FFC107';
			default: return 'var(--text-3)';
		}
	}

	function getGameColor(game: string): string {
		switch (game) {
			case 'Apex Legends': return '#EA4335';
			case 'Valorant': return '#FF4655';
			case 'Multi-game': return '#4285F4';
			case 'Community': return '#9C27B0';
			default: return 'var(--text-3)';
		}
	}
</script>

<PageHead 
	title="Careers - Team Cardinalis"
	description="Join Team Cardinalis and be part of the future of competitive esports. Explore career opportunities in professional gaming, coaching, content creation, and more."
/>

<div class="min-h-screen bg-black">
	<Navigation currentPage="careers" />

	<!-- Hero Section -->
	<section class="hero">
		<div class="container">
			<div style="text-align: center;">
				<h1 style="margin-bottom: var(--gap-4); font-size: clamp(48px, 8vw, 80px);">Join Team Cardinalis</h1>
				<p style="font-size: 24px; margin-bottom: var(--gap-6); max-width: 64ch; margin-left: auto; margin-right: auto; color: var(--text-2);">
					Be part of the future of competitive esports. We're looking for talented individuals to join our growing organization.
				</p>
				<div style="display: flex; flex-wrap: wrap; gap: var(--gap-3); justify-content: center;">
					{#if $user}
						<a href="/dashboard/apply" class="btn-primary btn-large">
							Apply Now
						</a>
					{:else}
						<a href="/auth/login" class="btn-primary btn-large">
							Sign In to Apply
						</a>
					{/if}
					<a href="#opportunities" class="btn-secondary btn-large">
						View Opportunities
					</a>
				</div>
			</div>
		</div>
	</section>

	<!-- Why Join Us Section -->
	<section class="section">
		<div class="container">
			<div style="text-align: center; margin-bottom: var(--gap-7);">
				<h2 style="margin-bottom: var(--gap-3);">Why Join Team Cardinalis?</h2>
				<p style="font-size: 20px; color: var(--text-2);">We offer more than just gaming - we offer a career</p>
			</div>
			<div class="grid grid-3">
				<div class="card">
					<h3 style="margin-bottom: var(--gap-2);">Competitive Excellence</h3>
					<p>Compete at the highest level with professional support, coaching, and resources to help you reach your full potential.</p>
				</div>
				<div class="card">
					<h3 style="margin-bottom: var(--gap-2);">Professional Development</h3>
					<p>Grow your career with comprehensive training, mentorship programs, and opportunities to develop new skills.</p>
				</div>
				<div class="card">
					<h3 style="margin-bottom: var(--gap-2);">Global Opportunities</h3>
					<p>Travel the world competing in international tournaments and representing Team Cardinalis on the global stage.</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Career Opportunities -->
	<section id="opportunities" class="section" style="background: var(--surface);">
		<div class="container">
			<div style="text-align: center; margin-bottom: var(--gap-7);">
				<h2 style="margin-bottom: var(--gap-3);">Open Positions</h2>
				<p style="font-size: 20px; color: var(--text-2);">Find your perfect role in our organization</p>
			</div>

			<div style="display: flex; flex-direction: column; gap: var(--gap-6);">
				{#each careerOpportunities as opportunity}
					<div class="card" style="border: 1px solid var(--divider);">
						<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--gap-4);">
							<div style="flex: 1;">
								<div style="display: flex; align-items: center; gap: var(--gap-2); margin-bottom: var(--gap-2);">
									<h3 style="margin: 0; font-size: 1.5rem; font-weight: 600;">{opportunity.title}</h3>
									<span style="
										padding: 4px 8px; 
										border-radius: var(--r-sm); 
										font-size: 12px; 
										font-weight: 500;
										background: {getStatusColor(opportunity.status)}20;
										color: {getStatusColor(opportunity.status)};
										border: 1px solid {getStatusColor(opportunity.status)}40;
									">
										{opportunity.status}
									</span>
								</div>
								<div style="display: flex; flex-wrap: gap: var(--gap-3); margin-bottom: var(--gap-3);">
									<span style="
										padding: 4px 8px; 
										border-radius: var(--r-sm); 
										font-size: 12px; 
										background: {getGameColor(opportunity.game)}20;
										color: {getGameColor(opportunity.game)};
										border: 1px solid {getGameColor(opportunity.game)}40;
									">
										{opportunity.game}
									</span>
									<span style="padding: 4px 8px; border-radius: var(--r-sm); font-size: 12px; background: var(--surface-elevated); color: var(--text-2);">
										{opportunity.type}
									</span>
									<span style="padding: 4px 8px; border-radius: var(--r-sm); font-size: 12px; background: var(--surface-elevated); color: var(--text-2);">
										{opportunity.location}
									</span>
									<span style="padding: 4px 8px; border-radius: var(--r-sm); font-size: 12px; background: var(--surface-elevated); color: var(--text-2);">
										{opportunity.experience}
									</span>
								</div>
								<p style="color: var(--text-2); font-size: 16px; margin-bottom: var(--gap-4);">
									{opportunity.description}
								</p>
							</div>
						</div>

						<div class="grid grid-2" style="margin-bottom: var(--gap-4);">
							<div>
								<h4 style="margin-bottom: var(--gap-2); color: var(--text);">Requirements</h4>
								<ul style="color: var(--text-2); font-size: 14px; margin: 0; padding-left: var(--gap-4);">
									{#each opportunity.requirements as requirement}
										<li style="margin-bottom: var(--gap-1);">{requirement}</li>
									{/each}
								</ul>
							</div>
							<div>
								<h4 style="margin-bottom: var(--gap-2); color: var(--text);">Benefits</h4>
								<ul style="color: var(--text-2); font-size: 14px; margin: 0; padding-left: var(--gap-4);">
									{#each opportunity.benefits as benefit}
										<li style="margin-bottom: var(--gap-1);">{benefit}</li>
									{/each}
								</ul>
							</div>
						</div>

						<div style="display: flex; justify-content: space-between; align-items: center;">
							<div style="font-size: 14px; color: var(--text-3);">
								Posted: {new Date().toLocaleDateString()}
							</div>
							<div style="display: flex; gap: var(--gap-2);">
								{#if $user}
									<a href="/dashboard/apply?position={opportunity.id}" class="btn-primary btn-small">
										Apply Now
									</a>
								{:else}
									<a href="/auth/login" class="btn-primary btn-small">
										Sign In to Apply
									</a>
								{/if}
								<button 
									class="btn-secondary btn-small"
									on:click={() => {
										// Toggle details visibility
										const details = document.getElementById(`details-${opportunity.id}`);
										if (details) {
											details.style.display = details.style.display === 'none' ? 'block' : 'none';
										}
									}}
								>
									View Details
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Application Process -->
	<section class="section">
		<div class="container">
			<div style="text-align: center; margin-bottom: var(--gap-7);">
				<h2 style="margin-bottom: var(--gap-3);">Application Process</h2>
				<p style="font-size: 20px; color: var(--text-2);">Simple steps to join our team</p>
			</div>
			<div class="grid grid-4">
				<div class="card" style="text-align: center;">
					<div style="font-size: 2rem; margin-bottom: var(--gap-3); color: var(--accent);">1</div>
					<h3 style="margin-bottom: var(--gap-2);">Apply Online</h3>
					<p style="color: var(--text-2);">Submit your application with your gaming experience and achievements.</p>
				</div>
				<div class="card" style="text-align: center;">
					<div style="font-size: 2rem; margin-bottom: var(--gap-3); color: var(--accent);">2</div>
					<h3 style="margin-bottom: var(--gap-2);">Initial Review</h3>
					<p style="color: var(--text-2);">Our team reviews your application and gaming portfolio.</p>
				</div>
				<div class="card" style="text-align: center;">
					<div style="font-size: 2rem; margin-bottom: var(--gap-3); color: var(--accent);">3</div>
					<h3 style="margin-bottom: var(--gap-2);">Trial Period</h3>
					<p style="color: var(--text-2);">Participate in tryouts and team integration sessions.</p>
				</div>
				<div class="card" style="text-align: center;">
					<div style="font-size: 2rem; margin-bottom: var(--gap-3); color: var(--accent);">4</div>
					<h3 style="margin-bottom: var(--gap-2);">Welcome Aboard</h3>
					<p style="color: var(--text-2);">Join Team Cardinalis and start your professional esports career!</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Call to Action -->
	<section class="section" style="background: var(--surface);">
		<div class="container">
			<div style="text-align: center;">
				<h2 style="margin-bottom: var(--gap-3);">Ready to Join Us?</h2>
				<p style="font-size: 20px; color: var(--text-2); margin-bottom: var(--gap-5);">
					Don't see the perfect role? We're always looking for talented individuals.
				</p>
				<div style="display: flex; flex-wrap: wrap; gap: var(--gap-3); justify-content: center;">
					{#if $user}
						<a href="/dashboard/apply" class="btn-primary btn-large">
							Start Your Application
						</a>
					{:else}
						<a href="/auth/login" class="btn-primary btn-large">
							Sign In to Apply
						</a>
					{/if}
					<a href="/contact" class="btn-secondary btn-large">
						Contact Us
					</a>
				</div>
			</div>
		</div>
	</section>
</div>

<Footer />
