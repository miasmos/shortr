import React from 'react'

export default class TermsPrivacy extends React.Component {
	constructor() {
		super()
		this.state = {
			buttonCSS: {}
		}
	}
	render() {
		return (
			<div id="termsprivacy">
				{this.props.terms &&
					<div className="terms"><div className="terms-inner">
						<h2>Terms of Service ("Terms")</h2>
						<br/>
						<p>Last updated: April 26, 2017
						<br/><br/>
						Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the shortr.li website (the "Service") operated by Shortr ("us", "we", or "our").

						Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service.

						By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service. This Terms of Service is licensed by TermsFeed Generator to Shortr.
						</p><br/>
						<h2>Links To Other Web Sites</h2>
						<br/>
						<p>Our Service may contain links to third-party web sites or services that are not owned or controlled by Shortr.

						Shortr has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that Shortr shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.

						We strongly advise you to read the terms and conditions and privacy policies of any third-party web sites or services that you visit.
						</p><br/>
						<h2>Termination</h2>
						<br/>
						<p>We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.

						All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.
						</p><br/>
						<h2>Governing Law</h2>
						<br/>
						<p>These Terms shall be governed and construed in accordance with the laws of Ontario, Canada, without regard to its conflict of law provisions.

						Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Service, and supersede and replace any prior agreements we might have between us regarding the Service.
						</p><br/>
						<h2>Changes</h2>
						<br/>
						<p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 15 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.

						By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
						</p><br/>
						<h2>Contact Us</h2>
						<br/>
						<p>If you have any questions about these Terms, please contact us.
						</p>
					</div></div>
				}

				{this.props.privacy &&
					<div className="privacy"><div className="privacy-inner">
						<h2>Privacy Policy</h2>
						<br/>
						<p>Last updated: April 26, 2017
						<br/><br/>
						Shortr ("us", "we", or "our") operates the shortr.li website (the "Service").

						This page informs you of our policies regarding the collection, use and disclosure of Personal Information when you use our Service.

						We will not use or share your information with anyone except as described in this Privacy Policy. This Privacy Policy is licensed by TermsFeed Generator to Shortr.

						We use your Personal Information for providing and improving the Service. By using the Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, accessible at shortr.li
						</p><br/>
						<h2>Information Collection And Use</h2>
						<br/>
						<p>While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you.
						</p><br/>
						<h2>Log Data</h2>
						<br/>
						<p>We collect information that your browser sends whenever you visit our Service ("Log Data"). This Log Data may include information such as your computer's Internet Protocol ("IP") address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages and other statistics.
						</p><br/>
						<h2>Cookies</h2>
						<br/>
						<p>Cookies are files with small amount of data, which may include an anonymous unique identifier. Cookies are sent to your browser from a web site and stored on your computer's hard drive.

						We use "cookies" to collect information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
						</p><br/>
						<h2>Service Providers</h2>
						<br/>
						<p>We may employ third party companies and individuals to facilitate our Service, to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used.

						These third parties have access to your Personal Information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
						</p><br/>
						<h2>Security</h2>
						<br/>
						<p>The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.
						</p><br/>
						<h2>Links To Other Sites</h2>
						<br/>
						<p>Our Service may contain links to other sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit.

						We have no control over, and assume no responsibility for the content, privacy policies or practices of any third party sites or services.
						</p><br/>
						<h2>Children's Privacy</h2>
						<br/>
						<p>Our Service does not address anyone under the age of 13 ("Children").

						We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your Children has provided us with Personal Information, please contact us. If we discover that a Children under 13 has provided us with Personal Information, we will delete such information from our servers immediately.
						</p><br/>
						<h2>Changes To This Privacy Policy</h2>
						<br/>
						<p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.

						You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
						</p><br/>
						<h2>Contact Us</h2>
						<br/>
						<p>If you have any questions about this Privacy Policy, please contact us.</p>
					</div></div>
				}

				<div className="back">
					<a href="/">
						<span onMouseDown={this.OnButtonMouseDown.bind(this)}
						onMouseUp={this.OnButtonMouseUp.bind(this)}
						onMouseLeave={this.OnButtonMouseLeave.bind(this)}
						style={this.state.buttonCSS}>go back</span>
					</a>
				</div>
			</div>
		)
	}

	OnButtonMouseDown(event) {
		this.setState({
			...this.state,
			buttonCSS: {
				transform: 'translate(1px, 1px)'
			}
		})
	}

	OnButtonMouseUp(event) {
		this.setState({
			...this.state,
			buttonCSS: {}
		})
	}

	OnButtonMouseLeave(event) {
		this.setState({
			...this.state,
			buttonCSS: {}
		})
	}
 }