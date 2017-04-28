/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _Log = __webpack_require__(2);

	var _Recaptcha = __webpack_require__(3);

	var _enums = __webpack_require__(7);

	var _Response = __webpack_require__(8);

	var _db = __webpack_require__(9);

	var _db2 = _interopRequireDefault(_db);

	var _params = __webpack_require__(15);

	var _messages = __webpack_require__(18);

	var _Error = __webpack_require__(16);

	var _server = __webpack_require__(19);

	var _server2 = _interopRequireDefault(_server);

	var _crypto = __webpack_require__(27);

	var _util = __webpack_require__(29);

	var _util2 = _interopRequireDefault(_util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var server = new _server2.default(),
	    path = __webpack_require__(25),
	    credentials = __webpack_require__(6),
	    html = __webpack_require__(30);

	var App = function App() {
		var _this = this;

		_classCallCheck(this, App);

		this.credentials = process.env.NODE_ENV === 'production' ? credentials.production : credentials.development;
		this.db = new _db2.default(this.credentials.database);

		_params.instance.Apply(server);

		server.Route('/api/hash/get/:hash', function (request, response) {
			_this.db.Links.Get(request.params.hash).then(function (result) {
				if (result !== null) {
					var link = result.get('link');

					if (!!link) {
						_Response.Response.Ok(response, _messages.Messages.Link(request.params.hash, link));
						return;
					}
				}

				_Response.Response.Ok(response, _messages.Messages.Link(request.params.hash, null));
			}).catch(function (error) {
				console.log(error);
				_Response.Response.Error(response, new _Error.ErrorExtended(_enums.instance.error.message.GENERIC_ERROR, _enums.instance.error.code.ERROR));
			});
		});

		server.Route('/api/hash/create/:url/:recaptchaToken', function (request, response) {
			var url = request.params.url.toLowerCase(),
			    regex = url.match(/^(http|https|ftp):\/\//g);
			if (!(!!regex && regex.length)) {
				url = 'http://' + url;
			}
			console.log('GET /api/hash/create/' + url + '/:token');
			// Recaptcha.Verify(request.params.recaptchaToken)
			// 	.then(data => {
			// 		if ('success' in data && data.success) {
			var hash = _crypto.instance.TimestampHash(url),
			    ip = _util2.default.GetRequestIP(request) || null;

			_this.db.Links.Create(url, hash, ip).then(function (result) {
				_Response.Response.Ok(response, _messages.Messages.Link(hash, url));
			}).catch(function (error) {
				console.log(error);
				_Response.Response.Error(response, new _Error.ErrorExtended(_enums.instance.error.message.GENERIC_ERROR, _enums.instance.error.code.ERROR));
			});
			// } else {
			// 	Response.Error(response, new Error(Enum.error.message.RECAPTCHA_FAILED, Enum.error.code.FORBIDDEN))
			// }
			// })
			// .catch(error => {
			// 	console.error(error)
			// 	Response.Error(response, new Error(Enum.error.message.GENERIC_ERROR, Enum.error.code.ERROR))
			// })
		});

		server.Route('/api*', function (request, response) {
			_Response.Response.Error(response, new _Error.ErrorExtended(_enums.instance.error.message.NOT_FOUND, _enums.instance.error.code.NOT_FOUND));
		});

		server.Route('/:hash', function (request, response) {
			_this.db.Links.Get(request.params.hash).then(function (result) {
				if (result !== null) {
					var link = result.get('link');

					if (!!link) {
						_this.db.Users.Add(request.params.hash, request.headers['user-agent']).catch(function (error) {
							console.log(error);
						});

						response.redirect(link);
						return;
					}
				}

				response.redirect('/?error=NOT_FOUND');
			}).catch(function (error) {
				console.log(error);
				response.redirect('/?error=GENERIC_ERROR');
			});
		});

		server.Route('/', function (request, response) {
			response.send(html);
		});

		server.Route('*', function (request, response) {
			response.redirect('/?error=NOT_FOUND');
		});

		server.Start();
	};

	var app = new App();

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Log = function () {
		function Log() {
			_classCallCheck(this, Log);
		}

		_createClass(Log, [{
			key: 'Say',
			value: function Say() {
				var _console;

				if (process.env.NODE_ENV === 'production') return;
				(_console = console).log.apply(_console, arguments);
			}
		}, {
			key: 'Warn',
			value: function Warn() {
				var _console2;

				(_console2 = console).warn.apply(_console2, arguments);
			}
		}, {
			key: 'Error',
			value: function Error() {
				var _console3;

				(_console3 = console).error.apply(_console3, arguments);
			}
		}, {
			key: 'Dir',
			value: function Dir() {
				var _console4;

				if (process.env.NODE_ENV !== 'production') return;
				(_console4 = console).dir.apply(_console4, arguments);
			}
		}]);

		return Log;
	}();

	var instance = exports.instance = new Log();

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.instance = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	__webpack_require__(4);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var request = __webpack_require__(5),
	    credentials = __webpack_require__(6);

	var Recaptcha = function () {
		function Recaptcha() {
			_classCallCheck(this, Recaptcha);

			this.private = process.env.NODE_ENV === 'production' ? credentials.production.recaptcha.private : credentials.development.recaptcha.private;
		}

		_createClass(Recaptcha, [{
			key: 'Verify',
			value: function Verify(token) {
				var _this = this;

				return new Promise(function (resolve, reject) {
					if (!token || !token.length) reject('Invalid Token');
					request({
						method: 'POST',
						uri: 'https://www.google.com/recaptcha/api/siteverify',
						form: {
							secret: _this.private,
							response: token
						}
					}).then(function (body) {
						try {
							var json = JSON.parse(body);
							resolve(json);
						} catch (e) {
							reject('Failed to parse JSON');
						}
					}).catch(function (error) {
						reject(error);
					});
				});
			}
		}]);

		return Recaptcha;
	}();

	var instance = exports.instance = new Recaptcha();

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("bluebird");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("request-promise");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = {
		"production": {
			"database": {
				"user": "postgres",
				"password": "B=jfCHn?akpHC7ymqQL5LhqVc2@F9dRb",
				"database": "shortr",
				"host": "127.0.0.1",
				"port": 5432
			},
			"recaptcha": {
				"private": "6Lfi0x4UAAAAAM11E-xmo5jwJ889vXPVEF9Pi92i"
			}
		},
		"development": {
			"database": {
				"user": "shortr.li",
				"password": "3g7hfbjevm3mms2e383d",
				"database": "shortr.li",
				"host": "127.0.0.1",
				"port": 5432
			},
			"recaptcha": {
				"private": "6Lfo0x4UAAAAABThukSZ6HI2ZeQbwstYtbT5n_yU"
			}
		}
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Enums = function Enums() {
		_classCallCheck(this, Enums);

		this.keys = {
			ENTER: 13
		};

		this.environment = {
			PRODUCTION: 0,
			DEVELOPMENT: 1
		};

		this.error = {
			message: {
				"NOT_FOUND": "Whoops. That page doesn't exist.",
				"INVALID_PARAM_HASH": "Invalid hash supplied.",
				"INVALID_PARAM_URL": "Invalid URL supplied.",
				"INVALID_PARAM_RECAPTCHA_TOKEN": "Invalid recaptcha token supplied.",
				"RATE_LIMITED": "Your request was rate limited. Try again later.",
				"GENERIC_ERROR": "An undiagnosed error has occurred.",
				"CORS": "This resource is restricted to the shortr.li domain.",
				"NO_RESULTS": "The request was made, but returned no results.",
				"SERVICE_UNAVAILABLE": "The requested service is unavailable. It is either down or slow to respond.",
				"RECAPTCHA_FAILED": "You failed to complete the captcha. Are you a robot?"
			},
			code: {
				"OK": 200,
				"FORBIDDEN": 403,
				"BAD_REQUEST": 400,
				"NOT_FOUND": 404,
				"TIMED_OUT": 408,
				"ERROR": 500,
				"TOO_MANY_REQUESTS": 429,
				"NO_RESULTS": 601,
				"SERVICE_UNAVAILABLE": 503
			}
		};
	};

	var instance = exports.instance = new Enums();

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Response = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _enums = __webpack_require__(7);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Response = exports.Response = function () {
		function Response() {
			_classCallCheck(this, Response);
		}

		_createClass(Response, null, [{
			key: 'Ok',
			value: function Ok(res, data) {
				return this.Make(res, data, undefined);
			}
		}, {
			key: 'Error',
			value: function Error(res, error) {
				return this.Make(res, undefined, error);
			}
		}, {
			key: 'Make',
			value: function Make(res, data, error) {
				if (typeof error !== 'undefined') {
					res.status(error.code || _enums.instance.error.code.ERROR).json({
						status: error.code || _enums.instance.error.code.ERROR,
						error: error.message || _enums.instance.error.message.GENERIC_ERROR,
						data: {}
					});
				} else {
					res.status(_enums.instance.error.code.OK).json({
						status: _enums.instance.error.code.OK,
						data: data
					});
				}
			}
		}]);

		return Response;
	}();

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _models = __webpack_require__(10);

	var _models2 = _interopRequireDefault(_models);

	var _links = __webpack_require__(12);

	var _links2 = _interopRequireDefault(_links);

	var _users = __webpack_require__(14);

	var _users2 = _interopRequireDefault(_users);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Sequelize = __webpack_require__(11);


	var instance = undefined;

	var Database = function () {
		function Database(credentials) {
			_classCallCheck(this, Database);

			if (!instance) instance = this;else return instance;

			this.user = credentials.user;
			this.password = credentials.password;
			this.host = credentials.host;
			this.port = credentials.port;
			this.database = credentials.database;
			this.connection = undefined;
			this.Connect();

			this.models = new _models2.default(this.connection);
			this.Links = new _links2.default(this.models.Links);
			this.Users = new _users2.default(this.models.Users);

			return instance;
		}

		_createClass(Database, [{
			key: 'Connect',
			value: function Connect() {
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
				});
			}
		}]);

		return Database;
	}();

	exports.default = Database;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Sequelize = __webpack_require__(11);

	var Models = function Models(connection) {
		_classCallCheck(this, Models);

		this.connection = connection;

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
			indexes: [{
				unique: true,
				fields: ['hash']
			}],
			freezeTableName: true
		});
		this.Links.sync();

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
		});
		this.Users.sync();
	};

	exports.default = Models;

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("sequelize");

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _table = __webpack_require__(13);

	var _table2 = _interopRequireDefault(_table);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Sequelize = __webpack_require__(11);

	var Links = function (_Table) {
		_inherits(Links, _Table);

		function Links() {
			_classCallCheck(this, Links);

			return _possibleConstructorReturn(this, (Links.__proto__ || Object.getPrototypeOf(Links)).apply(this, arguments));
		}

		_createClass(Links, [{
			key: 'Create',
			value: function Create(link, hash, ip) {
				return this.model.create({
					link: link,
					hash: hash,
					ip: ip
				});
			}
		}, {
			key: 'Get',
			value: function Get(hash) {
				return this.model.findOne({
					where: {
						hash: hash
					}
				});
			}
		}, {
			key: 'Exists',
			value: function Exists(hash) {
				var _this2 = this;

				return new Promise(function (resolve, reject) {
					_this2.Get(hash).then(function (result) {
						if (result !== null && !!result.get('hash')) resolve(true);else resolve(false);
					}).catch(reject);
				});
			}
		}]);

		return Links;
	}(_table2.default);

	exports.default = Links;

/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Table = function Table(model) {
		_classCallCheck(this, Table);

		this.model = model;
	};

	exports.default = Table;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _table = __webpack_require__(13);

	var _table2 = _interopRequireDefault(_table);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Sequelize = __webpack_require__(11);

	var Users = function (_Table) {
		_inherits(Users, _Table);

		function Users() {
			_classCallCheck(this, Users);

			return _possibleConstructorReturn(this, (Users.__proto__ || Object.getPrototypeOf(Users)).apply(this, arguments));
		}

		_createClass(Users, [{
			key: 'Add',
			value: function Add(hash, agent) {
				return this.model.create({
					hash: hash,
					agent: agent
				});
			}
		}]);

		return Users;
	}(_table2.default);

	exports.default = Users;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.instance = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Response = __webpack_require__(8);

	var _Error = __webpack_require__(16);

	var _enums = __webpack_require__(7);

	var _validator = __webpack_require__(17);

	var _validator2 = _interopRequireDefault(_validator);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Params = function () {
		function Params() {
			_classCallCheck(this, Params);

			this.routes = ['hash', 'url', 'recaptchaToken'];
		}

		_createClass(Params, [{
			key: 'hash',
			value: function hash(request, response, id) {
				return false;
			}
		}, {
			key: 'url',
			value: function url(request, response, id) {
				return false;
			}
		}, {
			key: 'recaptchaToken',
			value: function recaptchaToken() {
				return false;
			}
		}, {
			key: 'Apply',
			value: function Apply(server) {
				var _this = this;

				var _loop = function _loop(key) {
					var route = _this.routes[key];

					server.App().param(route, function (request, response, next, id) {
						var error = false;
						if (route in _this && typeof _this[route] === 'function') {
							error = _this[route].call(_this, request, response, id);
						}

						if (!error) {
							error = Validate[route].call(_this, request.params[route]);

							if (!error) {
								next();
							} else {
								_Response.Response.Error(response, error);
							}
						} else {
							_Response.Response.Error(response, error);
						}
					});
				};

				for (var key in this.routes) {
					_loop(key);
				}
			}
		}]);

		return Params;
	}();

	var Validate = function () {
		function Validate() {
			_classCallCheck(this, Validate);
		}

		_createClass(Validate, null, [{
			key: 'hash',
			value: function hash(param) {
				if (_validator2.default.isAlphanumeric(param)) {
					return false;
				} else {
					return new _Error.ErrorExtended(_enums.instance.error.message.INVALID_PARAM_HASH, _enums.instance.error.code.BAD_REQUEST);
				}
			}
		}, {
			key: 'url',
			value: function url(param) {
				if (_validator2.default.isURL(param)) {
					return false;
				} else {
					return new _Error.ErrorExtended(_enums.instance.error.message.INVALID_PARAM_URL, _enums.instance.error.code.BAD_REQUEST);
				}
			}
		}, {
			key: 'recaptchaToken',
			value: function recaptchaToken(param) {
				if (param.length < 200) {
					return new _Error.ErrorExtended(_enums.instance.error.message.INVALID_PARAM_RECAPTCHA_TOKEN, _enums.instance.error.code.BAD_REQUEST);
				} else {
					return false;
				}
			}
		}]);

		return Validate;
	}();

	var instance = exports.instance = new Params();

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ErrorExtended = exports.ErrorExtended = function (_Error) {
		_inherits(ErrorExtended, _Error);

		function ErrorExtended(message, code, fileName, lineNumber) {
			_classCallCheck(this, ErrorExtended);

			var _this = _possibleConstructorReturn(this, (ErrorExtended.__proto__ || Object.getPrototypeOf(ErrorExtended)).call(this, message, fileName, lineNumber));

			_this.code = code;
			return _this;
		}

		return ErrorExtended;
	}(Error);

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = require("validator");

/***/ },
/* 18 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Messages = exports.Messages = function () {
		function Messages() {
			_classCallCheck(this, Messages);
		}

		_createClass(Messages, null, [{
			key: "Link",
			value: function Link(hash, link) {
				return {
					hash: hash,
					link: link
				};
			}
		}]);

		return Messages;
	}();

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _enums = __webpack_require__(7);

	var _Error = __webpack_require__(16);

	var _Response = __webpack_require__(8);

	var _Log = __webpack_require__(2);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var express = __webpack_require__(20),
	    helmet = __webpack_require__(21),
	    spdy = __webpack_require__(22),
	    http = __webpack_require__(23),
	    fs = __webpack_require__(24),
	    path = __webpack_require__(25),
	    config = __webpack_require__(26);

	var Server = function () {
		function Server() {
			var _this = this;

			_classCallCheck(this, Server);

			this.config = process.env.NODE_ENV === 'production' ? config.production : config.development;

			var app = express();
			app.set('json spaces', 4);

			if (process.env.NODE_ENV === 'production') {
				app.use(function (request, response, next) {
					var host = request.headers.host.replace(/(.*):([0-9]+)/g, "$1");
					if (_this.config.host !== host && 'www.' + _this.config.host !== host) {
						_Response.Response.Error(response, new _Error.ErrorExtended(_enums.instance.error.message.CORS, _enums.instance.error.code.FORBIDDEN));
						return;
					}

					response.header('Access-Control-Allow-Origin', host);
					response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
					response.header('Access-Control-Allow-Headers', 'Content-Type');
					next();
				});
			}

			app.use(helmet());
			app.use('/static', express.static('static'));
			this.app = app;
		}

		_createClass(Server, [{
			key: 'Start',
			value: function Start() {
				var _this2 = this;

				var cert = {};
				if (process.env.NODE_ENV === 'production') {
					cert.key = fs.readFileSync(this.config.certificate.key, 'utf8');
					cert.cert = fs.readFileSync(this.config.certificate.cert, 'utf8');
				} else {
					cert.key = fs.readFileSync(path.join(__dirname, this.config.certificate.key), 'utf8');
					cert.cert = fs.readFileSync(path.join(__dirname, this.config.certificate.cert), 'utf8');
				}
				var server = spdy.createServer(cert, this.app);

				server.listen(this.config.https, function () {
					_Log.instance.Say('Server listening on port ' + _this2.config.https);
				});

				this.server = server;

				var httpServer = http.createServer(function (request, response) {
					response.writeHead(301, { "Location": "https://" + request.headers['host'] + request.url });
					response.end();
				}).listen(this.config.http);
			}
		}, {
			key: 'App',
			value: function App() {
				return this.app;
			}
		}, {
			key: 'Route',
			value: function Route(route, fn) {
				this.app.get(route, fn);
			}
		}]);

		return Server;
	}();

	exports.default = Server;

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = require("helmet");

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = require("spdy");

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = require("http");

/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = {
		"development": {
			"certificate": {
				"key": "../app/cert/privkey.pem",
				"cert": "../app/cert/fullchain.pem"
			},
			"host": "localhost",
			"protocol": "https",
			"https": 3000,
			"http": 3001
		},
		"production": {
			"certificate": {
				"key": "/etc/letsencrypt/live/shortr.li/privkey.pem",
				"cert": "/etc/letsencrypt/live/shortr.li/fullchain.pem"
			},
			"host": "shortr.li",
			"protocol": "https",
			"https": 443,
			"http": 80
		}
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.instance = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	__webpack_require__(4);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var shorthash = __webpack_require__(28);

	var Crypto = function () {
		function Crypto() {
			_classCallCheck(this, Crypto);
		}

		_createClass(Crypto, [{
			key: 'TimestampHash',
			value: function TimestampHash(str) {
				return shorthash.unique(+new Date() + str);
			}
		}]);

		return Crypto;
	}();

	var instance = exports.instance = new Crypto();

/***/ },
/* 28 */
/***/ function(module, exports) {

	module.exports = require("shorthash");

/***/ },
/* 29 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Util = function () {
		function Util() {
			_classCallCheck(this, Util);
		}

		_createClass(Util, null, [{
			key: 'GetRequestIP',
			value: function GetRequestIP(request) {
				if ('x-forwarded-for' in request.headers && typeof request.headers['x-forwarded-for'] === 'string' && request.headers['x-forwarded-for'].length) {
					return request.headers.split(', ')[0];
				}
				if ('remoteAddress' in request.connection && request.connection['remoteAddress'] === 'string' && request.connection.remoteAddress.length) {
					return request.connection.remoteAddress;
				}
				if ('socket' in request && 'remoteAddress' in request.socket && typeof request.socket['remoteAddress'] === 'string' && request.socket.remoteAddress.length) {
					return request.socket.remoteAddress;
				}
				if ('socket' in request.connection && 'remoteAddress' && 'remoteAddress' in request.connection.socket && typeof request.connection.socket.remoteAddress === 'string' && request.connection.socket.remoteAddress.length) {
					return request.connection.socket.remoteAddress;
				}

				return undefined;
			}
		}]);

		return Util;
	}();

	exports.default = Util;

/***/ },
/* 30 */
/***/ function(module, exports) {

	module.exports = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n\t<meta charset=\"UTF-8\">\n\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1\">\n\t<meta name=\"description\" content=\"Shortr is a premium link shortening service focusing on ease of use.\">\n\t<link href=\"https://fonts.googleapis.com/css?family=Oswald|Roboto+Condensed\" rel=\"stylesheet\">\n\t<link rel=\"apple-touch-icon\" sizes=\"180x180\" href=\"/static/images/apple-touch-icon.png\">\n\t<link rel=\"icon\" type=\"image/png\" sizes=\"32x32\" href=\"/static/images/favicon-32x32.png\">\n\t<link rel=\"icon\" type=\"image/png\" sizes=\"16x16\" href=\"/static/images/favicon-16x16.png\">\n\t<link rel=\"manifest\" href=\"/static/images/manifest.json\">\n\t<link rel=\"mask-icon\" href=\"/static/images/safari-pinned-tab.svg\" color=\"#5bbad5\">\n\t<link rel=\"shortcut icon\" href=\"/static/images/favicon.ico\">\n\t<meta name=\"msapplication-config\" content=\"/static/images/browserconfig.xml\">\n\t<meta name=\"theme-color\" content=\"#ffffff\">\n\t<title>Shortr | Shorten your links. Easily.</title>\n\t<style>\n\t\tbody {width: 100%; height: 100%; overflow: hidden;}\n\t\thtml,body,canvas {padding: 0; margin: 0;}\n\t</style>\n\t<div id=\"app\"></div>\n</head>\n<body>\n<script src=\"https://platform.twitter.com/widgets.js\"></script>\n<script src=\"https://www.google.com/recaptcha/api.js\" async defer></script>\n<script src=\"static/js/index.compiled.js\"></script></body>\n</html>";

/***/ }
/******/ ]);