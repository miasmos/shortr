import React from 'react'

export default class Logo extends React.Component {
	render() {
		return (
			<div id="logo">
				<a href="/"><div className="title-container">
					<img src="/static/images/logo.svg" />

					<div className="title-background"></div>
				</div></a>
				<p className="slogan">Shorten your links. Easily.</p>
			</div>
		)
	}
}