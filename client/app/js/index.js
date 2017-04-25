'use strict'
import {instance as Log} from './services/Log'
import {instance as Enum} from '../../../core/enums'
import ShortrAPI from './services/ShortrAPI'

import React from 'react'
import ReactDOM from 'react-dom'
require('../css/index.scss')

import Input from './components/Input/Input'
import Logo from './components/Logo/Logo'

let config = require('./config.json')

class App extends React.Component {
	render() {
		return (
			<div>
				<Logo />
				<Input requestLinkCreation={this.CreateLink.bind(this)} />
			</div>
		)
	}

	CreateLink(link) {
		ShortrAPI.CreateLink(link)
			.then(response => {
				console.log(response)
			})
			.catch(error => {
				console.error(error)
			})
	}
}

ReactDOM.render(
	<App></App>,
	document.getElementById("app")
)