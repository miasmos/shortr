import 'bluebird'

let shorthash = require('shorthash')

class Crypto {
	TimestampHash(str) {
		return shorthash.unique((+new Date()) + str)
	}
}

export let instance = new Crypto()