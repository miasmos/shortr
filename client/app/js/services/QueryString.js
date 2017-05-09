import {instance as Enum} from '../../../../core/enums'

var qs = require('qs')

class QueryString {
	Error() {
		return this._resolve('error')
	}

	Object() {
		return this.query
	}

	_parse() {
		let str = window.location.href
		return str.indexOf('?') > -1 ? qs.parse(str.substring(str.indexOf('?') + 1, str.length)) : false
	}

	_resolve(key) {
		let q = this._parse()

		if (!q) return false
		if (key in q && q[key].length) {
			let value = q[key]
			if (key === 'error' && value in Enum.error.message) {
				return Enum.error.message[value]
			} else if (!!value) {
				return value
			}
		}
		return false
	}
}

export let instance = new QueryString()