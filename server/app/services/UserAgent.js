import 'bluebird'

var platform = require('platform')

class UserAgent {
	Parse(str) { //name, version, layout, os, description
		if (!!str && str.length) {
			let p = platform.parse(str)

			return {
				name: 'name' in p ? p.name : undefined,
				version: 'version' in p ? p.version : undefined,
				layout: 'layout' in p ? p.layout : undefined,
				os: 'os' in p ? p.os.family : undefined,
				description: 'description' in p ? p.description : undefined
			}
		}
		return false
	}

	Tally(arr) {
		return new Promise((resolve, reject) => {
			//TODO: add country based on IP
			let totals = {
				browser: {},
				referrer: {},
				os: {},
				hits: 0
			}

			arr.map(obj => {
				if (!!obj.browser && obj.browser.length) {
					if (!(obj.browser in totals.browser)) {
						totals.browser[obj.browser] = 1
					} else {
						totals.browser[obj.browser]++
					}
				}

				if (!!obj.referrer && obj.referrer.length) {
					if (!(obj.referrer in totals.referrer)) {
						totals.referrer[obj.referrer] = 1
					} else {
						totals.referrer[obj.referrer]++
					}
				}

				if (!!obj.os && obj.os.length) {
					let os = obj.os.indexOf('Windows') > -1 ? 'Windows' : obj.os
					if (!(os in totals.os)) {
						totals.os[os] = 1
					} else {
						totals.os[os]++
					}
				}

				totals.hits++
			})

			resolve(totals)
		})
	}
}

export let instance = new UserAgent()