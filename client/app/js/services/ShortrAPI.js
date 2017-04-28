import 'whatwg-fetch'
import 'bluebird'
import {instance as Enum} from '../../../../core/enums'

export default class ShortrAPI {
	static CreateLink(link, token) {
		return this._resolve(`/api/hash/create/${encodeURIComponent(link)}/${token}`)
	}

	static GetLink(hash) {
		return this._resolve(`/api/hash/get/${hash}`)
	}

	static _resolve(url) {
		return new Promise((resolve, reject) => {
			fetch(url)
				.then(response => {
					if (response.status === 200) {
						response.json()
							.then(json => resolve(json.data))
							.catch(error => reject(Enum.error.message.GENERIC_ERROR))
					} else {
						response.json()
							.then(json => reject(json.error))
							.catch(error => reject(Enum.error.message.GENERIC_ERROR))
					}
				})
				.catch(error => {
					reject(Enum.error.message.GENERIC_ERROR)
				})
		})
	}
}