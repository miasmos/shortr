var Sequelize = require('sequelize')
import Table from './table'

export default class Analytics extends Table {
	Add(hash, ip, referrer, useragent) {
		return this.model.create({
			hash: hash,
			ip: ip,
			referrer: referrer,
			browser: useragent.name,
			browser_version: useragent.version,
			browser_layout: useragent.layout,
			os: useragent.os,
			browser_description: useragent.description
		})
	}

	Get(hash) {
		return this.model.findAll({
			where: {
				hash: hash
			},
			raw: true
		})
	}
}