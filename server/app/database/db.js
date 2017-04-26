var Sequelize = require('sequelize')
import Models from './models'
import Links from './tables/links'
import Users from './tables/users'

let instance = undefined

export default class Database {
	constructor(credentials) {
		if (!instance) instance = this
		else return instance

		this.user = credentials.user
		this.password = credentials.password
		this.host = credentials.host
		this.port = credentials.port
		this.database = credentials.database
		this.connection = undefined
		this.Connect()

		this.models = new Models(this.connection)
		this.Links = new Links(this.models.Links)
		this.Users = new Users(this.models.Users)

		return instance
	}

	Connect() {
		this.connection = new Sequelize(this.database, this.user, this.password, {
			host: this.host,
			port: this.port || 5432,
			logging: false,
			dialect: 'postgres',
			pool: {
				max: 5,
				min: 0,
				idle: 10000
			}
		})
	}
}