import React from 'react'
let validator = require('validator')

export default class Input extends React.Component {
	constructor() {
		super()
		this.state = {
			link: '',
			linkValid: false
		}
	}

	render() {
		return (
			<div id="input">
				<input type="text"
					placeholder="yourlongurl.com"
					style={{backgroundColor: this.state.link.length && !this.state.linkValid ? '#F00' : 'initial'}}
					value={this.state.link}
					onChange={this.OnLinkChange.bind(this)}
				/>

				<button type="button"
					onClick={this.OnSubmit.bind(this)}
					disabled={this.state.linkValid ? '' : 'disabled'}
				>Shorten</button>
			</div>
		)
	}

	OnLinkChange(event) {
		this.setState({
			...this.state,
			link: event.target.value,
			linkValid: validator.isURL(event.target.value)
		})
	}

	OnSubmit() {
		this.props.requestLinkCreation(this.state.link)
	}
 }