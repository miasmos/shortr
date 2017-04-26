import 'bluebird'

var request = require('request-promise'),
	credentials = require('../credentials.json')

class Recaptcha {
	Verify(token) {
		return new Promise((resolve, reject) => {
			request({
				method: 'POST',
				uri: 'https://www.google.com/recaptcha/api/siteverify',
				form: {
					secret: credentials.recaptcha.private,
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