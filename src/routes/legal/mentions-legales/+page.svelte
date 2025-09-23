<script lang="ts">
	import Navigation from '$lib/components/Navigation.svelte';
	import PageHead from '$lib/components/PageHead.svelte';

	const title = 'Legal Notice - Team Cardinalis';
	const description = 'Legal notice of the Team Cardinalis website in accordance with applicable law';
</script>

<PageHead title={title} description={description} />

<div class="min-h-screen bg-black">
	<Navigation currentPage="legal" />
	
	<div class="container" style="padding-top: 120px; padding-bottom: var(--gap-8);">
		<div class="card" style="max-width: 800px; margin: 0 auto;">
			<h1 style="font-size: 2.5rem; font-weight: 700; margin-bottom: var(--gap-4); text-align: center;">
				Legal Notice
			</h1>
			
			<div style="color: var(--text-2); font-size: 14px; margin-bottom: var(--gap-6); text-align: center;">
				In accordance with Article 6 of Law No. 2004-575 of June 21, 2004 on confidence in the digital economy
			</div>

			<div style="line-height: 1.8; color: var(--text-2);">
				
				<section style="margin-bottom: var(--gap-6);">
					<h2 style="color: var(--text); font-size: 1.5rem; margin-bottom: var(--gap-3); border-bottom: 1px solid var(--divider); padding-bottom: var(--gap-2);">
						1. Site Publisher
					</h2>
					
					<div style="background: var(--surface-elevated); padding: var(--gap-4); border-radius: var(--r-sm); margin-bottom: var(--gap-4);">
						<p><strong>Company Name:</strong> Team Cardinalis</p>
						<p><strong>Legal Form:</strong> Association under Law 1901</p>
						<p><strong>Registered Office:</strong> [Address to be completed]</p>
						<p><strong>SIREN Number:</strong> [To be completed]</p>
						<p><strong>RCS Number:</strong> [To be completed]</p>
						<p><strong>Intra-community VAT Number:</strong> [To be completed]</p>
						<p><strong>Share Capital:</strong> [To be completed]</p>
					</div>
				</section>

				<section style="margin-bottom: var(--gap-6);">
					<h2 style="color: var(--text); font-size: 1.5rem; margin-bottom: var(--gap-3); border-bottom: 1px solid var(--divider); padding-bottom: var(--gap-2);">
						2. Publication Director
					</h2>
					
					<div style="background: var(--surface-elevated); padding: var(--gap-4); border-radius: var(--r-sm);">
						<p><strong>Name:</strong> [Publication Director Name]</p>
						<p><strong>Position:</strong> President of Team Cardinalis Association</p>
						<p><strong>Contact:</strong> <a href="mailto:contact@teamcardinalis.com" style="color: var(--accent);">contact@teamcardinalis.com</a></p>
					</div>
				</section>

				<section style="margin-bottom: var(--gap-6);">
					<h2 style="color: var(--text); font-size: 1.5rem; margin-bottom: var(--gap-3); border-bottom: 1px solid var(--divider); padding-bottom: var(--gap-2);">
						3. Site Host
					</h2>
					
					<div style="background: var(--surface-elevated); padding: var(--gap-4); border-radius: var(--r-sm);">
						<p><strong>Name:</strong> Firebase (Google Cloud Platform)</p>
						<p><strong>Address:</strong> Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland</p>
						<p><strong>Phone:</strong> +353 1 436 1000</p>
						<p><strong>Website:</strong> <a href="https://firebase.google.com" target="_blank" rel="noopener" style="color: var(--accent);">https://firebase.google.com</a></p>
					</div>
				</section>

				<section style="margin-bottom: var(--gap-6);">
					<h2 style="color: var(--text); font-size: 1.5rem; margin-bottom: var(--gap-3); border-bottom: 1px solid var(--divider); padding-bottom: var(--gap-2);">
						4. Contact
					</h2>
					
					<div style="background: var(--surface-elevated); padding: var(--gap-4); border-radius: var(--r-sm);">
						<p><strong>Email:</strong> <a href="mailto:contact@teamcardinalis.com" style="color: var(--accent);">contact@teamcardinalis.com</a></p>
						<p><strong>Phone:</strong> [Number to be completed]</p>
						<p><strong>Postal Address:</strong> [Complete address to be completed]</p>
					</div>
				</section>

				<section style="margin-bottom: var(--gap-6);">
					<h2 style="color: var(--text); font-size: 1.5rem; margin-bottom: var(--gap-3); border-bottom: 1px solid var(--divider); padding-bottom: var(--gap-2);">
						5. Intellectual Property
					</h2>
					
					<p>
						This entire site is subject to French and international legislation on copyright and intellectual property. 
						All reproduction rights are reserved, including for downloadable documents and iconographic and photographic representations.
					</p>
					
					<p>
						The reproduction of all or part of this site on any electronic medium is strictly prohibited except with express authorization from the publication director.
					</p>
				</section>

				<section style="margin-bottom: var(--gap-6);">
					<h2 style="color: var(--text); font-size: 1.5rem; margin-bottom: var(--gap-3); border-bottom: 1px solid var(--divider); padding-bottom: var(--gap-2);">
						6. Liability
					</h2>
					
					<p>
						The information contained on this site is as accurate as possible and the site is updated at different times of the year, 
						but may nevertheless contain inaccuracies or omissions.
					</p>
					
					<p>
						If you notice a gap, error or what appears to be a malfunction, please report it by email, 
						to the address contact@teamcardinalis.com, describing the problem as precisely as possible.
					</p>
				</section>

				<section style="margin-bottom: var(--gap-6);">
					<h2 style="color: var(--text); font-size: 1.5rem; margin-bottom: var(--gap-3); border-bottom: 1px solid var(--divider); padding-bottom: var(--gap-2);">
						7. Hyperlinks
					</h2>
					
					<p>
						Hyperlinks may be present on the site. The user is informed that by clicking on these links, 
						they will leave the teamcardinalis.com site. The latter has no control over the web pages to which these links lead 
						and cannot in any case be responsible for their content.
					</p>
				</section>

				<section style="margin-bottom: var(--gap-6);">
					<h2 style="color: var(--text); font-size: 1.5rem; margin-bottom: var(--gap-3); border-bottom: 1px solid var(--divider); padding-bottom: var(--gap-2);">
						8. Applicable Law
					</h2>
					
					<p>
						Any dispute relating to the use of the teamcardinalis.com site is subject to French law. 
						Exclusive jurisdiction is attributed to the competent courts of [Registered Office City].
					</p>
				</section>

				<div style="margin-top: var(--gap-6); padding-top: var(--gap-4); border-top: 1px solid var(--divider); text-align: center; color: var(--text-3); font-size: 14px;">
					<p>Last updated: {new Date().toLocaleDateString('en-US')}</p>
				</div>
			</div>
		</div>
	</div>
</div>
