import React from 'react'
import {instance as Keyboard} from '../../services/Keyboard'
import {instance as Enum} from '../../../../../core/enums'

let validator = require('validator')

export default class InputBox extends React.Component {
	constructor() {
		super()
		this.state = {
			link: '',
			linkValid: false,
			dirty: false,
			submitted: false,
			buttonCSS: {}
		}

		this.typingTimeout = undefined
	}

	render() {
		let linkIsInvalid = this.state.link.length && !this.state.linkValid && this.state.dirty
		return (
			<div id="inputbox">
					<div className="input-wrapper">
						<input type="text"
							ref="input"
							placeholder="supercalifragilisticexpialidocious.com"
							value={this.state.link}
							onChange={this.OnLinkChange.bind(this)}
							onKeyDown={this.OnInputKeyDown.bind(this)}
							autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
						/>
						<div className={'input-background ' + (linkIsInvalid ? 'show' : '')} 
						></div>
					</div>

					<button type="button"
						onClick={this.OnSubmit.bind(this)}
						style={this.state.buttonCSS}
						disabled={this.state.linkValid ? '' : 'disabled'}
						className={this.state.linkValid ? '' : 'disabled'}
						onMouseDown={this.OnButtonMouseDown.bind(this)}
						onMouseUp={this.OnButtonMouseUp.bind(this)}
						onMouseLeave={this.OnButtonMouseLeave.bind(this)}
					>Shorten</button>
			</div>
		)
	}

	componentDidMount() {
		this.refs.input.focus()
	}

	OnInputKeyDown(event) {
		if (Keyboard.IsPressed(event, Enum.keys.ENTER) && this.state.linkValid) {
			event.preventDefault()
			this.OnSubmit()
		} else {
			this.OnLinkChange(event)
		}
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

	OnLinkChange(event) {
		if (!!this.typingTimeout) {
			clearTimeout(this.typingTimeout)
			this.typingTimeout = undefined
		}
		if (!this.state.dirty) {
			this.typingTimeout = setTimeout(() => {
				this.setState({
					...this.state,
					dirty: true
				})
				this.typingTimeout = undefined
			}, 600)
		}

		this.setState({
			...this.state,
			link: event.target.value,
			linkValid: validator.isURL(event.target.value)
		})
	}

	OnSubmit() {
		if (this.state.submitted) {
			return
		}
		this.props.requestLinkCreation(this.state.link)
		this.refs.input.blur()

		this.setState({
			...this.state,
			submitted: true
		})
	}
 }