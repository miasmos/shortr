import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import ClickEffect from '../ClickEffect'
import OutlinedButton from '../OutlinedButton'
import {instance as Environment} from '../../services/Environment'
let config = require('../../config.json')

export default class LinkDisplay extends React.Component {
	constructor() {
		super()
		this.url = Environment.IsProduction() ? config.production.url : config.development.url
	}

	render() {
		return (
			<div id="link">
				<ClickEffect>
					<div className="link">
						<CopyToClipboard text={`https://${this.url}/${this.props.hash}`}>
							<div>
								<p>https://{this.url}/{this.props.hash}</p>
								<div className="context">copy</div>
							</div>
						</CopyToClipboard>
					</div>
				</ClickEffect>
				<div className="button-container">
					<div className="button-inner">
						<OutlinedButton text="view analytics" link={`https://${this.url}/analytics/${this.props.hash}`}></OutlinedButton>
						<div className="or">or</div>
						<OutlinedButton text="create another" link="/"></OutlinedButton>
					</div>
				</div>
			</div>
		)
	}
 }