import React from 'react'
import {instance as Keyboard} from '../../services/Keyboard'
import {instance as Enum} from '../../../../../core/enums'
import {instance as Environment} from '../../services/Environment'
import ClickEffect from '../ClickEffect'

let validator = require('validator'),
	config = require('../../config.json')

export default class InputBox extends React.Component {
	constructor() {
		super()
		this.state = {
			link: '',
			linkValid: false,
			dirty: false,
			submitted: false
		}

		this.recaptcha = Environment.IsProduction() ? config.production.recaptcha : config.development.recaptcha
		this.typingTimeout = undefined
		window.captchaCallback = this.CaptchaCallback.bind(this)  //google's captcha library requires it's callback to be in the global scope
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
					<div
						className="g-recaptcha"
						data-sitekey={this.recaptcha}
						data-theme="dark"
						data-callback="captchaCallback"
						data-size="invisible"
					>
					</div>
					<ClickEffect>
						<button type="button"
							onClick={this.OnSubmit.bind(this)}
							disabled={this.state.linkValid ? '' : 'disabled'}
							className={this.state.linkValid ? '' : 'disabled'}
						>Shorten</button>
					</ClickEffect>
				</form>
			</div>
		)
	}

	CaptchaCallback(token) {
		this.props.requestLinkCreation(this.state.link, token)
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
		window.grecaptcha.execute()
		this.refs.input.blur()

		this.setState({
			...this.state,
			submitted: true
		})
	}
 }