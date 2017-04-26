import React from 'react'

export default class Footer extends React.Component {
	render() {
		return (
			<div id="footer">
				<div>Copyright © {new Date().getFullYear()} Stephen Poole</div>
			</div>
		)
	}
 }