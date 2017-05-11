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
			},
			ip: {
				type: Sequelize.TEXT,
				field: 'ip',
				allowNull: true
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

		this.Analytics = connection.define('Analytics', {
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
			ip: {
				type: Sequelize.TEXT,
				field: 'ip',
				allowNull: true
			},
			referrer: {
				type: Sequelize.TEXT,
				field: 'referrer',
				allowNull: true
			},
			referrer: {
				type: Sequelize.TEXT,
				field: 'referrer',
				allowNull: true
			},
			browser: {
				type: Sequelize.TEXT,
				field: 'browser',
				allowNull: true
			},
			browser_version: {
				type: Sequelize.TEXT,
				field: 'browser_version',
				allowNull: true
			},
			browser_layout: {
				type: Sequelize.TEXT,
				field: 'browser_layout',
				allowNull: true
			},
			os: {
				type: Sequelize.TEXT,
				field: 'os',
				allowNull: true
			},
			browser_description: {
				type: Sequelize.TEXT,
				field: 'browser_description',
				allowNull: false
			}
		}, {
			freezeTableName: true
		})
		this.Analytics.sync()
	}
}