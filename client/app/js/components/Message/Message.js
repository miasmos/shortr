import React from 'react'

export default class Message extends React.Component {
	constructor() {
		super()
		this.state = {
			buttonCSS: {}
		}
	}
	render() {
		return (
			<div id="message">
				<p className="text">
					{
						this.props.text.split('\n').map(
							(item, key) => {
								return (<span key={key}>{item}<br/></span>)
							}
						)
					}
				</p>
				<div className="back">
					<a href="/">
						<span onMouseDown={this.OnButtonMouseDown.bind(this)}
						onMouseUp={this.OnButtonMouseUp.bind(this)}
						onMouseLeave={this.OnButtonMouseLeave.bind(this)}
						style={this.state.buttonCSS}>go back</span>
					</a>
				</div>
			</div>
		)
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
 }