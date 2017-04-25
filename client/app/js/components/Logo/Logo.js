import React from 'react'
import {instance as Window} from '../../services/Window'

export default class Logo extends React.Component {
	constructor() {
		super()
		this.state = {
			backgroundCSS: {
				backgroundPositionX: 0,
				backgroundPositionY: 0
			}
		}
	}

	componentDidMount() {
		document.addEventListener('mousemove', (e) => {
			let clamp = 15, //in pixels
				leewayX = clamp,
				leewayY = clamp,
				screenWidth = Window.Width(),
				screenHeight = Window.Height(),
				mouseX = e.clientX,
				mouseY = e.clientY,
				mousePercentX = mouseX / screenWidth,
				mousePercentY = mouseY / screenHeight,
				xPos = leewayX * mousePercentX - (leewayX / 2),
				yPos = leewayY * mousePercentY - (leewayY / 2)

			this.setState({
				...this.state,
				backgroundCSS: {
					backgroundPositionX: xPos,
					backgroundPositionY: yPos
				}
			})
		})
	}

	render() {
		return (
			<div id="logo">
				<div className="title-container">
					<div className="title">Shortr</div>
					<div className="title-background" ref="background" style={this.state.backgroundCSS}></div>
				</div>
				<p>Shorten your links.</p>
			</div>
		)
	}
 }