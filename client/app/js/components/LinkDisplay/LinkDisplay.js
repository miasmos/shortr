import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
let config = require('../../config.json')

export default class LinkDisplay extends React.Component {
	constructor() {
		super()
		this.state = {
			showContext: false,
			copied: false,
			css: {}
		}
	}

	render() {
		return (
			<div id="link">
				<div className="link" 
					onMouseEnter={this.OnMouseEnter.bind(this)}
					onMouseLeave={this.OnMouseLeave.bind(this)}
					onMouseDown={this.OnMouseDown.bind(this)}
					onMouseUp={this.OnMouseUp.bind(this)}
				>
					<CopyToClipboard text={'https://' + config.url + '/' + this.props.hash}>
						<div style={this.state.css}>
							<p>https://{config.url}/{this.props.hash}</p>
							<div className={'context '}>copy</div>
						</div>
					</CopyToClipboard>
				</div>
			</div>
		)
	}

	OnMouseEnter(event) {
		this.setState({
			...this.state,
			showContext: true
		})
	}

	OnMouseLeave(event) {
		this.setState({
			...this.state,
			showContext: false,
			css: {}
		})
	}

	OnMouseDown(event) {
		this.setState({
			...this.state,
			css: {
				transform: 'translate(1px, 1px)'
			}
		})
	}

	OnMouseUp(event) {
		this.setState({
			...this.state,
			css: {}
		})
	}
 }