import {instance as Enum} from '../../../../core/enums'

var qs = require('qs')

class QueryString {
	constructor() {
		let str = window.location.href
		this.query = qs.parse(str.substring(str.indexOf('?') + 1, str.length))
	}

	Error() {
		return this._resolve('error')
	}

	_resolve(key) {
		if (key in this.query && this.query[key].length) {
			let value = this.query[key]
			if (value in Enum.error.message) {
				return Enum.error.message[value]
			}
		}
	}
}

export let instance = new QueryString()