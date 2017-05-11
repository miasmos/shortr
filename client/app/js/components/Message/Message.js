import React from 'react'
import OutlinedButton from '../OutlinedButton'

export default class Message extends React.Component {
	render() {
		return (
			<div id="message">
				<p className="text">
					{
						!!this.props.text && this.props.text.length ? this.props.text.split('\n').map(
							(item, key) => {
								return (<span key={key}>{item}<br/></span>)
							}
						) : <div></div>
					}
				</p>

				<OutlinedButton linkToRoute={false} link="/" text="go back"></OutlinedButton>
			</div>
		)
	}
 }