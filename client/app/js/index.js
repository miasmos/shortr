'use strict'
import {instance as Log} from './services/Log'
import {instance as Window} from './services/Window'
import {instance as QueryString} from './services/QueryString'
import {instance as Enum} from '../../../core/enums'
import ShortrAPI from './services/ShortrAPI'

import React from 'react'
import ReactDOM from 'react-dom'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
require('../css/index.scss')

import InputBox from './components/InputBox/InputBox'
import Logo from './components/Logo/Logo'
import LinkDisplay from './components/LinkDisplay/LinkDisplay'
import Message from './components/Message/Message'
import Stars from './components/Stars/Stars'
import Footer from './components/Footer/Footer'

let config = require('./config.json')

class App extends React.Component {
	constructor() {
		super()
		this.state = {
			submitted: false,
			hash: false,
			error: QueryString.Error()
		}
	}

	render() {
		return (
			<div className="wrapper">
				<div className="content">
					<Logo />
					<div className="user-interaction">
						{!this.state.error &&
							<div>
								<ReactCSSTransitionGroup transitionName="inputbox" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
									{!this.state.submitted && <InputBox requestLinkCreation={this.CreateLink.bind(this)} /> }
								</ReactCSSTransitionGroup>
								<ReactCSSTransitionGroup transitionName="link" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
									{this.state.submitted && !!this.state.hash && <LinkDisplay hash={this.state.hash} hide={!this.state.submitted} /> }
								</ReactCSSTransitionGroup>
							</div>
						}
						{this.state.error &&
							<Message text={this.state.error} clearMessage={this.ClearMessage.bind(this)} />
						}
					</div>
				</div>
				<Stars />
				<Footer />
			</div>
		)
	}

	CreateLink(link) {
		ShortrAPI.CreateLink(link)
			.then(response => {
				this.setState({
					...this.state,
					hash: response.hash
				})
				console.log(response)
			})
			.catch(error => {
				console.error(error)
			})

		this.setState({
			...this.state,
			submitted: true
		})
	}

	ClearMessage() {
		this.setState({
			...this.state,
			error: false
		})
	}
}

ReactDOM.render(
	<App></App>,
	document.getElementById("app")
)