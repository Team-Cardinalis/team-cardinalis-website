<script lang="ts">
	import Navigation from '$lib/components/Navigation.svelte';
	import PageHead from '$lib/components/PageHead.svelte';

	const title = 'Privacy Policy - Team Cardinalis';
	const description = 'Privacy policy and personal data protection in accordance with GDPR';
</script>

<PageHead title={title} description={description} />

<div class="min-h-screen bg-black">
	<Navigation currentPage="legal" />
	
	<div class="container" style="padding-top: 120px; padding-bottom: var(--gap-8);">
		<div class="card" style="max-width: 800px; margin: 0 auto;">
			<h1 style="font-size: 2.5rem; font-weight: 700; margin-bottom: var(--gap-4); text-align: center;">
				Privacy Policy
			</h1>
			
			<div style="color: var(--text-2); font-size: 14px; margin-bottom: var(--gap-6); text-align: center;">
				In accordance with the General Data Protection Regulation (GDPR) - EU Regulation 2016/679
			</div>

			<div style="line-height: 1.8; color: var(--text-2);">
				
				<section style="margin-bottom: var(--gap-6);">
					<h2 style="color: var(--text); font-size: 1.5rem; margin-bottom: var(--gap-3); border-bottom: 1px solid var(--divider); padding-bottom: var(--gap-2);">
						1. Data Controller
					</h2>
					
					<div style="background: var(--surface-elevated); padding: var(--gap-4); border-radius: var(--r-sm);">
						<p><strong>Identity:</strong> Team Cardinalis</p>
						<p><strong>Legal Form:</strong> Association under Law 1901</p>
						<p><strong>Address:</strong> [Complete address to be completed]</p>
						<p><strong>Email:</strong> <a href="mailto:contact@teamcardinalis.com" style="color: var(--accent);">contact@teamcardinalis.com</a></p>
						<p><strong>Phone:</strong> [Number to be completed]</p>
					</div>
				</section>

				<section style="margin-bottom: var(--gap-6);">
					<h2 style="color: var(--text); font-size: 1.5rem; margin-bottom: var(--gap-3); border-bottom: 1px solid var(--divider); padding-bottom: var(--gap-2);">
						2. Personal Data Collected
					</h2>
					
					<p>We collect the following personal data:</p>
					
					<div style="background: var(--surface-elevated); padding: var(--gap-4); border-radius: var(--r-sm); margin-top: var(--gap-3);">
						<h3 style="color: var(--text); margin-bottom: var(--gap-2);">Authentication Data:</h3>
						<ul style="margin-left: var(--gap-4);">
							<li>Email address (via Google OAuth)</li>
						<li>Display name</li>
						<li>Profile picture (optional)</li>
						<li>Unique user identifier</li>
						</ul>
						
				<h3 style="color: var(--text); margin: var(--gap-3) 0 var(--gap-2) 0;">Activity Data:</h3>
				<ul style="margin-left: var(--gap-4);">
					<li>Votes and proposals created</li>
					<li>Applications submitted</li>
					<li>Comments and discussions</li>
					<li>Activity timestamps</li>
				</ul>
						
				<h3 style="color: var(--text); margin: var(--gap-3) 0 var(--gap-2) 0;">Technical Data:</h3>
				<ul style="margin-left: var(--gap-4);">
					<li>IP address</li>
					<li>Browser type</li>
					<li>Navigation data</li>
				</ul>
					</div>
				</section>

				<section style="margin-bottom: var(--gap-6);">
			<h2 style="color: var(--text); font-size: 1.5rem; margin-bottom: var(--gap-3); border-bottom: 1px solid var(--divider); padding-bottom: var(--gap-2);">
				3. Processing Purposes
			</h2>
					
			<div style="background: var(--surface-elevated); padding: var(--gap-4); border-radius: var(--r-sm);">
				<p><strong>User account management:</strong> Creation, authentication and profile management</p>
				<p><strong>Voting features:</strong> Participation in the association's democratic system</p>
				<p><strong>Application management:</strong> Processing applications to join the team</p>
				<p><strong>Communication:</strong> Sending important information about the association</p>
				<p><strong>Security:</strong> Fraud prevention and user protection</p>
				<p><strong>Statistics:</strong> Anonymized analysis of site usage</p>
			</div>
				</section>

				<section style="margin-bottom: var(--gap-6);">
			<h2 style="color: var(--text); font-size: 1.5rem; margin-bottom: var(--gap-3); border-bottom: 1px solid var(--divider); padding-bottom: var(--gap-2);">
				4. Legal Basis for Processing
			</h2>
					
			<div style="background: var(--surface-elevated); padding: var(--gap-4); border-radius: var(--r-sm);">
				<p><strong>Consent (Art. 6.1.a GDPR):</strong> For the use of non-essential cookies</p>
				<p><strong>Contract performance (Art. 6.1.b GDPR):</strong> For providing association services</p>
				<p><strong>Legitimate interest (Art. 6.1.f GDPR):</strong> For security and anonymized statistics</p>
				<p><strong>Legal obligation (Art. 6.1.c GDPR):</strong> For retention of billing data</p>
			</div>
				</section>

				<section style="margin-bottom: var(--gap-6);">
			<h2 style="color: var(--text); font-size: 1.5rem; margin-bottom: var(--gap-3); border-bottom: 1px solid var(--divider); padding-bottom: var(--gap-2);">
				5. Retention Periods
			</h2>
					
			<div style="background: var(--surface-elevated); padding: var(--gap-4); border-radius: var(--r-sm);">
				<p><strong>Account data:</strong> Retained while account is active + 3 years after inactivity</p>
				<p><strong>Voting data:</strong> Retained for 5 years for democratic traceability</p>
				<p><strong>Applications:</strong> Retained for 2 years after processing</p>
				<p><strong>Technical data:</strong> Retained for maximum 12 months</p>
				<p><strong>Billing data:</strong> Retained for 10 years (legal obligation)</p>
			</div>
				</section>

				<section style="margin-bottom: var(--gap-6);">
			<h2 style="color: var(--text); font-size: 1.5rem; margin-bottom: var(--gap-3); border-bottom: 1px solid var(--divider); padding-bottom: var(--gap-2);">
				6. Data Recipients
			</h2>
			
			<p>Your personal data may be shared with:</p>
					
			<div style="background: var(--surface-elevated); padding: var(--gap-4); border-radius: var(--r-sm); margin-top: var(--gap-3);">
				<p><strong>Association members:</strong> For voting and discussion features</p>
				<p><strong>Firebase (Google):</strong> Hosting and authentication</p>
				<p><strong>Technical service providers:</strong> Site maintenance and development</p>
				<p><strong>Competent authorities:</strong> In case of legal obligation</p>
			</div>
				</section>

				<section style="margin-bottom: var(--gap-6);">
			<h2 style="color: var(--text); font-size: 1.5rem; margin-bottom: var(--gap-3); border-bottom: 1px solid var(--divider); padding-bottom: var(--gap-2);">
				7. International Transfers
			</h2>
			
			<p>
				Some of your data may be transferred to countries outside the European Union, 
				particularly to the United States (Firebase/Google). These transfers are governed by:
			</p>
					
			<div style="background: var(--surface-elevated); padding: var(--gap-4); border-radius: var(--r-sm); margin-top: var(--gap-3);">
				<p><strong>Adequacy decision:</strong> For countries recognized by the European Commission</p>
				<p><strong>Standard contractual clauses:</strong> For other countries</p>
				<p><strong>Certification:</strong> Privacy Shield or equivalent</p>
			</div>
				</section>

				<section style="margin-bottom: var(--gap-6);">
			<h2 style="color: var(--text); font-size: 1.5rem; margin-bottom: var(--gap-3); border-bottom: 1px solid var(--divider); padding-bottom: var(--gap-2);">
				8. Your Rights
			</h2>
			
			<p>In accordance with GDPR, you have the following rights:</p>
					
			<div style="background: var(--surface-elevated); padding: var(--gap-4); border-radius: var(--r-sm); margin-top: var(--gap-3);">
				<p><strong>Right of access (Art. 15):</strong> Know what data we hold about you</p>
				<p><strong>Right of rectification (Art. 16):</strong> Correct inaccurate data</p>
				<p><strong>Right to erasure (Art. 17):</strong> Request deletion of your data</p>
				<p><strong>Right to restriction (Art. 18):</strong> Limit the processing of your data</p>
				<p><strong>Right to portability (Art. 20):</strong> Retrieve your data in a structured format</p>
				<p><strong>Right to object (Art. 21):</strong> Object to the processing of your data</p>
				<p><strong>Right to withdraw consent:</strong> Withdraw your consent at any time</p>
			</div>
					
			<p style="margin-top: var(--gap-3);">
				To exercise these rights, contact us at: 
				<a href="mailto:privacy@teamcardinalis.com" style="color: var(--accent);">privacy@teamcardinalis.com</a>
			</p>
				</section>

				<section style="margin-bottom: var(--gap-6);">
			<h2 style="color: var(--text); font-size: 1.5rem; margin-bottom: var(--gap-3); border-bottom: 1px solid var(--divider); padding-bottom: var(--gap-2);">
				9. Data Security
			</h2>
			
			<p>
				We implement appropriate technical and organizational measures to protect your data 
				against loss, misuse, unauthorized access, disclosure, alteration or destruction.
			</p>
					
			<div style="background: var(--surface-elevated); padding: var(--gap-4); border-radius: var(--r-sm); margin-top: var(--gap-3);">
				<p><strong>Encryption:</strong> Data transmitted via HTTPS</p>
				<p><strong>Authentication:</strong> Secure system via Google OAuth</p>
				<p><strong>Restricted access:</strong> Only authorized members can access data</p>
				<p><strong>Regular audit:</strong> Periodic verification of security measures</p>
			</div>
				</section>

				<section style="margin-bottom: var(--gap-6);">
			<h2 style="color: var(--text); font-size: 1.5rem; margin-bottom: var(--gap-3); border-bottom: 1px solid var(--divider); padding-bottom: var(--gap-2);">
				10. Contact and Complaints
			</h2>
					
			<div style="background: var(--surface-elevated); padding: var(--gap-4); border-radius: var(--r-sm);">
				<p><strong>Data Protection Officer:</strong> [DPO name to be completed]</p>
				<p><strong>Email:</strong> <a href="mailto:dpo@teamcardinalis.com" style="color: var(--accent);">dpo@teamcardinalis.com</a></p>
				<p><strong>Phone:</strong> [Number to be completed]</p>
						
				<div style="margin-top: var(--gap-3); padding-top: var(--gap-3); border-top: 1px solid var(--divider);">
					<p><strong>Supervisory Authority:</strong></p>
					<p>CNIL - National Commission for Information Technology and Civil Liberties</p>
					<p>3 Place de Fontenoy - TSA 80715 - 75334 PARIS CEDEX 07</p>
					<p>Phone: 01 53 73 22 22</p>
					<p>Website: <a href="https://www.cnil.fr" target="_blank" rel="noopener" style="color: var(--accent);">www.cnil.fr</a></p>
				</div>
					</div>
				</section>

				<div style="margin-top: var(--gap-6); padding-top: var(--gap-4); border-top: 1px solid var(--divider); text-align: center; color: var(--text-3); font-size: 14px;">
					<p>Last updated: {new Date().toLocaleDateString('en-US')}</p>
				</div>
			</div>
		</div>
	</div>
</div>
