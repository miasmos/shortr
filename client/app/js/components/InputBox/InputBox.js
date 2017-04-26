import React from 'react'
import {instance as Keyboard} from '../../services/Keyboard'
import {instance as Enum} from '../../../../../core/enums'

let validator = require('validator'),
	config = require('../../config.json')

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
		window.captchaCallback = this.CaptchaCallback.bind(this)
	}

	render() {
		let linkIsInvalid = this.state.link.length && !this.state.linkValid && this.state.dirty
		return (
			<div id="inputbox">
				<form>
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
						className={'g-recaptcha ' + (this.state.linkValid ? '' : 'disabled')}
						data-sitekey={config.recaptcha.public}
						data-theme="dark"
						data-callback="captchaCallback"
						onMouseDown={this.OnButtonMouseDown.bind(this)}
						onMouseUp={this.OnButtonMouseUp.bind(this)}
						onMouseLeave={this.OnButtonMouseLeave.bind(this)}
					>Shorten</button>
				</form>
			</div>
		)
	}

	CaptchaCallback(token) {
		this.props.verifyCaptcha(token)
	}

	componentDidMount() {
		this.refs.input.focus()
	}

	OnInputKeyDown(event) {
		if (Keyboard.IsPressed(event, Enum.keys.ENTER) && this.state.linkValid) {
			event.preventDefault()
			window.grecaptcha.execute()
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
		this.props.setLink(this.state.link)
		this.refs.input.blur()

		this.setState({
			...this.state,
			submitted: true
		})
	}
 }