import 'bluebird'

var request = require('request-promise'),
	credentials = require('../credentials.json')

class Recaptcha {
	constructor() {
		this.private = process.env.NODE_ENV === 'production' ? credentials.production.recaptcha.private : credentials.development.recaptcha.private
	}
	Verify(token) {
		return new Promise((resolve, reject) => {
			request({
				method: 'POST',
				uri: 'https://www.google.com/recaptcha/api/siteverify',
				form: {
					secret: this.private,
					response: token
				}
			})
			.then(body => {
				try {
					let json = JSON.parse(body)
					resolve(json)
				} catch (e) {
					reject('Failed to parse JSON')
				}
			})
			.catch(error => {
				reject(error)
			})
		})
	}
}

export let instance = new Recaptcha()