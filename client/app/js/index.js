//TODO: Set up redux store

'use strict'
// import {instance as Log} from './services/Log'
// import {instance as Window} from './services/Window'
// import {instance as QueryString} from './services/QueryString'
// import {instance as Enum} from '../../../core/enums'
// import ShortrAPI from './services/ShortrAPI'

import React from 'react'
import ReactDOM from 'react-dom'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
require('../css/index.scss')

// import InputBox from './components/InputBox/InputBox'
// import Logo from './components/Logo/Logo'
// import LinkDisplay from './components/LinkDisplay/LinkDisplay'
// import Message from './components/Message/Message'
// import TermsPrivacy from './components/TermsPrivacy/TermsPrivacy'
// import Stars from './components/Stars/Stars'
// import Footer from './components/Footer/Footer'

let config = require('./config.json')

class App extends React.Component {
	constructor() {
		super()
		this.state = {
			submitted: false,
			hash: false,
			error: QueryString.Error(),
			terms: false,
			privacy: false
		}
	}

	render() {
		return (
			<div className="wrapper">
				<div className="content">
					<Logo />
					<div className="user-interaction">
						{!this.state.error && !(this.state.terms || this.state.privacy) &&
							<div>
								<ReactCSSTransitionGroup transitionName="inputbox" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
									{!this.state.submitted && <InputBox requestLinkCreation={this.CreateLink.bind(this)} /> }
								</ReactCSSTransitionGroup>
								<ReactCSSTransitionGroup transitionName="link" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
									{this.state.submitted && !!this.state.hash && <LinkDisplay hash={this.state.hash} hide={!this.state.submitted} /> }
								</ReactCSSTransitionGroup>
							</div>
						}
						{(this.state.terms || this.state.privacy) &&
							<TermsPrivacy terms={this.state.terms} privacy={this.state.privacy} clearTermsPrivacy={this.ClearTermsPrivacy.bind(this)} />
						}
						{!(this.state.terms || this.state.privacy) && this.state.error &&
							<Message text={this.state.error} clearMessage={this.ClearMessage.bind(this)} />
						}
					</div>
				</div>
				<Stars />
				<Footer showTerms={this.ShowTerms.bind(this)} showPrivacy={this.ShowPrivacy.bind(this)} />
			</div>
		)
	}

	CreateLink(link, token) {
		ShortrAPI.CreateLink(link, token)
			.then(response => {
				this.setState({
					...this.state,
					hash: response.hash
				})
			})
			.catch(json => {
				console.error(json.error)
				this.AddMessage(json.error)
			})

		this.setState({
			...this.state,
			submitted: true
		})
	}

	AddMessage(key) {
		if (!key || !key.length) key = 'GENERIC_ERROR'
		if (key in Enum.error.message) {
			this.setState({
				...this.state,
				error: Enum.error.message[key].replace(/(\. )/g, '.\n')
			})
		} else {
			this.setState({
				...this.state,
				error: key.replace(/(\. )/g, '.\n')
			})
		}
	}
}

ReactDOM.render(
	<App></App>,
	document.getElementById("app")
)