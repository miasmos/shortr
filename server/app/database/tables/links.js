var Sequelize = require('sequelize')
import Table from './table'

export default class Links extends Table {
	Create(link, hash, ip) {
		return this.model.create({
			link: link,
			hash: hash,
			ip: ip
		})
	}

	Get(hash) {
		return this.model.findOne({
			where: {
				hash: hash
			}
		})
	}

	Exists(hash) {
		return new Promise((resolve, reject) => {
			this.Get(hash)
				.then((result) => {
					if (result !== null && !!result.get('hash')) resolve(true)
					else resolve(false)
				})
				.catch(reject)
		})
	}
}