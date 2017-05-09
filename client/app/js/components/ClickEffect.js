import React from 'react'

export default class ClickEffect extends React.Component {
	constructor() {
		super()
		this.state = {
			css: {}
		}
	}

	render() {
		return (
			<div
				style={{
					width: '100%',
					height: '100%'
				}, this.state.css}
				onMouseDown={this.OnButtonMouseDown.bind(this)}
				onMouseUp={this.OnButtonMouseUp.bind(this)}
				onMouseLeave={this.OnButtonMouseLeave.bind(this)}
			>{this.props.children}</div>
		)
	}

	OnButtonMouseDown(event) {
		this.setState({
			...this.state,
			css: {
				transform: 'translate(1px, 1px)'
			}
		})
	}

	OnButtonMouseUp(event) {
		this.setState({
			...this.state,
			css: {}
		})
	}

	OnButtonMouseLeave(event) {
		this.setState({
			...this.state,
			css: {}
		})
	}
 }