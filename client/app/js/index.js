'use strict'
import {instance as Log} from './services/Log'
import {instance as Window} from './services/Window'
import {instance as QueryString} from './services/QueryString'
import {instance as Enum} from '../../../core/enums'
import ShortrAPI from './services/ShortrAPI'

import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
require('../css/index.scss')

import InputBox from './components/InputBox/InputBox'
import Logo from './components/Logo/Logo'
import LinkDisplay from './components/LinkDisplay/LinkDisplay'
import Message from './components/Message/Message'
import Terms from './components/Terms/Terms'
import Privacy from './components/Privacy/Privacy'
import Stars from './components/Stars/Stars'
import Footer from './components/Footer/Footer'

let config = require('./config.json')

class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			submitted: false,
			hash: false,
			error: false
		}
	}

	render() {
		return (
			<Router>
				<div className="wrapper">
					<div className="content">
						<Route render={({location}) => (
							// <ReactCSSTransitionGroup transitionName="fade" transitionEnterTimeout={0} transitionLeaveTimeout={0}>
								<Route location={location} key={location.key} render={() => (
									<div>
										<Logo />
										<Switch>
											<Route exact path="/" component={() => (
												this.state.error ? (
													<Redirect to="/error" />
												) : (
													<div className="user-interaction">
														{!this.state.submitted && <InputBox requestLinkCreation={this.CreateLink.bind(this)} /> }
														{this.state.submitted && !!this.state.hash && <LinkDisplay hash={this.state.hash} hide={!this.state.submitted} /> }
													</div>
												)
											)} />
											<Route path="/privacy" component={Privacy} />
											<Route path="/terms" component={Terms} />
											<Route path="/error" component={() => (
												<Message text={QueryString.Error() || this.state.error || Enum.error.message.GENERIC_ERROR} clearError={this.ClearError.bind(this)} />
											)} />
											<Route component={() => (
												<Message text={Enum.error.message.NOT_FOUND} clearError={this.ClearError.bind(this)} />
											)} />
										</Switch>
									</div>
								)} />
							// </ReactCSSTransitionGroup>
						)} />
					</div>
					<Stars />
					<Footer />
				</div>
			</Router>
		)
	}

	componentWillMount() {
		let error = QueryString.Error()
		if (!!error) {
			this.setState({ ...this.state, error: error })
		}
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

	ClearError() {
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