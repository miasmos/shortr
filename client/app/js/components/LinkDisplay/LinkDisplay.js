import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import ClickEffect from '../ClickEffect'
let config = require('../../config.json')

export default class LinkDisplay extends React.Component {
	render() {
		return (
			<div id="link">
				<ClickEffect>
					<div className="link">
						<CopyToClipboard text={'https://' + config.url + '/' + this.props.hash}>
							<div>
								<p>https://{config.url}/{this.props.hash}</p>
								<div className="context">copy</div>
							</div>
						</CopyToClipboard>
					</div>
				</ClickEffect>
			</div>
		)
	}
 }