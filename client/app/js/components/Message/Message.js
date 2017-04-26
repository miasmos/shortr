import React from 'react'

export default class Message extends React.Component {
	render() {
		return (
			<div id="message">
				<p>{this.props.text}</p>
			</div>
		)
	}
 }