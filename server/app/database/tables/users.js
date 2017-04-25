var Sequelize = require('sequelize')
import Table from './table'

export default class Users extends Table {
	Add(hash, agent) {
		return this.model.create({
			hash: hash,
			agent: agent
		})
	}
}