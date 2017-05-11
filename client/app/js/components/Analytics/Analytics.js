import React from 'react'
import ShortrAPI from '../../services/ShortrAPI'
import {instance as QueryString} from '../../services/QueryString'
import {Bar, Doughnut, defaults} from 'react-chartjs-2'

export default class Analytics extends React.Component {
	constructor() {
		super()
		this.state = {
			valid: false
		}

		defaults.global.defaultFontColor = '#FFF'
		defaults.global.defaultFontFamily = '\'Roboto Condensed\', \'Helvetica Neue\', helvetica, Arial, sans-serif'
		defaults.global.defaultFontSize = 12
	}

	render() {
		return (
			<div id="analytics">
				{this.state.valid && (
					<div className="charts">
						<Bar
							ref='chart1'
							data={{
								labels: this.state.os.keys,
								datasets: [{
									data: this.state.os.values,
									backgroundColor: '#FFF',
									borderWidth: 0
								}]
							}}

							options={{
								scales: {
									xAxes: [{
										stacked: true,
										gridLines: {
											display: false
										},
										categoryPercentage: 1,
										barPercentage: 1
									}],
									yAxes: [{
										stacked: true,
										gridLines: {
											display: false
										},
										categoryPercentage: 1,
										barPercentage: 1
									}]
								},
								title: {
									display: true,
									text: 'Platforms'
								},
								legend: {
									display: false
								}
							}}
						/>

						<Bar
							ref='chart2'
							data={{
								labels: this.state.browser.keys,
								datasets: [{
									data: this.state.browser.values
								}]
							}}

							options={{
								title: {
									display: true,
									text: 'Browsers'
								},
								legend: {
									display: false
								},
								gridLines: {
									display: false
								}
							}}
						/>

						<Doughnut
							ref='chart3'
							data={{
								labels: this.state.referrer.keys,
								datasets: [{
									data: this.state.referrer.values
								}]
							}}

							options={{
								title: {
									display: true,
									text: 'Referrers'
								},
								legend: {
									display: false
								}
							}}
						/>
					</div>
				)}
			</div>
		)
	}

	componentDidMount() {
		let pathname = this.props.location.pathname,
			hash = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length)

		ShortrAPI.Analytics(hash)
			.then(data => {
				console.log(data)
				if (!('hash' in data)) {
					this.props.addMessage('NOT_FOUND')
				}

				for (let i = data.hits; i > Object.keys(data.referrer).length; i--) {
					if (!('unknown' in data.referrer)) {
						data.referrer.unknown = 1
					} else {
						data.referrer.unknown++
					}
				}

				this.setState({
					...this.state,
					valid: true,
					os: this.normalizeData(data.os),
					browser: this.normalizeData(data.browser),
					referrer: this.normalizeData(data.referrer)
				})
			})
			.catch(error => console.error(error))
	}

	normalizeData(obj) {
		let keys = [], values = []
		for (var key in obj) {
			let value = obj[key]
			keys.push(key)
			values.push(value)
		}
		return { keys, values }
	}
}