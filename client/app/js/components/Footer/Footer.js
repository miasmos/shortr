import React from 'react'
let config = require('../../config.json')

export default class Footer extends React.Component {
	constructor() {
		super()
		this.state = {
			TermsCSS: {},
			PrivacyCSS: {},
			ContactCSS: {}
		}
	}
	render() {
		return (
			<div id="footer">
				<ul>
					<li className="link" style={this.state.TermsCSS}
							onMouseDown={this.AddCSS.bind(this, 'Terms')}
							onMouseUp={this.ClearCSS.bind(this, 'Terms')}
							onMouseLeave={this.ClearCSS.bind(this, 'Terms')}
							onClick={this.props.showTerms}>
						Terms
					</li>
					<li className="divider"></li>
					<li className="link" style={this.state.PrivacyCSS}
							onMouseDown={this.AddCSS.bind(this, 'Privacy')}
							onMouseUp={this.ClearCSS.bind(this, 'Privacy')}
							onMouseLeave={this.ClearCSS.bind(this, 'Privacy')}
							onClick={this.props.showPrivacy}>
						Privacy
					</li>
					<li className="divider"></li>
					<li className="link" style={this.state.ContactCSS}
						onMouseDown={this.AddCSS.bind(this, 'Contact')}
						onMouseUp={this.ClearCSS.bind(this, 'Contact')}
						onMouseLeave={this.ClearCSS.bind(this, 'Contact')}>
						<a href={'https://twitter.com/intent/tweet?text=@' + config.twitterHandle + ' '}>Contact</a>
					</li>
				</ul>
			</div>
		)
	}

	AddCSS(type) {
		switch(type) {
			case 'Terms':
				this.setState({
					...this.state,
					TermsCSS: {
						transform: 'translate(1px, 1px)'
					}
				})
				break
			case 'Privacy':
				this.setState({
					...this.state,
					PrivacyCSS: {
						transform: 'translate(1px, 1px)'
					}
				})
				break
			case 'Contact':
				this.setState({
					...this.state,
					ContactCSS: {
						transform: 'translate(1px, 1px)'
					}
				})
				break
		}
	}

	ClearCSS(type) {
		switch(type) {
			case 'Terms':
				this.setState({
					...this.state,
					TermsCSS: {}
				})
				break
			case 'Privacy':
				this.setState({
					...this.state,
					PrivacyCSS: {}
				})
				break
			case 'Contact':
				this.setState({
					...this.state,
					ContactCSS: {}
				})
				break
		}
	}
 }