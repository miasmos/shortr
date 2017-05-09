import React from 'react'
import {Link} from 'react-router-dom'
import ClickEffect from './ClickEffect'

export default class OutlinedButton extends React.Component {
	static defaultProps = {
		linkToRoute: false,
		link: '#',
		text: '',
		onClick: undefined
	}

	render() {
		return (
			<div className="outlined-button">
				<ClickEffect>
					{ !!this.props.linkToRoute && (
						<Link to={this.props.link} replace={!!this.props.replace ? true : false} onClick={this.props.onClick}>
							<span>{this.props.text}</span>
						</Link>
					)}
					{ !this.props.linkToRoute && (
						<a href={this.props.link} onClick={this.props.onClick}>
							<span>{this.props.text}</span>
						</a>
					)}
				</ClickEffect>
			</div>
		)
	}
 }