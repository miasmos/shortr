var Sequelize = require('sequelize')

export default class Models {
	constructor(connection) {
		this.connection = connection

		this.Links = connection.define('Links', {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				field: 'id',
				primaryKey: true
			},
			link: {
				type: Sequelize.STRING,
				field: 'salt',
				allowNull: false
			},
			hash: {
				type: Sequelize.TEXT,
				field: 'hash',
				allowNull: false
			}
		}, {
			indexes: [
				{
					unique: true,
					fields: ['hash']
				}
			],
			freezeTableName: true
		})
		this.Links.sync()

		this.Users = connection.define('Users', {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				field: 'id',
				primaryKey: true
			},
			hash: {
				type: Sequelize.TEXT,
				field: 'hash',
				allowNull: false
			},
			agent: {
				type: Sequelize.TEXT,
				field: 'agent',
				allowNull: false
			}
		}, {
			freezeTableName: true
		})
		this.Users.sync()
	}
}