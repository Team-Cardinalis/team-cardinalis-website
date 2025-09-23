<script lang="ts">
	import Navigation from '$lib/components/Navigation.svelte';
	import PageHead from '$lib/components/PageHead.svelte';

	const title = 'Gestion des cookies - Team Cardinalis';
	const description = 'Information sur l\'utilisation des cookies et traceurs sur le site Team Cardinalis';
</script>

<PageHead title={title} description={description} />

<div class="min-h-screen bg-black">
	<Navigation currentPage="legal" />
	
	<div class="container" style="padding-top: 120px; padding-bottom: var(--gap-8);">
		<div class="card" style="max-width: 800px; margin: 0 auto;">
			<h1 style="font-size: 2.5rem; font-weight: 700; margin-bottom: var(--gap-4); text-align: center;">
				Cookie Management
			</h1>
			
			<div style="color: var(--text-2); font-size: 14px; margin-bottom: var(--gap-6); text-align: center;">
				Information on the use of cookies and trackers in accordance with the ePrivacy directive
			</div>

			<div style="line-height: 1.8; color: var(--text-2);">
				
				<section style="margin-bottom: var(--gap-6);">
				<h2 style="color: var(--text); font-size: 1.5rem; margin-bottom: var(--gap-3); border-bottom: 1px solid var(--divider); padding-bottom: var(--gap-2);">
					What is a cookie?
				</h2>
				
				<p>
					A cookie is a small text file placed on your computer, tablet or smartphone when you visit our site. 
					It allows your browser to be recognized and remembers certain information about you.
				</p>
				</section>

				<section style="margin-bottom: var(--gap-6);">
				<h2 style="color: var(--text); font-size: 1.5rem; margin-bottom: var(--gap-3); border-bottom: 1px solid var(--divider); padding-bottom: var(--gap-2);">
					Types of cookies used
				</h2>
					
				<div style="background: var(--surface-elevated); padding: var(--gap-4); border-radius: var(--r-sm); margin-bottom: var(--gap-4);">
					<h3 style="color: var(--text); margin-bottom: var(--gap-2);">Strictly necessary cookies</h3>
					<p>These cookies are essential for the operation of the site and cannot be disabled.</p>
					<ul style="margin-left: var(--gap-4); margin-top: var(--gap-2);">
						<li><strong>Session cookies:</strong> Maintaining your connection</li>
						<li><strong>Security cookies:</strong> Protection against CSRF attacks</li>
						<li><strong>Preference cookies:</strong> Saving your interface choices</li>
					</ul>
				</div>

				<div style="background: var(--surface-elevated); padding: var(--gap-4); border-radius: var(--r-sm); margin-bottom: var(--gap-4);">
					<h3 style="color: var(--text); margin-bottom: var(--gap-2);">Functional cookies</h3>
					<p>These cookies improve your user experience but are not essential.</p>
					<ul style="margin-left: var(--gap-4); margin-top: var(--gap-2);">
						<li><strong>Preference cookies:</strong> Dark/light theme, language</li>
						<li><strong>Personalization cookies:</strong> Interface configuration</li>
					</ul>
				</div>

				<div style="background: var(--surface-elevated); padding: var(--gap-4); border-radius: var(--r-sm);">
					<h3 style="color: var(--text); margin-bottom: var(--gap-2);">Analytical cookies</h3>
					<p>These cookies help us understand how you use our site.</p>
					<ul style="margin-left: var(--gap-4); margin-top: var(--gap-2);">
						<li><strong>Google Analytics:</strong> Anonymized visit statistics</li>
						<li><strong>Performance cookies:</strong> Site performance measurement</li>
					</ul>
				</div>
				</section>

				<section style="margin-bottom: var(--gap-6);">
				<h2 style="color: var(--text); font-size: 1.5rem; margin-bottom: var(--gap-3); border-bottom: 1px solid var(--divider); padding-bottom: var(--gap-2);">
					Third-party cookies
				</h2>
					
				<div style="background: var(--surface-elevated); padding: var(--gap-4); border-radius: var(--r-sm);">
					<h3 style="color: var(--text); margin-bottom: var(--gap-2);">Firebase (Google)</h3>
					<p><strong>Purpose:</strong> Authentication and data hosting</p>
					<p><strong>Duration:</strong> Session + 2 years</p>
					<p><strong>Data collected:</strong> User identifier, connection preferences</p>
					<p><strong>Policy:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener" style="color: var(--accent);">Google Privacy Policy</a></p>
						
						<div style="margin-top: var(--gap-3); padding-top: var(--gap-3); border-top: 1px solid var(--divider);">
						<h3 style="color: var(--text); margin-bottom: var(--gap-2);">Google Analytics</h3>
						<p><strong>Purpose:</strong> Traffic and performance analysis</p>
						<p><strong>Duration:</strong> 2 years</p>
						<p><strong>Data collected:</strong> Pages visited, session duration, traffic source</p>
						<p><strong>Policy:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener" style="color: var(--accent);">Google Privacy Policy</a></p>
						</div>
					</div>
				</section>

				<section style="margin-bottom: var(--gap-6);">
				<h2 style="color: var(--text); font-size: 1.5rem; margin-bottom: var(--gap-3); border-bottom: 1px solid var(--divider); padding-bottom: var(--gap-2);">
					Managing your preferences
				</h2>
				
				<p>You can manage your cookie preferences in several ways:</p>
					
				<div style="background: var(--surface-elevated); padding: var(--gap-4); border-radius: var(--r-sm); margin-top: var(--gap-3);">
					<h3 style="color: var(--text); margin-bottom: var(--gap-2);">Via our consent banner</h3>
					<p>During your first visit, a banner allows you to:</p>
					<ul style="margin-left: var(--gap-4); margin-top: var(--gap-2);">
						<li>Accept all cookies</li>
						<li>Reject non-essential cookies</li>
						<li>Customize your preferences by category</li>
					</ul>
				</div>

				<div style="background: var(--surface-elevated); padding: var(--gap-4); border-radius: var(--r-sm); margin-top: var(--gap-3);">
					<h3 style="color: var(--text); margin-bottom: var(--gap-2);">Via your browser</h3>
					<p>You can configure your browser to:</p>
					<ul style="margin-left: var(--gap-4); margin-top: var(--gap-2);">
						<li>Block all cookies</li>
						<li>Accept only first-party cookies</li>
						<li>Delete existing cookies</li>
					</ul>
						
					<div style="margin-top: var(--gap-3); padding-top: var(--gap-3); border-top: 1px solid var(--divider);">
						<p><strong>Useful links:</strong></p>
							<p>• <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener" style="color: var(--accent);">Chrome</a></p>
							<p>• <a href="https://support.mozilla.org/fr/kb/protection-renforcee-contre-pistage-firefox-ordinateur" target="_blank" rel="noopener" style="color: var(--accent);">Firefox</a></p>
							<p>• <a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener" style="color: var(--accent);">Safari</a></p>
							<p>• <a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener" style="color: var(--accent);">Edge</a></p>
						</div>
					</div>
				</section>

				<section style="margin-bottom: var(--gap-6);">
				<h2 style="color: var(--text); font-size: 1.5rem; margin-bottom: var(--gap-3); border-bottom: 1px solid var(--divider); padding-bottom: var(--gap-2);">
					Consent and withdrawal
				</h2>
					
					<div style="background: var(--surface-elevated); padding: var(--gap-4); border-radius: var(--r-sm);">
					<h3 style="color: var(--text); margin-bottom: var(--gap-2);">Modifying your preferences</h3>
					<p>
						You can modify your cookie preferences at any time by clicking on the 
						"Cookie Management" link at the bottom of each page.
					</p>
						
						<div style="margin-top: var(--gap-3); padding-top: var(--gap-3); border-top: 1px solid var(--divider);">
						<h3 style="color: var(--text); margin-bottom: var(--gap-2);">Withdrawal of consent</h3>
						<p>
							Withdrawing your consent does not affect the lawfulness of processing based on consent 
							given before withdrawal. You can withdraw your consent by:
						</p>
						<ul style="margin-left: var(--gap-4); margin-top: var(--gap-2);">
							<li>Deleting cookies from your browser</li>
							<li>Modifying your preferences via our interface</li>
							<li>Contacting us directly</li>
						</ul>
						</div>
					</div>
				</section>

				<section style="margin-bottom: var(--gap-6);">
				<h2 style="color: var(--text); font-size: 1.5rem; margin-bottom: var(--gap-3); border-bottom: 1px solid var(--divider); padding-bottom: var(--gap-2);">
					Consequences of refusal
				</h2>
				
				<div style="background: var(--surface-elevated); padding: var(--gap-4); border-radius: var(--r-sm);">
					<p><strong>Strictly necessary cookies:</strong> The site will not function properly</p>
					<p><strong>Functional cookies:</strong> Loss of certain personalized features</p>
					<p><strong>Analytical cookies:</strong> We will not be able to improve the site according to your needs</p>
				</div>
				</section>

				<section style="margin-bottom: var(--gap-6);">
					<h2 style="color: var(--text); font-size: 1.5rem; margin-bottom: var(--gap-3); border-bottom: 1px solid var(--divider); padding-bottom: var(--gap-2);">
						Contact
					</h2>
					
				<div style="background: var(--surface-elevated); padding: var(--gap-4); border-radius: var(--r-sm);">
					<p>For any questions regarding our use of cookies:</p>
					<p><strong>Email:</strong> <a href="mailto:privacy@teamcardinalis.com" style="color: var(--accent);">privacy@teamcardinalis.com</a></p>
					<p><strong>Phone:</strong> [Number to be completed]</p>
					<p><strong>Address:</strong> [Complete address to be completed]</p>
				</div>
				</section>

				<div style="margin-top: var(--gap-6); padding-top: var(--gap-4); border-top: 1px solid var(--divider); text-align: center; color: var(--text-3); font-size: 14px;">
					<p>Last updated: {new Date().toLocaleDateString('en-US')}</p>
				</div>
			</div>
		</div>
	</div>
</div>
