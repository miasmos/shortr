import React from 'react'
import {Link} from 'react-router-dom'
import ClickEffect from '../ClickEffect'
let config = require('../../config.json')

export default class Footer extends React.Component {
	render() {
		return (
			<div id="footer">
				<ul>
					<li className="link">
						<ClickEffect>
							<Link to="/terms">Terms</Link>
						</ClickEffect>
					</li>

					<li className="divider"></li>

					<li className="link">
						<ClickEffect>
							<Link to="/privacy">Privacy</Link>
						</ClickEffect>
					</li>

					<li className="divider"></li>

					<li className="link">
						<ClickEffect>
							<a href={'https://twitter.com/intent/tweet?text=@' + config.twitterHandle + ' '}>Contact</a>
						</ClickEffect>
					</li>
				</ul>
			</div>
		)
	}
 }