import 'whatwg-fetch'
import 'bluebird'

export default class ShortrAPI {
	static CreateLink(link, token) {
		return this._resolve(`/api/hash/create/${encodeURIComponent(link)}/${token}`)
	}

	static GetLink(hash) {
		return this._resolve(`/api/hash/get/${hash}`)
	}

	static Analytics(hash) {
		return this._resolve(`/api/hash/analytics/${hash}`)
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
							.then(json => reject(json))
							.catch(error => reject())
					}
				})
				.catch(error => {
					reject({status: 500, data: {}})
				})
		})
	}
}