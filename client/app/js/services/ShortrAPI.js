import 'whatwg-fetch'
import 'bluebird'

export default class ShortrAPI {
	static CreateLink(link) {
		return this._resolve(`/api/hash/create/${encodeURIComponent(link)}`)
	}

	static GetLink(hash) {
		return this._resolve(`/api/hash/get/${hash}`)
	}

	_resolve(url) {
		return fetch(url)
			.then(response => {
				if (response.status === 200) {
					resolve(response.json())
				} else {
					reject(response.json())
				}
			})
			.catch(error => {
				reject({status: 500, data: {}})
			})
	}
}