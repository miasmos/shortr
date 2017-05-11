'use strict'
import {instance as Enum} from '../../core/enums'
import {ErrorExtended as Error} from './response/Error'
import {Response} from './response/Response'
import {instance as Log} from './services/Log'
import {instance as Mimetypes} from './services/Mimetypes'

var express = require('express'),
	helmet = require('helmet'),
	compression = require('compression'),
	spdy = require('spdy'),
	url = require('url'),
	http = require('http'),
	fs = require('fs'),
	path = require('path'),
	config = require('./config.json')

export default class Server {
	constructor() {
		this.config = process.env.NODE_ENV === 'production' ? config.production : config.development

		let app = express()
		app.set('json spaces', 4)

		if (process.env.NODE_ENV === 'production') {
			app.use((request, response, next) => {
				let host = request.headers.host.replace(/(.*):([0-9]+)/g, "$1")
				if (this.config.host !== host && 'www.' + this.config.host !== host) {
					Response.Error(response, new Error(Enum.error.message.CORS, Enum.error.code.FORBIDDEN))
					return
				}

				response.header('Access-Control-Allow-Origin', host)
				response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
				response.header('Access-Control-Allow-Headers', 'Content-Type')
				next()
			})
		}

		app.use(helmet())
		app.use(compression())
		app.get('/static*', (request, response) => {
			let filepath = path.join(__dirname, request.url)

			fs.access(filepath, fs.constants.F_OK, (error) => {
				if (!!error) {
					response.redirect('/')
				} else {
					let mimetype = Mimetypes.getMime(request.url)
					response.header('content-type', mimetype)
					response.header('max-age', 24 * 60 * 60 * 1000)
					response.sendFile(filepath)
				}
			})
		})
		this.app = app
	}

	Start() {
		let cert = {}
		if (process.env.NODE_ENV === 'production') {
			cert.key = fs.readFileSync(this.config.certificate.key, 'utf8')
			cert.cert = fs.readFileSync(this.config.certificate.cert, 'utf8')
		} else {
			cert.key = fs.readFileSync(path.join(__dirname, this.config.certificate.key), 'utf8')
			cert.cert = fs.readFileSync(path.join(__dirname, this.config.certificate.cert), 'utf8')
		}
		let server = spdy.createServer(cert, this.app)

		server.listen(this.config.https, () => {
			Log.Say(`Server listening on port ${this.config.https}`)
		})

		this.server = server

		let httpServer = http.createServer((request, response) => {
			response.writeHead(301, {"Location": "https://" + request.headers['host'] + request.url})
			response.end()
		}).listen(this.config.http)
	}

	App() {
		return this.app
	}

	Route(route, fn) {
		this.app.get(route, fn)
	}
}