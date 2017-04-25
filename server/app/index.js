'use strict'
import Service from '../../core/services/Service'
import {instance as Enum} from '../../core/enums'
import {Response} from './response/Response'
import Database from './database/db'
import {instance as Params} from './params'
import {Messages} from './messages'
import {ErrorExtended as Error} from './response/Error'
import Server from './server'
import {instance as Crypto} from './crypto'

let server = new Server(8080),
	path = require('path'),
	credentials = require('./credentials.json'),
	Log = Service.Log(),
	html = require('./index.html')

class App {
	constructor() {
		this.db = new Database(credentials.database)

		Params.Apply(server)

		server.Route('/api/hash/get/:hash', (request, response) => {
			this.db.Links.Get(request.params.hash)
				.then(result => {
					if (result !== null) {
						let link = result.get('link')

						if (!!link) {
							Response.Ok(response, Messages.Link(request.params.hash, link))
							return
						}
					}

					Response.Ok(response, Messages.Link(request.params.hash, null))
				})
				.catch(error => {
					console.log(error)
					Response.Error(response, new Error(Enum.error.message.GENERIC_ERROR, Enum.error.code.ERROR))
				})
		})

		server.Route('/api/hash/create/:url', (request, response) => {
			let hash = Crypto.TimestampHash(request.params.url)

			this.db.Links.Create(request.params.url, hash)
				.then(result => {
					Response.Ok(response, Messages.Link(hash, request.params.url))
				})
				.catch(error => {
					console.log(error)
					Response.Error(response, new Error(Enum.error.message.GENERIC_ERROR, Enum.error.code.ERROR))
				})
		})

		server.Route('/api*', (request, response) => {
			Response.Error(response, new Error(Enum.error.message.NOT_FOUND, Enum.error.code.NOT_FOUND))
		})

		server.Route('/:hash', (request, response) => {
			this.db.Links.Get(request.params.hash)
				.then(result => {
					if (result !== null) {
						let link = result.get('link')

						if (!!link) {
							this.db.Users.Add(request.params.hash, request.headers['user-agent'])
								.catch(error => {
									console.log(error)
								})

							response.redirect(link)
							return
						}
					}

					response.redirect('/?error=NOT_FOUND')
				})
				.catch(error => {
					console.log(error)
					Response.Error(response, new Error(Enum.error.message.GENERIC_ERROR, Enum.error.code.ERROR))
				})
		})

		server.Route('/', (request, response) => {
			response.send(html)
		})

		server.Route('*', (request, response) => {
			response.redirect('/?error=NOT_FOUND')
		})

		server.Start()
	}
}

let app = new App()