import 'bluebird'

let crypto = require('crypto'),
	csprng = require('csprng'),
	shorthash = require('shorthash')

class Crypto {
	Salt128() {
		return csprng(1024, 36).substring(0,128)
	}

	HashWithSalt(str, salt) {
		if (typeof salt === 'undefined') salt = this.Salt128()
		let time = 0,
			timer = setInterval(() => {
				time += 10
			},10)

		return new Promise((resolve, reject) => {
			crypto.pbkdf2(str, salt, 25000, 512, 'sha512', (error, key) => {
				clearInterval(timer)
				if (error) reject(error)
				resolve({
					salt: salt,
					hash: key,
					time: time
				})
			})
		})
	}

	VerifyHash(str, hash, salt) {
		return new Promise((resolve, reject) => {
			this.Hash(str, salt)
				.then((obj) => {
					resolve(obj.hash.toString() === hash.toString())
				})
				.catch((error) => {
					reject(error)
				})
		})
	}

	TimestampHash(str) {
		return shorthash.unique((+new Date()) + str)
	}
}

export let instance = new Crypto()