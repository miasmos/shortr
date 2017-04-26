import 'whatwg-fetch'
import 'bluebird'

export default class ShortrAPI {
	static CreateLink(link) {
		return this._resolve(`/api/hash/create/${encodeURIComponent(link)}`)
	}

	static GetLink(hash) {
		return this._resolve(`/api/hash/get/${hash}`)
	}

	static VerifyCaptcha(token) {
		return this._resolve(`/api/captcha/verify/${token}`)
	}

	static _resolve(url) {
		return new Promise((resolve, reject) => {
			fetch(url)
				.then(response => {
					if (response.status === 200) {
						response.json()
							.then(json => resolve(json.data))
							.catch(error => reject())
					} else {
						response.json()
							.then(json => resolve(json.data))
							.catch(error => reject())
					}
				})
				.catch(error => {
					reject({status: 500, data: {}})
				})
		})
	}
}