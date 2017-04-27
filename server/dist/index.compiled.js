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

	var _crypto = __webpack_require__(26);

	var _util = __webpack_require__(29);

	var _util2 = _interopRequireDefault(_util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var server = new _server2.default(),
	    path = __webpack_require__(24),
	    credentials = __webpack_require__(6),
	    html = __webpack_require__(28);

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

			_Recaptcha.instance.Verify(request.params.recaptchaToken).then(function (data) {
				if ('success' in data && data.success) {
					(function () {
						var hash = _crypto.instance.TimestampHash(url),
						    ip = _util2.default.GetRequestIP(request) || null;

						_this.db.Links.Create(url, hash, ip).then(function (result) {
							_Response.Response.Ok(response, _messages.Messages.Link(hash, url));
						}).catch(function (error) {
							console.log(error);
							_Response.Response.Error(response, new _Error.ErrorExtended(_enums.instance.error.message.GENERIC_ERROR, _enums.instance.error.code.ERROR));
						});
					})();
				} else {
					_Response.Response.Error(response, new _Error.ErrorExtended(_enums.instance.error.message.RECAPTCHA_FAILED, _enums.instance.error.code.FORBIDDEN));
				}
			}).catch(function (error) {
				console.error(error);
				_Response.Response.Error(response, new _Error.ErrorExtended(_enums.instance.error.message.GENERIC_ERROR, _enums.instance.error.code.ERROR));
			});
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
	    helmet = __webpack_require__(30),
	    spdy = __webpack_require__(73),
	    http = __webpack_require__(22),
	    fs = __webpack_require__(23),
	    path = __webpack_require__(24),
	    config = __webpack_require__(25);

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

	module.exports = require("https");

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = require("http");

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 25 */
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
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.instance = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	__webpack_require__(4);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var shorthash = __webpack_require__(27);

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
/* 27 */
/***/ function(module, exports) {

	module.exports = require("shorthash");

/***/ },
/* 28 */
/***/ function(module, exports) {

	module.exports = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n\t<meta charset=\"UTF-8\">\n\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1\">\n\t<meta name=\"description\" content=\"Shortr is a premium link shortening service focusing on ease of use.\">\n\t<link href=\"https://fonts.googleapis.com/css?family=Oswald|Roboto+Condensed\" rel=\"stylesheet\">\n\t<link rel=\"apple-touch-icon\" sizes=\"180x180\" href=\"/static/images/apple-touch-icon.png\">\n\t<link rel=\"icon\" type=\"image/png\" sizes=\"32x32\" href=\"/static/images/favicon-32x32.png\">\n\t<link rel=\"icon\" type=\"image/png\" sizes=\"16x16\" href=\"/static/images/favicon-16x16.png\">\n\t<link rel=\"manifest\" href=\"/static/images/manifest.json\">\n\t<link rel=\"mask-icon\" href=\"/static/images/safari-pinned-tab.svg\" color=\"#5bbad5\">\n\t<link rel=\"shortcut icon\" href=\"/static/images/favicon.ico\">\n\t<meta name=\"msapplication-config\" content=\"/static/images/browserconfig.xml\">\n\t<meta name=\"theme-color\" content=\"#ffffff\">\n\t<title>Shortr | Shorten your links. Easily.</title>\n\t<style>\n\t\tbody {width: 100%; height: 100%; overflow: hidden;}\n\t\thtml,body,canvas {padding: 0; margin: 0;}\n\t</style>\n\t<div id=\"app\"></div>\n</head>\n<body>\n<script src=\"https://platform.twitter.com/widgets.js\"></script>\n<script src=\"https://www.google.com/recaptcha/api.js\" async defer></script>\n<script src=\"static/js/index.compiled.js\"></script></body>\n</html>";

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
/***/ function(module, exports, __webpack_require__) {

	var connect = __webpack_require__(31)

	var config = __webpack_require__(37)

	var middlewares
	function helmet (options) {
	  options = options || {}

	  var chain = connect()

	  middlewares.forEach(function (middlewareName) {
	    var middleware = helmet[middlewareName]
	    var option = options[middlewareName]
	    var isDefault = config.defaultMiddleware.indexOf(middlewareName) !== -1

	    if (option === false) { return }

	    if (option != null) {
	      if (option === true) {
	        chain.use(middleware({}))
	      } else {
	        chain.use(middleware(option))
	      }
	    } else if (isDefault) {
	      chain.use(middleware({}))
	    }
	  })

	  return chain
	}

	helmet.contentSecurityPolicy = __webpack_require__(38)
	helmet.dnsPrefetchControl = __webpack_require__(61)
	helmet.frameguard = __webpack_require__(62)
	helmet.hidePoweredBy = __webpack_require__(64)
	helmet.hpkp = __webpack_require__(65)
	helmet.hsts = __webpack_require__(66)
	helmet.ieNoOpen = __webpack_require__(68)
	helmet.noCache = __webpack_require__(69)
	helmet.noSniff = __webpack_require__(70)
	helmet.referrerPolicy = __webpack_require__(71)
	helmet.xssFilter = __webpack_require__(72)
	middlewares = Object.keys(helmet)

	module.exports = helmet


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * connect
	 * Copyright(c) 2010 Sencha Inc.
	 * Copyright(c) 2011 TJ Holowaychuk
	 * Copyright(c) 2015 Douglas Christopher Wilson
	 * MIT Licensed
	 */

	'use strict';

	/**
	 * Module dependencies.
	 * @private
	 */

	var debug = __webpack_require__(32)('connect:dispatcher');
	var EventEmitter = __webpack_require__(33).EventEmitter;
	var finalhandler = __webpack_require__(34);
	var http = __webpack_require__(22);
	var merge = __webpack_require__(35);
	var parseUrl = __webpack_require__(36);

	/**
	 * Module exports.
	 * @public
	 */

	module.exports = createServer;

	/**
	 * Module variables.
	 * @private
	 */

	var env = process.env.NODE_ENV || 'development';
	var proto = {};

	/* istanbul ignore next */
	var defer = typeof setImmediate === 'function'
	  ? setImmediate
	  : function(fn){ process.nextTick(fn.bind.apply(fn, arguments)) }

	/**
	 * Create a new connect server.
	 *
	 * @return {function}
	 * @public
	 */

	function createServer() {
	  function app(req, res, next){ app.handle(req, res, next); }
	  merge(app, proto);
	  merge(app, EventEmitter.prototype);
	  app.route = '/';
	  app.stack = [];
	  return app;
	}

	/**
	 * Utilize the given middleware `handle` to the given `route`,
	 * defaulting to _/_. This "route" is the mount-point for the
	 * middleware, when given a value other than _/_ the middleware
	 * is only effective when that segment is present in the request's
	 * pathname.
	 *
	 * For example if we were to mount a function at _/admin_, it would
	 * be invoked on _/admin_, and _/admin/settings_, however it would
	 * not be invoked for _/_, or _/posts_.
	 *
	 * @param {String|Function|Server} route, callback or server
	 * @param {Function|Server} callback or server
	 * @return {Server} for chaining
	 * @public
	 */

	proto.use = function use(route, fn) {
	  var handle = fn;
	  var path = route;

	  // default route to '/'
	  if (typeof route !== 'string') {
	    handle = route;
	    path = '/';
	  }

	  // wrap sub-apps
	  if (typeof handle.handle === 'function') {
	    var server = handle;
	    server.route = path;
	    handle = function (req, res, next) {
	      server.handle(req, res, next);
	    };
	  }

	  // wrap vanilla http.Servers
	  if (handle instanceof http.Server) {
	    handle = handle.listeners('request')[0];
	  }

	  // strip trailing slash
	  if (path[path.length - 1] === '/') {
	    path = path.slice(0, -1);
	  }

	  // add the middleware
	  debug('use %s %s', path || '/', handle.name || 'anonymous');
	  this.stack.push({ route: path, handle: handle });

	  return this;
	};

	/**
	 * Handle server requests, punting them down
	 * the middleware stack.
	 *
	 * @private
	 */

	proto.handle = function handle(req, res, out) {
	  var index = 0;
	  var protohost = getProtohost(req.url) || '';
	  var removed = '';
	  var slashAdded = false;
	  var stack = this.stack;

	  // final function handler
	  var done = out || finalhandler(req, res, {
	    env: env,
	    onerror: logerror
	  });

	  // store the original URL
	  req.originalUrl = req.originalUrl || req.url;

	  function next(err) {
	    if (slashAdded) {
	      req.url = req.url.substr(1);
	      slashAdded = false;
	    }

	    if (removed.length !== 0) {
	      req.url = protohost + removed + req.url.substr(protohost.length);
	      removed = '';
	    }

	    // next callback
	    var layer = stack[index++];

	    // all done
	    if (!layer) {
	      defer(done, err);
	      return;
	    }

	    // route data
	    var path = parseUrl(req).pathname || '/';
	    var route = layer.route;

	    // skip this layer if the route doesn't match
	    if (path.toLowerCase().substr(0, route.length) !== route.toLowerCase()) {
	      return next(err);
	    }

	    // skip if route match does not border "/", ".", or end
	    var c = path[route.length];
	    if (c !== undefined && '/' !== c && '.' !== c) {
	      return next(err);
	    }

	    // trim off the part of the url that matches the route
	    if (route.length !== 0 && route !== '/') {
	      removed = route;
	      req.url = protohost + req.url.substr(protohost.length + removed.length);

	      // ensure leading slash
	      if (!protohost && req.url[0] !== '/') {
	        req.url = '/' + req.url;
	        slashAdded = true;
	      }
	    }

	    // call the layer handle
	    call(layer.handle, route, err, req, res, next);
	  }

	  next();
	};

	/**
	 * Listen for connections.
	 *
	 * This method takes the same arguments
	 * as node's `http.Server#listen()`.
	 *
	 * HTTP and HTTPS:
	 *
	 * If you run your application both as HTTP
	 * and HTTPS you may wrap them individually,
	 * since your Connect "server" is really just
	 * a JavaScript `Function`.
	 *
	 *      var connect = require('connect')
	 *        , http = require('http')
	 *        , https = require('https');
	 *
	 *      var app = connect();
	 *
	 *      http.createServer(app).listen(80);
	 *      https.createServer(options, app).listen(443);
	 *
	 * @return {http.Server}
	 * @api public
	 */

	proto.listen = function listen() {
	  var server = http.createServer(this);
	  return server.listen.apply(server, arguments);
	};

	/**
	 * Invoke a route handle.
	 * @private
	 */

	function call(handle, route, err, req, res, next) {
	  var arity = handle.length;
	  var error = err;
	  var hasError = Boolean(err);

	  debug('%s %s : %s', handle.name || '<anonymous>', route, req.originalUrl);

	  try {
	    if (hasError && arity === 4) {
	      // error-handling middleware
	      handle(err, req, res, next);
	      return;
	    } else if (!hasError && arity < 4) {
	      // request-handling middleware
	      handle(req, res, next);
	      return;
	    }
	  } catch (e) {
	    // replace the error
	    error = e;
	  }

	  // continue
	  next(error);
	}

	/**
	 * Log error using console.error.
	 *
	 * @param {Error} err
	 * @private
	 */

	function logerror(err) {
	  if (env !== 'test') console.error(err.stack || err.toString());
	}

	/**
	 * Get get protocol + host for a URL.
	 *
	 * @param {string} url
	 * @private
	 */

	function getProtohost(url) {
	  if (url.length === 0 || url[0] === '/') {
	    return undefined;
	  }

	  var searchIndex = url.indexOf('?');
	  var pathLength = searchIndex !== -1
	    ? searchIndex
	    : url.length;
	  var fqdnIndex = url.substr(0, pathLength).indexOf('://');

	  return fqdnIndex !== -1
	    ? url.substr(0, url.indexOf('/', 3 + fqdnIndex))
	    : undefined;
	}


/***/ },
/* 32 */
/***/ function(module, exports) {

	module.exports = require("debug");

/***/ },
/* 33 */
/***/ function(module, exports) {

	module.exports = require("events");

/***/ },
/* 34 */
/***/ function(module, exports) {

	module.exports = require("finalhandler");

/***/ },
/* 35 */
/***/ function(module, exports) {

	module.exports = require("utils-merge");

/***/ },
/* 36 */
/***/ function(module, exports) {

	module.exports = require("parseurl");

/***/ },
/* 37 */
/***/ function(module, exports) {

	module.exports = {
		"defaultMiddleware": [
			"dnsPrefetchControl",
			"frameguard",
			"hidePoweredBy",
			"hsts",
			"ieNoOpen",
			"noSniff",
			"xssFilter"
		]
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var camelize = __webpack_require__(39)
	var cspBuilder = __webpack_require__(40)
	var isFunction = __webpack_require__(42)
	var platform = __webpack_require__(43)
	var checkOptions = __webpack_require__(45)
	var containsFunction = __webpack_require__(56)
	var getHeaderKeysForBrowser = __webpack_require__(57)
	var transformDirectivesForBrowser = __webpack_require__(58)
	var parseDynamicDirectives = __webpack_require__(60)
	var config = __webpack_require__(47)

	module.exports = function csp (options) {
	  checkOptions(options)

	  var originalDirectives = camelize(options.directives || {})
	  var directivesAreDynamic = containsFunction(originalDirectives)
	  var shouldBrowserSniff = options.browserSniff !== false
	  var reportOnlyIsFunction = isFunction(options.reportOnly)

	  if (shouldBrowserSniff) {
	    return function csp (req, res, next) {
	      var userAgent = req.headers['user-agent']

	      var browser
	      if (userAgent) {
	        browser = platform.parse(userAgent)
	      } else {
	        browser = {}
	      }

	      var headerKeys
	      if (options.setAllHeaders || !userAgent) {
	        headerKeys = config.allHeaders
	      } else {
	        headerKeys = getHeaderKeysForBrowser(browser, options)
	      }

	      if (headerKeys.length === 0) {
	        next()
	        return
	      }

	      var directives = transformDirectivesForBrowser(browser, originalDirectives)

	      if (directivesAreDynamic) {
	        directives = parseDynamicDirectives(directives, [req, res])
	      }

	      var policyString = cspBuilder({ directives: directives })

	      headerKeys.forEach(function (headerKey) {
	        if ((reportOnlyIsFunction && options.reportOnly(req, res)) ||
	            (!reportOnlyIsFunction && options.reportOnly)) {
	          headerKey += '-Report-Only'
	        }
	        res.setHeader(headerKey, policyString)
	      })

	      next()
	    }
	  } else {
	    var headerKeys
	    if (options.setAllHeaders) {
	      headerKeys = config.allHeaders
	    } else {
	      headerKeys = ['Content-Security-Policy']
	    }

	    return function csp (req, res, next) {
	      var directives = parseDynamicDirectives(originalDirectives, [req, res])
	      var policyString = cspBuilder({ directives: directives })

	      if ((reportOnlyIsFunction && options.reportOnly(req, res)) ||
	          (!reportOnlyIsFunction && options.reportOnly)) {
	        headerKeys.forEach(function (headerKey) {
	          res.setHeader(headerKey + '-Report-Only', policyString)
	        })
	      } else {
	        headerKeys.forEach(function (headerKey) {
	          res.setHeader(headerKey, policyString)
	        })
	      }

	      next()
	    }
	  }
	}


/***/ },
/* 39 */
/***/ function(module, exports) {

	module.exports = function(obj) {
	    if (typeof obj === 'string') return camelCase(obj);
	    return walk(obj);
	};

	function walk (obj) {
	    if (!obj || typeof obj !== 'object') return obj;
	    if (isDate(obj) || isRegex(obj)) return obj;
	    if (isArray(obj)) return map(obj, walk);
	    return reduce(objectKeys(obj), function (acc, key) {
	        var camel = camelCase(key);
	        acc[camel] = walk(obj[key]);
	        return acc;
	    }, {});
	}

	function camelCase(str) {
	    return str.replace(/[_.-](\w|$)/g, function (_,x) {
	        return x.toUpperCase();
	    });
	}

	var isArray = Array.isArray || function (obj) {
	    return Object.prototype.toString.call(obj) === '[object Array]';
	};

	var isDate = function (obj) {
	    return Object.prototype.toString.call(obj) === '[object Date]';
	};

	var isRegex = function (obj) {
	    return Object.prototype.toString.call(obj) === '[object RegExp]';
	};

	var has = Object.prototype.hasOwnProperty;
	var objectKeys = Object.keys || function (obj) {
	    var keys = [];
	    for (var key in obj) {
	        if (has.call(obj, key)) keys.push(key);
	    }
	    return keys;
	};

	function map (xs, f) {
	    if (xs.map) return xs.map(f);
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        res.push(f(xs[i], i));
	    }
	    return res;
	}

	function reduce (xs, f, acc) {
	    if (xs.reduce) return xs.reduce(f, acc);
	    for (var i = 0; i < xs.length; i++) {
	        acc = f(acc, xs[i], i);
	    }
	    return acc;
	}


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var dashify = __webpack_require__(41)

	module.exports = function (options) {
	  var directives = options.directives

	  var keysSeen = {}

	  return Object.keys(directives).reduce(function (result, originalKey) {
	    var directive = dashify(originalKey)

	    if (keysSeen[directive]) {
	      throw new Error(originalKey + ' is specified more than once')
	    }
	    keysSeen[directive] = true

	    var value = directives[originalKey]
	    if (Array.isArray(value)) {
	      value = value.join(' ')
	    } else if (value === true) {
	      value = ''
	    }

	    if (value) {
	      return result.concat(directive + ' ' + value)
	    } else {
	      return result.concat(directive)
	    }
	  }, []).join('; ')
	}


/***/ },
/* 41 */
/***/ function(module, exports) {

	/*!
	 * dashify <https://github.com/jonschlinkert/dashify>
	 *
	 * Copyright (c) 2015 Jon Schlinkert.
	 * Licensed under the MIT license.
	 */

	'use strict';

	module.exports = function dashify(str) {
	  if (typeof str !== 'string') {
	    throw new TypeError('expected a string');
	  }
	  str = str.replace(/([a-z])([A-Z])/g, '$1-$2');
	  str = str.replace(/[ \t\W]/g, '-');
	  str = str.replace(/^-+|-+$/g, '');
	  return str.toLowerCase();
	};


/***/ },
/* 42 */
/***/ function(module, exports) {

	module.exports = function isFunction (value) {
	  return value instanceof Function
	}


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {/*!
	 * Platform.js <https://mths.be/platform>
	 * Copyright 2014-2016 Benjamin Tan <https://demoneaux.github.io/>
	 * Copyright 2011-2013 John-David Dalton <http://allyoucanleet.com/>
	 * Available under MIT license <https://mths.be/mit>
	 */
	;(function() {
	  'use strict';

	  /** Used to determine if values are of the language type `Object`. */
	  var objectTypes = {
	    'function': true,
	    'object': true
	  };

	  /** Used as a reference to the global object. */
	  var root = (objectTypes[typeof window] && window) || this;

	  /** Backup possible global object. */
	  var oldRoot = root;

	  /** Detect free variable `exports`. */
	  var freeExports = objectTypes[typeof exports] && exports;

	  /** Detect free variable `module`. */
	  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

	  /** Detect free variable `global` from Node.js or Browserified code and use it as `root`. */
	  var freeGlobal = freeExports && freeModule && typeof global == 'object' && global;
	  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {
	    root = freeGlobal;
	  }

	  /**
	   * Used as the maximum length of an array-like object.
	   * See the [ES6 spec](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength)
	   * for more details.
	   */
	  var maxSafeInteger = Math.pow(2, 53) - 1;

	  /** Regular expression to detect Opera. */
	  var reOpera = /\bOpera/;

	  /** Possible global object. */
	  var thisBinding = this;

	  /** Used for native method references. */
	  var objectProto = Object.prototype;

	  /** Used to check for own properties of an object. */
	  var hasOwnProperty = objectProto.hasOwnProperty;

	  /** Used to resolve the internal `[[Class]]` of values. */
	  var toString = objectProto.toString;

	  /*--------------------------------------------------------------------------*/

	  /**
	   * Capitalizes a string value.
	   *
	   * @private
	   * @param {string} string The string to capitalize.
	   * @returns {string} The capitalized string.
	   */
	  function capitalize(string) {
	    string = String(string);
	    return string.charAt(0).toUpperCase() + string.slice(1);
	  }

	  /**
	   * A utility function to clean up the OS name.
	   *
	   * @private
	   * @param {string} os The OS name to clean up.
	   * @param {string} [pattern] A `RegExp` pattern matching the OS name.
	   * @param {string} [label] A label for the OS.
	   */
	  function cleanupOS(os, pattern, label) {
	    // Platform tokens are defined at:
	    // http://msdn.microsoft.com/en-us/library/ms537503(VS.85).aspx
	    // http://web.archive.org/web/20081122053950/http://msdn.microsoft.com/en-us/library/ms537503(VS.85).aspx
	    var data = {
	      '10.0': '10',
	      '6.4':  '10 Technical Preview',
	      '6.3':  '8.1',
	      '6.2':  '8',
	      '6.1':  'Server 2008 R2 / 7',
	      '6.0':  'Server 2008 / Vista',
	      '5.2':  'Server 2003 / XP 64-bit',
	      '5.1':  'XP',
	      '5.01': '2000 SP1',
	      '5.0':  '2000',
	      '4.0':  'NT',
	      '4.90': 'ME'
	    };
	    // Detect Windows version from platform tokens.
	    if (pattern && label && /^Win/i.test(os) && !/^Windows Phone /i.test(os) &&
	        (data = data[/[\d.]+$/.exec(os)])) {
	      os = 'Windows ' + data;
	    }
	    // Correct character case and cleanup string.
	    os = String(os);

	    if (pattern && label) {
	      os = os.replace(RegExp(pattern, 'i'), label);
	    }

	    os = format(
	      os.replace(/ ce$/i, ' CE')
	        .replace(/\bhpw/i, 'web')
	        .replace(/\bMacintosh\b/, 'Mac OS')
	        .replace(/_PowerPC\b/i, ' OS')
	        .replace(/\b(OS X) [^ \d]+/i, '$1')
	        .replace(/\bMac (OS X)\b/, '$1')
	        .replace(/\/(\d)/, ' $1')
	        .replace(/_/g, '.')
	        .replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, '')
	        .replace(/\bx86\.64\b/gi, 'x86_64')
	        .replace(/\b(Windows Phone) OS\b/, '$1')
	        .replace(/\b(Chrome OS \w+) [\d.]+\b/, '$1')
	        .split(' on ')[0]
	    );

	    return os;
	  }

	  /**
	   * An iteration utility for arrays and objects.
	   *
	   * @private
	   * @param {Array|Object} object The object to iterate over.
	   * @param {Function} callback The function called per iteration.
	   */
	  function each(object, callback) {
	    var index = -1,
	        length = object ? object.length : 0;

	    if (typeof length == 'number' && length > -1 && length <= maxSafeInteger) {
	      while (++index < length) {
	        callback(object[index], index, object);
	      }
	    } else {
	      forOwn(object, callback);
	    }
	  }

	  /**
	   * Trim and conditionally capitalize string values.
	   *
	   * @private
	   * @param {string} string The string to format.
	   * @returns {string} The formatted string.
	   */
	  function format(string) {
	    string = trim(string);
	    return /^(?:webOS|i(?:OS|P))/.test(string)
	      ? string
	      : capitalize(string);
	  }

	  /**
	   * Iterates over an object's own properties, executing the `callback` for each.
	   *
	   * @private
	   * @param {Object} object The object to iterate over.
	   * @param {Function} callback The function executed per own property.
	   */
	  function forOwn(object, callback) {
	    for (var key in object) {
	      if (hasOwnProperty.call(object, key)) {
	        callback(object[key], key, object);
	      }
	    }
	  }

	  /**
	   * Gets the internal `[[Class]]` of a value.
	   *
	   * @private
	   * @param {*} value The value.
	   * @returns {string} The `[[Class]]`.
	   */
	  function getClassOf(value) {
	    return value == null
	      ? capitalize(value)
	      : toString.call(value).slice(8, -1);
	  }

	  /**
	   * Host objects can return type values that are different from their actual
	   * data type. The objects we are concerned with usually return non-primitive
	   * types of "object", "function", or "unknown".
	   *
	   * @private
	   * @param {*} object The owner of the property.
	   * @param {string} property The property to check.
	   * @returns {boolean} Returns `true` if the property value is a non-primitive, else `false`.
	   */
	  function isHostType(object, property) {
	    var type = object != null ? typeof object[property] : 'number';
	    return !/^(?:boolean|number|string|undefined)$/.test(type) &&
	      (type == 'object' ? !!object[property] : true);
	  }

	  /**
	   * Prepares a string for use in a `RegExp` by making hyphens and spaces optional.
	   *
	   * @private
	   * @param {string} string The string to qualify.
	   * @returns {string} The qualified string.
	   */
	  function qualify(string) {
	    return String(string).replace(/([ -])(?!$)/g, '$1?');
	  }

	  /**
	   * A bare-bones `Array#reduce` like utility function.
	   *
	   * @private
	   * @param {Array} array The array to iterate over.
	   * @param {Function} callback The function called per iteration.
	   * @returns {*} The accumulated result.
	   */
	  function reduce(array, callback) {
	    var accumulator = null;
	    each(array, function(value, index) {
	      accumulator = callback(accumulator, value, index, array);
	    });
	    return accumulator;
	  }

	  /**
	   * Removes leading and trailing whitespace from a string.
	   *
	   * @private
	   * @param {string} string The string to trim.
	   * @returns {string} The trimmed string.
	   */
	  function trim(string) {
	    return String(string).replace(/^ +| +$/g, '');
	  }

	  /*--------------------------------------------------------------------------*/

	  /**
	   * Creates a new platform object.
	   *
	   * @memberOf platform
	   * @param {Object|string} [ua=navigator.userAgent] The user agent string or
	   *  context object.
	   * @returns {Object} A platform object.
	   */
	  function parse(ua) {

	    /** The environment context object. */
	    var context = root;

	    /** Used to flag when a custom context is provided. */
	    var isCustomContext = ua && typeof ua == 'object' && getClassOf(ua) != 'String';

	    // Juggle arguments.
	    if (isCustomContext) {
	      context = ua;
	      ua = null;
	    }

	    /** Browser navigator object. */
	    var nav = context.navigator || {};

	    /** Browser user agent string. */
	    var userAgent = nav.userAgent || '';

	    ua || (ua = userAgent);

	    /** Used to flag when `thisBinding` is the [ModuleScope]. */
	    var isModuleScope = isCustomContext || thisBinding == oldRoot;

	    /** Used to detect if browser is like Chrome. */
	    var likeChrome = isCustomContext
	      ? !!nav.likeChrome
	      : /\bChrome\b/.test(ua) && !/internal|\n/i.test(toString.toString());

	    /** Internal `[[Class]]` value shortcuts. */
	    var objectClass = 'Object',
	        airRuntimeClass = isCustomContext ? objectClass : 'ScriptBridgingProxyObject',
	        enviroClass = isCustomContext ? objectClass : 'Environment',
	        javaClass = (isCustomContext && context.java) ? 'JavaPackage' : getClassOf(context.java),
	        phantomClass = isCustomContext ? objectClass : 'RuntimeObject';

	    /** Detect Java environments. */
	    var java = /\bJava/.test(javaClass) && context.java;

	    /** Detect Rhino. */
	    var rhino = java && getClassOf(context.environment) == enviroClass;

	    /** A character to represent alpha. */
	    var alpha = java ? 'a' : '\u03b1';

	    /** A character to represent beta. */
	    var beta = java ? 'b' : '\u03b2';

	    /** Browser document object. */
	    var doc = context.document || {};

	    /**
	     * Detect Opera browser (Presto-based).
	     * http://www.howtocreate.co.uk/operaStuff/operaObject.html
	     * http://dev.opera.com/articles/view/opera-mini-web-content-authoring-guidelines/#operamini
	     */
	    var opera = context.operamini || context.opera;

	    /** Opera `[[Class]]`. */
	    var operaClass = reOpera.test(operaClass = (isCustomContext && opera) ? opera['[[Class]]'] : getClassOf(opera))
	      ? operaClass
	      : (opera = null);

	    /*------------------------------------------------------------------------*/

	    /** Temporary variable used over the script's lifetime. */
	    var data;

	    /** The CPU architecture. */
	    var arch = ua;

	    /** Platform description array. */
	    var description = [];

	    /** Platform alpha/beta indicator. */
	    var prerelease = null;

	    /** A flag to indicate that environment features should be used to resolve the platform. */
	    var useFeatures = ua == userAgent;

	    /** The browser/environment version. */
	    var version = useFeatures && opera && typeof opera.version == 'function' && opera.version();

	    /** A flag to indicate if the OS ends with "/ Version" */
	    var isSpecialCasedOS;

	    /* Detectable layout engines (order is important). */
	    var layout = getLayout([
	      { 'label': 'EdgeHTML', 'pattern': 'Edge' },
	      'Trident',
	      { 'label': 'WebKit', 'pattern': 'AppleWebKit' },
	      'iCab',
	      'Presto',
	      'NetFront',
	      'Tasman',
	      'KHTML',
	      'Gecko'
	    ]);

	    /* Detectable browser names (order is important). */
	    var name = getName([
	      'Adobe AIR',
	      'Arora',
	      'Avant Browser',
	      'Breach',
	      'Camino',
	      'Epiphany',
	      'Fennec',
	      'Flock',
	      'Galeon',
	      'GreenBrowser',
	      'iCab',
	      'Iceweasel',
	      'K-Meleon',
	      'Konqueror',
	      'Lunascape',
	      'Maxthon',
	      { 'label': 'Microsoft Edge', 'pattern': 'Edge' },
	      'Midori',
	      'Nook Browser',
	      'PaleMoon',
	      'PhantomJS',
	      'Raven',
	      'Rekonq',
	      'RockMelt',
	      'SeaMonkey',
	      { 'label': 'Silk', 'pattern': '(?:Cloud9|Silk-Accelerated)' },
	      'Sleipnir',
	      'SlimBrowser',
	      { 'label': 'SRWare Iron', 'pattern': 'Iron' },
	      'Sunrise',
	      'Swiftfox',
	      'WebPositive',
	      'Opera Mini',
	      { 'label': 'Opera Mini', 'pattern': 'OPiOS' },
	      'Opera',
	      { 'label': 'Opera', 'pattern': 'OPR' },
	      'Chrome',
	      { 'label': 'Chrome Mobile', 'pattern': '(?:CriOS|CrMo)' },
	      { 'label': 'Firefox', 'pattern': '(?:Firefox|Minefield)' },
	      { 'label': 'Firefox for iOS', 'pattern': 'FxiOS' },
	      { 'label': 'IE', 'pattern': 'IEMobile' },
	      { 'label': 'IE', 'pattern': 'MSIE' },
	      'Safari'
	    ]);

	    /* Detectable products (order is important). */
	    var product = getProduct([
	      { 'label': 'BlackBerry', 'pattern': 'BB10' },
	      'BlackBerry',
	      { 'label': 'Galaxy S', 'pattern': 'GT-I9000' },
	      { 'label': 'Galaxy S2', 'pattern': 'GT-I9100' },
	      { 'label': 'Galaxy S3', 'pattern': 'GT-I9300' },
	      { 'label': 'Galaxy S4', 'pattern': 'GT-I9500' },
	      'Google TV',
	      'Lumia',
	      'iPad',
	      'iPod',
	      'iPhone',
	      'Kindle',
	      { 'label': 'Kindle Fire', 'pattern': '(?:Cloud9|Silk-Accelerated)' },
	      'Nexus',
	      'Nook',
	      'PlayBook',
	      'PlayStation 3',
	      'PlayStation 4',
	      'PlayStation Vita',
	      'TouchPad',
	      'Transformer',
	      { 'label': 'Wii U', 'pattern': 'WiiU' },
	      'Wii',
	      'Xbox One',
	      { 'label': 'Xbox 360', 'pattern': 'Xbox' },
	      'Xoom'
	    ]);

	    /* Detectable manufacturers. */
	    var manufacturer = getManufacturer({
	      'Apple': { 'iPad': 1, 'iPhone': 1, 'iPod': 1 },
	      'Archos': {},
	      'Amazon': { 'Kindle': 1, 'Kindle Fire': 1 },
	      'Asus': { 'Transformer': 1 },
	      'Barnes & Noble': { 'Nook': 1 },
	      'BlackBerry': { 'PlayBook': 1 },
	      'Google': { 'Google TV': 1, 'Nexus': 1 },
	      'HP': { 'TouchPad': 1 },
	      'HTC': {},
	      'LG': {},
	      'Microsoft': { 'Xbox': 1, 'Xbox One': 1 },
	      'Motorola': { 'Xoom': 1 },
	      'Nintendo': { 'Wii U': 1,  'Wii': 1 },
	      'Nokia': { 'Lumia': 1 },
	      'Samsung': { 'Galaxy S': 1, 'Galaxy S2': 1, 'Galaxy S3': 1, 'Galaxy S4': 1 },
	      'Sony': { 'PlayStation 4': 1, 'PlayStation 3': 1, 'PlayStation Vita': 1 }
	    });

	    /* Detectable operating systems (order is important). */
	    var os = getOS([
	      'Windows Phone',
	      'Android',
	      'CentOS',
	      { 'label': 'Chrome OS', 'pattern': 'CrOS' },
	      'Debian',
	      'Fedora',
	      'FreeBSD',
	      'Gentoo',
	      'Haiku',
	      'Kubuntu',
	      'Linux Mint',
	      'OpenBSD',
	      'Red Hat',
	      'SuSE',
	      'Ubuntu',
	      'Xubuntu',
	      'Cygwin',
	      'Symbian OS',
	      'hpwOS',
	      'webOS ',
	      'webOS',
	      'Tablet OS',
	      'Linux',
	      'Mac OS X',
	      'Macintosh',
	      'Mac',
	      'Windows 98;',
	      'Windows '
	    ]);

	    /*------------------------------------------------------------------------*/

	    /**
	     * Picks the layout engine from an array of guesses.
	     *
	     * @private
	     * @param {Array} guesses An array of guesses.
	     * @returns {null|string} The detected layout engine.
	     */
	    function getLayout(guesses) {
	      return reduce(guesses, function(result, guess) {
	        return result || RegExp('\\b' + (
	          guess.pattern || qualify(guess)
	        ) + '\\b', 'i').exec(ua) && (guess.label || guess);
	      });
	    }

	    /**
	     * Picks the manufacturer from an array of guesses.
	     *
	     * @private
	     * @param {Array} guesses An object of guesses.
	     * @returns {null|string} The detected manufacturer.
	     */
	    function getManufacturer(guesses) {
	      return reduce(guesses, function(result, value, key) {
	        // Lookup the manufacturer by product or scan the UA for the manufacturer.
	        return result || (
	          value[product] ||
	          value[/^[a-z]+(?: +[a-z]+\b)*/i.exec(product)] ||
	          RegExp('\\b' + qualify(key) + '(?:\\b|\\w*\\d)', 'i').exec(ua)
	        ) && key;
	      });
	    }

	    /**
	     * Picks the browser name from an array of guesses.
	     *
	     * @private
	     * @param {Array} guesses An array of guesses.
	     * @returns {null|string} The detected browser name.
	     */
	    function getName(guesses) {
	      return reduce(guesses, function(result, guess) {
	        return result || RegExp('\\b' + (
	          guess.pattern || qualify(guess)
	        ) + '\\b', 'i').exec(ua) && (guess.label || guess);
	      });
	    }

	    /**
	     * Picks the OS name from an array of guesses.
	     *
	     * @private
	     * @param {Array} guesses An array of guesses.
	     * @returns {null|string} The detected OS name.
	     */
	    function getOS(guesses) {
	      return reduce(guesses, function(result, guess) {
	        var pattern = guess.pattern || qualify(guess);
	        if (!result && (result =
	              RegExp('\\b' + pattern + '(?:/[\\d.]+|[ \\w.]*)', 'i').exec(ua)
	            )) {
	          result = cleanupOS(result, pattern, guess.label || guess);
	        }
	        return result;
	      });
	    }

	    /**
	     * Picks the product name from an array of guesses.
	     *
	     * @private
	     * @param {Array} guesses An array of guesses.
	     * @returns {null|string} The detected product name.
	     */
	    function getProduct(guesses) {
	      return reduce(guesses, function(result, guess) {
	        var pattern = guess.pattern || qualify(guess);
	        if (!result && (result =
	              RegExp('\\b' + pattern + ' *\\d+[.\\w_]*', 'i').exec(ua) ||
	              RegExp('\\b' + pattern + '(?:; *(?:[a-z]+[_-])?[a-z]+\\d+|[^ ();-]*)', 'i').exec(ua)
	            )) {
	          // Split by forward slash and append product version if needed.
	          if ((result = String((guess.label && !RegExp(pattern, 'i').test(guess.label)) ? guess.label : result).split('/'))[1] && !/[\d.]+/.test(result[0])) {
	            result[0] += ' ' + result[1];
	          }
	          // Correct character case and cleanup string.
	          guess = guess.label || guess;
	          result = format(result[0]
	            .replace(RegExp(pattern, 'i'), guess)
	            .replace(RegExp('; *(?:' + guess + '[_-])?', 'i'), ' ')
	            .replace(RegExp('(' + guess + ')[-_.]?(\\w)', 'i'), '$1 $2'));
	        }
	        return result;
	      });
	    }

	    /**
	     * Resolves the version using an array of UA patterns.
	     *
	     * @private
	     * @param {Array} patterns An array of UA patterns.
	     * @returns {null|string} The detected version.
	     */
	    function getVersion(patterns) {
	      return reduce(patterns, function(result, pattern) {
	        return result || (RegExp(pattern +
	          '(?:-[\\d.]+/|(?: for [\\w-]+)?[ /-])([\\d.]+[^ ();/_-]*)', 'i').exec(ua) || 0)[1] || null;
	      });
	    }

	    /**
	     * Returns `platform.description` when the platform object is coerced to a string.
	     *
	     * @name toString
	     * @memberOf platform
	     * @returns {string} Returns `platform.description` if available, else an empty string.
	     */
	    function toStringPlatform() {
	      return this.description || '';
	    }

	    /*------------------------------------------------------------------------*/

	    // Convert layout to an array so we can add extra details.
	    layout && (layout = [layout]);

	    // Detect product names that contain their manufacturer's name.
	    if (manufacturer && !product) {
	      product = getProduct([manufacturer]);
	    }
	    // Clean up Google TV.
	    if ((data = /\bGoogle TV\b/.exec(product))) {
	      product = data[0];
	    }
	    // Detect simulators.
	    if (/\bSimulator\b/i.test(ua)) {
	      product = (product ? product + ' ' : '') + 'Simulator';
	    }
	    // Detect Opera Mini 8+ running in Turbo/Uncompressed mode on iOS.
	    if (name == 'Opera Mini' && /\bOPiOS\b/.test(ua)) {
	      description.push('running in Turbo/Uncompressed mode');
	    }
	    // Detect IE Mobile 11.
	    if (name == 'IE' && /\blike iPhone OS\b/.test(ua)) {
	      data = parse(ua.replace(/like iPhone OS/, ''));
	      manufacturer = data.manufacturer;
	      product = data.product;
	    }
	    // Detect iOS.
	    else if (/^iP/.test(product)) {
	      name || (name = 'Safari');
	      os = 'iOS' + ((data = / OS ([\d_]+)/i.exec(ua))
	        ? ' ' + data[1].replace(/_/g, '.')
	        : '');
	    }
	    // Detect Kubuntu.
	    else if (name == 'Konqueror' && !/buntu/i.test(os)) {
	      os = 'Kubuntu';
	    }
	    // Detect Android browsers.
	    else if ((manufacturer && manufacturer != 'Google' &&
	        ((/Chrome/.test(name) && !/\bMobile Safari\b/i.test(ua)) || /\bVita\b/.test(product))) ||
	        (/\bAndroid\b/.test(os) && /^Chrome/.test(name) && /\bVersion\//i.test(ua))) {
	      name = 'Android Browser';
	      os = /\bAndroid\b/.test(os) ? os : 'Android';
	    }
	    // Detect Silk desktop/accelerated modes.
	    else if (name == 'Silk') {
	      if (!/\bMobi/i.test(ua)) {
	        os = 'Android';
	        description.unshift('desktop mode');
	      }
	      if (/Accelerated *= *true/i.test(ua)) {
	        description.unshift('accelerated');
	      }
	    }
	    // Detect PaleMoon identifying as Firefox.
	    else if (name == 'PaleMoon' && (data = /\bFirefox\/([\d.]+)\b/.exec(ua))) {
	      description.push('identifying as Firefox ' + data[1]);
	    }
	    // Detect Firefox OS and products running Firefox.
	    else if (name == 'Firefox' && (data = /\b(Mobile|Tablet|TV)\b/i.exec(ua))) {
	      os || (os = 'Firefox OS');
	      product || (product = data[1]);
	    }
	    // Detect false positives for Firefox/Safari.
	    else if (!name || (data = !/\bMinefield\b/i.test(ua) && /\b(?:Firefox|Safari)\b/.exec(name))) {
	      // Escape the `/` for Firefox 1.
	      if (name && !product && /[\/,]|^[^(]+?\)/.test(ua.slice(ua.indexOf(data + '/') + 8))) {
	        // Clear name of false positives.
	        name = null;
	      }
	      // Reassign a generic name.
	      if ((data = product || manufacturer || os) &&
	          (product || manufacturer || /\b(?:Android|Symbian OS|Tablet OS|webOS)\b/.test(os))) {
	        name = /[a-z]+(?: Hat)?/i.exec(/\bAndroid\b/.test(os) ? os : data) + ' Browser';
	      }
	    }
	    // Detect non-Opera (Presto-based) versions (order is important).
	    if (!version) {
	      version = getVersion([
	        '(?:Cloud9|CriOS|CrMo|Edge|FxiOS|IEMobile|Iron|Opera ?Mini|OPiOS|OPR|Raven|Silk(?!/[\\d.]+$))',
	        'Version',
	        qualify(name),
	        '(?:Firefox|Minefield|NetFront)'
	      ]);
	    }
	    // Detect stubborn layout engines.
	    if ((data =
	          layout == 'iCab' && parseFloat(version) > 3 && 'WebKit' ||
	          /\bOpera\b/.test(name) && (/\bOPR\b/.test(ua) ? 'Blink' : 'Presto') ||
	          /\b(?:Midori|Nook|Safari)\b/i.test(ua) && !/^(?:Trident|EdgeHTML)$/.test(layout) && 'WebKit' ||
	          !layout && /\bMSIE\b/i.test(ua) && (os == 'Mac OS' ? 'Tasman' : 'Trident') ||
	          layout == 'WebKit' && /\bPlayStation\b(?! Vita\b)/i.test(name) && 'NetFront'
	        )) {
	      layout = [data];
	    }
	    // Detect Windows Phone 7 desktop mode.
	    if (name == 'IE' && (data = (/; *(?:XBLWP|ZuneWP)(\d+)/i.exec(ua) || 0)[1])) {
	      name += ' Mobile';
	      os = 'Windows Phone ' + (/\+$/.test(data) ? data : data + '.x');
	      description.unshift('desktop mode');
	    }
	    // Detect Windows Phone 8.x desktop mode.
	    else if (/\bWPDesktop\b/i.test(ua)) {
	      name = 'IE Mobile';
	      os = 'Windows Phone 8.x';
	      description.unshift('desktop mode');
	      version || (version = (/\brv:([\d.]+)/.exec(ua) || 0)[1]);
	    }
	    // Detect IE 11.
	    else if (name != 'IE' && layout == 'Trident' && (data = /\brv:([\d.]+)/.exec(ua))) {
	      if (name) {
	        description.push('identifying as ' + name + (version ? ' ' + version : ''));
	      }
	      name = 'IE';
	      version = data[1];
	    }
	    // Leverage environment features.
	    if (useFeatures) {
	      // Detect server-side environments.
	      // Rhino has a global function while others have a global object.
	      if (isHostType(context, 'global')) {
	        if (java) {
	          data = java.lang.System;
	          arch = data.getProperty('os.arch');
	          os = os || data.getProperty('os.name') + ' ' + data.getProperty('os.version');
	        }
	        if (isModuleScope && isHostType(context, 'system') && (data = [context.system])[0]) {
	          os || (os = data[0].os || null);
	          try {
	            data[1] = context.require('ringo/engine').version;
	            version = data[1].join('.');
	            name = 'RingoJS';
	          } catch(e) {
	            if (data[0].global.system == context.system) {
	              name = 'Narwhal';
	            }
	          }
	        }
	        else if (
	          typeof context.process == 'object' && !context.process.browser &&
	          (data = context.process)
	        ) {
	          name = 'Node.js';
	          arch = data.arch;
	          os = data.platform;
	          version = /[\d.]+/.exec(data.version)[0];
	        }
	        else if (rhino) {
	          name = 'Rhino';
	        }
	      }
	      // Detect Adobe AIR.
	      else if (getClassOf((data = context.runtime)) == airRuntimeClass) {
	        name = 'Adobe AIR';
	        os = data.flash.system.Capabilities.os;
	      }
	      // Detect PhantomJS.
	      else if (getClassOf((data = context.phantom)) == phantomClass) {
	        name = 'PhantomJS';
	        version = (data = data.version || null) && (data.major + '.' + data.minor + '.' + data.patch);
	      }
	      // Detect IE compatibility modes.
	      else if (typeof doc.documentMode == 'number' && (data = /\bTrident\/(\d+)/i.exec(ua))) {
	        // We're in compatibility mode when the Trident version + 4 doesn't
	        // equal the document mode.
	        version = [version, doc.documentMode];
	        if ((data = +data[1] + 4) != version[1]) {
	          description.push('IE ' + version[1] + ' mode');
	          layout && (layout[1] = '');
	          version[1] = data;
	        }
	        version = name == 'IE' ? String(version[1].toFixed(1)) : version[0];
	      }
	      os = os && format(os);
	    }
	    // Detect prerelease phases.
	    if (version && (data =
	          /(?:[ab]|dp|pre|[ab]\d+pre)(?:\d+\+?)?$/i.exec(version) ||
	          /(?:alpha|beta)(?: ?\d)?/i.exec(ua + ';' + (useFeatures && nav.appMinorVersion)) ||
	          /\bMinefield\b/i.test(ua) && 'a'
	        )) {
	      prerelease = /b/i.test(data) ? 'beta' : 'alpha';
	      version = version.replace(RegExp(data + '\\+?$'), '') +
	        (prerelease == 'beta' ? beta : alpha) + (/\d+\+?/.exec(data) || '');
	    }
	    // Detect Firefox Mobile.
	    if (name == 'Fennec' || name == 'Firefox' && /\b(?:Android|Firefox OS)\b/.test(os)) {
	      name = 'Firefox Mobile';
	    }
	    // Obscure Maxthon's unreliable version.
	    else if (name == 'Maxthon' && version) {
	      version = version.replace(/\.[\d.]+/, '.x');
	    }
	    // Detect Xbox 360 and Xbox One.
	    else if (/\bXbox\b/i.test(product)) {
	      os = null;
	      if (product == 'Xbox 360' && /\bIEMobile\b/.test(ua)) {
	        description.unshift('mobile mode');
	      }
	    }
	    // Add mobile postfix.
	    else if ((/^(?:Chrome|IE|Opera)$/.test(name) || name && !product && !/Browser|Mobi/.test(name)) &&
	        (os == 'Windows CE' || /Mobi/i.test(ua))) {
	      name += ' Mobile';
	    }
	    // Detect IE platform preview.
	    else if (name == 'IE' && useFeatures && context.external === null) {
	      description.unshift('platform preview');
	    }
	    // Detect BlackBerry OS version.
	    // http://docs.blackberry.com/en/developers/deliverables/18169/HTTP_headers_sent_by_BB_Browser_1234911_11.jsp
	    else if ((/\bBlackBerry\b/.test(product) || /\bBB10\b/.test(ua)) && (data =
	          (RegExp(product.replace(/ +/g, ' *') + '/([.\\d]+)', 'i').exec(ua) || 0)[1] ||
	          version
	        )) {
	      data = [data, /BB10/.test(ua)];
	      os = (data[1] ? (product = null, manufacturer = 'BlackBerry') : 'Device Software') + ' ' + data[0];
	      version = null;
	    }
	    // Detect Opera identifying/masking itself as another browser.
	    // http://www.opera.com/support/kb/view/843/
	    else if (this != forOwn && product != 'Wii' && (
	          (useFeatures && opera) ||
	          (/Opera/.test(name) && /\b(?:MSIE|Firefox)\b/i.test(ua)) ||
	          (name == 'Firefox' && /\bOS X (?:\d+\.){2,}/.test(os)) ||
	          (name == 'IE' && (
	            (os && !/^Win/.test(os) && version > 5.5) ||
	            /\bWindows XP\b/.test(os) && version > 8 ||
	            version == 8 && !/\bTrident\b/.test(ua)
	          ))
	        ) && !reOpera.test((data = parse.call(forOwn, ua.replace(reOpera, '') + ';'))) && data.name) {
	      // When "identifying", the UA contains both Opera and the other browser's name.
	      data = 'ing as ' + data.name + ((data = data.version) ? ' ' + data : '');
	      if (reOpera.test(name)) {
	        if (/\bIE\b/.test(data) && os == 'Mac OS') {
	          os = null;
	        }
	        data = 'identify' + data;
	      }
	      // When "masking", the UA contains only the other browser's name.
	      else {
	        data = 'mask' + data;
	        if (operaClass) {
	          name = format(operaClass.replace(/([a-z])([A-Z])/g, '$1 $2'));
	        } else {
	          name = 'Opera';
	        }
	        if (/\bIE\b/.test(data)) {
	          os = null;
	        }
	        if (!useFeatures) {
	          version = null;
	        }
	      }
	      layout = ['Presto'];
	      description.push(data);
	    }
	    // Detect WebKit Nightly and approximate Chrome/Safari versions.
	    if ((data = (/\bAppleWebKit\/([\d.]+\+?)/i.exec(ua) || 0)[1])) {
	      // Correct build number for numeric comparison.
	      // (e.g. "532.5" becomes "532.05")
	      data = [parseFloat(data.replace(/\.(\d)$/, '.0$1')), data];
	      // Nightly builds are postfixed with a "+".
	      if (name == 'Safari' && data[1].slice(-1) == '+') {
	        name = 'WebKit Nightly';
	        prerelease = 'alpha';
	        version = data[1].slice(0, -1);
	      }
	      // Clear incorrect browser versions.
	      else if (version == data[1] ||
	          version == (data[2] = (/\bSafari\/([\d.]+\+?)/i.exec(ua) || 0)[1])) {
	        version = null;
	      }
	      // Use the full Chrome version when available.
	      data[1] = (/\bChrome\/([\d.]+)/i.exec(ua) || 0)[1];
	      // Detect Blink layout engine.
	      if (data[0] == 537.36 && data[2] == 537.36 && parseFloat(data[1]) >= 28 && layout == 'WebKit') {
	        layout = ['Blink'];
	      }
	      // Detect JavaScriptCore.
	      // http://stackoverflow.com/questions/6768474/how-can-i-detect-which-javascript-engine-v8-or-jsc-is-used-at-runtime-in-androi
	      if (!useFeatures || (!likeChrome && !data[1])) {
	        layout && (layout[1] = 'like Safari');
	        data = (data = data[0], data < 400 ? 1 : data < 500 ? 2 : data < 526 ? 3 : data < 533 ? 4 : data < 534 ? '4+' : data < 535 ? 5 : data < 537 ? 6 : data < 538 ? 7 : data < 601 ? 8 : '8');
	      } else {
	        layout && (layout[1] = 'like Chrome');
	        data = data[1] || (data = data[0], data < 530 ? 1 : data < 532 ? 2 : data < 532.05 ? 3 : data < 533 ? 4 : data < 534.03 ? 5 : data < 534.07 ? 6 : data < 534.10 ? 7 : data < 534.13 ? 8 : data < 534.16 ? 9 : data < 534.24 ? 10 : data < 534.30 ? 11 : data < 535.01 ? 12 : data < 535.02 ? '13+' : data < 535.07 ? 15 : data < 535.11 ? 16 : data < 535.19 ? 17 : data < 536.05 ? 18 : data < 536.10 ? 19 : data < 537.01 ? 20 : data < 537.11 ? '21+' : data < 537.13 ? 23 : data < 537.18 ? 24 : data < 537.24 ? 25 : data < 537.36 ? 26 : layout != 'Blink' ? '27' : '28');
	      }
	      // Add the postfix of ".x" or "+" for approximate versions.
	      layout && (layout[1] += ' ' + (data += typeof data == 'number' ? '.x' : /[.+]/.test(data) ? '' : '+'));
	      // Obscure version for some Safari 1-2 releases.
	      if (name == 'Safari' && (!version || parseInt(version) > 45)) {
	        version = data;
	      }
	    }
	    // Detect Opera desktop modes.
	    if (name == 'Opera' &&  (data = /\bzbov|zvav$/.exec(os))) {
	      name += ' ';
	      description.unshift('desktop mode');
	      if (data == 'zvav') {
	        name += 'Mini';
	        version = null;
	      } else {
	        name += 'Mobile';
	      }
	      os = os.replace(RegExp(' *' + data + '$'), '');
	    }
	    // Detect Chrome desktop mode.
	    else if (name == 'Safari' && /\bChrome\b/.exec(layout && layout[1])) {
	      description.unshift('desktop mode');
	      name = 'Chrome Mobile';
	      version = null;

	      if (/\bOS X\b/.test(os)) {
	        manufacturer = 'Apple';
	        os = 'iOS 4.3+';
	      } else {
	        os = null;
	      }
	    }
	    // Strip incorrect OS versions.
	    if (version && version.indexOf((data = /[\d.]+$/.exec(os))) == 0 &&
	        ua.indexOf('/' + data + '-') > -1) {
	      os = trim(os.replace(data, ''));
	    }
	    // Add layout engine.
	    if (layout && !/\b(?:Avant|Nook)\b/.test(name) && (
	        /Browser|Lunascape|Maxthon/.test(name) ||
	        name != 'Safari' && /^iOS/.test(os) && /\bSafari\b/.test(layout[1]) ||
	        /^(?:Adobe|Arora|Breach|Midori|Opera|Phantom|Rekonq|Rock|Sleipnir|Web)/.test(name) && layout[1])) {
	      // Don't add layout details to description if they are falsey.
	      (data = layout[layout.length - 1]) && description.push(data);
	    }
	    // Combine contextual information.
	    if (description.length) {
	      description = ['(' + description.join('; ') + ')'];
	    }
	    // Append manufacturer to description.
	    if (manufacturer && product && product.indexOf(manufacturer) < 0) {
	      description.push('on ' + manufacturer);
	    }
	    // Append product to description.
	    if (product) {
	      description.push((/^on /.test(description[description.length - 1]) ? '' : 'on ') + product);
	    }
	    // Parse the OS into an object.
	    if (os) {
	      data = / ([\d.+]+)$/.exec(os);
	      isSpecialCasedOS = data && os.charAt(os.length - data[0].length - 1) == '/';
	      os = {
	        'architecture': 32,
	        'family': (data && !isSpecialCasedOS) ? os.replace(data[0], '') : os,
	        'version': data ? data[1] : null,
	        'toString': function() {
	          var version = this.version;
	          return this.family + ((version && !isSpecialCasedOS) ? ' ' + version : '') + (this.architecture == 64 ? ' 64-bit' : '');
	        }
	      };
	    }
	    // Add browser/OS architecture.
	    if ((data = /\b(?:AMD|IA|Win|WOW|x86_|x)64\b/i.exec(arch)) && !/\bi686\b/i.test(arch)) {
	      if (os) {
	        os.architecture = 64;
	        os.family = os.family.replace(RegExp(' *' + data), '');
	      }
	      if (
	          name && (/\bWOW64\b/i.test(ua) ||
	          (useFeatures && /\w(?:86|32)$/.test(nav.cpuClass || nav.platform) && !/\bWin64; x64\b/i.test(ua)))
	      ) {
	        description.unshift('32-bit');
	      }
	    }
	    // Chrome 39 and above on OS X is always 64-bit.
	    else if (
	        os && /^OS X/.test(os.family) &&
	        name == 'Chrome' && parseFloat(version) >= 39
	    ) {
	      os.architecture = 64;
	    }

	    ua || (ua = null);

	    /*------------------------------------------------------------------------*/

	    /**
	     * The platform object.
	     *
	     * @name platform
	     * @type Object
	     */
	    var platform = {};

	    /**
	     * The platform description.
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.description = ua;

	    /**
	     * The name of the browser's layout engine.
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.layout = layout && layout[0];

	    /**
	     * The name of the product's manufacturer.
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.manufacturer = manufacturer;

	    /**
	     * The name of the browser/environment.
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.name = name;

	    /**
	     * The alpha/beta release indicator.
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.prerelease = prerelease;

	    /**
	     * The name of the product hosting the browser.
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.product = product;

	    /**
	     * The browser's user agent string.
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.ua = ua;

	    /**
	     * The browser/environment version.
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.version = name && version;

	    /**
	     * The name of the operating system.
	     *
	     * @memberOf platform
	     * @type Object
	     */
	    platform.os = os || {

	      /**
	       * The CPU architecture the OS is built for.
	       *
	       * @memberOf platform.os
	       * @type number|null
	       */
	      'architecture': null,

	      /**
	       * The family of the OS.
	       *
	       * Common values include:
	       * "Windows", "Windows Server 2008 R2 / 7", "Windows Server 2008 / Vista",
	       * "Windows XP", "OS X", "Ubuntu", "Debian", "Fedora", "Red Hat", "SuSE",
	       * "Android", "iOS" and "Windows Phone"
	       *
	       * @memberOf platform.os
	       * @type string|null
	       */
	      'family': null,

	      /**
	       * The version of the OS.
	       *
	       * @memberOf platform.os
	       * @type string|null
	       */
	      'version': null,

	      /**
	       * Returns the OS string.
	       *
	       * @memberOf platform.os
	       * @returns {string} The OS string.
	       */
	      'toString': function() { return 'null'; }
	    };

	    platform.parse = parse;
	    platform.toString = toStringPlatform;

	    if (platform.version) {
	      description.unshift(version);
	    }
	    if (platform.name) {
	      description.unshift(name);
	    }
	    if (os && name && !(os == String(os).split(' ')[0] && (os == name.split(' ')[0] || product))) {
	      description.push(product ? '(' + os + ')' : 'on ' + os);
	    }
	    if (description.length) {
	      platform.description = description.join(' ');
	    }
	    return platform;
	  }

	  /*--------------------------------------------------------------------------*/

	  // Export platform.
	  var platform = parse();

	  // Some AMD build optimizers, like r.js, check for condition patterns like the following:
	  if (true) {
	    // Expose platform on the global object to prevent errors when platform is
	    // loaded by a script tag in the presence of an AMD loader.
	    // See http://requirejs.org/docs/errors.html#mismatch for more details.
	    root.platform = platform;

	    // Define as an anonymous module so platform can be aliased through path mapping.
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return platform;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	  // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
	  else if (freeExports && freeModule) {
	    // Export for CommonJS support.
	    forOwn(platform, function(value, key) {
	      freeExports[key] = value;
	    });
	  }
	  else {
	    // Export to the global object.
	    root.platform = platform;
	  }
	}.call(this));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(44)(module)))

/***/ },
/* 44 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var checkDirective = __webpack_require__(46)
	var dasherize = __webpack_require__(55)

	module.exports = function (options) {
	  if (!options) {
	    throw new Error('csp must be called with arguments. See the documentation.')
	  }

	  var directives = options.directives

	  var directivesExist = Object.prototype.toString.call(directives) === '[object Object]'
	  if (!directivesExist || Object.keys(directives).length === 0) {
	    throw new Error('csp must have at least one directive under the "directives" key. See the documentation.')
	  }

	  Object.keys(directives).forEach(function (directiveKey) {
	    checkDirective(dasherize(directiveKey), directives[directiveKey], options)
	  })
	}


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var config = __webpack_require__(47)
	var checkers = {
	  sourceList: __webpack_require__(48),
	  pluginTypes: __webpack_require__(49),
	  sandbox: __webpack_require__(50),
	  reportUri: __webpack_require__(51),
	  boolean: __webpack_require__(53)
	}

	module.exports = function (key, value, options) {
	  if (options.loose) { return }

	  if (!config.directives.hasOwnProperty(key)) {
	    throw new Error('"' + key + '" is an invalid directive. See the documentation for the supported list. Force this by enabling loose mode.')
	  }

	  var directiveType = config.directives[key].type
	  checkers[directiveType](key, value, options)
	}


/***/ },
/* 47 */
/***/ function(module, exports) {

	module.exports = {
		"directives": {
			"base-uri": {
				"type": "sourceList"
			},
			"block-all-mixed-content": {
				"type": "boolean"
			},
			"child-src": {
				"type": "sourceList"
			},
			"connect-src": {
				"type": "sourceList"
			},
			"default-src": {
				"type": "sourceList"
			},
			"font-src": {
				"type": "sourceList"
			},
			"form-action": {
				"type": "sourceList"
			},
			"frame-ancestors": {
				"type": "sourceList"
			},
			"frame-src": {
				"type": "sourceList"
			},
			"img-src": {
				"type": "sourceList"
			},
			"manifest-src": {
				"type": "sourceList"
			},
			"media-src": {
				"type": "sourceList"
			},
			"object-src": {
				"type": "sourceList"
			},
			"script-src": {
				"type": "sourceList",
				"hasUnsafes": true
			},
			"style-src": {
				"type": "sourceList",
				"hasUnsafes": true
			},
			"plugin-types": {
				"type": "pluginTypes"
			},
			"sandbox": {
				"type": "sandbox"
			},
			"report-uri": {
				"type": "reportUri"
			},
			"upgrade-insecure-requests": {
				"type": "boolean"
			},
			"worker-src": {
				"type": "sourceList",
				"hasUnsafes": true
			}
		},
		"allHeaders": [
			"Content-Security-Policy",
			"X-Content-Security-Policy",
			"X-WebKit-CSP"
		],
		"mustQuote": [
			"none",
			"self",
			"unsafe-inline",
			"unsafe-eval"
		],
		"unsafes": [
			"'unsafe-inline'",
			"unsafe-inline",
			"'unsafe-eval'",
			"unsafe-eval"
		],
		"sandboxDirectives": [
			"allow-forms",
			"allow-modals",
			"allow-orientation-lock",
			"allow-pointer-lock",
			"allow-popups",
			"allow-popups-to-escape-sandbox",
			"allow-presentation",
			"allow-same-origin",
			"allow-scripts",
			"allow-top-navigation"
		]
	};

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(42)
	var config = __webpack_require__(47)

	module.exports = function sourceListCheck (key, value, options) {
	  var directiveInfo = config.directives[key]

	  if (value === false) { return }

	  if (!Array.isArray(value)) {
	    throw new Error('"' + value + '" is not a valid value for ' + key + '. Use an array of strings.')
	  }

	  if (value.length === 0) {
	    throw new Error(key + ' must have at least one value. To block everything, set ' + key + ' to ["\'none\'"].')
	  }

	  value.forEach(function (sourceExpression) {
	    if (!sourceExpression) {
	      throw new Error('"' + sourceExpression + '" is not a valid source expression. Only non-empty strings are allowed.')
	    }

	    if (isFunction(sourceExpression)) { return }

	    sourceExpression = sourceExpression.valueOf()

	    if ((typeof sourceExpression !== 'string') || (sourceExpression.length === 0)) {
	      throw new Error('"' + sourceExpression + '" is not a valid source expression. Only non-empty strings are allowed.')
	    }

	    if (!directiveInfo.hasUnsafes && (config.unsafes.indexOf(sourceExpression) !== -1)) {
	      throw new Error('"' + sourceExpression + '" does not make sense in ' + key + '. Remove it.')
	    }

	    if (config.mustQuote.indexOf(sourceExpression) !== -1) {
	      throw new Error('"' + sourceExpression + '" must be quoted in ' + key + '. Change it to "\'' + sourceExpression + '\'" in your source list. Force this by enabling loose mode.')
	    }
	  })
	}


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var config = __webpack_require__(47)
	var isFunction = __webpack_require__(42)

	var notAllowed = ['self', "'self'"].concat(config.unsafes)

	module.exports = function pluginTypesCheck (key, value, options) {
	  if (!Array.isArray(value) && (value !== false)) {
	    throw new Error('"' + value + '" is not a valid value for ' + key + '. Use an array of strings.')
	  }

	  if (value.length === 0) {
	    throw new Error(key + ' must have at least one value. To block everything, set ' + key + ' to ["\'none\'"].')
	  }

	  value.forEach(function (pluginType) {
	    if (!pluginType) {
	      throw new Error('"' + pluginType + '" is not a valid plugin type. Only non-empty strings are allowed.')
	    }

	    if (isFunction(pluginType)) { return }

	    pluginType = pluginType.valueOf()

	    if ((typeof pluginType !== 'string') || (pluginType.length === 0)) {
	      throw new Error('"' + pluginType + '" is not a valid plugin type. Only non-empty strings are allowed.')
	    }

	    if (notAllowed.indexOf(pluginType) !== -1) {
	      throw new Error('"' + pluginType + '" does not make sense in ' + key + '. Remove it.')
	    }

	    if (config.mustQuote.indexOf(pluginType) !== -1) {
	      throw new Error('"' + pluginType + '" must be quoted in ' + key + '. Change it to "\'' + pluginType + '\'" in your source list. Force this by enabling loose mode.')
	    }
	  })
	}


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(42)
	var config = __webpack_require__(47)

	module.exports = function sandboxCheck (key, value, options) {
	  if (value === false) { return }
	  if (value === true) { return }

	  if (!Array.isArray(value)) {
	    throw new Error('"' + value + '" is not a valid value for ' + key + '. Use an array of strings or `true`.')
	  }

	  if (value.length === 0) {
	    throw new Error(key + ' must have at least one value. To block everything, set ' + key + ' to `true`.')
	  }

	  value.forEach(function (expression) {
	    if (isFunction(expression)) { return }

	    if (config.sandboxDirectives.indexOf(expression) === -1) {
	      throw new Error('"' + expression + '" is not a valid ' + key + ' directive. Remove it.')
	    }
	  })
	}


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(42)
	var isString = __webpack_require__(52)

	module.exports = function (key, value) {
	  if (value === false) { return }
	  if (isFunction(value)) { return }

	  if (!isString(value) || (value.length === 0)) {
	    throw new Error('"' + value + '" is not a valid value for ' + key + '. Use a non-empty string.')
	  }
	}


/***/ },
/* 52 */
/***/ function(module, exports) {

	module.exports = function isString (value) {
	  return Object.prototype.toString.call(value) === '[object String]'
	}


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var isBoolean = __webpack_require__(54)

	module.exports = function (key, value) {
	  if (!isBoolean(value)) {
	    throw new Error('"' + value + '" is not a valid value for ' + key + '. Use `true` or `false`.')
	  }
	}


/***/ },
/* 54 */
/***/ function(module, exports) {

	module.exports = function isBoolean (value) {
	  return Object.prototype.toString.call(value) === '[object Boolean]'
	}


/***/ },
/* 55 */
/***/ function(module, exports) {

	'use strict';

	var isArray = Array.isArray || function (obj) {
	  return Object.prototype.toString.call(obj) === '[object Array]';
	};

	var isDate = function (obj) {
	  return Object.prototype.toString.call(obj) === '[object Date]';
	};

	var isRegex = function (obj) {
	  return Object.prototype.toString.call(obj) === '[object RegExp]';
	};

	var has = Object.prototype.hasOwnProperty;
	var objectKeys = Object.keys || function (obj) {
	  var keys = [];
	  for (var key in obj) {
	    if (has.call(obj, key)) {
	      keys.push(key);
	    }
	  }
	  return keys;
	};

	function dashCase(str) {
	  return str.replace(/[A-Z](?:(?=[^A-Z])|[A-Z]*(?=[A-Z][^A-Z]|$))/g, function (s, i) {
	    return (i > 0 ? '-' : '') + s.toLowerCase();
	  });
	}

	function map(xs, f) {
	  if (xs.map) {
	    return xs.map(f);
	  }
	  var res = [];
	  for (var i = 0; i < xs.length; i++) {
	    res.push(f(xs[i], i));
	  }
	  return res;
	}

	function reduce(xs, f, acc) {
	  if (xs.reduce) {
	    return xs.reduce(f, acc);
	  }
	  for (var i = 0; i < xs.length; i++) {
	    acc = f(acc, xs[i], i);
	  }
	  return acc;
	}

	function walk(obj) {
	  if (!obj || typeof obj !== 'object') {
	    return obj;
	  }
	  if (isDate(obj) || isRegex(obj)) {
	    return obj;
	  }
	  if (isArray(obj)) {
	    return map(obj, walk);
	  }
	  return reduce(objectKeys(obj), function (acc, key) {
	    var camel = dashCase(key);
	    acc[camel] = walk(obj[key]);
	    return acc;
	  }, {});
	}

	module.exports = function (obj) {
	  if (typeof obj === 'string') {
	    return dashCase(obj);
	  }
	  return walk(obj);
	};


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(42)

	module.exports = function containsFunction (obj) {
	  for (var key in obj) {
	    if (!obj.hasOwnProperty(key)) { continue }

	    var value = obj[key]

	    if (!Array.isArray(value)) {
	      value = [value]
	    }

	    if (value.some(isFunction)) {
	      return true
	    }
	  }

	  return false
	}


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var config = __webpack_require__(47)

	function goodBrowser () {
	  return ['Content-Security-Policy']
	}

	var handlers = {
	  'Android Browser': function (browser, options) {
	    if (parseFloat(browser.os.version) < 4.4 || options.disableAndroid) {
	      return []
	    } else {
	      return ['Content-Security-Policy']
	    }
	  },

	  Chrome: function (browser) {
	    var version = parseFloat(browser.version)

	    if (version >= 14 && version < 25) {
	      return ['X-WebKit-CSP']
	    } else if (version >= 25) {
	      return ['Content-Security-Policy']
	    } else {
	      return []
	    }
	  },

	  'Chrome Mobile': function (browser) {
	    if (browser.os.family === 'iOS') {
	      return ['Content-Security-Policy']
	    } else {
	      return handlers['Android Browser'].apply(this, arguments)
	    }
	  },

	  Firefox: function (browser) {
	    var version = parseFloat(browser.version)

	    if (version >= 23) {
	      return ['Content-Security-Policy']
	    } else if (version >= 4 && version < 23) {
	      return ['X-Content-Security-Policy']
	    } else {
	      return []
	    }
	  },

	  'Firefox Mobile': function (browser) {
	    // Handles both Firefox for Android and Firefox OS
	    var family = browser.os.family
	    var version = parseFloat(browser.version)

	    if (family === 'Firefox OS') {
	      if (version >= 32) {
	        return ['Content-Security-Policy']
	      } else {
	        return ['X-Content-Security-Policy']
	      }
	    } else if (family === 'Android') {
	      if (version >= 25) {
	        return ['Content-Security-Policy']
	      } else {
	        return ['X-Content-Security-Policy']
	      }
	    }

	    return []
	  },

	  'Firefox for iOS': goodBrowser,

	  IE: function (browser) {
	    var version = parseFloat(browser.version)
	    var header = version < 12 ? 'X-Content-Security-Policy' : 'Content-Security-Policy'

	    return [header]
	  },

	  'Microsoft Edge': goodBrowser,

	  'Microsoft Edge Mobile': goodBrowser,

	  Opera: function (browser) {
	    if (parseFloat(browser.version) >= 15) {
	      return ['Content-Security-Policy']
	    } else {
	      return []
	    }
	  },

	  Safari: function (browser) {
	    var version = parseFloat(browser.version)

	    if (version >= 7) {
	      return ['Content-Security-Policy']
	    } else if (version >= 6) {
	      return ['X-WebKit-CSP']
	    } else {
	      return []
	    }
	  }
	}

	handlers['IE Mobile'] = handlers.IE

	module.exports = function getHeaderKeysForBrowser (browser, options) {
	  var handler = handlers[browser.name]

	  if (handler) {
	    return handler(browser, options)
	  } else {
	    return config.allHeaders
	  }
	}


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var reduce = __webpack_require__(59)

	function createFirefoxPreCSP10Directives (directives, basePolicy) {
	  return reduce(directives, function (result, value, key) {
	    if (key === 'connectSrc') {
	      result.xhrSrc = value
	    } else {
	      result[key] = value
	    }

	    if (key === 'scriptSrc') {
	      var optionsValues = []

	      if (value.indexOf("'unsafe-inline'") !== -1) {
	        optionsValues.push('inline-script')
	      }
	      if (value.indexOf("'unsafe-eval'") !== -1) {
	        optionsValues.push('eval-script')
	      }

	      if (optionsValues.length !== 0) {
	        result.options = optionsValues
	      }
	    }

	    return result
	  }, basePolicy)
	}

	var handlers = {
	  Firefox: function (browser, directives) {
	    var version = parseFloat(browser.version)

	    if (version >= 4 && version < 23) {
	      var basePolicy = {}
	      if (version < 5) {
	        basePolicy.allow = ['*']

	        if (directives.defaultSrc) {
	          basePolicy.allow = directives.defaultSrc
	          delete directives.defaultSrc
	        }
	      } else {
	        basePolicy.defaultSrc = ['*']
	      }

	      return createFirefoxPreCSP10Directives(directives, basePolicy)
	    } else {
	      return directives
	    }
	  },

	  'Firefox Mobile': function (browser, directives) {
	    // Handles both Firefox for Android and Firefox OS
	    var family = browser.os.family
	    var version = parseFloat(browser.version)

	    if ((family === 'Firefox OS' && version < 32) || (family === 'Android' && version < 25)) {
	      return createFirefoxPreCSP10Directives(directives, { defaultSrc: ['*'] })
	    } else {
	      return directives
	    }
	  }
	}

	module.exports = function transformDirectivesForBrowser (browser, directives) {
	  var handler = handlers[browser.name]

	  if (handler) {
	    return handler(browser, directives)
	  } else {
	    return directives
	  }
	}


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/**
	 * lodash (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
	 * Released under MIT license <https://lodash.com/license>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 */

	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE = 200;

	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';

	/** Used to compose bitmasks for comparison styles. */
	var UNORDERED_COMPARE_FLAG = 1,
	    PARTIAL_COMPARE_FLAG = 2;

	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0,
	    MAX_SAFE_INTEGER = 9007199254740991;

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    objectTag = '[object Object]',
	    promiseTag = '[object Promise]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    symbolTag = '[object Symbol]',
	    weakMapTag = '[object WeakMap]';

	var arrayBufferTag = '[object ArrayBuffer]',
	    dataViewTag = '[object DataView]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';

	/** Used to match property names within property paths. */
	var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
	    reIsPlainProp = /^\w*$/,
	    reLeadingDot = /^\./,
	    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

	/**
	 * Used to match `RegExp`
	 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
	 */
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

	/** Used to match backslashes in property paths. */
	var reEscapeChar = /\\(\\)?/g;

	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/** Used to detect unsigned integer values. */
	var reIsUint = /^(?:0|[1-9]\d*)$/;

	/** Used to identify `toStringTag` values of typed arrays. */
	var typedArrayTags = {};
	typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	typedArrayTags[uint32Tag] = true;
	typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
	typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
	typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
	typedArrayTags[errorTag] = typedArrayTags[funcTag] =
	typedArrayTags[mapTag] = typedArrayTags[numberTag] =
	typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
	typedArrayTags[setTag] = typedArrayTags[stringTag] =
	typedArrayTags[weakMapTag] = false;

	/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || Function('return this')();

	/** Detect free variable `exports`. */
	var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;

	/** Detect free variable `process` from Node.js. */
	var freeProcess = moduleExports && freeGlobal.process;

	/** Used to access faster Node.js helpers. */
	var nodeUtil = (function() {
	  try {
	    return freeProcess && freeProcess.binding('util');
	  } catch (e) {}
	}());

	/* Node.js helper references. */
	var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

	/**
	 * A specialized version of `_.reduce` for arrays without support for
	 * iteratee shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {*} [accumulator] The initial value.
	 * @param {boolean} [initAccum] Specify using the first element of `array` as
	 *  the initial value.
	 * @returns {*} Returns the accumulated value.
	 */
	function arrayReduce(array, iteratee, accumulator, initAccum) {
	  var index = -1,
	      length = array ? array.length : 0;

	  if (initAccum && length) {
	    accumulator = array[++index];
	  }
	  while (++index < length) {
	    accumulator = iteratee(accumulator, array[index], index, array);
	  }
	  return accumulator;
	}

	/**
	 * A specialized version of `_.some` for arrays without support for iteratee
	 * shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {boolean} Returns `true` if any element passes the predicate check,
	 *  else `false`.
	 */
	function arraySome(array, predicate) {
	  var index = -1,
	      length = array ? array.length : 0;

	  while (++index < length) {
	    if (predicate(array[index], index, array)) {
	      return true;
	    }
	  }
	  return false;
	}

	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new accessor function.
	 */
	function baseProperty(key) {
	  return function(object) {
	    return object == null ? undefined : object[key];
	  };
	}

	/**
	 * The base implementation of `_.reduce` and `_.reduceRight`, without support
	 * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
	 *
	 * @private
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {*} accumulator The initial value.
	 * @param {boolean} initAccum Specify using the first or last element of
	 *  `collection` as the initial value.
	 * @param {Function} eachFunc The function to iterate over `collection`.
	 * @returns {*} Returns the accumulated value.
	 */
	function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
	  eachFunc(collection, function(value, index, collection) {
	    accumulator = initAccum
	      ? (initAccum = false, value)
	      : iteratee(accumulator, value, index, collection);
	  });
	  return accumulator;
	}

	/**
	 * The base implementation of `_.times` without support for iteratee shorthands
	 * or max array length checks.
	 *
	 * @private
	 * @param {number} n The number of times to invoke `iteratee`.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the array of results.
	 */
	function baseTimes(n, iteratee) {
	  var index = -1,
	      result = Array(n);

	  while (++index < n) {
	    result[index] = iteratee(index);
	  }
	  return result;
	}

	/**
	 * The base implementation of `_.unary` without support for storing metadata.
	 *
	 * @private
	 * @param {Function} func The function to cap arguments for.
	 * @returns {Function} Returns the new capped function.
	 */
	function baseUnary(func) {
	  return function(value) {
	    return func(value);
	  };
	}

	/**
	 * Gets the value at `key` of `object`.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {string} key The key of the property to get.
	 * @returns {*} Returns the property value.
	 */
	function getValue(object, key) {
	  return object == null ? undefined : object[key];
	}

	/**
	 * Checks if `value` is a host object in IE < 9.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
	 */
	function isHostObject(value) {
	  // Many host objects are `Object` objects that can coerce to strings
	  // despite having improperly defined `toString` methods.
	  var result = false;
	  if (value != null && typeof value.toString != 'function') {
	    try {
	      result = !!(value + '');
	    } catch (e) {}
	  }
	  return result;
	}

	/**
	 * Converts `map` to its key-value pairs.
	 *
	 * @private
	 * @param {Object} map The map to convert.
	 * @returns {Array} Returns the key-value pairs.
	 */
	function mapToArray(map) {
	  var index = -1,
	      result = Array(map.size);

	  map.forEach(function(value, key) {
	    result[++index] = [key, value];
	  });
	  return result;
	}

	/**
	 * Creates a unary function that invokes `func` with its argument transformed.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {Function} transform The argument transform.
	 * @returns {Function} Returns the new function.
	 */
	function overArg(func, transform) {
	  return function(arg) {
	    return func(transform(arg));
	  };
	}

	/**
	 * Converts `set` to an array of its values.
	 *
	 * @private
	 * @param {Object} set The set to convert.
	 * @returns {Array} Returns the values.
	 */
	function setToArray(set) {
	  var index = -1,
	      result = Array(set.size);

	  set.forEach(function(value) {
	    result[++index] = value;
	  });
	  return result;
	}

	/** Used for built-in method references. */
	var arrayProto = Array.prototype,
	    funcProto = Function.prototype,
	    objectProto = Object.prototype;

	/** Used to detect overreaching core-js shims. */
	var coreJsData = root['__core-js_shared__'];

	/** Used to detect methods masquerading as native. */
	var maskSrcKey = (function() {
	  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
	  return uid ? ('Symbol(src)_1.' + uid) : '';
	}());

	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/** Built-in value references. */
	var Symbol = root.Symbol,
	    Uint8Array = root.Uint8Array,
	    propertyIsEnumerable = objectProto.propertyIsEnumerable,
	    splice = arrayProto.splice;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeKeys = overArg(Object.keys, Object);

	/* Built-in method references that are verified to be native. */
	var DataView = getNative(root, 'DataView'),
	    Map = getNative(root, 'Map'),
	    Promise = getNative(root, 'Promise'),
	    Set = getNative(root, 'Set'),
	    WeakMap = getNative(root, 'WeakMap'),
	    nativeCreate = getNative(Object, 'create');

	/** Used to detect maps, sets, and weakmaps. */
	var dataViewCtorString = toSource(DataView),
	    mapCtorString = toSource(Map),
	    promiseCtorString = toSource(Promise),
	    setCtorString = toSource(Set),
	    weakMapCtorString = toSource(WeakMap);

	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : undefined,
	    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined,
	    symbolToString = symbolProto ? symbolProto.toString : undefined;

	/**
	 * Creates a hash object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Hash(entries) {
	  var index = -1,
	      length = entries ? entries.length : 0;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	/**
	 * Removes all key-value entries from the hash.
	 *
	 * @private
	 * @name clear
	 * @memberOf Hash
	 */
	function hashClear() {
	  this.__data__ = nativeCreate ? nativeCreate(null) : {};
	}

	/**
	 * Removes `key` and its value from the hash.
	 *
	 * @private
	 * @name delete
	 * @memberOf Hash
	 * @param {Object} hash The hash to modify.
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function hashDelete(key) {
	  return this.has(key) && delete this.__data__[key];
	}

	/**
	 * Gets the hash value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Hash
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function hashGet(key) {
	  var data = this.__data__;
	  if (nativeCreate) {
	    var result = data[key];
	    return result === HASH_UNDEFINED ? undefined : result;
	  }
	  return hasOwnProperty.call(data, key) ? data[key] : undefined;
	}

	/**
	 * Checks if a hash value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Hash
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function hashHas(key) {
	  var data = this.__data__;
	  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
	}

	/**
	 * Sets the hash `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Hash
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the hash instance.
	 */
	function hashSet(key, value) {
	  var data = this.__data__;
	  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
	  return this;
	}

	// Add methods to `Hash`.
	Hash.prototype.clear = hashClear;
	Hash.prototype['delete'] = hashDelete;
	Hash.prototype.get = hashGet;
	Hash.prototype.has = hashHas;
	Hash.prototype.set = hashSet;

	/**
	 * Creates an list cache object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function ListCache(entries) {
	  var index = -1,
	      length = entries ? entries.length : 0;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	/**
	 * Removes all key-value entries from the list cache.
	 *
	 * @private
	 * @name clear
	 * @memberOf ListCache
	 */
	function listCacheClear() {
	  this.__data__ = [];
	}

	/**
	 * Removes `key` and its value from the list cache.
	 *
	 * @private
	 * @name delete
	 * @memberOf ListCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function listCacheDelete(key) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);

	  if (index < 0) {
	    return false;
	  }
	  var lastIndex = data.length - 1;
	  if (index == lastIndex) {
	    data.pop();
	  } else {
	    splice.call(data, index, 1);
	  }
	  return true;
	}

	/**
	 * Gets the list cache value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf ListCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function listCacheGet(key) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);

	  return index < 0 ? undefined : data[index][1];
	}

	/**
	 * Checks if a list cache value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf ListCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function listCacheHas(key) {
	  return assocIndexOf(this.__data__, key) > -1;
	}

	/**
	 * Sets the list cache `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf ListCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the list cache instance.
	 */
	function listCacheSet(key, value) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);

	  if (index < 0) {
	    data.push([key, value]);
	  } else {
	    data[index][1] = value;
	  }
	  return this;
	}

	// Add methods to `ListCache`.
	ListCache.prototype.clear = listCacheClear;
	ListCache.prototype['delete'] = listCacheDelete;
	ListCache.prototype.get = listCacheGet;
	ListCache.prototype.has = listCacheHas;
	ListCache.prototype.set = listCacheSet;

	/**
	 * Creates a map cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function MapCache(entries) {
	  var index = -1,
	      length = entries ? entries.length : 0;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	/**
	 * Removes all key-value entries from the map.
	 *
	 * @private
	 * @name clear
	 * @memberOf MapCache
	 */
	function mapCacheClear() {
	  this.__data__ = {
	    'hash': new Hash,
	    'map': new (Map || ListCache),
	    'string': new Hash
	  };
	}

	/**
	 * Removes `key` and its value from the map.
	 *
	 * @private
	 * @name delete
	 * @memberOf MapCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function mapCacheDelete(key) {
	  return getMapData(this, key)['delete'](key);
	}

	/**
	 * Gets the map value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf MapCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function mapCacheGet(key) {
	  return getMapData(this, key).get(key);
	}

	/**
	 * Checks if a map value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf MapCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function mapCacheHas(key) {
	  return getMapData(this, key).has(key);
	}

	/**
	 * Sets the map `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf MapCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the map cache instance.
	 */
	function mapCacheSet(key, value) {
	  getMapData(this, key).set(key, value);
	  return this;
	}

	// Add methods to `MapCache`.
	MapCache.prototype.clear = mapCacheClear;
	MapCache.prototype['delete'] = mapCacheDelete;
	MapCache.prototype.get = mapCacheGet;
	MapCache.prototype.has = mapCacheHas;
	MapCache.prototype.set = mapCacheSet;

	/**
	 *
	 * Creates an array cache object to store unique values.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [values] The values to cache.
	 */
	function SetCache(values) {
	  var index = -1,
	      length = values ? values.length : 0;

	  this.__data__ = new MapCache;
	  while (++index < length) {
	    this.add(values[index]);
	  }
	}

	/**
	 * Adds `value` to the array cache.
	 *
	 * @private
	 * @name add
	 * @memberOf SetCache
	 * @alias push
	 * @param {*} value The value to cache.
	 * @returns {Object} Returns the cache instance.
	 */
	function setCacheAdd(value) {
	  this.__data__.set(value, HASH_UNDEFINED);
	  return this;
	}

	/**
	 * Checks if `value` is in the array cache.
	 *
	 * @private
	 * @name has
	 * @memberOf SetCache
	 * @param {*} value The value to search for.
	 * @returns {number} Returns `true` if `value` is found, else `false`.
	 */
	function setCacheHas(value) {
	  return this.__data__.has(value);
	}

	// Add methods to `SetCache`.
	SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
	SetCache.prototype.has = setCacheHas;

	/**
	 * Creates a stack cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Stack(entries) {
	  this.__data__ = new ListCache(entries);
	}

	/**
	 * Removes all key-value entries from the stack.
	 *
	 * @private
	 * @name clear
	 * @memberOf Stack
	 */
	function stackClear() {
	  this.__data__ = new ListCache;
	}

	/**
	 * Removes `key` and its value from the stack.
	 *
	 * @private
	 * @name delete
	 * @memberOf Stack
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function stackDelete(key) {
	  return this.__data__['delete'](key);
	}

	/**
	 * Gets the stack value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Stack
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function stackGet(key) {
	  return this.__data__.get(key);
	}

	/**
	 * Checks if a stack value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Stack
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function stackHas(key) {
	  return this.__data__.has(key);
	}

	/**
	 * Sets the stack `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Stack
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the stack cache instance.
	 */
	function stackSet(key, value) {
	  var cache = this.__data__;
	  if (cache instanceof ListCache) {
	    var pairs = cache.__data__;
	    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
	      pairs.push([key, value]);
	      return this;
	    }
	    cache = this.__data__ = new MapCache(pairs);
	  }
	  cache.set(key, value);
	  return this;
	}

	// Add methods to `Stack`.
	Stack.prototype.clear = stackClear;
	Stack.prototype['delete'] = stackDelete;
	Stack.prototype.get = stackGet;
	Stack.prototype.has = stackHas;
	Stack.prototype.set = stackSet;

	/**
	 * Creates an array of the enumerable property names of the array-like `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @param {boolean} inherited Specify returning inherited property names.
	 * @returns {Array} Returns the array of property names.
	 */
	function arrayLikeKeys(value, inherited) {
	  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
	  // Safari 9 makes `arguments.length` enumerable in strict mode.
	  var result = (isArray(value) || isArguments(value))
	    ? baseTimes(value.length, String)
	    : [];

	  var length = result.length,
	      skipIndexes = !!length;

	  for (var key in value) {
	    if ((inherited || hasOwnProperty.call(value, key)) &&
	        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	/**
	 * Gets the index at which the `key` is found in `array` of key-value pairs.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} key The key to search for.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function assocIndexOf(array, key) {
	  var length = array.length;
	  while (length--) {
	    if (eq(array[length][0], key)) {
	      return length;
	    }
	  }
	  return -1;
	}

	/**
	 * The base implementation of `_.forEach` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array|Object} Returns `collection`.
	 */
	var baseEach = createBaseEach(baseForOwn);

	/**
	 * The base implementation of `baseForOwn` which iterates over `object`
	 * properties returned by `keysFunc` and invokes `iteratee` for each property.
	 * Iteratee functions may exit iteration early by explicitly returning `false`.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @returns {Object} Returns `object`.
	 */
	var baseFor = createBaseFor();

	/**
	 * The base implementation of `_.forOwn` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Object} Returns `object`.
	 */
	function baseForOwn(object, iteratee) {
	  return object && baseFor(object, iteratee, keys);
	}

	/**
	 * The base implementation of `_.get` without support for default values.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path of the property to get.
	 * @returns {*} Returns the resolved value.
	 */
	function baseGet(object, path) {
	  path = isKey(path, object) ? [path] : castPath(path);

	  var index = 0,
	      length = path.length;

	  while (object != null && index < length) {
	    object = object[toKey(path[index++])];
	  }
	  return (index && index == length) ? object : undefined;
	}

	/**
	 * The base implementation of `getTag`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	function baseGetTag(value) {
	  return objectToString.call(value);
	}

	/**
	 * The base implementation of `_.hasIn` without support for deep paths.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {Array|string} key The key to check.
	 * @returns {boolean} Returns `true` if `key` exists, else `false`.
	 */
	function baseHasIn(object, key) {
	  return object != null && key in Object(object);
	}

	/**
	 * The base implementation of `_.isEqual` which supports partial comparisons
	 * and tracks traversed objects.
	 *
	 * @private
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @param {Function} [customizer] The function to customize comparisons.
	 * @param {boolean} [bitmask] The bitmask of comparison flags.
	 *  The bitmask may be composed of the following flags:
	 *     1 - Unordered comparison
	 *     2 - Partial comparison
	 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 */
	function baseIsEqual(value, other, customizer, bitmask, stack) {
	  if (value === other) {
	    return true;
	  }
	  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
	    return value !== value && other !== other;
	  }
	  return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
	}

	/**
	 * A specialized version of `baseIsEqual` for arrays and objects which performs
	 * deep comparisons and tracks traversed objects enabling objects with circular
	 * references to be compared.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparisons.
	 * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual`
	 *  for more details.
	 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
	  var objIsArr = isArray(object),
	      othIsArr = isArray(other),
	      objTag = arrayTag,
	      othTag = arrayTag;

	  if (!objIsArr) {
	    objTag = getTag(object);
	    objTag = objTag == argsTag ? objectTag : objTag;
	  }
	  if (!othIsArr) {
	    othTag = getTag(other);
	    othTag = othTag == argsTag ? objectTag : othTag;
	  }
	  var objIsObj = objTag == objectTag && !isHostObject(object),
	      othIsObj = othTag == objectTag && !isHostObject(other),
	      isSameTag = objTag == othTag;

	  if (isSameTag && !objIsObj) {
	    stack || (stack = new Stack);
	    return (objIsArr || isTypedArray(object))
	      ? equalArrays(object, other, equalFunc, customizer, bitmask, stack)
	      : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
	  }
	  if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
	    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
	        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

	    if (objIsWrapped || othIsWrapped) {
	      var objUnwrapped = objIsWrapped ? object.value() : object,
	          othUnwrapped = othIsWrapped ? other.value() : other;

	      stack || (stack = new Stack);
	      return equalFunc(objUnwrapped, othUnwrapped, customizer, bitmask, stack);
	    }
	  }
	  if (!isSameTag) {
	    return false;
	  }
	  stack || (stack = new Stack);
	  return equalObjects(object, other, equalFunc, customizer, bitmask, stack);
	}

	/**
	 * The base implementation of `_.isMatch` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Object} object The object to inspect.
	 * @param {Object} source The object of property values to match.
	 * @param {Array} matchData The property names, values, and compare flags to match.
	 * @param {Function} [customizer] The function to customize comparisons.
	 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
	 */
	function baseIsMatch(object, source, matchData, customizer) {
	  var index = matchData.length,
	      length = index,
	      noCustomizer = !customizer;

	  if (object == null) {
	    return !length;
	  }
	  object = Object(object);
	  while (index--) {
	    var data = matchData[index];
	    if ((noCustomizer && data[2])
	          ? data[1] !== object[data[0]]
	          : !(data[0] in object)
	        ) {
	      return false;
	    }
	  }
	  while (++index < length) {
	    data = matchData[index];
	    var key = data[0],
	        objValue = object[key],
	        srcValue = data[1];

	    if (noCustomizer && data[2]) {
	      if (objValue === undefined && !(key in object)) {
	        return false;
	      }
	    } else {
	      var stack = new Stack;
	      if (customizer) {
	        var result = customizer(objValue, srcValue, key, object, source, stack);
	      }
	      if (!(result === undefined
	            ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack)
	            : result
	          )) {
	        return false;
	      }
	    }
	  }
	  return true;
	}

	/**
	 * The base implementation of `_.isNative` without bad shim checks.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function,
	 *  else `false`.
	 */
	function baseIsNative(value) {
	  if (!isObject(value) || isMasked(value)) {
	    return false;
	  }
	  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
	  return pattern.test(toSource(value));
	}

	/**
	 * The base implementation of `_.isTypedArray` without Node.js optimizations.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	 */
	function baseIsTypedArray(value) {
	  return isObjectLike(value) &&
	    isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
	}

	/**
	 * The base implementation of `_.iteratee`.
	 *
	 * @private
	 * @param {*} [value=_.identity] The value to convert to an iteratee.
	 * @returns {Function} Returns the iteratee.
	 */
	function baseIteratee(value) {
	  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
	  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
	  if (typeof value == 'function') {
	    return value;
	  }
	  if (value == null) {
	    return identity;
	  }
	  if (typeof value == 'object') {
	    return isArray(value)
	      ? baseMatchesProperty(value[0], value[1])
	      : baseMatches(value);
	  }
	  return property(value);
	}

	/**
	 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeys(object) {
	  if (!isPrototype(object)) {
	    return nativeKeys(object);
	  }
	  var result = [];
	  for (var key in Object(object)) {
	    if (hasOwnProperty.call(object, key) && key != 'constructor') {
	      result.push(key);
	    }
	  }
	  return result;
	}

	/**
	 * The base implementation of `_.matches` which doesn't clone `source`.
	 *
	 * @private
	 * @param {Object} source The object of property values to match.
	 * @returns {Function} Returns the new spec function.
	 */
	function baseMatches(source) {
	  var matchData = getMatchData(source);
	  if (matchData.length == 1 && matchData[0][2]) {
	    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
	  }
	  return function(object) {
	    return object === source || baseIsMatch(object, source, matchData);
	  };
	}

	/**
	 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
	 *
	 * @private
	 * @param {string} path The path of the property to get.
	 * @param {*} srcValue The value to match.
	 * @returns {Function} Returns the new spec function.
	 */
	function baseMatchesProperty(path, srcValue) {
	  if (isKey(path) && isStrictComparable(srcValue)) {
	    return matchesStrictComparable(toKey(path), srcValue);
	  }
	  return function(object) {
	    var objValue = get(object, path);
	    return (objValue === undefined && objValue === srcValue)
	      ? hasIn(object, path)
	      : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
	  };
	}

	/**
	 * A specialized version of `baseProperty` which supports deep paths.
	 *
	 * @private
	 * @param {Array|string} path The path of the property to get.
	 * @returns {Function} Returns the new accessor function.
	 */
	function basePropertyDeep(path) {
	  return function(object) {
	    return baseGet(object, path);
	  };
	}

	/**
	 * The base implementation of `_.toString` which doesn't convert nullish
	 * values to empty strings.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	function baseToString(value) {
	  // Exit early for strings to avoid a performance hit in some environments.
	  if (typeof value == 'string') {
	    return value;
	  }
	  if (isSymbol(value)) {
	    return symbolToString ? symbolToString.call(value) : '';
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
	}

	/**
	 * Casts `value` to a path array if it's not one.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @returns {Array} Returns the cast property path array.
	 */
	function castPath(value) {
	  return isArray(value) ? value : stringToPath(value);
	}

	/**
	 * Creates a `baseEach` or `baseEachRight` function.
	 *
	 * @private
	 * @param {Function} eachFunc The function to iterate over a collection.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseEach(eachFunc, fromRight) {
	  return function(collection, iteratee) {
	    if (collection == null) {
	      return collection;
	    }
	    if (!isArrayLike(collection)) {
	      return eachFunc(collection, iteratee);
	    }
	    var length = collection.length,
	        index = fromRight ? length : -1,
	        iterable = Object(collection);

	    while ((fromRight ? index-- : ++index < length)) {
	      if (iteratee(iterable[index], index, iterable) === false) {
	        break;
	      }
	    }
	    return collection;
	  };
	}

	/**
	 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
	 *
	 * @private
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseFor(fromRight) {
	  return function(object, iteratee, keysFunc) {
	    var index = -1,
	        iterable = Object(object),
	        props = keysFunc(object),
	        length = props.length;

	    while (length--) {
	      var key = props[fromRight ? length : ++index];
	      if (iteratee(iterable[key], key, iterable) === false) {
	        break;
	      }
	    }
	    return object;
	  };
	}

	/**
	 * A specialized version of `baseIsEqualDeep` for arrays with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Array} array The array to compare.
	 * @param {Array} other The other array to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} customizer The function to customize comparisons.
	 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
	 *  for more details.
	 * @param {Object} stack Tracks traversed `array` and `other` objects.
	 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
	 */
	function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
	  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
	      arrLength = array.length,
	      othLength = other.length;

	  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
	    return false;
	  }
	  // Assume cyclic values are equal.
	  var stacked = stack.get(array);
	  if (stacked && stack.get(other)) {
	    return stacked == other;
	  }
	  var index = -1,
	      result = true,
	      seen = (bitmask & UNORDERED_COMPARE_FLAG) ? new SetCache : undefined;

	  stack.set(array, other);
	  stack.set(other, array);

	  // Ignore non-index properties.
	  while (++index < arrLength) {
	    var arrValue = array[index],
	        othValue = other[index];

	    if (customizer) {
	      var compared = isPartial
	        ? customizer(othValue, arrValue, index, other, array, stack)
	        : customizer(arrValue, othValue, index, array, other, stack);
	    }
	    if (compared !== undefined) {
	      if (compared) {
	        continue;
	      }
	      result = false;
	      break;
	    }
	    // Recursively compare arrays (susceptible to call stack limits).
	    if (seen) {
	      if (!arraySome(other, function(othValue, othIndex) {
	            if (!seen.has(othIndex) &&
	                (arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
	              return seen.add(othIndex);
	            }
	          })) {
	        result = false;
	        break;
	      }
	    } else if (!(
	          arrValue === othValue ||
	            equalFunc(arrValue, othValue, customizer, bitmask, stack)
	        )) {
	      result = false;
	      break;
	    }
	  }
	  stack['delete'](array);
	  stack['delete'](other);
	  return result;
	}

	/**
	 * A specialized version of `baseIsEqualDeep` for comparing objects of
	 * the same `toStringTag`.
	 *
	 * **Note:** This function only supports comparing values with tags of
	 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {string} tag The `toStringTag` of the objects to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} customizer The function to customize comparisons.
	 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
	 *  for more details.
	 * @param {Object} stack Tracks traversed `object` and `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
	  switch (tag) {
	    case dataViewTag:
	      if ((object.byteLength != other.byteLength) ||
	          (object.byteOffset != other.byteOffset)) {
	        return false;
	      }
	      object = object.buffer;
	      other = other.buffer;

	    case arrayBufferTag:
	      if ((object.byteLength != other.byteLength) ||
	          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
	        return false;
	      }
	      return true;

	    case boolTag:
	    case dateTag:
	    case numberTag:
	      // Coerce booleans to `1` or `0` and dates to milliseconds.
	      // Invalid dates are coerced to `NaN`.
	      return eq(+object, +other);

	    case errorTag:
	      return object.name == other.name && object.message == other.message;

	    case regexpTag:
	    case stringTag:
	      // Coerce regexes to strings and treat strings, primitives and objects,
	      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
	      // for more details.
	      return object == (other + '');

	    case mapTag:
	      var convert = mapToArray;

	    case setTag:
	      var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
	      convert || (convert = setToArray);

	      if (object.size != other.size && !isPartial) {
	        return false;
	      }
	      // Assume cyclic values are equal.
	      var stacked = stack.get(object);
	      if (stacked) {
	        return stacked == other;
	      }
	      bitmask |= UNORDERED_COMPARE_FLAG;

	      // Recursively compare objects (susceptible to call stack limits).
	      stack.set(object, other);
	      var result = equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask, stack);
	      stack['delete'](object);
	      return result;

	    case symbolTag:
	      if (symbolValueOf) {
	        return symbolValueOf.call(object) == symbolValueOf.call(other);
	      }
	  }
	  return false;
	}

	/**
	 * A specialized version of `baseIsEqualDeep` for objects with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} customizer The function to customize comparisons.
	 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
	 *  for more details.
	 * @param {Object} stack Tracks traversed `object` and `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
	  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
	      objProps = keys(object),
	      objLength = objProps.length,
	      othProps = keys(other),
	      othLength = othProps.length;

	  if (objLength != othLength && !isPartial) {
	    return false;
	  }
	  var index = objLength;
	  while (index--) {
	    var key = objProps[index];
	    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
	      return false;
	    }
	  }
	  // Assume cyclic values are equal.
	  var stacked = stack.get(object);
	  if (stacked && stack.get(other)) {
	    return stacked == other;
	  }
	  var result = true;
	  stack.set(object, other);
	  stack.set(other, object);

	  var skipCtor = isPartial;
	  while (++index < objLength) {
	    key = objProps[index];
	    var objValue = object[key],
	        othValue = other[key];

	    if (customizer) {
	      var compared = isPartial
	        ? customizer(othValue, objValue, key, other, object, stack)
	        : customizer(objValue, othValue, key, object, other, stack);
	    }
	    // Recursively compare objects (susceptible to call stack limits).
	    if (!(compared === undefined
	          ? (objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack))
	          : compared
	        )) {
	      result = false;
	      break;
	    }
	    skipCtor || (skipCtor = key == 'constructor');
	  }
	  if (result && !skipCtor) {
	    var objCtor = object.constructor,
	        othCtor = other.constructor;

	    // Non `Object` object instances with different constructors are not equal.
	    if (objCtor != othCtor &&
	        ('constructor' in object && 'constructor' in other) &&
	        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
	          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
	      result = false;
	    }
	  }
	  stack['delete'](object);
	  stack['delete'](other);
	  return result;
	}

	/**
	 * Gets the data for `map`.
	 *
	 * @private
	 * @param {Object} map The map to query.
	 * @param {string} key The reference key.
	 * @returns {*} Returns the map data.
	 */
	function getMapData(map, key) {
	  var data = map.__data__;
	  return isKeyable(key)
	    ? data[typeof key == 'string' ? 'string' : 'hash']
	    : data.map;
	}

	/**
	 * Gets the property names, values, and compare flags of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the match data of `object`.
	 */
	function getMatchData(object) {
	  var result = keys(object),
	      length = result.length;

	  while (length--) {
	    var key = result[length],
	        value = object[key];

	    result[length] = [key, value, isStrictComparable(value)];
	  }
	  return result;
	}

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = getValue(object, key);
	  return baseIsNative(value) ? value : undefined;
	}

	/**
	 * Gets the `toStringTag` of `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	var getTag = baseGetTag;

	// Fallback for data views, maps, sets, and weak maps in IE 11,
	// for data views in Edge < 14, and promises in Node.js.
	if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
	    (Map && getTag(new Map) != mapTag) ||
	    (Promise && getTag(Promise.resolve()) != promiseTag) ||
	    (Set && getTag(new Set) != setTag) ||
	    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
	  getTag = function(value) {
	    var result = objectToString.call(value),
	        Ctor = result == objectTag ? value.constructor : undefined,
	        ctorString = Ctor ? toSource(Ctor) : undefined;

	    if (ctorString) {
	      switch (ctorString) {
	        case dataViewCtorString: return dataViewTag;
	        case mapCtorString: return mapTag;
	        case promiseCtorString: return promiseTag;
	        case setCtorString: return setTag;
	        case weakMapCtorString: return weakMapTag;
	      }
	    }
	    return result;
	  };
	}

	/**
	 * Checks if `path` exists on `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path to check.
	 * @param {Function} hasFunc The function to check properties.
	 * @returns {boolean} Returns `true` if `path` exists, else `false`.
	 */
	function hasPath(object, path, hasFunc) {
	  path = isKey(path, object) ? [path] : castPath(path);

	  var result,
	      index = -1,
	      length = path.length;

	  while (++index < length) {
	    var key = toKey(path[index]);
	    if (!(result = object != null && hasFunc(object, key))) {
	      break;
	    }
	    object = object[key];
	  }
	  if (result) {
	    return result;
	  }
	  var length = object ? object.length : 0;
	  return !!length && isLength(length) && isIndex(key, length) &&
	    (isArray(object) || isArguments(object));
	}

	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return !!length &&
	    (typeof value == 'number' || reIsUint.test(value)) &&
	    (value > -1 && value % 1 == 0 && value < length);
	}

	/**
	 * Checks if `value` is a property name and not a property path.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {Object} [object] The object to query keys on.
	 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
	 */
	function isKey(value, object) {
	  if (isArray(value)) {
	    return false;
	  }
	  var type = typeof value;
	  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
	      value == null || isSymbol(value)) {
	    return true;
	  }
	  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
	    (object != null && value in Object(object));
	}

	/**
	 * Checks if `value` is suitable for use as unique object key.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
	 */
	function isKeyable(value) {
	  var type = typeof value;
	  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
	    ? (value !== '__proto__')
	    : (value === null);
	}

	/**
	 * Checks if `func` has its source masked.
	 *
	 * @private
	 * @param {Function} func The function to check.
	 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
	 */
	function isMasked(func) {
	  return !!maskSrcKey && (maskSrcKey in func);
	}

	/**
	 * Checks if `value` is likely a prototype object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	 */
	function isPrototype(value) {
	  var Ctor = value && value.constructor,
	      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

	  return value === proto;
	}

	/**
	 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` if suitable for strict
	 *  equality comparisons, else `false`.
	 */
	function isStrictComparable(value) {
	  return value === value && !isObject(value);
	}

	/**
	 * A specialized version of `matchesProperty` for source values suitable
	 * for strict equality comparisons, i.e. `===`.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @param {*} srcValue The value to match.
	 * @returns {Function} Returns the new spec function.
	 */
	function matchesStrictComparable(key, srcValue) {
	  return function(object) {
	    if (object == null) {
	      return false;
	    }
	    return object[key] === srcValue &&
	      (srcValue !== undefined || (key in Object(object)));
	  };
	}

	/**
	 * Converts `string` to a property path array.
	 *
	 * @private
	 * @param {string} string The string to convert.
	 * @returns {Array} Returns the property path array.
	 */
	var stringToPath = memoize(function(string) {
	  string = toString(string);

	  var result = [];
	  if (reLeadingDot.test(string)) {
	    result.push('');
	  }
	  string.replace(rePropName, function(match, number, quote, string) {
	    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
	  });
	  return result;
	});

	/**
	 * Converts `value` to a string key if it's not a string or symbol.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @returns {string|symbol} Returns the key.
	 */
	function toKey(value) {
	  if (typeof value == 'string' || isSymbol(value)) {
	    return value;
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
	}

	/**
	 * Converts `func` to its source code.
	 *
	 * @private
	 * @param {Function} func The function to process.
	 * @returns {string} Returns the source code.
	 */
	function toSource(func) {
	  if (func != null) {
	    try {
	      return funcToString.call(func);
	    } catch (e) {}
	    try {
	      return (func + '');
	    } catch (e) {}
	  }
	  return '';
	}

	/**
	 * Reduces `collection` to a value which is the accumulated result of running
	 * each element in `collection` thru `iteratee`, where each successive
	 * invocation is supplied the return value of the previous. If `accumulator`
	 * is not given, the first element of `collection` is used as the initial
	 * value. The iteratee is invoked with four arguments:
	 * (accumulator, value, index|key, collection).
	 *
	 * Many lodash methods are guarded to work as iteratees for methods like
	 * `_.reduce`, `_.reduceRight`, and `_.transform`.
	 *
	 * The guarded methods are:
	 * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
	 * and `sortBy`
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Collection
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	 * @param {*} [accumulator] The initial value.
	 * @returns {*} Returns the accumulated value.
	 * @see _.reduceRight
	 * @example
	 *
	 * _.reduce([1, 2], function(sum, n) {
	 *   return sum + n;
	 * }, 0);
	 * // => 3
	 *
	 * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
	 *   (result[value] || (result[value] = [])).push(key);
	 *   return result;
	 * }, {});
	 * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
	 */
	function reduce(collection, iteratee, accumulator) {
	  var func = isArray(collection) ? arrayReduce : baseReduce,
	      initAccum = arguments.length < 3;

	  return func(collection, baseIteratee(iteratee, 4), accumulator, initAccum, baseEach);
	}

	/**
	 * Creates a function that memoizes the result of `func`. If `resolver` is
	 * provided, it determines the cache key for storing the result based on the
	 * arguments provided to the memoized function. By default, the first argument
	 * provided to the memoized function is used as the map cache key. The `func`
	 * is invoked with the `this` binding of the memoized function.
	 *
	 * **Note:** The cache is exposed as the `cache` property on the memoized
	 * function. Its creation may be customized by replacing the `_.memoize.Cache`
	 * constructor with one whose instances implement the
	 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
	 * method interface of `delete`, `get`, `has`, and `set`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Function
	 * @param {Function} func The function to have its output memoized.
	 * @param {Function} [resolver] The function to resolve the cache key.
	 * @returns {Function} Returns the new memoized function.
	 * @example
	 *
	 * var object = { 'a': 1, 'b': 2 };
	 * var other = { 'c': 3, 'd': 4 };
	 *
	 * var values = _.memoize(_.values);
	 * values(object);
	 * // => [1, 2]
	 *
	 * values(other);
	 * // => [3, 4]
	 *
	 * object.a = 2;
	 * values(object);
	 * // => [1, 2]
	 *
	 * // Modify the result cache.
	 * values.cache.set(object, ['a', 'b']);
	 * values(object);
	 * // => ['a', 'b']
	 *
	 * // Replace `_.memoize.Cache`.
	 * _.memoize.Cache = WeakMap;
	 */
	function memoize(func, resolver) {
	  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  var memoized = function() {
	    var args = arguments,
	        key = resolver ? resolver.apply(this, args) : args[0],
	        cache = memoized.cache;

	    if (cache.has(key)) {
	      return cache.get(key);
	    }
	    var result = func.apply(this, args);
	    memoized.cache = cache.set(key, result);
	    return result;
	  };
	  memoized.cache = new (memoize.Cache || MapCache);
	  return memoized;
	}

	// Assign cache to `_.memoize`.
	memoize.Cache = MapCache;

	/**
	 * Performs a
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * comparison between two values to determine if they are equivalent.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 * var other = { 'a': 1 };
	 *
	 * _.eq(object, object);
	 * // => true
	 *
	 * _.eq(object, other);
	 * // => false
	 *
	 * _.eq('a', 'a');
	 * // => true
	 *
	 * _.eq('a', Object('a'));
	 * // => false
	 *
	 * _.eq(NaN, NaN);
	 * // => true
	 */
	function eq(value, other) {
	  return value === other || (value !== value && other !== other);
	}

	/**
	 * Checks if `value` is likely an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	function isArguments(value) {
	  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
	  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
	    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
	}

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */
	var isArray = Array.isArray;

	/**
	 * Checks if `value` is array-like. A value is considered array-like if it's
	 * not a function and has a `value.length` that's an integer greater than or
	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 * @example
	 *
	 * _.isArrayLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLike(document.body.children);
	 * // => true
	 *
	 * _.isArrayLike('abc');
	 * // => true
	 *
	 * _.isArrayLike(_.noop);
	 * // => false
	 */
	function isArrayLike(value) {
	  return value != null && isLength(value.length) && !isFunction(value);
	}

	/**
	 * This method is like `_.isArrayLike` except that it also checks if `value`
	 * is an object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array-like object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArrayLikeObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLikeObject(document.body.children);
	 * // => true
	 *
	 * _.isArrayLikeObject('abc');
	 * // => false
	 *
	 * _.isArrayLikeObject(_.noop);
	 * // => false
	 */
	function isArrayLikeObject(value) {
	  return isObjectLike(value) && isArrayLike(value);
	}

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 8-9 which returns 'object' for typed array and other constructors.
	  var tag = isObject(value) ? objectToString.call(value) : '';
	  return tag == funcTag || tag == genTag;
	}

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 * @example
	 *
	 * _.isLength(3);
	 * // => true
	 *
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isLength(Infinity);
	 * // => false
	 *
	 * _.isLength('3');
	 * // => false
	 */
	function isLength(value) {
	  return typeof value == 'number' &&
	    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return typeof value == 'symbol' ||
	    (isObjectLike(value) && objectToString.call(value) == symbolTag);
	}

	/**
	 * Checks if `value` is classified as a typed array.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	 * @example
	 *
	 * _.isTypedArray(new Uint8Array);
	 * // => true
	 *
	 * _.isTypedArray([]);
	 * // => false
	 */
	var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

	/**
	 * Converts `value` to a string. An empty string is returned for `null`
	 * and `undefined` values. The sign of `-0` is preserved.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 * @example
	 *
	 * _.toString(null);
	 * // => ''
	 *
	 * _.toString(-0);
	 * // => '-0'
	 *
	 * _.toString([1, 2, 3]);
	 * // => '1,2,3'
	 */
	function toString(value) {
	  return value == null ? '' : baseToString(value);
	}

	/**
	 * Gets the value at `path` of `object`. If the resolved value is
	 * `undefined`, the `defaultValue` is returned in its place.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.7.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path of the property to get.
	 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
	 * @returns {*} Returns the resolved value.
	 * @example
	 *
	 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
	 *
	 * _.get(object, 'a[0].b.c');
	 * // => 3
	 *
	 * _.get(object, ['a', '0', 'b', 'c']);
	 * // => 3
	 *
	 * _.get(object, 'a.b.c', 'default');
	 * // => 'default'
	 */
	function get(object, path, defaultValue) {
	  var result = object == null ? undefined : baseGet(object, path);
	  return result === undefined ? defaultValue : result;
	}

	/**
	 * Checks if `path` is a direct or inherited property of `object`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path to check.
	 * @returns {boolean} Returns `true` if `path` exists, else `false`.
	 * @example
	 *
	 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
	 *
	 * _.hasIn(object, 'a');
	 * // => true
	 *
	 * _.hasIn(object, 'a.b');
	 * // => true
	 *
	 * _.hasIn(object, ['a', 'b']);
	 * // => true
	 *
	 * _.hasIn(object, 'b');
	 * // => false
	 */
	function hasIn(object, path) {
	  return object != null && hasPath(object, path, baseHasIn);
	}

	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	function keys(object) {
	  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
	}

	/**
	 * This method returns the first argument it receives.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Util
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 *
	 * console.log(_.identity(object) === object);
	 * // => true
	 */
	function identity(value) {
	  return value;
	}

	/**
	 * Creates a function that returns the value at `path` of a given object.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Util
	 * @param {Array|string} path The path of the property to get.
	 * @returns {Function} Returns the new accessor function.
	 * @example
	 *
	 * var objects = [
	 *   { 'a': { 'b': 2 } },
	 *   { 'a': { 'b': 1 } }
	 * ];
	 *
	 * _.map(objects, _.property('a.b'));
	 * // => [2, 1]
	 *
	 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
	 * // => [1, 2]
	 */
	function property(path) {
	  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
	}

	module.exports = reduce;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(44)(module)))

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var reduce = __webpack_require__(59)
	var isFunction = __webpack_require__(42)

	module.exports = function parseDynamicDirectives (directives, functionArgs) {
	  return reduce(directives, function (result, value, key) {
	    if (Array.isArray(value)) {
	      result[key] = value.map(function (element) {
	        if (isFunction(element)) {
	          return element.apply(null, functionArgs)
	        } else {
	          return element
	        }
	      })
	    } else if (isFunction(value)) {
	      result[key] = value.apply(null, functionArgs)
	    } else if (value !== false) {
	      result[key] = value
	    }

	    return result
	  }, {})
	}


/***/ },
/* 61 */
/***/ function(module, exports) {

	module.exports = function dnsPrefetchControl (options) {
	  if (options && options.allow) {
	    return function dnsPrefetchControl (req, res, next) {
	      res.setHeader('X-DNS-Prefetch-Control', 'on')
	      next()
	    }
	  } else {
	    return function dnsPrefetchControl (req, res, next) {
	      res.setHeader('X-DNS-Prefetch-Control', 'off')
	      next()
	    }
	  }
	}


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	var isString = __webpack_require__(63)

	module.exports = function frameguard (options) {
	  options = options || {}

	  var domain = options.domain
	  var action = options.action

	  var directive
	  if (action === undefined) {
	    directive = 'SAMEORIGIN'
	  } else if (isString(action)) {
	    directive = action.toUpperCase()
	  }

	  if (directive === 'ALLOWFROM') {
	    directive = 'ALLOW-FROM'
	  } else if (directive === 'SAME-ORIGIN') {
	    directive = 'SAMEORIGIN'
	  }

	  if (['DENY', 'ALLOW-FROM', 'SAMEORIGIN'].indexOf(directive) === -1) {
	    throw new Error('action must be undefined, "DENY", "ALLOW-FROM", or "SAMEORIGIN".')
	  }

	  if (directive === 'ALLOW-FROM') {
	    if (!isString(domain)) {
	      throw new Error('ALLOW-FROM action requires a domain parameter.')
	    }
	    if (!domain.length) {
	      throw new Error('domain parameter must not be empty.')
	    }
	    directive = 'ALLOW-FROM ' + domain
	  }

	  return function frameguard (req, res, next) {
	    res.setHeader('X-Frame-Options', directive)
	    next()
	  }
	}


/***/ },
/* 63 */
/***/ function(module, exports) {

	module.exports = function (val) {
	  return typeof val === 'string' || val instanceof String
	}


/***/ },
/* 64 */
/***/ function(module, exports) {

	module.exports = function hidePoweredBy (options) {
	  var setTo = (options || {}).setTo

	  if (setTo) {
	    return function hidePoweredBy (req, res, next) {
	      res.setHeader('X-Powered-By', setTo)
	      next()
	    }
	  } else {
	    return function hidePoweredBy (req, res, next) {
	      res.removeHeader('X-Powered-By')
	      next()
	    }
	  }
	}


/***/ },
/* 65 */
/***/ function(module, exports) {

	var badArgumentsError = new Error('hpkp must be called with a maxAge and at least two SHA-256s (one actually used and another kept as a backup).')

	module.exports = function hpkp (passedOptions) {
	  var options = parseOptions(passedOptions)
	  var headerKey = getHeaderKey(options)
	  var headerValue = getHeaderValue(options)

	  return function hpkp (req, res, next) {
	    var setHeader = true
	    var setIf = options.setIf

	    if (setIf) {
	      setHeader = setIf(req, res)
	    }

	    if (setHeader) {
	      res.setHeader(headerKey, headerValue)
	    }

	    next()
	  }
	}

	function parseOptions (options) {
	  if (!options) { throw badArgumentsError }

	  if (options.maxage && options.maxAge) { throw badArgumentsError }

	  var maxAge = options.maxAge
	  var sha256s = options.sha256s
	  var setIf = options.setIf

	  if (!maxAge || maxAge <= 0) { throw badArgumentsError }
	  if (!sha256s || sha256s.length < 2) { throw badArgumentsError }
	  if (setIf && (typeof setIf !== 'function')) {
	    throw new TypeError('setIf must be a function.')
	  }

	  if (options.reportOnly && !options.reportUri) { throw badArgumentsError }

	  return {
	    maxAge: maxAge,
	    sha256s: sha256s,
	    includeSubDomains: options.includeSubDomains || options.includeSubdomains,
	    reportUri: options.reportUri,
	    reportOnly: options.reportOnly,
	    setIf: setIf
	  }
	}

	function getHeaderKey (options) {
	  var header = 'Public-Key-Pins'
	  if (options.reportOnly) {
	    header += '-Report-Only'
	  }
	  return header
	}

	function getHeaderValue (options) {
	  var result = options.sha256s.map(function (sha) {
	    return 'pin-sha256="' + sha + '"'
	  })
	  result.push('max-age=' + Math.round(options.maxAge))
	  if (options.includeSubDomains) {
	    result.push('includeSubDomains')
	  }
	  if (options.reportUri) {
	    result.push('report-uri="' + options.reportUri + '"')
	  }
	  return result.join('; ')
	}


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(67)

	var defaultMaxAge = 180 * 24 * 60 * 60

	module.exports = function hsts (options) {
	  options = options || {}

	  var maxAge = options.maxAge != null ? options.maxAge : defaultMaxAge
	  var includeSubDomains = (options.includeSubDomains !== false) && (options.includeSubdomains !== false)
	  var force = options.force
	  var setIf = options.setIf

	  if (options.hasOwnProperty('maxage')) {
	    throw new Error('maxage is not a supported property. Did you mean to pass "maxAge" instead of "maxage"?')
	  }
	  if (arguments.length > 1) {
	    throw new Error('HSTS passed the wrong number of arguments.')
	  }
	  if (!util.isNumber(maxAge)) {
	    throw new TypeError('HSTS must be passed a numeric maxAge parameter.')
	  }
	  if (maxAge < 0) {
	    throw new RangeError('HSTS maxAge must be nonnegative.')
	  }
	  if (options.hasOwnProperty('setIf')) {
	    if (!util.isFunction(setIf)) {
	      throw new TypeError('setIf must be a function.')
	    }
	    if (options.hasOwnProperty('force')) {
	      throw new Error('setIf and force cannot both be specified.')
	    }
	  }
	  if (options.hasOwnProperty('includeSubDomains') && options.hasOwnProperty('includeSubdomains')) {
	    throw new Error('includeSubDomains and includeSubdomains cannot both be specified.')
	  }

	  var header = 'max-age=' + Math.round(maxAge)
	  if (includeSubDomains) {
	    header += '; includeSubDomains'
	  }
	  if (options.preload) {
	    header += '; preload'
	  }

	  return function hsts (req, res, next) {
	    var setHeader
	    if (setIf) {
	      setHeader = setIf(req, res)
	    } else {
	      setHeader = force || req.secure
	    }

	    if (setHeader) {
	      res.setHeader('Strict-Transport-Security', header)
	    }

	    next()
	  }
	}


/***/ },
/* 67 */
/***/ function(module, exports) {

	module.exports = require("core-util-is");

/***/ },
/* 68 */
/***/ function(module, exports) {

	module.exports = function ienoopen () {
	  return function ienoopen (req, res, next) {
	    res.setHeader('X-Download-Options', 'noopen')
	    next()
	  }
	}


/***/ },
/* 69 */
/***/ function(module, exports) {

	module.exports = function nocache () {
	  return function nocache (req, res, next) {
	    res.setHeader('Surrogate-Control', 'no-store')
	    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
	    res.setHeader('Pragma', 'no-cache')
	    res.setHeader('Expires', '0')

	    next()
	  }
	}


/***/ },
/* 70 */
/***/ function(module, exports) {

	module.exports = function nosniff () {
	  return function nosniff (req, res, next) {
	    res.setHeader('X-Content-Type-Options', 'nosniff')
	    next()
	  }
	}


/***/ },
/* 71 */
/***/ function(module, exports) {

	var DEFAULT_POLICY = 'no-referrer'
	var ALLOWED_POLICIES = [
	  'no-referrer',
	  'no-referrer-when-downgrade',
	  'same-origin',
	  'origin',
	  'strict-origin',
	  'origin-when-cross-origin',
	  'strict-origin-when-cross-origin',
	  'unsafe-url',
	  ''
	]
	var ALLOWED_POLICIES_ERROR_LIST = ALLOWED_POLICIES.map(function (policy) {
	  if (policy.length) {
	    return '"' + policy + '"'
	  } else {
	    return 'and the empty string'
	  }
	}).join(', ')

	module.exports = function referrerPolicy (options) {
	  options = options || {}

	  var policy
	  if ('policy' in options) {
	    policy = options.policy
	  } else {
	    policy = DEFAULT_POLICY
	  }

	  if (ALLOWED_POLICIES.indexOf(policy) === -1) {
	    throw new Error('"' + policy + '" is not a valid policy. Allowed policies: ' + ALLOWED_POLICIES_ERROR_LIST + '.')
	  }

	  return function referrerPolicy (req, res, next) {
	    res.setHeader('Referrer-Policy', policy)
	    next()
	  }
	}


/***/ },
/* 72 */
/***/ function(module, exports) {

	module.exports = function xXssProtection (options) {
	  if (options && options.setOnOldIE) {
	    return function xXssProtection (req, res, next) {
	      res.setHeader('X-XSS-Protection', '1; mode=block')
	      next()
	    }
	  } else {
	    return function xXssProtection (req, res, next) {
	      var matches = /msie\s*(\d+)/i.exec(req.headers['user-agent'])

	      var value
	      if (!matches || (parseFloat(matches[1]) >= 9)) {
	        value = '1; mode=block'
	      } else {
	        value = '0'
	      }

	      res.setHeader('X-XSS-Protection', value)
	      next()
	    }
	  }
	}


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var spdy = exports;

	// Export tools
	spdy.handle = __webpack_require__(74);
	spdy.request = __webpack_require__(81);
	spdy.response = __webpack_require__(82);
	spdy.Socket = __webpack_require__(83);

	// Export client
	spdy.agent = __webpack_require__(85);
	spdy.Agent = spdy.agent.Agent;
	spdy.createAgent = spdy.agent.create;

	// Export server
	spdy.server = __webpack_require__(124);
	spdy.Server = spdy.server.Server;
	spdy.PlainServer = spdy.server.PlainServer;
	spdy.createServer = spdy.server.create;


/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var assert = __webpack_require__(75);
	var thing = __webpack_require__(76);
	var httpDeceiver = __webpack_require__(80);
	var util = __webpack_require__(77);

	function Handle(options, stream, socket) {
	  var state = {};
	  this._spdyState = state;

	  state.options = options || {};

	  state.stream = stream;
	  state.socket = null;
	  state.rawSocket = socket || stream.connection.socket;
	  state.deceiver = null;
	  state.ending = false;

	  var self = this;
	  thing.call(this, stream, {
	    getPeerName: function() {
	      return self._getPeerName();
	    },
	    close: function(callback) {
	      return self._closeCallback(callback);
	    }
	  });

	  if (!state.stream) {
	    this.on('stream', function(stream) {
	      state.stream = stream;
	    });
	  }
	}
	util.inherits(Handle, thing);
	module.exports = Handle;

	Handle.create = function create(options, stream, socket) {
	  return new Handle(options, stream, socket);
	};

	Handle.prototype._getPeerName = function _getPeerName() {
	  var state = this._spdyState;

	  if (state.rawSocket._getpeername)
	    return state.rawSocket._getpeername();

	  return null;
	};

	Handle.prototype._closeCallback = function _closeCallback(callback) {
	  var state = this._spdyState;
	  var stream = state.stream;

	  if (state.ending) {
	    // The .end() method of the stream may be called by us or by the
	    // .shutdown() method in our super-class. If the latter has already been
	    // called, then calling the .end() method below will have no effect, with
	    // the result that the callback will never get executed, leading to an ever
	    // so subtle memory leak.
	    if (stream._writableState.finished) {
	      // NOTE: it is important to call `setImmediate` instead of `nextTick`,
	      // since this is how regular `handle.close()` works in node.js core.
	      //
	      // Using `nextTick` will lead to `net.Socket` emitting `close` before
	      // `end` on UV_EOF. This results in aborted request without `end` event.
	      setImmediate(callback);
	    } else if (stream._writableState.ending) {
	      stream.once('finish', function() {
	        callback(null);
	      });
	    } else {
	      stream.end(callback);
	    }
	  } else {
	    stream.abort(callback);
	  }

	  // Only a single end is allowed
	  state.ending = false;
	};

	Handle.prototype.getStream = function getStream(callback) {
	  var state = this._spdyState;

	  if (!callback) {
	    assert(state.stream);
	    return state.stream;
	  }

	  if (state.stream) {
	    process.nextTick(function() {
	      callback(state.stream);
	    });
	    return;
	  }

	  this.on('stream', callback);
	};

	Handle.prototype.assignSocket = function assignSocket(socket, options) {
	  var state = this._spdyState;

	  state.socket = socket;
	  state.deceiver = httpDeceiver.create(socket, options);

	  function onStreamError(err) {
	    state.socket.emit('error', err);
	  }

	  this.getStream(function(stream) {
	    stream.on('error', onStreamError);
	  });
	};

	Handle.prototype.assignClientRequest = function assignClientRequest(req) {
	  var state = this._spdyState;
	  var oldEnd = req.end;
	  var oldSend = req._send;

	  // Catch the headers before request will be sent
	  var self = this;

	  // For old nodes
	  if (thing.mode !== 'modern') {
	    req.end = function end() {
	      this.end = oldEnd;

	      this._send('');

	      return this.end.apply(this, arguments);
	    };
	  }

	  req._send = function send(data) {
	    this._headerSent = true;

	    // for v0.10 and below, otherwise it will set `hot = false` and include
	    // headers in first write
	    this._header = 'ignore me';

	    // To prevent exception
	    this.connection = state.socket;

	    // It is very important to leave this here, otherwise it will be executed
	    // on a next tick, after `_send` will perform write
	    self.getStream(function(stream) {
	      stream.send();
	    });

	    // We are ready to create stream
	    self.emit('needStream');

	    req._send = oldSend;

	    // Ignore empty writes
	    if (req.method === 'GET' && data.length === 0)
	      return;

	    return req._send.apply(this, arguments);
	  };

	  // No chunked encoding
	  req.useChunkedEncodingByDefault = false;

	  req.on('finish', function() {
	    req.socket.end();
	  });
	};

	Handle.prototype.assignRequest = function assignRequest(req) {
	  // Emit trailing headers
	  this.getStream(function(stream) {
	    stream.on('headers', function(headers) {
	      req.emit('trailers', headers);
	    });
	  });
	};

	Handle.prototype.assignResponse = function assignResponse(res) {
	  var self = this;

	  res.addTrailers = function addTrailers(headers) {
	    self.getStream(function(stream) {
	      stream.sendHeaders(headers);
	    });
	  };
	};

	Handle.prototype._transformHeaders = function _transformHeaders(kind, headers) {
	  var state = this._spdyState;

	  var res = {};
	  var keys = Object.keys(headers);

	  if (kind === 'request' && state.options['x-forwarded-for']) {
	    var xforwarded = state.stream.connection.getXForwardedFor();
	    if (xforwarded !== null)
	      res['x-forwarded-for'] = xforwarded;
	  }

	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    var value = headers[key];

	    if (key === ':authority')
	      res.host = value;
	    if (/^:/.test(key))
	      continue;

	    res[key] = value;
	  }
	  return res;
	};

	Handle.prototype.emitRequest = function emitRequest() {
	  var state = this._spdyState;
	  var stream = state.stream;

	  state.deceiver.emitRequest({
	    method: stream.method,
	    path: stream.path,
	    headers: this._transformHeaders('request', stream.headers)
	  });
	};

	Handle.prototype.emitResponse = function emitResponse(status, headers) {
	  var state = this._spdyState;

	  state.deceiver.emitResponse({
	    status: status,
	    headers: this._transformHeaders('response', headers)
	  });
	};


/***/ },
/* 75 */
/***/ function(module, exports) {

	module.exports = require("assert");

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	var assert = __webpack_require__(75);
	var util = __webpack_require__(77);

	var EventEmitter = __webpack_require__(33).EventEmitter;
	var Buffer = __webpack_require__(78).Buffer;

	var Queue = __webpack_require__(79);

	// Node.js version
	var mode = /^v0\.8\./.test(process.version) ? 'rusty' :
	           /^v0\.(9|10)\./.test(process.version) ? 'old' :
	           'modern';

	function Handle(stream, options) {
	  EventEmitter.call(this);

	  this._stream = stream;
	  this._flowing = false;
	  this._reading = false;
	  this._options = options || {};

	  this.onread = null;

	  // Pending requests
	  this.pending = new Queue();

	  // Start handle once `onread` is set
	  if (mode === 'rusty') {
	    var self = this;
	    Object.defineProperty(this, 'onread', {
	      set: function(value) {
	        Object.defineProperty(self, 'onread', {
	          value: value
	        });
	        process.nextTick(function() {
	          self.readStart();
	        });
	      }
	    });
	  }

	  // NOTE: v0.8 has some odd .pause()/.resume() semantics in http.js
	  if (mode === 'rusty')
	    this.writeQueueSize = 0;
	  else if (mode !== 'modern')
	    this.writeQueueSize = 1;

	  if (mode === 'rusty') {
	    if (this._stream)
	      this._rustyInit();
	    else
	      this.once('stream', this._rustyInit);
	  }
	}
	util.inherits(Handle, EventEmitter);
	module.exports = Handle;

	Handle.mode = mode;

	Handle.create = function create(stream, options) {
	  return new Handle(stream, options);
	};

	Handle.prototype._queueReq = function _queueReq(type, req) {
	  return this.pending.append(type, req);
	};

	Handle.prototype._pendingList = function _pendingList() {
	  var list = [];
	  while (!this.pending.isEmpty())
	    list.push(this.pending.first().dequeue());
	  return list;
	};

	Handle.prototype.setStream = function setStream(stream) {
	  assert(this._stream === null, 'Can\'t set stream two times');
	  this._stream = stream;

	  this.emit('stream', stream);
	};

	Handle.prototype.readStart = function readStart() {
	  this._reading = true;

	  if (!this._stream) {
	    this.once('stream', this.readStart);
	    return 0;
	  }

	  if (!this._flowing) {
	    this._flowing = true;
	    this._flow();
	  }

	  this._stream.resume();
	  return 0;
	};

	Handle.prototype.readStop = function readStop() {
	  this._reading = false;

	  if (!this._stream) {
	    this.once('stream', this.readStop);
	    return 0;
	  }
	  this._stream.pause();
	  return 0;
	};

	if (mode === 'modern') {
	  var uv = process.binding('uv');

	  Handle.prototype._flow = function flow() {
	    var self = this;
	    this._stream.on('data', function(chunk) {
	      self.onread(chunk.length, chunk);
	    });

	    this._stream.on('end', function() {
	      self.onread(uv.UV_EOF, new Buffer(0));
	    });

	    this._stream.on('close', function() {
	      setImmediate(function() {
	        if (self._reading)
	          self.onread(uv.UV_ECONNRESET, new Buffer(0));
	      });
	    });
	  };

	  Handle.prototype._close = function _close() {
	    var list = this._pendingList();

	    var self = this;
	    setImmediate(function() {
	      for (var i = 0; i < list.length; i++) {
	        var req = list[i];
	        req.oncomplete(uv.UV_ECANCELED, self, req);
	      }
	    });

	    this.readStop();
	  };
	} else if (mode === 'old') {
	  Handle.prototype._flow = function flow() {
	    var self = this;
	    this._stream.on('data', function(chunk) {
	      self.onread(chunk, 0, chunk.length);
	    });

	    this._stream.on('end', function() {
	      var errno = process._errno;
	      process._errno = 'EOF';
	      self.onread(null, 0, 0);
	      if (process._errno === 'EOF')
	        process._errno = errno;
	    });

	    this._stream.on('close', function() {
	      setImmediate(function() {
	        if (!self._reading)
	          return;

	        var errno = process._errno;
	        process._errno = 'ECONNRESET';
	        self.onread(null, 0, 0);
	        if (process._errno === 'ECONNRESET')
	          process._errno = errno;
	      });
	    });
	  };

	  Handle.prototype._close = function _close() {
	    var list = this._pendingList();

	    var self = this;
	    setImmediate(function() {
	      for (var i = 0; i < list.length; i++) {
	        process._errno = 'CANCELED';
	        var req = list[i];
	        req.oncomplete(-1, self, req);
	      }
	    });

	    this.readStop();
	  };
	} else {
	  Handle.prototype._rustyInit = function _rustyInit() {
	    var self = this;

	    this._stream.on('close', function() {
	      process.nextTick(function() {
	        if (!self._reading)
	          return;

	        var errno = global.errno;
	        global.errno = 'ECONNRESET';
	        self.onread(null, 0, 0);
	        if (global.errno === 'ECONNRESET')
	          global.errno = errno;
	      });
	    });
	  };

	  Handle.prototype._flow = function flow() {
	    var self = this;
	    this._stream.on('data', function(chunk) {
	      self.onread(chunk, 0, chunk.length);
	    });

	    this._stream.on('end', function() {
	      var errno = global.errno;
	      global.errno = 'EOF';
	      self.onread(null, 0, 0);
	      if (global.errno === 'EOF')
	        global.errno = errno;
	    });
	  };

	  Handle.prototype._close = function _close() {
	    var list = this._pendingList();

	    var self = this;
	    process.nextTick(function() {
	      for (var i = 0; i < list.length; i++) {
	        var req = list[i];
	        global.errno = 'CANCELED';
	        req.oncomplete(-1, self, req);
	      }
	    });

	    this.readStop();
	  };
	}

	if (mode === 'modern') {
	  Handle.prototype.shutdown = function shutdown(req) {
	    var wrap = this._queueReq('shutdown', req);

	    if (!this._stream) {
	      this.once('stream', function() {
	        this._shutdown(wrap);
	      });
	      return 0;
	    }

	    return this._shutdown(wrap);
	  };

	  Handle.prototype._shutdown = function _shutdown(wrap) {
	    var self = this;
	    this._stream.end(function() {
	      var req = wrap.dequeue();
	      if (!req)
	        return;

	      req.oncomplete(0, self, req);
	    });
	    return 0;
	  };
	} else {
	  Handle.prototype.shutdown = function shutdown(req) {
	    if (!req)
	      req = {};

	    var wrap = this._queueReq('shutdown', req);

	    if (!this._stream) {
	      this.once('stream', function() {
	        this._shutdown(wrap);
	      });
	      return req;
	    }

	    this._shutdown(wrap);

	    return req;
	  };

	  Handle.prototype._shutdown = function _shutdown(wrap) {
	    var self = this;
	    this._stream.end(function() {
	      var req = wrap.dequeue();
	      if (!req)
	        return;
	      req.oncomplete(0, self, req);
	    });
	  };
	}

	if (mode !== 'rusty') {
	  Handle.prototype.close = function close(callback) {
	    this._close();

	    if (!this._stream) {
	      this.once('stream', function() {
	        this.close(callback);
	      });
	      return 0;
	    }

	    if (this._options.close)
	      this._options.close(callback);
	    else
	      process.nextTick(callback);

	    return 0;
	  };
	} else {
	  Handle.prototype.close = function close() {
	    this._close();

	    if (!this._stream)
	      this.once('stream', this.close);
	    else if (this._options.close)
	      this._options.close(function() {});

	    return 0;
	  };
	}

	if (mode === 'modern') {
	  Handle.prototype.writeEnc = function writeEnc(req, data, enc) {
	    var wrap = this._queueReq('write', req);

	    if (!this._stream) {
	      this.once('stream', function() {
	        this._writeEnc(wrap, req, data, enc);
	      });

	      return 0;
	    }

	    return this._writeEnc(wrap, req, data, enc);
	  };

	  Handle.prototype._writeEnc = function _writeEnc(wrap, req, data, enc) {
	    var self = this;

	    req.async = true;
	    req.bytes = data.length;

	    if (wrap.isEmpty())
	      return 0;

	    this._stream.write(data, enc, function() {
	      var req = wrap.dequeue();
	      if (!req)
	        return;
	      req.oncomplete(0, self, req);
	    });

	    return 0;
	  };
	} else {
	  Handle.prototype.writeEnc = function writeEnc(data, ignored, enc, req) {
	    if (!req)
	      req = { bytes: data.length };

	    var wrap = this._queueReq('write', req);

	    if (!this._stream) {
	      this.once('stream', function() {
	        this._writeEnc(data, ignored, enc, wrap);
	      });
	      return req;
	    }

	    this._writeEnc(data, ignored, enc, wrap);
	    return req;
	  };

	  Handle.prototype._writeEnc = function _writeEnc(data, ignored, enc, wrap) {
	    var self = this;
	    var buffer = new Buffer(data, enc);

	    if (wrap.isEmpty())
	      return;

	    this._stream.write(buffer, function() {
	      var req = wrap.dequeue();
	      if (!req)
	        return;
	      req.oncomplete(0, self, req);
	    });
	  };
	}

	Handle.prototype.writeBuffer = function writeBuffer(req, data) {
	  return this.writeEnc(req, data, null);
	};

	Handle.prototype.writeAsciiString = function writeAsciiString(req, data) {
	  return this.writeEnc(req, data, 'ascii');
	};

	Handle.prototype.writeUtf8String = function writeUtf8String(req, data) {
	  return this.writeEnc(req, data, 'utf8');
	};

	Handle.prototype.writeUcs2String = function writeUcs2String(req, data) {
	  return this.writeEnc(req, data, 'ucs2');
	};

	Handle.prototype.writeBinaryString = function writeBinaryString(req, data) {
	  return this.writeEnc(req, data, 'binary');
	};

	Handle.prototype.writeLatin1String = function writeLatin1String(req, data) {
	  return this.writeEnc(req, data, 'binary');
	};

	// v0.8
	Handle.prototype.getsockname = function getsockname() {
	  if (this._options.getPeerName)
	    return this._options.getPeerName();
	  return null;
	};

	if (mode === 'modern') {
	  Handle.prototype.getpeername = function getpeername(out) {
	    var res = this.getsockname();
	    if (!res)
	      return -1;

	    Object.keys(res).forEach(function(key) {
	      out[key] = res[key];
	    });

	    return 0;
	  };
	} else {
	  // v0.10
	  Handle.prototype.getpeername = function getpeername() {
	    return this.getsockname();
	  };
	}


/***/ },
/* 77 */
/***/ function(module, exports) {

	module.exports = require("util");

/***/ },
/* 78 */
/***/ function(module, exports) {

	module.exports = require("buffer");

/***/ },
/* 79 */
/***/ function(module, exports) {

	function Queue() {
	  this.head = new Item('head', null);
	}
	module.exports = Queue;

	Queue.prototype.append = function append(kind, value) {
	  var item = new Item(kind, value);
	  this.head.prepend(item);
	  return item;
	};

	Queue.prototype.isEmpty = function isEmpty() {
	  return this.head.prev === this.head;
	};

	Queue.prototype.first = function first() {
	  return this.head.next;
	};

	function Item(kind, value) {
	  this.prev = this;
	  this.next = this;
	  this.kind = kind;
	  this.value = value;
	}

	Item.prototype.prepend = function prepend(other) {
	  other.prev = this.prev;
	  other.next = this;
	  other.prev.next = other;
	  other.next.prev = other;
	};

	Item.prototype.dequeue = function dequeue() {
	  var prev = this.prev;
	  var next = this.next;

	  prev.next = next;
	  next.prev = prev;
	  this.prev = this;
	  this.next = this;

	  return this.value;
	};

	Item.prototype.isEmpty = function isEmpty() {
	  return this.prev === this;
	};


/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	var assert = __webpack_require__(75);
	var util = __webpack_require__(77);

	var Buffer = __webpack_require__(78).Buffer;

	// Node.js version
	var mode = /^v0\.8\./.test(process.version) ? 'rusty' :
	           /^v0\.(9|10)\./.test(process.version) ? 'old' :
	           /^v0\.12\./.test(process.version) ? 'normal' :
	           'modern';

	var HTTPParser;

	var methods;
	var reverseMethods;

	var kOnHeaders;
	var kOnHeadersComplete;
	var kOnMessageComplete;
	var kOnBody;
	if (mode === 'normal' || mode === 'modern') {
	  HTTPParser = process.binding('http_parser').HTTPParser;
	  methods = HTTPParser.methods;

	  // v6
	  if (!methods)
	    methods = process.binding('http_parser').methods;

	  reverseMethods = {};

	  methods.forEach(function(method, index) {
	    reverseMethods[method] = index;
	  });

	  kOnHeaders = HTTPParser.kOnHeaders | 0;
	  kOnHeadersComplete = HTTPParser.kOnHeadersComplete | 0;
	  kOnMessageComplete = HTTPParser.kOnMessageComplete | 0;
	  kOnBody = HTTPParser.kOnBody | 0;
	} else {
	  kOnHeaders = 'onHeaders';
	  kOnHeadersComplete = 'onHeadersComplete';
	  kOnMessageComplete = 'onMessageComplete';
	  kOnBody = 'onBody';
	}

	function Deceiver(socket, options) {
	  this.socket = socket;
	  this.options = options || {};
	  this.isClient = this.options.isClient;
	}
	module.exports = Deceiver;

	Deceiver.create = function create(stream, options) {
	  return new Deceiver(stream, options);
	};

	Deceiver.prototype._toHeaderList = function _toHeaderList(object) {
	  var out = [];
	  var keys = Object.keys(object);

	  for (var i = 0; i < keys.length; i++)
	    out.push(keys[i], object[keys[i]]);

	  return out;
	};

	Deceiver.prototype._isUpgrade = function _isUpgrade(request) {
	  return request.method === 'CONNECT' ||
	         request.headers.upgrade ||
	         request.headers.connection &&
	            /(^|\W)upgrade(\W|$)/i.test(request.headers.connection);
	};

	// TODO(indutny): support CONNECT
	if (mode === 'modern') {
	  /*
	  function parserOnHeadersComplete(versionMajor, versionMinor, headers, method,
	                                   url, statusCode, statusMessage, upgrade,
	                                   shouldKeepAlive) {
	   */
	  Deceiver.prototype.emitRequest = function emitRequest(request) {
	    var parser = this.socket.parser;
	    assert(parser, 'No parser present');

	    parser.execute = null;

	    var self = this;
	    var method = reverseMethods[request.method];
	    parser.execute = function execute() {
	      self._skipExecute(this);
	      this[kOnHeadersComplete](1,
	                               1,
	                               self._toHeaderList(request.headers),
	                               method,
	                               request.path,
	                               0,
	                               '',
	                               self._isUpgrade(request),
	                               true);
	      return 0;
	    };

	    this._emitEmpty();
	  };

	  Deceiver.prototype.emitResponse = function emitResponse(response) {
	    var parser = this.socket.parser;
	    assert(parser, 'No parser present');

	    parser.execute = null;

	    var self = this;
	    parser.execute = function execute() {
	      self._skipExecute(this);
	      this[kOnHeadersComplete](1,
	                               1,
	                               self._toHeaderList(response.headers),
	                               response.path,
	                               response.code,
	                               response.status,
	                               response.reason || '',
	                               self._isUpgrade(response),
	                               true);
	      return 0;
	    };

	    this._emitEmpty();
	  };
	} else {
	  /*
	    `function parserOnHeadersComplete(info) {`

	    info = { .versionMajor, .versionMinor, .url, .headers, .method,
	             .statusCode, .statusMessage, .upgrade, .shouldKeepAlive }
	   */
	  Deceiver.prototype.emitRequest = function emitRequest(request) {
	    var parser = this.socket.parser;
	    assert(parser, 'No parser present');

	    var method = request.method;
	    if (reverseMethods)
	      method = reverseMethods[method];

	    var info = {
	      versionMajor: 1,
	      versionMinor: 1,
	      url: request.path,
	      headers: this._toHeaderList(request.headers),
	      method: method,
	      statusCode: 0,
	      statusMessage: '',
	      upgrade: this._isUpgrade(request),
	      shouldKeepAlive: true
	    };

	    var self = this;
	    parser.execute = function execute() {
	      self._skipExecute(this);
	      this[kOnHeadersComplete](info);
	      return 0;
	    };

	    this._emitEmpty();
	  };

	  Deceiver.prototype.emitResponse = function emitResponse(response) {
	    var parser = this.socket.parser;
	    assert(parser, 'No parser present');

	    var info = {
	      versionMajor: 1,
	      versionMinor: 1,
	      url: response.path,
	      headers: this._toHeaderList(response.headers),
	      method: false,
	      statusCode: response.status,
	      statusMessage: response.reason || '',
	      upgrade: this._isUpgrade(response),
	      shouldKeepAlive: true
	    };

	    var self = this;
	    parser.execute = function execute() {
	      self._skipExecute(this);
	      this[kOnHeadersComplete](info);
	      return 0;
	    };

	    this._emitEmpty();
	  };
	}

	Deceiver.prototype._skipExecute = function _skipExecute(parser) {
	  var self = this;
	  var oldExecute = parser.constructor.prototype.execute;
	  var oldFinish = parser.constructor.prototype.finish;

	  parser.execute = null;
	  parser.finish = null;

	  parser.execute = function execute(buffer, start, len) {
	    // Parser reuse
	    if (this.socket !== self.socket) {
	      this.execute = oldExecute;
	      this.finish = oldFinish;
	      return this.execute(buffer, start, len);
	    }

	    if (start !== undefined)
	      buffer = buffer.slice(start, start + len);
	    self.emitBody(buffer);
	    return len;
	  };

	  parser.finish = function finish() {
	    // Parser reuse
	    if (this.socket !== self.socket) {
	      this.execute = oldExecute;
	      this.finish = oldFinish;
	      return this.finish();
	    }

	    this.execute = oldExecute;
	    this.finish = oldFinish;
	    self.emitMessageComplete();
	  };
	};

	Deceiver.prototype.emitBody = function emitBody(buffer) {
	  var parser = this.socket.parser;
	  assert(parser, 'No parser present');

	  parser[kOnBody](buffer, 0, buffer.length);
	};

	Deceiver.prototype._emitEmpty = function _emitEmpty() {
	  // Emit data to force out handling of UPGRADE
	  var empty = new Buffer(0);
	  if (this.socket.ondata)
	    this.socket.ondata(empty, 0, 0);
	  else
	    this.socket.emit('data', empty);
	};

	Deceiver.prototype.emitMessageComplete = function emitMessageComplete() {
	  var parser = this.socket.parser;
	  assert(parser, 'No parser present');

	  parser[kOnMessageComplete]();
	};


/***/ },
/* 81 */
/***/ function(module, exports) {

	'use strict';

	function attachPush(req) {
	  var handle = req.socket._handle;

	  handle.getStream(function(stream) {
	    stream.on('pushPromise', function(push) {
	      req.emit('push', push);
	    });
	  });
	}

	exports.onNewListener = function onNewListener(type) {
	  var req = this;

	  if (type !== 'push')
	    return;

	  // Not first listener
	  if (req.listeners('push').length !== 0)
	    return;

	  if (!req.socket) {
	    req.on('socket', function() {
	      attachPush(req);
	    });
	    return;
	  }

	  attachPush(req);
	};


/***/ },
/* 82 */
/***/ function(module, exports) {

	'use strict';

	// NOTE: Mostly copy paste from node
	exports.writeHead = function writeHead(statusCode, reason, obj) {
	  var headers;

	  if (typeof reason === 'string') {
	    // writeHead(statusCode, reasonPhrase[, headers])
	    this.statusMessage = reason;
	  } else {
	    // writeHead(statusCode[, headers])
	    this.statusMessage =
	      this.statusMessage || 'unknown';
	    obj = reason;
	  }
	  this.statusCode = statusCode;

	  if (this._headers) {
	    // Slow-case: when progressive API and header fields are passed.
	    if (obj) {
	      var keys = Object.keys(obj);
	      for (var i = 0; i < keys.length; i++) {
	        var k = keys[i];
	        if (k) this.setHeader(k, obj[k]);
	      }
	    }
	    // only progressive api is used
	    headers = this._renderHeaders();
	  } else {
	    // only writeHead() called
	    headers = obj;
	  }

	  if (statusCode === 204 || statusCode === 304 ||
	      (100 <= statusCode && statusCode <= 199)) {
	    // RFC 2616, 10.2.5:
	    // The 204 response MUST NOT include a message-body, and thus is always
	    // terminated by the first empty line after the header fields.
	    // RFC 2616, 10.3.5:
	    // The 304 response MUST NOT contain a message-body, and thus is always
	    // terminated by the first empty line after the header fields.
	    // RFC 2616, 10.1 Informational 1xx:
	    // This class of status code indicates a provisional response,
	    // consisting only of the Status-Line and optional headers, and is
	    // terminated by an empty line.
	    this._hasBody = false;
	  }

	  // don't keep alive connections where the client expects 100 Continue
	  // but we sent a final status; they may put extra bytes on the wire.
	  if (this._expect_continue && !this._sent100) {
	    this.shouldKeepAlive = false;
	  }

	  // Implicit headers sent!
	  this._header = true;
	  this._headerSent = true;

	  if (this.socket._handle)
	    this.socket._handle._spdyState.stream.respond(this.statusCode, headers);
	};

	exports.end = function end(data, encoding, callback) {
	  if (!this._headerSent)
	    this.writeHead(this.statusCode);

	  if (!this.socket._handle)
	    return;

	  // Compatibility with Node.js core
	  this.finished = true;

	  var self = this;
	  var handle = this.socket._handle;
	  handle._spdyState.ending = true;
	  this.socket.end(data, encoding, function() {
	    self.constructor.prototype.end.call(self, '', 'utf8', callback);
	  });
	};

	exports.push = function push(path, headers, callback) {
	  var frame = {
	    path: path,
	    method: headers.method ? headers.method.toString() : 'GET',
	    status: headers.status ? parseInt(headers.status, 10) : 200,
	    host: this._req.headers.host,
	    headers: headers.request,
	    response: headers.response
	  };

	  var stream = this.spdyStream;
	  return stream.pushPromise(frame, callback);
	};

	exports.writeContinue = function writeContinue(callback) {
	  if (this.socket._handle)
	    this.socket._handle._spdyState.stream.respond(100, {}, callback);
	};


/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var util = __webpack_require__(77);
	var net = __webpack_require__(84);

	function Socket(parent, options) {
	  net.Socket.call(this, options);

	  var state = {};

	  this._spdyState = state;

	  state.parent = parent;

	  this.servername = parent.servername;
	  this.npnProtocol = parent.npnProtocol;
	  this.alpnProtocol = parent.alpnProtocol;
	  this.authorized = parent.authorized;
	  this.authorizationError = parent.authorizationError;
	  this.encrypted = true;
	}
	util.inherits(Socket, net.Socket);

	module.exports = Socket;

	var methods = [
	  'renegotiate', 'setMaxSendFragment', 'getTLSTicket', 'setServername',
	  'setSession', 'getPeerCertificate', 'getSession', 'isSessionReused',
	  'getCipher', 'getEphemeralKeyInfo'
	];

	methods.forEach(function(method) {
	  Socket.prototype[method] = function methodWrap() {
	    var parent = this._spdyState.parent;
	    return parent[method].apply(parent, arguments);
	  };
	});


/***/ },
/* 84 */
/***/ function(module, exports) {

	module.exports = require("net");

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var assert = __webpack_require__(75);
	var http = __webpack_require__(22);
	var https = __webpack_require__(21);
	var net = __webpack_require__(84);
	var util = __webpack_require__(77);
	var transport = __webpack_require__(86);
	var debug = __webpack_require__(32)('spdy:client');

	var EventEmitter = __webpack_require__(33).EventEmitter;

	var spdy = __webpack_require__(73);

	var mode = /^v0\.8\./.test(process.version) ? 'rusty' :
	           /^v0\.(9|10)\./.test(process.version) ? 'old' :
	           /^v0\.12\./.test(process.version) ? 'normal' :
	           'modern';

	var proto = {};

	function instantiate(base) {
	  function Agent(options) {
	    this._init(base, options);
	  }
	  util.inherits(Agent, base);

	  Agent.create = function create(options) {
	    return new Agent(options);
	  };

	  Object.keys(proto).forEach(function(key) {
	    Agent.prototype[key] = proto[key];
	  });

	  return Agent;
	}

	proto._init = function _init(base, options) {
	  base.call(this, options);

	  var state = {};
	  this._spdyState = state;

	  state.host = options.host;
	  state.options = options.spdy || {};
	  state.secure = this instanceof https.Agent;
	  state.fallback = false;
	  state.createSocket = this._getCreateSocket();
	  state.socket = null;
	  state.connection = null;

	  // No chunked encoding
	  this.keepAlive = false;

	  var self = this;
	  this._connect(options, function(err, connection) {
	    if (err)
	      return self.emit('error', err);

	    state.connection = connection;
	    self.emit('_connect');
	  });
	};

	proto._getCreateSocket = function _getCreateSocket() {
	  // Find super's `createSocket` method
	  var createSocket;
	  var cons = this.constructor.super_;
	  do {
	    createSocket = cons.prototype.createSocket;

	    if (cons.super_ === EventEmitter || !cons.super_)
	      break;
	    cons = cons.super_;
	  } while (!createSocket);
	  if (!createSocket)
	    createSocket = http.Agent.prototype.createSocket;

	  assert(createSocket, '.createSocket() method not found');

	  return createSocket;
	};

	proto._connect = function _connect(options, callback) {
	  var state = this._spdyState;

	  var protocols = state.options.protocols || [
	    'h2',
	    'spdy/3.1', 'spdy/3', 'spdy/2',
	    'http/1.1', 'http/1.0'
	  ];

	  // TODO(indutny): reconnect automatically?
	  var socket = this.createConnection(util._extend({
	    NPNProtocols: protocols,
	    ALPNProtocols: protocols,
	    servername: options.servername || options.host
	  }, options));
	  state.socket = socket;

	  socket.setNoDelay(true);

	  function onError(err) {
	    return callback(err);
	  }
	  socket.on('error', onError);

	  socket.on(state.secure ? 'secureConnect' : 'connect', function() {
	    socket.removeListener('error', onError);

	    var protocol;
	    if (state.secure) {
	      protocol = socket.npnProtocol ||
	                 socket.alpnProtocol ||
	                 state.options.protocol;
	    } else {
	      protocol = state.options.protocol;
	    }

	    // HTTP server - kill socket and switch to the fallback mode
	    if (!protocol || protocol === 'http/1.1' || protocol === 'http/1.0') {
	      debug('activating fallback');
	      socket.destroy();
	      state.fallback = true;
	      return;
	    }

	    debug('connected protocol=%j', protocol);
	    var connection = transport.connection.create(socket, util._extend({
	      protocol: /spdy/.test(protocol) ? 'spdy' : 'http2',
	      isServer: false
	    }, state.options.connection || {}));

	    // Set version when we are certain
	    if (protocol === 'h2') {
	      connection.start(4);
	    } else if (protocol === 'spdy/3.1') {
	      connection.start(3.1);
	    } else if (protocol === 'spdy/3') {
	      connection.start(3);
	    } else if (protocol === 'spdy/2') {
	      connection.start(2);
	    } else {
	      socket.destroy();
	      callback(new Error('Unexpected protocol: ' + protocol));
	      return;
	    }

	    if (state.options['x-forwarded-for'] !== undefined)
	      connection.sendXForwardedFor(state.options['x-forwarded-for']);

	    callback(null, connection);
	  });
	};

	proto._createSocket = function _createSocket(req, options, callback) {
	  var state = this._spdyState;
	  if (state.fallback)
	    return state.createSocket(req, options);

	  var handle = spdy.handle.create(null, null, state.socket);

	  var socketOptions = {
	    handle: handle,
	    allowHalfOpen: true
	  };

	  var socket;
	  if (state.secure)
	    socket = new spdy.Socket(state.socket, socketOptions);
	  else
	    socket = new net.Socket(socketOptions);

	  handle.assignSocket(socket);
	  handle.assignClientRequest(req);

	  // Create stream only once `req.end()` is called
	  var self = this;
	  handle.once('needStream', function() {
	    if (state.connection === null) {
	      self.once('_connect', function() {
	        handle.setStream(self._createStream(req, handle));
	      });
	    } else {
	      handle.setStream(self._createStream(req, handle));
	    }
	  });

	  // Yes, it is in reverse
	  req.on('response', function(res) {
	    handle.assignRequest(res);
	  });
	  handle.assignResponse(req);

	  // Handle PUSH
	  req.addListener('newListener', spdy.request.onNewListener);

	  // For v0.8
	  socket.readable = true;
	  socket.writable = true;

	  if (callback)
	    return callback(null, socket);

	  return socket;
	};

	if (mode === 'modern' || mode === 'normal') {
	  proto.createSocket = proto._createSocket;
	} else {
	  proto.createSocket = function createSocket(name, host, port, addr, req) {
	    var state = this._spdyState;
	    if (state.fallback)
	      return state.createSocket(name, host, port, addr, req);

	    return this._createSocket(req, {
	      host: host,
	      port: port
	    });
	  };
	}

	proto._createStream = function _createStream(req, handle) {
	  var state = this._spdyState;

	  var self = this;
	  return state.connection.reserveStream({
	    method: req.method,
	    path: req.path,
	    headers: req._headers,
	    host: state.host
	  }, function(err, stream) {
	    if (err)
	      return self.emit('error', err);

	    stream.on('response', function(status, headers) {
	      handle.emitResponse(status, headers);
	    });
	  });
	};

	// Public APIs

	proto.close = function close(callback) {
	  var state = this._spdyState;

	  if (state.connection === null) {
	    this.once('_connect', function() {
	      this.close(callback);
	    });
	    return;
	  }

	  state.connection.end(callback);
	};

	exports.Agent = instantiate(https.Agent);
	exports.PlainAgent = instantiate(http.Agent);

	exports.create = function create(base, options) {
	  if (typeof base === 'object') {
	    options = base;
	    base = null;
	  }

	  if (base)
	    return instantiate(base).create(options);

	  if (options.spdy && options.spdy.plain)
	    return exports.PlainAgent.create(options);
	  else
	    return exports.Agent.create(options);
	};


/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var transport = exports;

	// Exports utils
	transport.utils = __webpack_require__(87);

	// Export parser&framer
	transport.protocol = {};
	transport.protocol.base = __webpack_require__(88);
	transport.protocol.spdy = __webpack_require__(96);
	transport.protocol.http2 = __webpack_require__(105);

	// Window
	transport.Window = __webpack_require__(120);

	// Priority Tree
	transport.Priority = __webpack_require__(121);

	// Export Connection and Stream
	transport.Stream = __webpack_require__(122).Stream;
	transport.Connection = __webpack_require__(123).Connection;

	// Just for `transport.connection.create()`
	transport.connection = transport.Connection;


/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var util = __webpack_require__(77);

	function QueueItem() {
	  this.prev = null;
	  this.next = null;
	}
	exports.QueueItem = QueueItem;

	function Queue() {
	  QueueItem.call(this);

	  this.prev = this;
	  this.next = this;
	}
	util.inherits(Queue, QueueItem);
	exports.Queue = Queue;

	Queue.prototype.insertTail = function insertTail(item) {
	  item.prev = this.prev;
	  item.next = this;
	  item.prev.next = item;
	  item.next.prev = item;
	};

	Queue.prototype.remove = function remove(item) {
	  var next = item.next;
	  var prev = item.prev;

	  item.next = item;
	  item.prev = item;
	  next.prev = prev;
	  prev.next = next;
	};

	Queue.prototype.head = function head() {
	  return this.next;
	};

	Queue.prototype.tail = function tail() {
	  return this.prev;
	};

	Queue.prototype.isEmpty = function isEmpty() {
	  return this.next === this;
	};

	Queue.prototype.isRoot = function isRoot(item) {
	  return this === item;
	};

	function LockStream(stream) {
	  this.locked = false;
	  this.queue = [];
	  this.stream = stream;
	}
	exports.LockStream = LockStream;

	LockStream.prototype.write = function write(chunks, callback) {
	  var self = this;

	  // Do not let it interleave
	  if (this.locked) {
	    this.queue.push(function() {
	      return self.write(chunks, callback);
	    });
	    return;
	  }

	  this.locked = true;

	  function done(err, chunks) {
	    self.stream.removeListener('error', done);

	    self.locked = false;
	    if (self.queue.length > 0)
	      self.queue.shift()();
	    callback(err, chunks);
	  }

	  this.stream.on('error', done);

	  // Accumulate all output data
	  var output = [];
	  function onData(chunk) {
	    output.push(chunk);
	  }
	  this.stream.on('data', onData);

	  function next(err) {
	    self.stream.removeListener('data', onData);
	    if (err)
	      return done(err);

	    done(null, output);
	  }

	  for (var i = 0; i < chunks.length - 1; i++)
	    this.stream.write(chunks[i]);

	  if (chunks.length > 0)
	    this.stream.write(chunks[i], next);
	  else
	    process.nextTick(next);

	  if (this.stream.execute) {
	    this.stream.execute(function(err) {
	      if (err)
	        return done(err);
	    });
	  }
	};

	// Just finds the place in array to insert
	function binaryLookup(list, item, compare) {
	  var start = 0;
	  var end = list.length;

	  while (start < end) {
	    var pos = (start + end) >> 1;
	    var cmp = compare(item, list[pos]);

	    if (cmp === 0) {
	      start = pos;
	      end = pos;
	      break;
	    } else if (cmp < 0) {
	      end = pos;
	    } else {
	      start = pos + 1;
	    }
	  }

	  return start;
	}
	exports.binaryLookup = binaryLookup;

	function binaryInsert(list, item, compare) {
	  var index = binaryLookup(list, item, compare);

	  list.splice(index, 0, item);
	}
	exports.binaryInsert = binaryInsert;

	function binarySearch(list, item, compare) {
	  var index = binaryLookup(list, item, compare);

	  if (index >= list.length)
	    return -1;

	  if (compare(item, list[index]) === 0)
	    return index;

	  return -1;
	}
	exports.binarySearch = binarySearch;

	function Timeout(object) {
	  this.delay = 0;
	  this.timer = null;
	  this.object = object;
	}
	exports.Timeout = Timeout;

	Timeout.prototype.set = function set(delay, callback) {
	  this.delay = delay;
	  this.reset();
	  if (!callback)
	    return;

	  if (this.delay === 0)
	    this.object.removeListener('timeout', callback);
	  else
	    this.object.once('timeout', callback);
	};

	Timeout.prototype.reset = function reset() {
	  if (this.timer !== null) {
	    clearTimeout(this.timer);
	    this.timer = null;
	  }

	  if (this.delay === 0)
	    return;

	  var self = this;
	  this.timer = setTimeout(function() {
	    self.timer = null;
	    self.object.emit('timeout');
	  }, this.delay);
	};


/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.utils = __webpack_require__(89);
	exports.constants = __webpack_require__(90);
	exports.Scheduler = __webpack_require__(91);
	exports.Parser = __webpack_require__(93);
	exports.Framer = __webpack_require__(95);


/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = exports;

	var util = __webpack_require__(77);

	function ProtocolError(code, message) {
	  this.code = code;
	  this.message = message;
	}
	util.inherits(ProtocolError, Error);
	utils.ProtocolError = ProtocolError;

	utils.error = function error(code, message) {
	  return new ProtocolError(code, message);
	};

	utils.reverse = function reverse(object) {
	  var result = []

	  Object.keys(object).forEach(function(key) {
	    result[object[key] | 0] = key;
	  });

	  return result;
	};

	// weight [1, 36] <=> priority [0, 7]
	// This way weight=16 is preserved and has priority=3
	utils.weightToPriority = function weightToPriority(weight) {
	  return ((Math.min(35, (weight - 1)) / 35) * 7) | 0;
	};

	utils.priorityToWeight = function priorityToWeight(priority) {
	  return (((priority / 7) * 35) | 0) + 1;
	};

	// Copy-Paste from node
	exports.addHeaderLine = function addHeaderLine(field, value, dest) {
	  field = field.toLowerCase();
	  if (/^:/.test(field)) {
	    dest[field] = value;
	    return;
	  }

	  switch (field) {
	    // Array headers:
	    case 'set-cookie':
	      if (dest[field] !== undefined) {
	        dest[field].push(value);
	      } else {
	        dest[field] = [ value ];
	      }
	      break;

	    /* eslint-disable max-len */
	    // list is taken from:
	    /* eslint-enable max-len */
	    case 'content-type':
	    case 'content-length':
	    case 'user-agent':
	    case 'referer':
	    case 'host':
	    case 'authorization':
	    case 'proxy-authorization':
	    case 'if-modified-since':
	    case 'if-unmodified-since':
	    case 'from':
	    case 'location':
	    case 'max-forwards':
	      // drop duplicates
	      if (dest[field] === undefined)
	        dest[field] = value;
	      break;

	    case 'cookie':
	      // make semicolon-separated list
	      if (dest[field] !== undefined) {
	        dest[field] += '; ' + value;
	      } else {
	        dest[field] = value;
	      }
	      break;

	    default:
	      // make comma-separated list
	      if (dest[field] !== undefined) {
	        dest[field] += ', ' + value;
	      } else {
	        dest[field] = value;
	      }
	  }
	};


/***/ },
/* 90 */
/***/ function(module, exports) {

	exports.DEFAULT_METHOD = 'GET';
	exports.DEFAULT_HOST = 'localhost';
	exports.MAX_PRIORITY_STREAMS = 100;
	exports.DEFAULT_MAX_CHUNK = 8 * 1024;


/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var transport = __webpack_require__(86);
	var utils = transport.utils;

	var assert = __webpack_require__(75);
	var util = __webpack_require__(77);
	var debug = __webpack_require__(32)('spdy:scheduler');
	var Readable = __webpack_require__(92).Readable;

	/*
	 * We create following structure in `pending`:
	 * [ [ id = 0 ], [ id = 1 ], [ id = 2 ], [ id = 0 ] ]
	 *     chunks      chunks      chunks      chunks
	 *     chunks                  chunks
	 *     chunks
	 *
	 * Then on the `.tick()` pass we pick one chunks from each item and remove the
	 * item if it is empty:
	 *
	 * [ [ id = 0 ], [ id = 2 ] ]
	 *     chunks      chunks
	 *     chunks
	 *
	 * Writing out: chunks for 0, chunks for 1, chunks for 2, chunks for 0
	 *
	 * This way data is interleaved between the different streams.
	 */

	function Scheduler(options) {
	  Readable.call(this);

	  // Pretty big window by default
	  this.window = 0.25;

	  if (options && options.window)
	    this.window = options.window;

	  this.sync = [];
	  this.list = [];
	  this.count = 0;
	  this.pendingTick = false;
	}
	util.inherits(Scheduler, Readable);
	module.exports = Scheduler;

	// Just for testing, really
	Scheduler.create = function create(options) {
	  return new Scheduler(options);
	};

	function insertCompare(a, b) {
	  return a.priority === b.priority ?
	      a.stream - b.stream :
	      b.priority - a.priority;
	}

	Scheduler.prototype.schedule = function schedule(data) {
	  var priority = data.priority;
	  var stream = data.stream;
	  var chunks = data.chunks;

	  // Synchronous frames should not be interleaved
	  if (priority === false) {
	    debug('queue sync', chunks);
	    this.sync.push(data);
	    this.count += chunks.length;

	    this._read();
	    return;
	  }

	  debug('queue async priority=%d stream=%d', priority, stream, chunks);
	  var item = new SchedulerItem(stream, priority);
	  var index = utils.binaryLookup(this.list, item, insertCompare);

	  // Push new item
	  if (index >= this.list.length || insertCompare(this.list[index], item) !== 0)
	    this.list.splice(index, 0, item);
	  // Coalesce
	  else
	    item = this.list[index];

	  item.push(data);

	  this.count += chunks.length;

	  this._read();
	};

	Scheduler.prototype._read = function _read() {
	  if (this.count === 0)
	    return;

	  if (this.pendingTick)
	    return;
	  this.pendingTick = true;

	  var self = this;
	  process.nextTick(function() {
	    self.pendingTick = false;
	    self.tick();
	  });
	};

	Scheduler.prototype.tick = function tick() {
	  // No luck for async frames
	  if (!this.tickSync())
	    return false;

	  return this.tickAsync();
	};

	Scheduler.prototype.tickSync = function tickSync() {
	  // Empty sync queue first
	  var sync = this.sync;
	  var res = true;
	  this.sync = [];
	  for (var i = 0; i < sync.length; i++) {
	    var item = sync[i];
	    debug('tick sync pending=%d', this.count, item.chunks);
	    for (var j = 0; j < item.chunks.length; j++) {
	      this.count--;
	      res = this.push(item.chunks[j]);
	    }
	    debug('after tick sync pending=%d', this.count);

	    // TODO(indutny): figure out the way to invoke callback on actual write
	    if (item.callback)
	      item.callback(null);
	  }
	  return res;
	};

	Scheduler.prototype.tickAsync = function tickAsync() {
	  var res = true;
	  var list = this.list;
	  if (list.length === 0)
	    return res;

	  var startPriority = list[0].priority;
	  for (var index = 0; list.length > 0; index++) {
	    // Loop index
	    index %= list.length;
	    if (startPriority - list[index].priority > this.window)
	      index = 0;
	    debug('tick async index=%d start=%d', index, startPriority);

	    var current = list[index];
	    var item = current.shift();

	    if (current.isEmpty()) {
	      list.splice(index, 1);
	      if (index === 0 && list.length > 0)
	        startPriority = list[0].priority;
	      index--;
	    }

	    debug('tick async pending=%d', this.count, item.chunks);
	    for (var i = 0; i < item.chunks.length; i++) {
	      this.count--;
	      res = this.push(item.chunks[i]);
	    }
	    debug('after tick pending=%d', this.count);

	    // TODO(indutny): figure out the way to invoke callback on actual write
	    if (item.callback)
	      item.callback(null);
	    if (!res)
	      break;
	  }

	  return res;
	};

	Scheduler.prototype.dump = function dump() {
	  this.tickSync();

	  // Write everything out
	  while (!this.tickAsync()) {
	    // Intentional no-op
	  }
	  assert.equal(this.count, 0);
	};

	function SchedulerItem(stream, priority) {
	  this.stream = stream;
	  this.priority = priority;
	  this.queue = [];
	}

	SchedulerItem.prototype.push = function push(chunks) {
	  this.queue.push(chunks);
	};

	SchedulerItem.prototype.shift = function shift() {
	  return this.queue.shift();
	};

	SchedulerItem.prototype.isEmpty = function isEmpty() {
	  return this.queue.length === 0;
	};


/***/ },
/* 92 */
/***/ function(module, exports) {

	module.exports = require("readable-stream");

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var transport = __webpack_require__(86);

	var util = __webpack_require__(77);
	var utils = __webpack_require__(88).utils;
	var OffsetBuffer = __webpack_require__(94);
	var Transform = __webpack_require__(92).Transform;

	function Parser(options) {
	  Transform.call(this, {
	    readableObjectMode: true
	  });

	  this.buffer = new OffsetBuffer();
	  this.partial = false;
	  this.waiting = 0;

	  this.window = options.window;

	  this.version = null;
	  this.decompress = null;
	  this.dead = false;
	}
	module.exports = Parser;
	util.inherits(Parser, Transform);

	Parser.prototype.error = utils.error;

	Parser.prototype.kill = function kill() {
	  this.dead = true;
	};

	Parser.prototype._transform = function transform(data, encoding, cb) {
	  if (!this.dead)
	    this.buffer.push(data);

	  this._consume(cb);
	};

	Parser.prototype._consume = function _consume(cb) {
	  var self = this;

	  function next(err, frame) {
	    if (err)
	      return cb(err);

	    if (Array.isArray(frame)) {
	      for (var i = 0; i < frame.length; i++)
	        self.push(frame[i]);
	    } else if (frame) {
	      self.push(frame);
	    }

	    // Consume more packets
	    if (!sync)
	      return self._consume(cb);

	    process.nextTick(function() {
	      self._consume(cb);
	    });
	  }

	  if (this.dead)
	    return cb();


	  if (this.buffer.size < this.waiting) {
	    // No data at all
	    if (this.buffer.size === 0)
	      return cb();

	    // Partial DATA frame or something that we can process partially
	    if (this.partial) {
	      var partial = this.buffer.clone(this.buffer.size);
	      this.buffer.skip(partial.size);
	      this.waiting -= partial.size;

	      this.executePartial(partial, next);
	      return;
	    }

	    // We shall not do anything until we get all expected data
	    return cb();
	  }

	  var sync = true;

	  var content = this.buffer.clone(this.waiting);
	  this.buffer.skip(this.waiting);

	  this.execute(content, next);
	  sync = false;
	};

	Parser.prototype.setVersion = function setVersion(version) {
	  this.version = version;
	  this.emit('version', version);
	};

	Parser.prototype.setCompression = function setCompresion(pair) {
	  this.decompress = new transport.utils.LockStream(pair.decompress);
	};


/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	var Buffer = __webpack_require__(78).Buffer;

	function OffsetBuffer() {
	  this.offset = 0;
	  this.size = 0;
	  this.buffers = [];
	}
	module.exports = OffsetBuffer;

	OffsetBuffer.prototype.isEmpty = function isEmpty() {
	  return this.size === 0;
	};

	OffsetBuffer.prototype.clone = function clone(size) {
	  var r = new OffsetBuffer();
	  r.offset = this.offset;
	  r.size = size;
	  r.buffers = this.buffers.slice();
	  return r;
	};

	OffsetBuffer.prototype.toChunks = function toChunks() {
	  if (this.size === 0)
	    return [];

	  // We are going to slice it anyway
	  if (this.offset !== 0) {
	    this.buffers[0] = this.buffers[0].slice(this.offset);
	    this.offset = 0;
	  }

	  var chunks = [ ];
	  var off = 0;
	  for (var i = 0; off <= this.size && i < this.buffers.length; i++) {
	    var buf = this.buffers[i];
	    off += buf.length;

	    // Slice off last buffer
	    if (off > this.size) {
	      buf = buf.slice(0, buf.length - (off - this.size));
	      this.buffers[i] = buf;
	    }

	    chunks.push(buf);
	  }

	  // If some buffers were skipped - trim length
	  if (i < this.buffers.length)
	    this.buffers.length = i;

	  return chunks;
	};

	OffsetBuffer.prototype.toString = function toString(enc) {
	  return this.toChunks().map(function(c) {
	    return c.toString(enc);
	  }).join('');
	};

	OffsetBuffer.prototype.use = function use(buf, off, n) {
	  this.buffers = [ buf ];
	  this.offset = off;
	  this.size = n;
	};

	OffsetBuffer.prototype.push = function push(data) {
	  // Ignore empty writes
	  if (data.length === 0)
	    return;

	  this.size += data.length;
	  this.buffers.push(data);
	};

	OffsetBuffer.prototype.has = function has(n) {
	  return this.size >= n;
	};

	OffsetBuffer.prototype.skip = function skip(n) {
	  if (this.size === 0)
	    return;

	  this.size -= n;

	  // Fast case, skip bytes in a first buffer
	  if (this.offset + n < this.buffers[0].length) {
	    this.offset += n;
	    return;
	  }

	  var left = n - (this.buffers[0].length - this.offset);
	  this.offset = 0;

	  for (var shift = 1; left > 0 && shift < this.buffers.length; shift++) {
	    var buf = this.buffers[shift];
	    if (buf.length > left) {
	      this.offset = left;
	      break;
	    }
	    left -= buf.length;
	  }
	  this.buffers = this.buffers.slice(shift);
	};

	OffsetBuffer.prototype.copy = function copy(target, targetOff, off, n) {
	  if (this.size === 0)
	    return;
	  if (off !== 0)
	    throw new Error('Unsupported offset in .copy()');

	  var toff = targetOff;
	  var first = this.buffers[0];
	  var toCopy = Math.min(n, first.length - this.offset);
	  first.copy(target, toff, this.offset, this.offset + toCopy);

	  toff += toCopy;
	  var left = n - toCopy;
	  for (var i = 1; left > 0 && i < this.buffers.length; i++) {
	    var buf = this.buffers[i];
	    var toCopy = Math.min(left, buf.length);

	    buf.copy(target, toff, 0, toCopy);

	    toff += toCopy;
	    left -= toCopy;
	  }
	};

	OffsetBuffer.prototype.take = function take(n) {
	  if (n === 0)
	    return new Buffer(0);

	  this.size -= n;

	  // Fast cases
	  var first = this.buffers[0].length - this.offset;
	  if (first === n) {
	    var r = this.buffers.shift();
	    if (this.offset !== 0) {
	      r = r.slice(this.offset);
	      this.offset = 0;
	    }
	    return r;
	  } else if (first > n) {
	    var r = this.buffers[0].slice(this.offset, this.offset + n);
	    this.offset += n;
	    return r;
	  }

	  // Allocate and fill buffer
	  var out = new Buffer(n);
	  var toOff = 0;
	  var startOff = this.offset;
	  for (var i = 0; toOff !== n && i < this.buffers.length; i++) {
	    var buf = this.buffers[i];
	    var toCopy = Math.min(buf.length - startOff, n - toOff);

	    buf.copy(out, toOff, startOff, startOff + toCopy);
	    if (startOff + toCopy < buf.length) {
	      this.offset = startOff + toCopy;
	      break;
	    } else {
	      toOff += toCopy;
	      startOff = 0;
	    }
	  }

	  this.buffers = this.buffers.slice(i);
	  if (this.buffers.length === 0)
	    this.offset = 0;

	  return out;
	};

	OffsetBuffer.prototype.peekUInt8 = function peekUInt8() {
	  return this.buffers[0][this.offset];
	};

	OffsetBuffer.prototype.readUInt8 = function readUInt8() {
	  this.size -= 1;
	  var first = this.buffers[0];
	  var r = first[this.offset];
	  if (++this.offset === first.length) {
	    this.offset = 0;
	    this.buffers.shift();
	  }

	  return r;
	};

	OffsetBuffer.prototype.readUInt16LE = function readUInt16LE() {
	  var first = this.buffers[0];
	  this.size -= 2;

	  var r;
	  var shift;

	  // Fast case - first buffer has all bytes
	  if (first.length - this.offset >= 2) {
	    r = first.readUInt16LE(this.offset, true);
	    shift = 0;
	    this.offset += 2;

	  // One byte here - one byte there
	  } else {
	    r = first[this.offset] | (this.buffers[1][0] << 8);
	    shift = 1;
	    this.offset = 1;
	  }

	  if (this.offset === this.buffers[shift].length) {
	    this.offset = 0;
	    shift++;
	  }
	  if (shift !== 0)
	    this.buffers = this.buffers.slice(shift);

	  return r;
	};

	OffsetBuffer.prototype.readUInt24LE = function readUInt24LE() {
	  var first = this.buffers[0];

	  var r;
	  var shift;
	  var firstHas = first.length - this.offset;

	  // Fast case - first buffer has all bytes
	  if (firstHas >= 3) {
	    r = first.readUInt16LE(this.offset, true) | (first[this.offset + 2] << 16);
	    shift = 0;
	    this.offset += 3;

	  // First buffer has 2 of 3 bytes
	  } else if (firstHas >= 2) {
	    r = first.readUInt16LE(this.offset, true) | (this.buffers[1][0] << 16);
	    shift = 1;
	    this.offset = 1;

	  // Slow case: First buffer has 1 of 3 bytes
	  } else {
	    r = first[this.offset];
	    this.offset = 0;
	    this.buffers.shift();
	    this.size -= 1;

	    r |= this.readUInt16LE() << 8;
	    return r;
	  }

	  this.size -= 3;
	  if (this.offset === this.buffers[shift].length) {
	    this.offset = 0;
	    shift++;
	  }
	  if (shift !== 0)
	    this.buffers = this.buffers.slice(shift);

	  return r;
	};

	OffsetBuffer.prototype.readUInt32LE = function readUInt32LE() {
	  var first = this.buffers[0];

	  var r;
	  var shift;
	  var firstHas = first.length - this.offset;

	  // Fast case - first buffer has all bytes
	  if (firstHas >= 4) {
	    r = first.readUInt32LE(this.offset, true);
	    shift = 0;
	    this.offset += 4;

	  // First buffer has 3 of 4 bytes
	  } else if (firstHas >= 3) {
	    r = (first.readUInt16LE(this.offset, true) |
	         (first[this.offset + 2] << 16)) +
	        (this.buffers[1][0] * 0x1000000);
	    shift = 1;
	    this.offset = 1;

	  // Slow case: First buffer has 2 of 4 bytes
	  } else if (firstHas >= 2) {
	    r = first.readUInt16LE(this.offset, true);
	    this.offset = 0;
	    this.buffers.shift();
	    this.size -= 2;

	    r += this.readUInt16LE() * 0x10000;
	    return r;

	  // Slow case: First buffer has 1 of 4 bytes
	  } else {
	    r = first[this.offset];
	    this.offset = 0;
	    this.buffers.shift();
	    this.size -= 1;

	    r += this.readUInt24LE() * 0x100;
	    return r;
	  }

	  this.size -= 4;
	  if (this.offset === this.buffers[shift].length) {
	    this.offset = 0;
	    shift++;
	  }
	  if (shift !== 0)
	    this.buffers = this.buffers.slice(shift);

	  return r;
	};

	OffsetBuffer.prototype.readUInt16BE = function readUInt16BE() {
	  var r = this.readUInt16LE();

	  return ((r & 0xff) << 8) | (r >> 8);
	};

	OffsetBuffer.prototype.readUInt24BE = function readUInt24BE() {
	  var r = this.readUInt24LE();

	  return ((r & 0xff) << 16) | (((r >> 8) & 0xff) << 8) | (r >> 16);
	};

	OffsetBuffer.prototype.readUInt32BE = function readUInt32BE() {
	  var r = this.readUInt32LE();

	  return (((r & 0xff) << 24) |
	          (((r >>> 8) & 0xff) << 16) |
	          (((r >>> 16) & 0xff) << 8) |
	          (r >>> 24)) >>> 0;
	};

	// Signed number APIs

	function signedInt8(num) {
	  if (num >= 0x80)
	    return -(0xff ^ num) - 1;
	  else
	    return num;
	}

	OffsetBuffer.prototype.peekInt8 = function peekInt8() {
	  return signedInt8(this.peekUInt8());
	};

	OffsetBuffer.prototype.readInt8 = function readInt8() {
	  return signedInt8(this.readUInt8());
	};

	function signedInt16(num) {
	  if (num >= 0x8000)
	    return -(0xffff ^ num) - 1;
	  else
	    return num;
	}

	OffsetBuffer.prototype.readInt16BE = function readInt16BE() {
	  return signedInt16(this.readUInt16BE());
	};

	OffsetBuffer.prototype.readInt16LE = function readInt16LE() {
	  return signedInt16(this.readUInt16LE());
	};

	function signedInt24(num) {
	  if (num >= 0x800000)
	    return -(0xffffff ^ num) - 1;
	  else
	    return num;
	}

	OffsetBuffer.prototype.readInt24BE = function readInt24BE() {
	  return signedInt24(this.readUInt24BE());
	};

	OffsetBuffer.prototype.readInt24LE = function readInt24LE() {
	  return signedInt24(this.readUInt24LE());
	};

	function signedInt32(num) {
	  if (num >= 0x80000000)
	    return -(0xffffffff ^ num) - 1;
	  else
	    return num;
	}

	OffsetBuffer.prototype.readInt32BE = function readInt32BE() {
	  return signedInt32(this.readUInt32BE());
	};

	OffsetBuffer.prototype.readInt32LE = function readInt32LE() {
	  return signedInt32(this.readUInt32LE());
	};


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var util = __webpack_require__(77);

	var transport = __webpack_require__(86);
	var base = __webpack_require__(88);
	var Scheduler = base.Scheduler;

	function Framer(options) {
	  Scheduler.call(this);

	  this.version = null;
	  this.compress = null;
	  this.window = options.window;
	  this.timeout = options.timeout;

	  // Wait for `enablePush`
	  this.pushEnabled = null;
	}
	util.inherits(Framer, Scheduler);
	module.exports = Framer;

	Framer.prototype.setVersion = function setVersion(version) {
	  this.version = version;
	  this.emit('version');
	};

	Framer.prototype.setCompression = function setCompresion(pair) {
	  this.compress = new transport.utils.LockStream(pair.compress);
	};

	Framer.prototype.enablePush = function enablePush(enable) {
	  this.pushEnabled = enable;
	  this.emit('_pushEnabled');
	};

	Framer.prototype._checkPush = function _checkPush(callback) {
	  if (this.pushEnabled === null) {
	    this.once('_pushEnabled', function() {
	      this._checkPush(callback);
	    });
	    return;
	  }

	  var self = this;
	  var err = null;
	  if (!this.pushEnabled)
	    err = new Error('PUSH_PROMISE disabled by other side');
	  process.nextTick(function() {
	    return callback(err);
	  });
	};

	Framer.prototype._resetTimeout = function _resetTimeout() {
	  if (this.timeout)
	    this.timeout.reset();
	};


/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.name = 'spdy';

	exports.dictionary = __webpack_require__(97);
	exports.constants = __webpack_require__(98);
	exports.parser = __webpack_require__(99);
	exports.framer = __webpack_require__(100);
	exports.compressionPool = __webpack_require__(103);


/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Buffer = __webpack_require__(78).Buffer;

	var dictionary = {};
	module.exports = dictionary;

	dictionary[2] = new Buffer([
	  'optionsgetheadpostputdeletetraceacceptaccept-charsetaccept-encodingaccept-',
	  'languageauthorizationexpectfromhostif-modified-sinceif-matchif-none-matchi',
	  'f-rangeif-unmodifiedsincemax-forwardsproxy-authorizationrangerefererteuser',
	  '-agent10010120020120220320420520630030130230330430530630740040140240340440',
	  '5406407408409410411412413414415416417500501502503504505accept-rangesageeta',
	  'glocationproxy-authenticatepublicretry-afterservervarywarningwww-authentic',
	  'ateallowcontent-basecontent-encodingcache-controlconnectiondatetrailertran',
	  'sfer-encodingupgradeviawarningcontent-languagecontent-lengthcontent-locati',
	  'oncontent-md5content-rangecontent-typeetagexpireslast-modifiedset-cookieMo',
	  'ndayTuesdayWednesdayThursdayFridaySaturdaySundayJanFebMarAprMayJunJulAugSe',
	  'pOctNovDecchunkedtext/htmlimage/pngimage/jpgimage/gifapplication/xmlapplic',
	  'ation/xhtmltext/plainpublicmax-agecharset=iso-8859-1utf-8gzipdeflateHTTP/1',
	  '.1statusversionurl\x00'
	].join(''));

	dictionary[3] = new Buffer([
	  0x00, 0x00, 0x00, 0x07, 0x6f, 0x70, 0x74, 0x69,  // ....opti
	  0x6f, 0x6e, 0x73, 0x00, 0x00, 0x00, 0x04, 0x68,  // ons....h
	  0x65, 0x61, 0x64, 0x00, 0x00, 0x00, 0x04, 0x70,  // ead....p
	  0x6f, 0x73, 0x74, 0x00, 0x00, 0x00, 0x03, 0x70,  // ost....p
	  0x75, 0x74, 0x00, 0x00, 0x00, 0x06, 0x64, 0x65,  // ut....de
	  0x6c, 0x65, 0x74, 0x65, 0x00, 0x00, 0x00, 0x05,  // lete....
	  0x74, 0x72, 0x61, 0x63, 0x65, 0x00, 0x00, 0x00,  // trace...
	  0x06, 0x61, 0x63, 0x63, 0x65, 0x70, 0x74, 0x00,  // .accept.
	  0x00, 0x00, 0x0e, 0x61, 0x63, 0x63, 0x65, 0x70,  // ...accep
	  0x74, 0x2d, 0x63, 0x68, 0x61, 0x72, 0x73, 0x65,  // t-charse
	  0x74, 0x00, 0x00, 0x00, 0x0f, 0x61, 0x63, 0x63,  // t....acc
	  0x65, 0x70, 0x74, 0x2d, 0x65, 0x6e, 0x63, 0x6f,  // ept-enco
	  0x64, 0x69, 0x6e, 0x67, 0x00, 0x00, 0x00, 0x0f,  // ding....
	  0x61, 0x63, 0x63, 0x65, 0x70, 0x74, 0x2d, 0x6c,  // accept-l
	  0x61, 0x6e, 0x67, 0x75, 0x61, 0x67, 0x65, 0x00,  // anguage.
	  0x00, 0x00, 0x0d, 0x61, 0x63, 0x63, 0x65, 0x70,  // ...accep
	  0x74, 0x2d, 0x72, 0x61, 0x6e, 0x67, 0x65, 0x73,  // t-ranges
	  0x00, 0x00, 0x00, 0x03, 0x61, 0x67, 0x65, 0x00,  // ....age.
	  0x00, 0x00, 0x05, 0x61, 0x6c, 0x6c, 0x6f, 0x77,  // ...allow
	  0x00, 0x00, 0x00, 0x0d, 0x61, 0x75, 0x74, 0x68,  // ....auth
	  0x6f, 0x72, 0x69, 0x7a, 0x61, 0x74, 0x69, 0x6f,  // orizatio
	  0x6e, 0x00, 0x00, 0x00, 0x0d, 0x63, 0x61, 0x63,  // n....cac
	  0x68, 0x65, 0x2d, 0x63, 0x6f, 0x6e, 0x74, 0x72,  // he-contr
	  0x6f, 0x6c, 0x00, 0x00, 0x00, 0x0a, 0x63, 0x6f,  // ol....co
	  0x6e, 0x6e, 0x65, 0x63, 0x74, 0x69, 0x6f, 0x6e,  // nnection
	  0x00, 0x00, 0x00, 0x0c, 0x63, 0x6f, 0x6e, 0x74,  // ....cont
	  0x65, 0x6e, 0x74, 0x2d, 0x62, 0x61, 0x73, 0x65,  // ent-base
	  0x00, 0x00, 0x00, 0x10, 0x63, 0x6f, 0x6e, 0x74,  // ....cont
	  0x65, 0x6e, 0x74, 0x2d, 0x65, 0x6e, 0x63, 0x6f,  // ent-enco
	  0x64, 0x69, 0x6e, 0x67, 0x00, 0x00, 0x00, 0x10,  // ding....
	  0x63, 0x6f, 0x6e, 0x74, 0x65, 0x6e, 0x74, 0x2d,  // content-
	  0x6c, 0x61, 0x6e, 0x67, 0x75, 0x61, 0x67, 0x65,  // language
	  0x00, 0x00, 0x00, 0x0e, 0x63, 0x6f, 0x6e, 0x74,  // ....cont
	  0x65, 0x6e, 0x74, 0x2d, 0x6c, 0x65, 0x6e, 0x67,  // ent-leng
	  0x74, 0x68, 0x00, 0x00, 0x00, 0x10, 0x63, 0x6f,  // th....co
	  0x6e, 0x74, 0x65, 0x6e, 0x74, 0x2d, 0x6c, 0x6f,  // ntent-lo
	  0x63, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x00, 0x00,  // cation..
	  0x00, 0x0b, 0x63, 0x6f, 0x6e, 0x74, 0x65, 0x6e,  // ..conten
	  0x74, 0x2d, 0x6d, 0x64, 0x35, 0x00, 0x00, 0x00,  // t-md5...
	  0x0d, 0x63, 0x6f, 0x6e, 0x74, 0x65, 0x6e, 0x74,  // .content
	  0x2d, 0x72, 0x61, 0x6e, 0x67, 0x65, 0x00, 0x00,  // -range..
	  0x00, 0x0c, 0x63, 0x6f, 0x6e, 0x74, 0x65, 0x6e,  // ..conten
	  0x74, 0x2d, 0x74, 0x79, 0x70, 0x65, 0x00, 0x00,  // t-type..
	  0x00, 0x04, 0x64, 0x61, 0x74, 0x65, 0x00, 0x00,  // ..date..
	  0x00, 0x04, 0x65, 0x74, 0x61, 0x67, 0x00, 0x00,  // ..etag..
	  0x00, 0x06, 0x65, 0x78, 0x70, 0x65, 0x63, 0x74,  // ..expect
	  0x00, 0x00, 0x00, 0x07, 0x65, 0x78, 0x70, 0x69,  // ....expi
	  0x72, 0x65, 0x73, 0x00, 0x00, 0x00, 0x04, 0x66,  // res....f
	  0x72, 0x6f, 0x6d, 0x00, 0x00, 0x00, 0x04, 0x68,  // rom....h
	  0x6f, 0x73, 0x74, 0x00, 0x00, 0x00, 0x08, 0x69,  // ost....i
	  0x66, 0x2d, 0x6d, 0x61, 0x74, 0x63, 0x68, 0x00,  // f-match.
	  0x00, 0x00, 0x11, 0x69, 0x66, 0x2d, 0x6d, 0x6f,  // ...if-mo
	  0x64, 0x69, 0x66, 0x69, 0x65, 0x64, 0x2d, 0x73,  // dified-s
	  0x69, 0x6e, 0x63, 0x65, 0x00, 0x00, 0x00, 0x0d,  // ince....
	  0x69, 0x66, 0x2d, 0x6e, 0x6f, 0x6e, 0x65, 0x2d,  // if-none-
	  0x6d, 0x61, 0x74, 0x63, 0x68, 0x00, 0x00, 0x00,  // match...
	  0x08, 0x69, 0x66, 0x2d, 0x72, 0x61, 0x6e, 0x67,  // .if-rang
	  0x65, 0x00, 0x00, 0x00, 0x13, 0x69, 0x66, 0x2d,  // e....if-
	  0x75, 0x6e, 0x6d, 0x6f, 0x64, 0x69, 0x66, 0x69,  // unmodifi
	  0x65, 0x64, 0x2d, 0x73, 0x69, 0x6e, 0x63, 0x65,  // ed-since
	  0x00, 0x00, 0x00, 0x0d, 0x6c, 0x61, 0x73, 0x74,  // ....last
	  0x2d, 0x6d, 0x6f, 0x64, 0x69, 0x66, 0x69, 0x65,  // -modifie
	  0x64, 0x00, 0x00, 0x00, 0x08, 0x6c, 0x6f, 0x63,  // d....loc
	  0x61, 0x74, 0x69, 0x6f, 0x6e, 0x00, 0x00, 0x00,  // ation...
	  0x0c, 0x6d, 0x61, 0x78, 0x2d, 0x66, 0x6f, 0x72,  // .max-for
	  0x77, 0x61, 0x72, 0x64, 0x73, 0x00, 0x00, 0x00,  // wards...
	  0x06, 0x70, 0x72, 0x61, 0x67, 0x6d, 0x61, 0x00,  // .pragma.
	  0x00, 0x00, 0x12, 0x70, 0x72, 0x6f, 0x78, 0x79,  // ...proxy
	  0x2d, 0x61, 0x75, 0x74, 0x68, 0x65, 0x6e, 0x74,  // -authent
	  0x69, 0x63, 0x61, 0x74, 0x65, 0x00, 0x00, 0x00,  // icate...
	  0x13, 0x70, 0x72, 0x6f, 0x78, 0x79, 0x2d, 0x61,  // .proxy-a
	  0x75, 0x74, 0x68, 0x6f, 0x72, 0x69, 0x7a, 0x61,  // uthoriza
	  0x74, 0x69, 0x6f, 0x6e, 0x00, 0x00, 0x00, 0x05,  // tion....
	  0x72, 0x61, 0x6e, 0x67, 0x65, 0x00, 0x00, 0x00,  // range...
	  0x07, 0x72, 0x65, 0x66, 0x65, 0x72, 0x65, 0x72,  // .referer
	  0x00, 0x00, 0x00, 0x0b, 0x72, 0x65, 0x74, 0x72,  // ....retr
	  0x79, 0x2d, 0x61, 0x66, 0x74, 0x65, 0x72, 0x00,  // y-after.
	  0x00, 0x00, 0x06, 0x73, 0x65, 0x72, 0x76, 0x65,  // ...serve
	  0x72, 0x00, 0x00, 0x00, 0x02, 0x74, 0x65, 0x00,  // r....te.
	  0x00, 0x00, 0x07, 0x74, 0x72, 0x61, 0x69, 0x6c,  // ...trail
	  0x65, 0x72, 0x00, 0x00, 0x00, 0x11, 0x74, 0x72,  // er....tr
	  0x61, 0x6e, 0x73, 0x66, 0x65, 0x72, 0x2d, 0x65,  // ansfer-e
	  0x6e, 0x63, 0x6f, 0x64, 0x69, 0x6e, 0x67, 0x00,  // ncoding.
	  0x00, 0x00, 0x07, 0x75, 0x70, 0x67, 0x72, 0x61,  // ...upgra
	  0x64, 0x65, 0x00, 0x00, 0x00, 0x0a, 0x75, 0x73,  // de....us
	  0x65, 0x72, 0x2d, 0x61, 0x67, 0x65, 0x6e, 0x74,  // er-agent
	  0x00, 0x00, 0x00, 0x04, 0x76, 0x61, 0x72, 0x79,  // ....vary
	  0x00, 0x00, 0x00, 0x03, 0x76, 0x69, 0x61, 0x00,  // ....via.
	  0x00, 0x00, 0x07, 0x77, 0x61, 0x72, 0x6e, 0x69,  // ...warni
	  0x6e, 0x67, 0x00, 0x00, 0x00, 0x10, 0x77, 0x77,  // ng....ww
	  0x77, 0x2d, 0x61, 0x75, 0x74, 0x68, 0x65, 0x6e,  // w-authen
	  0x74, 0x69, 0x63, 0x61, 0x74, 0x65, 0x00, 0x00,  // ticate..
	  0x00, 0x06, 0x6d, 0x65, 0x74, 0x68, 0x6f, 0x64,  // ..method
	  0x00, 0x00, 0x00, 0x03, 0x67, 0x65, 0x74, 0x00,  // ....get.
	  0x00, 0x00, 0x06, 0x73, 0x74, 0x61, 0x74, 0x75,  // ...statu
	  0x73, 0x00, 0x00, 0x00, 0x06, 0x32, 0x30, 0x30,  // s....200
	  0x20, 0x4f, 0x4b, 0x00, 0x00, 0x00, 0x07, 0x76,  // .OK....v
	  0x65, 0x72, 0x73, 0x69, 0x6f, 0x6e, 0x00, 0x00,  // ersion..
	  0x00, 0x08, 0x48, 0x54, 0x54, 0x50, 0x2f, 0x31,  // ..HTTP.1
	  0x2e, 0x31, 0x00, 0x00, 0x00, 0x03, 0x75, 0x72,  // .1....ur
	  0x6c, 0x00, 0x00, 0x00, 0x06, 0x70, 0x75, 0x62,  // l....pub
	  0x6c, 0x69, 0x63, 0x00, 0x00, 0x00, 0x0a, 0x73,  // lic....s
	  0x65, 0x74, 0x2d, 0x63, 0x6f, 0x6f, 0x6b, 0x69,  // et-cooki
	  0x65, 0x00, 0x00, 0x00, 0x0a, 0x6b, 0x65, 0x65,  // e....kee
	  0x70, 0x2d, 0x61, 0x6c, 0x69, 0x76, 0x65, 0x00,  // p-alive.
	  0x00, 0x00, 0x06, 0x6f, 0x72, 0x69, 0x67, 0x69,  // ...origi
	  0x6e, 0x31, 0x30, 0x30, 0x31, 0x30, 0x31, 0x32,  // n1001012
	  0x30, 0x31, 0x32, 0x30, 0x32, 0x32, 0x30, 0x35,  // 01202205
	  0x32, 0x30, 0x36, 0x33, 0x30, 0x30, 0x33, 0x30,  // 20630030
	  0x32, 0x33, 0x30, 0x33, 0x33, 0x30, 0x34, 0x33,  // 23033043
	  0x30, 0x35, 0x33, 0x30, 0x36, 0x33, 0x30, 0x37,  // 05306307
	  0x34, 0x30, 0x32, 0x34, 0x30, 0x35, 0x34, 0x30,  // 40240540
	  0x36, 0x34, 0x30, 0x37, 0x34, 0x30, 0x38, 0x34,  // 64074084
	  0x30, 0x39, 0x34, 0x31, 0x30, 0x34, 0x31, 0x31,  // 09410411
	  0x34, 0x31, 0x32, 0x34, 0x31, 0x33, 0x34, 0x31,  // 41241341
	  0x34, 0x34, 0x31, 0x35, 0x34, 0x31, 0x36, 0x34,  // 44154164
	  0x31, 0x37, 0x35, 0x30, 0x32, 0x35, 0x30, 0x34,  // 17502504
	  0x35, 0x30, 0x35, 0x32, 0x30, 0x33, 0x20, 0x4e,  // 505203.N
	  0x6f, 0x6e, 0x2d, 0x41, 0x75, 0x74, 0x68, 0x6f,  // on-Autho
	  0x72, 0x69, 0x74, 0x61, 0x74, 0x69, 0x76, 0x65,  // ritative
	  0x20, 0x49, 0x6e, 0x66, 0x6f, 0x72, 0x6d, 0x61,  // .Informa
	  0x74, 0x69, 0x6f, 0x6e, 0x32, 0x30, 0x34, 0x20,  // tion204.
	  0x4e, 0x6f, 0x20, 0x43, 0x6f, 0x6e, 0x74, 0x65,  // No.Conte
	  0x6e, 0x74, 0x33, 0x30, 0x31, 0x20, 0x4d, 0x6f,  // nt301.Mo
	  0x76, 0x65, 0x64, 0x20, 0x50, 0x65, 0x72, 0x6d,  // ved.Perm
	  0x61, 0x6e, 0x65, 0x6e, 0x74, 0x6c, 0x79, 0x34,  // anently4
	  0x30, 0x30, 0x20, 0x42, 0x61, 0x64, 0x20, 0x52,  // 00.Bad.R
	  0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x34, 0x30,  // equest40
	  0x31, 0x20, 0x55, 0x6e, 0x61, 0x75, 0x74, 0x68,  // 1.Unauth
	  0x6f, 0x72, 0x69, 0x7a, 0x65, 0x64, 0x34, 0x30,  // orized40
	  0x33, 0x20, 0x46, 0x6f, 0x72, 0x62, 0x69, 0x64,  // 3.Forbid
	  0x64, 0x65, 0x6e, 0x34, 0x30, 0x34, 0x20, 0x4e,  // den404.N
	  0x6f, 0x74, 0x20, 0x46, 0x6f, 0x75, 0x6e, 0x64,  // ot.Found
	  0x35, 0x30, 0x30, 0x20, 0x49, 0x6e, 0x74, 0x65,  // 500.Inte
	  0x72, 0x6e, 0x61, 0x6c, 0x20, 0x53, 0x65, 0x72,  // rnal.Ser
	  0x76, 0x65, 0x72, 0x20, 0x45, 0x72, 0x72, 0x6f,  // ver.Erro
	  0x72, 0x35, 0x30, 0x31, 0x20, 0x4e, 0x6f, 0x74,  // r501.Not
	  0x20, 0x49, 0x6d, 0x70, 0x6c, 0x65, 0x6d, 0x65,  // .Impleme
	  0x6e, 0x74, 0x65, 0x64, 0x35, 0x30, 0x33, 0x20,  // nted503.
	  0x53, 0x65, 0x72, 0x76, 0x69, 0x63, 0x65, 0x20,  // Service.
	  0x55, 0x6e, 0x61, 0x76, 0x61, 0x69, 0x6c, 0x61,  // Unavaila
	  0x62, 0x6c, 0x65, 0x4a, 0x61, 0x6e, 0x20, 0x46,  // bleJan.F
	  0x65, 0x62, 0x20, 0x4d, 0x61, 0x72, 0x20, 0x41,  // eb.Mar.A
	  0x70, 0x72, 0x20, 0x4d, 0x61, 0x79, 0x20, 0x4a,  // pr.May.J
	  0x75, 0x6e, 0x20, 0x4a, 0x75, 0x6c, 0x20, 0x41,  // un.Jul.A
	  0x75, 0x67, 0x20, 0x53, 0x65, 0x70, 0x74, 0x20,  // ug.Sept.
	  0x4f, 0x63, 0x74, 0x20, 0x4e, 0x6f, 0x76, 0x20,  // Oct.Nov.
	  0x44, 0x65, 0x63, 0x20, 0x30, 0x30, 0x3a, 0x30,  // Dec.00.0
	  0x30, 0x3a, 0x30, 0x30, 0x20, 0x4d, 0x6f, 0x6e,  // 0.00.Mon
	  0x2c, 0x20, 0x54, 0x75, 0x65, 0x2c, 0x20, 0x57,  // ..Tue..W
	  0x65, 0x64, 0x2c, 0x20, 0x54, 0x68, 0x75, 0x2c,  // ed..Thu.
	  0x20, 0x46, 0x72, 0x69, 0x2c, 0x20, 0x53, 0x61,  // .Fri..Sa
	  0x74, 0x2c, 0x20, 0x53, 0x75, 0x6e, 0x2c, 0x20,  // t..Sun..
	  0x47, 0x4d, 0x54, 0x63, 0x68, 0x75, 0x6e, 0x6b,  // GMTchunk
	  0x65, 0x64, 0x2c, 0x74, 0x65, 0x78, 0x74, 0x2f,  // ed.text.
	  0x68, 0x74, 0x6d, 0x6c, 0x2c, 0x69, 0x6d, 0x61,  // html.ima
	  0x67, 0x65, 0x2f, 0x70, 0x6e, 0x67, 0x2c, 0x69,  // ge.png.i
	  0x6d, 0x61, 0x67, 0x65, 0x2f, 0x6a, 0x70, 0x67,  // mage.jpg
	  0x2c, 0x69, 0x6d, 0x61, 0x67, 0x65, 0x2f, 0x67,  // .image.g
	  0x69, 0x66, 0x2c, 0x61, 0x70, 0x70, 0x6c, 0x69,  // if.appli
	  0x63, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x2f, 0x78,  // cation.x
	  0x6d, 0x6c, 0x2c, 0x61, 0x70, 0x70, 0x6c, 0x69,  // ml.appli
	  0x63, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x2f, 0x78,  // cation.x
	  0x68, 0x74, 0x6d, 0x6c, 0x2b, 0x78, 0x6d, 0x6c,  // html.xml
	  0x2c, 0x74, 0x65, 0x78, 0x74, 0x2f, 0x70, 0x6c,  // .text.pl
	  0x61, 0x69, 0x6e, 0x2c, 0x74, 0x65, 0x78, 0x74,  // ain.text
	  0x2f, 0x6a, 0x61, 0x76, 0x61, 0x73, 0x63, 0x72,  // .javascr
	  0x69, 0x70, 0x74, 0x2c, 0x70, 0x75, 0x62, 0x6c,  // ipt.publ
	  0x69, 0x63, 0x70, 0x72, 0x69, 0x76, 0x61, 0x74,  // icprivat
	  0x65, 0x6d, 0x61, 0x78, 0x2d, 0x61, 0x67, 0x65,  // emax-age
	  0x3d, 0x67, 0x7a, 0x69, 0x70, 0x2c, 0x64, 0x65,  // .gzip.de
	  0x66, 0x6c, 0x61, 0x74, 0x65, 0x2c, 0x73, 0x64,  // flate.sd
	  0x63, 0x68, 0x63, 0x68, 0x61, 0x72, 0x73, 0x65,  // chcharse
	  0x74, 0x3d, 0x75, 0x74, 0x66, 0x2d, 0x38, 0x63,  // t.utf-8c
	  0x68, 0x61, 0x72, 0x73, 0x65, 0x74, 0x3d, 0x69,  // harset.i
	  0x73, 0x6f, 0x2d, 0x38, 0x38, 0x35, 0x39, 0x2d,  // so-8859-
	  0x31, 0x2c, 0x75, 0x74, 0x66, 0x2d, 0x2c, 0x2a,  // 1.utf-..
	  0x2c, 0x65, 0x6e, 0x71, 0x3d, 0x30, 0x2e         // .enq.0.
	]);

	dictionary[3.1] = dictionary[3];


/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var transport = __webpack_require__(86);
	var base = transport.protocol.base;

	exports.FRAME_HEADER_SIZE = 8;

	exports.PING_OPAQUE_SIZE = 4;

	exports.MAX_CONCURRENT_STREAMS = Infinity;
	exports.DEFAULT_MAX_HEADER_LIST_SIZE = Infinity;

	exports.DEFAULT_WEIGHT = 16;

	exports.frameType = {
	  SYN_STREAM: 1,
	  SYN_REPLY: 2,
	  RST_STREAM: 3,
	  SETTINGS: 4,
	  PING: 6,
	  GOAWAY: 7,
	  HEADERS: 8,
	  WINDOW_UPDATE: 9,

	  // Custom
	  X_FORWARDED_FOR: 0xf000
	};

	exports.flags = {
	  FLAG_FIN: 0x01,
	  FLAG_COMPRESSED: 0x02,
	  FLAG_UNIDIRECTIONAL: 0x02
	};

	exports.error = {
	  PROTOCOL_ERROR: 1,
	  INVALID_STREAM: 2,
	  REFUSED_STREAM: 3,
	  UNSUPPORTED_VERSION: 4,
	  CANCEL: 5,
	  INTERNAL_ERROR: 6,
	  FLOW_CONTROL_ERROR: 7,
	  STREAM_IN_USE: 8,
	  // STREAM_ALREADY_CLOSED: 9
	  STREAM_CLOSED: 9,
	  INVALID_CREDENTIALS: 10,
	  FRAME_TOO_LARGE: 11
	};
	exports.errorByCode = base.utils.reverse(exports.error);

	exports.settings = {
	  FLAG_SETTINGS_PERSIST_VALUE: 1,
	  FLAG_SETTINGS_PERSISTED: 2,

	  SETTINGS_UPLOAD_BANDWIDTH: 1,
	  SETTINGS_DOWNLOAD_BANDWIDTH: 2,
	  SETTINGS_ROUND_TRIP_TIME: 3,
	  SETTINGS_MAX_CONCURRENT_STREAMS: 4,
	  SETTINGS_CURRENT_CWND: 5,
	  SETTINGS_DOWNLOAD_RETRANS_RATE: 6,
	  SETTINGS_INITIAL_WINDOW_SIZE: 7,
	  SETTINGS_CLIENT_CERTIFICATE_VECTOR_SIZE: 8
	};

	exports.settingsIndex = [
	  null,

	  'upload_bandwidth',
	  'download_bandwidth',
	  'round_trip_time',
	  'max_concurrent_streams',
	  'current_cwnd',
	  'download_retrans_rate',
	  'initial_window_size',
	  'client_certificate_vector_size'
	];

	exports.DEFAULT_WINDOW = 64 * 1024;
	exports.MAX_INITIAL_WINDOW_SIZE = 2147483647;

	exports.goaway = {
	  OK: 0,
	  PROTOCOL_ERROR: 1,
	  INTERNAL_ERROR: 2
	};
	exports.goawayByCode = base.utils.reverse(exports.goaway);

	exports.statusReason = {
	  100 : 'Continue',
	  101 : 'Switching Protocols',
	  102 : 'Processing',                 // RFC 2518, obsoleted by RFC 4918
	  200 : 'OK',
	  201 : 'Created',
	  202 : 'Accepted',
	  203 : 'Non-Authoritative Information',
	  204 : 'No Content',
	  205 : 'Reset Content',
	  206 : 'Partial Content',
	  207 : 'Multi-Status',               // RFC 4918
	  300 : 'Multiple Choices',
	  301 : 'Moved Permanently',
	  302 : 'Moved Temporarily',
	  303 : 'See Other',
	  304 : 'Not Modified',
	  305 : 'Use Proxy',
	  307 : 'Temporary Redirect',
	  308 : 'Permanent Redirect',         // RFC 7238
	  400 : 'Bad Request',
	  401 : 'Unauthorized',
	  402 : 'Payment Required',
	  403 : 'Forbidden',
	  404 : 'Not Found',
	  405 : 'Method Not Allowed',
	  406 : 'Not Acceptable',
	  407 : 'Proxy Authentication Required',
	  408 : 'Request Time-out',
	  409 : 'Conflict',
	  410 : 'Gone',
	  411 : 'Length Required',
	  412 : 'Precondition Failed',
	  413 : 'Request Entity Too Large',
	  414 : 'Request-URI Too Large',
	  415 : 'Unsupported Media Type',
	  416 : 'Requested Range Not Satisfiable',
	  417 : 'Expectation Failed',
	  418 : 'I\'m a teapot',              // RFC 2324
	  422 : 'Unprocessable Entity',       // RFC 4918
	  423 : 'Locked',                     // RFC 4918
	  424 : 'Failed Dependency',          // RFC 4918
	  425 : 'Unordered Collection',       // RFC 4918
	  426 : 'Upgrade Required',           // RFC 2817
	  428 : 'Precondition Required',      // RFC 6585
	  429 : 'Too Many Requests',          // RFC 6585
	  431 : 'Request Header Fields Too Large',// RFC 6585
	  500 : 'Internal Server Error',
	  501 : 'Not Implemented',
	  502 : 'Bad Gateway',
	  503 : 'Service Unavailable',
	  504 : 'Gateway Time-out',
	  505 : 'HTTP Version Not Supported',
	  506 : 'Variant Also Negotiates',    // RFC 2295
	  507 : 'Insufficient Storage',       // RFC 4918
	  509 : 'Bandwidth Limit Exceeded',
	  510 : 'Not Extended',               // RFC 2774
	  511 : 'Network Authentication Required' // RFC 6585
	};


/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var parser = exports;

	var transport = __webpack_require__(86);
	var base = transport.protocol.base;
	var utils = base.utils;
	var constants = __webpack_require__(98);

	var assert = __webpack_require__(75);
	var util = __webpack_require__(77);
	var OffsetBuffer = __webpack_require__(94);

	function Parser(options) {
	  base.Parser.call(this, options);

	  this.isServer = options.isServer;
	  this.waiting = constants.FRAME_HEADER_SIZE;
	  this.state = 'frame-head';
	  this.pendingHeader = null;
	}
	util.inherits(Parser, base.Parser);

	parser.create = function create(options) {
	  return new Parser(options);
	};

	Parser.prototype.setMaxFrameSize = function setMaxFrameSize(size) {
	  // http2-only
	};

	Parser.prototype.setMaxHeaderListSize = function setMaxHeaderListSize(size) {
	  // http2-only
	};

	// Only for testing
	Parser.prototype.skipPreface = function skipPreface() {
	};

	Parser.prototype.execute = function execute(buffer, callback) {
	  if (this.state === 'frame-head')
	    return this.onFrameHead(buffer, callback);

	  assert(this.state === 'frame-body' && this.pendingHeader !== null);

	  var self = this;
	  var header = this.pendingHeader;
	  this.pendingHeader = null;

	  this.onFrameBody(header, buffer, function(err, frame) {
	    if (err)
	      return callback(err);

	    self.state = 'frame-head';
	    self.waiting = constants.FRAME_HEADER_SIZE;
	    self.partial = false;
	    callback(null, frame);
	  });
	};

	Parser.prototype.executePartial = function executePartial(buffer, callback) {
	  var header = this.pendingHeader;

	  if (this.window)
	    this.window.recv.update(-buffer.size);

	  // DATA frame
	  callback(null, {
	    type: 'DATA',
	    id: header.id,

	    // Partial DATA can't be FIN
	    fin: false,
	    data: buffer.take(buffer.size)
	  });
	};

	Parser.prototype.onFrameHead = function onFrameHead(buffer, callback) {
	  var header = {
	    control: (buffer.peekUInt8() & 0x80) === 0x80 ? true : false,
	    version: null,
	    type: null,
	    id: null,
	    flags: null,
	    length: null
	  };

	  if (header.control) {
	    header.version = buffer.readUInt16BE() & 0x7fff;
	    header.type = buffer.readUInt16BE();
	  } else {
	    header.id = buffer.readUInt32BE(0) & 0x7fffffff;
	  }
	  header.flags = buffer.readUInt8();
	  header.length = buffer.readUInt24BE();

	  if (this.version === null && header.control) {
	    // TODO(indutny): do ProtocolError here and in the rest of errors
	    if (header.version !== 2 && header.version !== 3)
	      return callback(new Error('Unsupported SPDY version: ' + header.version));
	    this.setVersion(header.version);
	  }

	  this.state = 'frame-body';
	  this.waiting = header.length;
	  this.pendingHeader = header;
	  this.partial = !header.control;

	  callback(null, null);
	};

	Parser.prototype.onFrameBody = function onFrameBody(header, buffer, callback) {
	  // Data frame
	  if (!header.control) {
	    // Count received bytes
	    if (this.window)
	      this.window.recv.update(-buffer.size);

	    // No support for compressed DATA
	    if ((header.flags & constants.flags.FLAG_COMPRESSED) !== 0)
	      return callback(new Error('DATA compression not supported'));

	    if (header.id === 0) {
	      return callback(this.error(constants.error.PROTOCOL_ERROR,
	                                 'Invalid stream id for DATA'));
	    }

	    return callback(null, {
	      type: 'DATA',
	      id: header.id,
	      fin: (header.flags & constants.flags.FLAG_FIN) !== 0,
	      data: buffer.take(buffer.size)
	    });
	  }

	  // SYN_STREAM or SYN_REPLY
	  if (header.type === 0x01 || header.type === 0x02)
	    this.onSynHeadFrame(header.type, header.flags, buffer, callback);
	  // RST_STREAM
	  else if (header.type === 0x03)
	    this.onRSTFrame(buffer, callback);
	  // SETTINGS
	  else if (header.type === 0x04)
	    this.onSettingsFrame(buffer, callback);
	  else if (header.type === 0x05)
	    callback(null, { type: 'NOOP' });
	  // PING
	  else if (header.type === 0x06)
	    this.onPingFrame(buffer, callback);
	  // GOAWAY
	  else if (header.type === 0x07)
	    this.onGoawayFrame(buffer, callback);
	  // HEADERS
	  else if (header.type === 0x08)
	    this.onHeaderFrames(buffer, callback);
	  // WINDOW_UPDATE
	  else if (header.type === 0x09)
	    this.onWindowUpdateFrame(buffer, callback);
	  // X-FORWARDED
	  else if (header.type === 0xf000)
	    this.onXForwardedFrame(buffer, callback);
	  else
	    callback(null, { type: 'unknown: ' + header.type });
	};

	Parser.prototype._filterHeader = function _filterHeader(headers, name) {
	  var res = {};
	  var keys = Object.keys(headers);

	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (key !== name)
	      res[key] = headers[key];
	  }

	  return res;
	};

	Parser.prototype.onSynHeadFrame = function onSynHeadFrame(type,
	                                                          flags,
	                                                          body,
	                                                          callback) {
	  var self = this;
	  var stream = type === 0x01;
	  var offset = stream ? 10 : this.version === 2 ? 6 : 4;

	  if (!body.has(offset))
	    return callback(new Error('SynHead OOB'));

	  var head = body.clone(offset);
	  body.skip(offset);
	  this.parseKVs(body, function(err, headers) {
	    if (err)
	      return callback(err);

	    if (stream &&
	        (!headers[':method'] || !headers[':path'])) {
	      return callback(new Error('Missing `:method` and/or `:path` header'));
	    }

	    var id = head.readUInt32BE() & 0x7fffffff;

	    if (id === 0) {
	      return callback(self.error(constants.error.PROTOCOL_ERROR,
	                                 'Invalid stream id for HEADERS'));
	    }

	    var associated = stream ? head.readUInt32BE() & 0x7fffffff : 0;
	    var priority = stream ? head.readUInt8() >> 5 :
	                            utils.weightToPriority(constants.DEFAULT_WEIGHT);
	    var fin = (flags & constants.flags.FLAG_FIN) !== 0;
	    var unidir = (flags & constants.flags.FLAG_UNIDIRECTIONAL) !== 0;
	    var path = headers[':path'];

	    var isPush = stream && associated !== 0;

	    var weight = utils.priorityToWeight(priority);
	    var priorityInfo = {
	      weight: weight,
	      exclusive: false,
	      parent: 0
	    };

	    if (!isPush) {
	      callback(null, {
	        type: 'HEADERS',
	        id: id,
	        priority: priorityInfo,
	        fin: fin,
	        writable: !unidir,
	        headers: headers,
	        path: path
	      });
	      return;
	    }

	    if (stream && !headers[':status'])
	      return callback(new Error('Missing `:status` header'));

	    var filteredHeaders = self._filterHeader(headers, ':status');

	    callback(null, [ {
	      type: 'PUSH_PROMISE',
	      id: associated,
	      fin: false,
	      promisedId: id,
	      headers: filteredHeaders,
	      path: path
	    }, {
	      type: 'HEADERS',
	      id: id,
	      fin: fin,
	      priority: priorityInfo,
	      writable: true,
	      path: undefined,
	      headers: {
	        ':status': headers[':status']
	      }
	    }]);
	  });
	};

	Parser.prototype.onHeaderFrames = function onHeaderFrames(body, callback) {
	  var offset = this.version === 2 ? 6 : 4;
	  if (!body.has(offset))
	    return callback(new Error('HEADERS OOB'));

	  var streamId = body.readUInt32BE() & 0x7fffffff;
	  if (this.version === 2)
	    body.skip(2);

	  this.parseKVs(body, function(err, headers) {
	    if (err)
	      return callback(err);

	    callback(null, {
	      type: 'HEADERS',
	      priority: {
	        parent: 0,
	        exclusive: false,
	        weight: constants.DEFAULT_WEIGHT
	      },
	      id: streamId,
	      fin: false,
	      writable: true,
	      path: undefined,
	      headers: headers
	    });
	  });
	};

	Parser.prototype.parseKVs = function parseKVs(buffer, callback) {
	  var self = this;

	  this.decompress.write(buffer.toChunks(), function(err, chunks) {
	    if (err)
	      return callback(err);

	    var buffer = new OffsetBuffer();
	    for (var i = 0; i < chunks.length; i++)
	      buffer.push(chunks[i]);

	    var size = self.version === 2 ? 2 : 4;
	    if (!buffer.has(size))
	      return callback(new Error('KV OOB'));

	    var count = self.version === 2 ? buffer.readUInt16BE() :
	                                     buffer.readUInt32BE();
	    var headers = {};

	    function readString() {
	      if (!buffer.has(size))
	        return null;
	      var len = self.version === 2 ? buffer.readUInt16BE() :
	                                     buffer.readUInt32BE();

	      if (!buffer.has(len))
	        return null;

	      var value = buffer.take(len);
	      return value.toString();
	    }

	    while (count > 0) {
	      var key = readString();
	      var value = readString();

	      if (key === null || value === null)
	        return callback(new Error('Headers OOB'));

	      if (self.version < 3) {
	        var isInternal = /^(method|version|url|host|scheme|status)$/.test(key);
	        if (key === 'url')
	          key = 'path';
	        if (isInternal)
	          key = ':' + key;
	      }

	      // Compatibility with HTTP2
	      if (key === ':status')
	        value = value.split(/ /g, 2)[0];

	      count--;
	      if (key === ':host')
	        key = ':authority';

	      // Skip version, not present in HTTP2
	      if (key === ':version')
	        continue;

	      value = value.split(/\0/g);
	      for (var i = 0; i < value.length; i++)
	        utils.addHeaderLine(key, value[i], headers);
	    }

	    callback(null, headers);
	  });
	};

	Parser.prototype.onRSTFrame = function onRSTFrame(body, callback) {
	  if (!body.has(8))
	    return callback(new Error('RST OOB'));

	  var frame = {
	    type: 'RST',
	    id: body.readUInt32BE() & 0x7fffffff,
	    code: constants.errorByCode[body.readUInt32BE()],
	  };

	  if (frame.id === 0) {
	    return callback(this.error(constants.error.PROTOCOL_ERROR,
	                               'Invalid stream id for RST'));
	  }

	  if (body.size !== 0)
	    frame.extra = body.take(body.size);
	  callback(null, frame);
	};

	Parser.prototype.onSettingsFrame = function onSettingsFrame(body, callback) {
	  if (!body.has(4))
	    return callback(new Error('SETTINGS OOB'));

	  var settings = {},
	      number = body.readUInt32BE(),
	      idMap = {
	        1: 'upload_bandwidth',
	        2: 'download_bandwidth',
	        3: 'round_trip_time',
	        4: 'max_concurrent_streams',
	        5: 'current_cwnd',
	        6: 'download_retrans_rate',
	        7: 'initial_window_size',
	        8: 'client_certificate_vector_size'
	      };

	  if (!body.has(number * 8))
	    return callback(new Error('SETTINGS OOB#2'));

	  for (var i = 0; i < number; i++) {
	    var id = this.version === 2 ? body.readUInt32LE() :
	                                   body.readUInt32BE();
	    var flags = (id >> 24) & 0xff;
	    id = id & 0xffffff;

	    // Skip persisted settings
	    if (flags & 0x2)
	      continue;

	    var name = idMap[id];

	    settings[name] = body.readUInt32BE();
	  }

	  callback(null, {
	    type: 'SETTINGS',
	    settings: settings
	  });
	};

	Parser.prototype.onPingFrame = function onPingFrame(body, callback) {
	  if (!body.has(4))
	    return callback(new Error('PING OOB'));

	  var isServer = this.isServer;
	  var opaque = body.clone(body.size).take(body.size);
	  var id = body.readUInt32BE();
	  var ack = isServer ? (id % 2 === 0) : (id % 2 === 1);

	  callback(null, { type: 'PING', opaque: opaque, ack: ack });
	};

	Parser.prototype.onGoawayFrame = function onGoawayFrame(body, callback) {
	  if (!body.has(8))
	    return callback(new Error('GOAWAY OOB'));

	  callback(null, {
	    type: 'GOAWAY',
	    lastId: body.readUInt32BE() & 0x7fffffff,
	    code: constants.goawayByCode[body.readUInt32BE()]
	  });
	};

	Parser.prototype.onWindowUpdateFrame = function onWindowUpdateFrame(body,
	                                                                    callback) {
	  if (!body.has(8))
	    return callback(new Error('WINDOW_UPDATE OOB'));

	  callback(null, {
	    type: 'WINDOW_UPDATE',
	    id: body.readUInt32BE() & 0x7fffffff,
	    delta: body.readInt32BE()
	  });
	};

	Parser.prototype.onXForwardedFrame = function onXForwardedFrame(body,
	                                                                callback) {
	  if (!body.has(4))
	    return callback(new Error('X_FORWARDED OOB'));

	  var len = body.readUInt32BE();
	  if (!body.has(len))
	    return callback(new Error('X_FORWARDED host length OOB'));

	  callback(null, {
	    type: 'X_FORWARDED_FOR',
	    host: body.take(len).toString()
	  });
	};


/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var transport = __webpack_require__(86);
	var constants = __webpack_require__(96).constants;
	var base = transport.protocol.base;
	var utils = base.utils;

	var assert = __webpack_require__(75);
	var util = __webpack_require__(77);
	var Buffer = __webpack_require__(78).Buffer;
	var WriteBuffer = __webpack_require__(101);

	var debug = __webpack_require__(32)('spdy:framer');

	function Framer(options) {
	  base.Framer.call(this, options);
	}
	util.inherits(Framer, base.Framer);
	module.exports = Framer;

	Framer.create = function create(options) {
	  return new Framer(options);
	};

	Framer.prototype.setMaxFrameSize = function setMaxFrameSize(size) {
	  // http2-only
	};

	Framer.prototype.headersToDict = function headersToDict(headers,
	                                                        preprocess,
	                                                        callback) {
	  function stringify(value) {
	    if (value !== undefined) {
	      if (Array.isArray(value)) {
	        return value.join('\x00');
	      } else if (typeof value === 'string') {
	        return value;
	      } else {
	        return value.toString();
	      }
	    } else {
	      return '';
	    }
	  }

	  // Lower case of all headers keys
	  var loweredHeaders = {};
	  Object.keys(headers || {}).map(function(key) {
	    loweredHeaders[key.toLowerCase()] = headers[key];
	  });

	  // Allow outer code to add custom headers or remove something
	  if (preprocess)
	    preprocess(loweredHeaders);

	  // Transform object into kv pairs
	  var size = this.version === 2 ? 2 : 4;
	  var len = size;
	  var pairs = Object.keys(loweredHeaders).filter(function(key) {
	    var lkey = key.toLowerCase();

	    // Will be in `:host`
	    if (lkey === 'host' && this.version >= 3)
	      return false;

	    return lkey !== 'connection' && lkey !== 'keep-alive' &&
	           lkey !== 'proxy-connection' && lkey !== 'transfer-encoding';
	  }, this).map(function(key) {
	    var klen = Buffer.byteLength(key),
	        value = stringify(loweredHeaders[key]),
	        vlen = Buffer.byteLength(value);

	    len += size * 2 + klen + vlen;
	    return [klen, key, vlen, value];
	  });

	  var block = new WriteBuffer();
	  block.reserve(len);

	  if (this.version === 2)
	    block.writeUInt16BE(pairs.length);
	  else
	    block.writeUInt32BE(pairs.length);

	  pairs.forEach(function(pair) {
	    // Write key length
	    if (this.version === 2)
	      block.writeUInt16BE(pair[0]);
	    else
	      block.writeUInt32BE(pair[0]);

	    // Write key
	    block.write(pair[1]);

	    // Write value length
	    if (this.version === 2)
	      block.writeUInt16BE(pair[2]);
	    else
	      block.writeUInt32BE(pair[2]);
	    // Write value
	    block.write(pair[3]);
	  }, this);

	  assert(this.compress !== null, 'Framer version not initialized');
	  this.compress.write(block.render(), callback);
	};

	Framer.prototype._frame = function _frame(frame, body, callback) {
	  if (!this.version) {
	    this.on('version', function() {
	      this._frame(frame, body, callback);
	    });
	    return;
	  }

	  debug('id=%d type=%s', frame.id, frame.type);

	  var buffer = new WriteBuffer();

	  buffer.writeUInt16BE(0x8000 | this.version);
	  buffer.writeUInt16BE(constants.frameType[frame.type]);
	  buffer.writeUInt8(frame.flags);
	  var len = buffer.skip(3);

	  var self = this;
	  body(buffer);

	  var frameSize = buffer.size - constants.FRAME_HEADER_SIZE;
	  len.writeUInt24BE(frameSize);

	  var chunks = buffer.render();
	  var toWrite = {
	    stream: frame.id,
	    priority: false,
	    chunks: chunks,
	    callback: callback
	  };

	  this._resetTimeout();
	  this.schedule(toWrite);

	  return chunks;
	};

	Framer.prototype._synFrame = function _synFrame(frame, callback) {
	  var self = this;

	  if (!frame.path)
	    throw new Error('`path` is required frame argument');

	  function preprocess(headers) {
	    var method = frame.method || base.constants.DEFAULT_METHOD;
	    var version = frame.version || 'HTTP/1.1';
	    var scheme = frame.scheme || 'https';
	    var host = frame.host ||
	               frame.headers && frame.headers.host ||
	               base.constants.DEFAULT_HOST;

	    if (self.version === 2) {
	      headers.method = method;
	      headers.version = version;
	      headers.url = frame.path;
	      headers.scheme = scheme;
	      headers.host = host;
	      if (frame.status)
	        headers.status = frame.status;
	    } else {
	      headers[':method'] = method;
	      headers[':version'] = version;
	      headers[':path'] = frame.path;
	      headers[':scheme'] = scheme;
	      headers[':host'] = host;
	      if (frame.status)
	        headers[':status'] = frame.status;
	    }
	  }

	  this.headersToDict(frame.headers, preprocess, function(err, chunks) {
	    if (err) {
	      if (callback)
	        return callback(err);
	      else
	        return self.emit('error', err);
	    }

	    self._frame({
	      type: 'SYN_STREAM',
	      id: frame.id,
	      flags: frame.fin ? constants.flags.FLAG_FIN : 0
	    }, function(buf) {
	      buf.reserve(10);

	      buf.writeUInt32BE(frame.id & 0x7fffffff);
	      buf.writeUInt32BE(frame.associated & 0x7fffffff);

	      var weight = frame.priority && frame.priority.weight ||
	                   constants.DEFAULT_WEIGHT;

	      // We only have 3 bits for priority in SPDY, try to fit it into this
	      var priority = utils.weightToPriority(weight);
	      buf.writeUInt8(priority << 5);

	      // CREDENTIALS slot
	      buf.writeUInt8(0);

	      for (var i = 0; i < chunks.length; i++)
	        buf.copyFrom(chunks[i]);
	    }, callback);
	  });
	};

	Framer.prototype.requestFrame = function requestFrame(frame, callback) {
	  this._synFrame({
	    id: frame.id,
	    fin: frame.fin,
	    associated: 0,
	    method: frame.method,
	    version: frame.version,
	    scheme: frame.scheme,
	    host: frame.host,
	    path: frame.path,
	    priority: frame.priority,
	    headers: frame.headers
	  }, callback);
	};

	Framer.prototype.responseFrame = function responseFrame(frame, callback) {
	  var self = this;

	  var reason = frame.reason;
	  if (!reason)
	    reason = constants.statusReason[frame.status];

	  function preprocess(headers) {
	    if (self.version === 2) {
	      headers.status = frame.status + ' ' + reason;
	      headers.version = 'HTTP/1.1';
	    } else {
	      headers[':status'] = frame.status + ' ' + reason;
	      headers[':version'] = 'HTTP/1.1';
	    }
	  }

	  this.headersToDict(frame.headers, preprocess, function(err, chunks) {
	    if (err) {
	      if (callback)
	        return callback(err);
	      else
	        return self.emit('error', err);
	    }

	    self._frame({
	      type: 'SYN_REPLY',
	      id: frame.id,
	      flags: 0
	    }, function(buf) {
	      buf.reserve(self.version === 2 ? 6 : 4);

	      buf.writeUInt32BE(frame.id & 0x7fffffff);

	      // Unused data
	      if (self.version === 2)
	        buf.writeUInt16BE(0);

	      for (var i = 0; i < chunks.length; i++)
	        buf.copyFrom(chunks[i]);
	    }, callback);
	  });
	};


	Framer.prototype.pushFrame = function pushFrame(frame, callback) {
	  var self = this;

	  this._checkPush(function(err) {
	    if (err)
	      return callback(err);

	    self._synFrame({
	      id: frame.promisedId,
	      associated: frame.id,
	      method: frame.method,
	      status: frame.status || 200,
	      version: frame.version,
	      scheme: frame.scheme,
	      host: frame.host,
	      path: frame.path,
	      priority: frame.priority,

	      // Merge everything together, there is no difference in SPDY protocol
	      headers: util._extend(util._extend({}, frame.headers), frame.response)
	    }, callback);
	  });
	};

	Framer.prototype.headersFrame = function headersFrame(frame, callback) {
	  var self = this;

	  this.headersToDict(frame.headers, null, function(err, chunks) {
	    if (err) {
	      if (callback)
	        return callback(err);
	      else
	        return self.emit('error', err);
	    }

	    self._frame({
	      type: 'HEADERS',
	      id: frame.id,
	      priority: false,
	      flags: 0
	    }, function(buf) {
	      buf.reserve(4 + (self.version === 2 ? 2 : 0));
	      buf.writeUInt32BE(frame.id & 0x7fffffff);

	      // Unused data
	      if (self.version === 2)
	        buf.writeUInt16BE(0);

	      for (var i = 0; i < chunks.length; i++)
	        buf.copyFrom(chunks[i]);
	    }, callback);
	  });
	};

	Framer.prototype.dataFrame = function dataFrame(frame, callback) {
	  if (!this.version) {
	    return this.on('version', function() {
	      this.dataFrame(frame, callback);
	    });
	  }

	  debug('id=%d type=DATA', frame.id);

	  var buffer = new WriteBuffer();
	  buffer.reserve(8 + frame.data.length);

	  buffer.writeUInt32BE(frame.id & 0x7fffffff);
	  buffer.writeUInt8(frame.fin ? 0x01 : 0x0);
	  buffer.writeUInt24BE(frame.data.length);
	  buffer.copyFrom(frame.data);

	  var chunks = buffer.render();
	  var toWrite = {
	    stream: frame.id,
	    priority: frame.priority,
	    chunks: chunks,
	    callback: callback
	  };

	  var self = this;
	  this._resetTimeout();

	  var bypass = this.version < 3.1;
	  this.window.send.update(-frame.data.length, bypass ? undefined : function() {
	    self._resetTimeout();
	    self.schedule(toWrite);
	  });

	  if (bypass) {
	    this._resetTimeout();
	    this.schedule(toWrite);
	  }
	};

	Framer.prototype.pingFrame = function pingFrame(frame, callback) {
	  this._frame({
	    type: 'PING',
	    id: 0,
	    flags: 0
	  }, function(buf, callback) {
	    buf.reserve(4);

	    var opaque = frame.opaque;
	    buf.writeUInt32BE(opaque.readUInt32BE(opaque.length - 4, true));
	  }, callback);
	};

	Framer.prototype.rstFrame = function rstFrame(frame, callback) {
	  var self = this;

	  this._frame({
	    type: 'RST_STREAM',
	    id: frame.id,
	    flags: 0
	  }, function(buf) {
	    buf.reserve(8);

	    // Stream ID
	    buf.writeUInt32BE(frame.id & 0x7fffffff);
	    // Status Code
	    buf.writeUInt32BE(constants.error[frame.code]);

	    // Extra debugging information
	    if (frame.extra)
	      buf.write(frame.extra);
	  }, callback);
	};

	Framer.prototype.prefaceFrame = function prefaceFrame() {
	};

	Framer.prototype.settingsFrame = function settingsFrame(options, callback) {
	  var self = this;

	  var key = this.version + '/' + JSON.stringify(options);

	  var settings = Framer.settingsCache[key];
	  if (settings) {
	    debug('cached settings');
	    this._resetTimeout();
	    this.schedule({
	      stream: 0,
	      priority: false,
	      chunks: settings,
	      callback: callback
	    });
	    return;
	  }

	  var params = [];
	  for (var i = 0; i < constants.settingsIndex.length; i++) {
	    var name = constants.settingsIndex[i];
	    if (!name)
	      continue;

	    // value: Infinity
	    if (!isFinite(options[name]))
	      continue;

	    if (options[name] !== undefined)
	      params.push({ key: i, value: options[name] });
	  }

	  var frame = this._frame({
	    type: 'SETTINGS',
	    id: 0,
	    flags: 0
	  }, function(buf) {
	    buf.reserve(4 + 8 * params.length);

	    // Count of entries
	    buf.writeUInt32BE(params.length);

	    params.forEach(function(param) {
	      var flag = constants.settings.FLAG_SETTINGS_PERSIST_VALUE << 24;

	      if (self.version === 2)
	        buf.writeUInt32LE(flag | param.key);
	      else
	        buf.writeUInt32BE(flag | param.key);
	      buf.writeUInt32BE(param.value & 0x7fffffff);
	    });
	  }, callback);

	  Framer.settingsCache[key] = frame;
	};
	Framer.settingsCache = {};

	Framer.prototype.ackSettingsFrame = function ackSettingsFrame(callback) {
	  if (callback)
	    process.nextTick(callback);
	};

	Framer.prototype.windowUpdateFrame = function windowUpdateFrame(frame,
	                                                                callback) {
	  this._frame({
	    type: 'WINDOW_UPDATE',
	    id: frame.id,
	    flags: 0
	  }, function(buf) {
	    buf.reserve(8);

	    // ID
	    buf.writeUInt32BE(frame.id & 0x7fffffff);

	    // Delta
	    buf.writeInt32BE(frame.delta);
	  }, callback);
	};

	Framer.prototype.goawayFrame = function goawayFrame(frame, callback) {
	  this._frame({
	    type: 'GOAWAY',
	    id: 0,
	    flags: 0
	  }, function(buf) {
	    buf.reserve(8);

	    // Last-good-stream-ID
	    buf.writeUInt32BE(frame.lastId & 0x7fffffff);
	    // Status
	    buf.writeUInt32BE(constants.goaway[frame.code]);
	  }, callback);
	};

	Framer.prototype.priorityFrame = function priorityFrame(frame, callback) {
	  // No such thing in SPDY
	  if (callback)
	    process.nextTick(callback);
	};

	Framer.prototype.xForwardedFor = function xForwardedFor(frame, callback) {
	  this._frame({
	    type: 'X_FORWARDED_FOR',
	    id: 0,
	    flags: 0
	  }, function(buf) {
	    buf.writeUInt32BE(Buffer.byteLength(frame.host));
	    buf.write(frame.host);
	  }, callback);
	};


/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	var assert = __webpack_require__(102);
	var Buffer = __webpack_require__(78).Buffer;

	function WBuf() {
	  this.buffers = [];
	  this.toReserve = 0;
	  this.size = 0;
	  this.maxSize = 0;
	  this.avail = 0;

	  this.last = null;
	  this.offset = 0;

	  // Used in slicing
	  this.sliceQueue = null;

	  this.forceReserve = false;

	  // Mostly a constant
	  this.reserveRate = 64;
	}
	module.exports = WBuf;

	WBuf.prototype.reserve = function reserve(n) {
	  this.toReserve += n;

	  // Force reservation of extra bytes
	  if (this.forceReserve)
	    this.toReserve = Math.max(this.toReserve, this.reserveRate);
	};

	WBuf.prototype._ensure = function _ensure(n) {
	  if (this.avail >= n)
	    return;

	  if (this.toReserve === 0)
	    this.toReserve = this.reserveRate;

	  this.toReserve = Math.max(n - this.avail, this.toReserve);

	  if (this.avail === 0)
	    this._next();
	};

	WBuf.prototype._next = function _next() {
	  var buf;
	  if (this.sliceQueue === null) {
	    // Most common case
	    buf = new Buffer(this.toReserve);
	  } else {
	    // Only for `.slice()` results
	    buf = this.sliceQueue.shift();
	    if (this.sliceQueue.length === 0)
	      this.sliceQueue = null;
	  }

	  this.toReserve = 0;

	  this.buffers.push(buf);
	  this.avail = buf.length;
	  this.offset = 0;
	  this.last = buf;
	};

	WBuf.prototype._rangeCheck = function _rangeCheck() {
	  if (this.maxSize !== 0 && this.size > this.maxSize)
	    throw new RangeError('WBuf overflow');
	};

	WBuf.prototype._move = function _move(n) {
	  this.size += n;
	  if (this.avail === 0)
	    this.last = null;

	  this._rangeCheck();
	};

	WBuf.prototype.slice = function slice(start, end) {
	  assert(0 <= start && start <= this.size);
	  assert(0 <= end && end <= this.size);

	  if (this.last === null)
	    this._next();

	  var res = new WBuf();

	  // Only last chunk is requested
	  if (start >= this.size - this.offset) {
	    res.buffers.push(this.last);
	    res.last = this.last;
	    res.offset = start - this.size + this.offset;
	    res.maxSize = end - start;
	    res.avail = res.maxSize;

	    return res;
	  }

	  var startIndex = -1;
	  var startOffset = 0;
	  var endIndex = -1;

	  // Find buffer indices
	  var offset = 0;
	  for (var i = 0; i < this.buffers.length; i++) {
	    var buf = this.buffers[i];
	    var next = offset + buf.length;

	    // Found the start
	    if (start >= offset && start <= next) {
	      startIndex = i;
	      startOffset = start - offset;
	      if (endIndex !== -1)
	        break;
	    }
	    if (end >= offset && end <= next) {
	      endIndex = i;
	      if (startIndex !== -1)
	        break;
	    }

	    offset = next;
	  }

	  res.last = this.buffers[startIndex];
	  res.offset = startOffset;
	  res.maxSize = end - start;

	  // Multi-buffer slice
	  if (startIndex < endIndex) {
	    res.sliceQueue = this.buffers.slice(startIndex + 1, endIndex + 1);

	    res.last = res.last.slice(res.offset);
	    res.offset = 0;
	  }

	  res.avail = res.last.length - res.offset;
	  res.buffers.push(res.last);

	  return res;
	};

	WBuf.prototype.skip = function skip(n) {
	  if (n === 0)
	    return this.slice(this.size, this.size);

	  this._ensure(n);

	  var left = n;
	  while (left > 0) {
	    var toSkip = Math.min(left, this.avail);
	    left -= toSkip;
	    this.size += toSkip;
	    if (toSkip === this.avail) {
	      if (left !== 0) {
	        this._next();
	      } else {
	        this.avail -= toSkip;
	        this.offset += toSkip;
	      }
	    } else {
	      this.offset += toSkip;
	      this.avail -= toSkip;
	    }
	  }

	  this._rangeCheck();

	  return this.slice(this.size - n, this.size);
	};

	WBuf.prototype.write = function write(str) {
	  var len = 0;
	  for (var i = 0; i < str.length; i++) {
	    var c = str.charCodeAt(i);
	    if (c > 255)
	      len += 2;
	    else
	      len += 1;
	  }
	  this.reserve(len);
	  for (var i = 0; i < str.length; i++) {
	    var c = str.charCodeAt(i);
	    var hi = c >>> 8;
	    var lo = c & 0xff;

	    if (hi)
	      this.writeUInt8(hi);
	    this.writeUInt8(lo);
	  }
	};

	WBuf.prototype.copyFrom = function copyFrom(buf, start, end) {
	  var off = start === undefined ? 0 : start;
	  var len = end === undefined ? buf.length : end;
	  if (off === len)
	    return;

	  this._ensure(len - off);
	  while (off < len) {
	    var toCopy = Math.min(len - off, this.avail);
	    buf.copy(this.last, this.offset, off, off + toCopy);
	    off += toCopy;
	    this.size += toCopy;
	    if (toCopy === this.avail) {
	      if (off !== len) {
	        this._next();
	      } else {
	        this.avail = 0;
	        this.offset += toCopy;
	      }
	    } else {
	      this.offset += toCopy;
	      this.avail -= toCopy;
	    }
	  }

	  this._rangeCheck();
	};

	WBuf.prototype.writeUInt8 = function writeUInt8(v) {
	  this._ensure(1);

	  this.last[this.offset++] = v;
	  this.avail--;
	  this._move(1);
	};

	WBuf.prototype.writeUInt16BE = function writeUInt16BE(v) {
	  this._ensure(2);

	  // Fast case - everything fits into the last buffer
	  if (this.avail >= 2) {
	    this.last.writeUInt16BE(v, this.offset, true);
	    this.offset += 2;
	    this.avail -= 2;

	  // One byte here, one byte there
	  } else {
	    this.last[this.offset] = (v >>> 8);
	    this._next();
	    this.last[this.offset++] = v & 0xff;
	    this.avail--;
	  }

	  this._move(2);
	};

	WBuf.prototype.writeUInt24BE = function writeUInt24BE(v) {
	  this._ensure(3);

	  // Fast case - everything fits into the last buffer
	  if (this.avail >= 3) {
	    this.last.writeUInt16BE(v >>> 8, this.offset, true);
	    this.last[this.offset + 2] = v & 0xff;
	    this.offset += 3;
	    this.avail -= 3;
	    this._move(3);

	  // Two bytes here
	  } else if (this.avail >= 2) {
	    this.last.writeUInt16BE(v >>> 8, this.offset, true);
	    this._next();
	    this.last[this.offset++] = v & 0xff;
	    this.avail--;
	    this._move(3);

	  // Just one byte here
	  } else {
	    this.last[this.offset] = v >>> 16;
	    this._move(1);
	    this._next();
	    this.writeUInt16BE(v & 0xffff);
	  }
	};

	WBuf.prototype.writeUInt32BE = function writeUInt32BE(v) {
	  this._ensure(4);

	  // Fast case - everything fits into the last buffer
	  if (this.avail >= 4) {
	    this.last.writeUInt32BE(v, this.offset, true);
	    this.offset += 4;
	    this.avail -= 4;
	    this._move(4);

	  // Three bytes here
	  } else if (this.avail >= 3) {
	    this.writeUInt24BE(v >>> 8);
	    this._next();
	    this.last[this.offset++] = v & 0xff;
	    this.avail--;
	    this._move(1);

	  // Slow case, who cares
	  } else {
	    this.writeUInt16BE(v >>> 16);
	    this.writeUInt16BE(v & 0xffff);
	  }
	};

	WBuf.prototype.writeUInt16LE = function writeUInt16LE(num) {
	  var r = ((num & 0xff) << 8) | (num >>> 8);
	  this.writeUInt16BE(r);
	};

	WBuf.prototype.writeUInt24LE = function writeUInt24LE(num) {
	  var r = ((num & 0xff) << 16) | (((num >>> 8) & 0xff) << 8) | (num >>> 16);
	  this.writeUInt24BE(r);
	};

	WBuf.prototype.writeUInt32LE = function writeUInt32LE(num) {
	  var r = ((num & 0xff) << 24) |
	          (((num >>> 8) & 0xff) << 16) |
	          (((num >>> 16) & 0xff) << 8) |
	          (num >>> 24);
	  this.writeUInt32BE(r);
	};

	WBuf.prototype.render = function render() {
	  var left = this.size;
	  var out = [];

	  for (var i = 0; i < this.buffers.length && left >= 0; i++) {
	    var buf = this.buffers[i];
	    left -= buf.length;
	    if (left >= 0) {
	      out.push(buf);
	    } else {
	      out.push(buf.slice(0, buf.length + left));
	    }
	  }

	  return out;
	};

	// Signed APIs
	WBuf.prototype.writeInt8 = function writeInt8(num) {
	  if (num < 0)
	    return this.writeUInt8(0x100 + num);
	  else
	    return this.writeUInt8(num);
	};

	function toUnsigned16(num) {
	  if (num < 0)
	    return 0x10000 + num;
	  else
	    return num;
	}

	WBuf.prototype.writeInt16LE = function writeInt16LE(num) {
	  this.writeUInt16LE(toUnsigned16(num));
	};

	WBuf.prototype.writeInt16BE = function writeInt16BE(num) {
	  this.writeUInt16BE(toUnsigned16(num));
	};

	function toUnsigned24(num) {
	  if (num < 0)
	    return 0x1000000 + num;
	  else
	    return num;
	}

	WBuf.prototype.writeInt24LE = function writeInt24LE(num) {
	  this.writeUInt24LE(toUnsigned24(num));
	};

	WBuf.prototype.writeInt24BE = function writeInt24BE(num) {
	  this.writeUInt24BE(toUnsigned24(num));
	};

	function toUnsigned32(num) {
	  if (num < 0)
	    return (0xffffffff + num) + 1;
	  else
	    return num;
	}

	WBuf.prototype.writeInt32LE = function writeInt32LE(num) {
	  this.writeUInt32LE(toUnsigned32(num));
	};

	WBuf.prototype.writeInt32BE = function writeInt32BE(num) {
	  this.writeUInt32BE(toUnsigned32(num));
	};

	WBuf.prototype.writeComb = function writeComb(size, endian, value) {
	  if (size === 1)
	    return this.writeUInt8(value);

	  if (endian === 'le') {
	    if (size === 2)
	      this.writeUInt16LE(value);
	    else if (size === 3)
	      this.writeUInt24LE(value);
	    else if (size === 4)
	      this.writeUInt32LE(value);
	  } else {
	    if (size === 2)
	      this.writeUInt16BE(value);
	    else if (size === 3)
	      this.writeUInt24BE(value);
	    else if (size === 4)
	      this.writeUInt32BE(value);
	  }
	};


/***/ },
/* 102 */
/***/ function(module, exports) {

	module.exports = assert;

	function assert(val, msg) {
	  if (!val)
	    throw new Error(msg || 'Assertion failed');
	}

	assert.equal = function assertEqual(l, r, msg) {
	  if (l != r)
	    throw new Error(msg || ('Assertion failed: ' + l + ' != ' + r));
	};


/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var zlibpool = exports;
	var zlib = __webpack_require__(104);

	var transport = __webpack_require__(86);

	// TODO(indutny): think about it, why has it always been Z_SYNC_FLUSH here.
	// It should be possible to manually flush stuff after the write instead
	function createDeflate(version, compression) {
	  var deflate = zlib.createDeflate({
	    dictionary: transport.protocol.spdy.dictionary[version],
	    flush: zlib.Z_SYNC_FLUSH,
	    windowBits: 11,
	    level: compression ? zlib.Z_DEFAULT_COMPRESSION : zlib.Z_NO_COMPRESSION
	  });

	  // For node.js v0.8
	  deflate._flush = zlib.Z_SYNC_FLUSH;

	  return deflate;
	}

	function createInflate(version) {
	  var inflate = zlib.createInflate({
	    dictionary: transport.protocol.spdy.dictionary[version],
	    flush: zlib.Z_SYNC_FLUSH,
	    windowBits: 0
	  });

	  // For node.js v0.8
	  inflate._flush = zlib.Z_SYNC_FLUSH;

	  return inflate;
	}

	function Pool(compression) {
	  this.compression = compression;
	  this.pool = {
	    2: [],
	    3: [],
	    3.1: []
	  };
	}

	zlibpool.create = function create(compression) {
	  return new Pool(compression);
	};

	Pool.prototype.get = function get(version) {
	  if (this.pool[version].length > 0) {
	    return this.pool[version].pop();
	  } else {
	    var id = version;

	    return {
	      version: version,
	      compress: createDeflate(id, this.compression),
	      decompress: createInflate(id)
	    };
	  }
	};

	Pool.prototype.put = function put(pair) {
	  this.pool[pair.version].push(pair);
	};


/***/ },
/* 104 */
/***/ function(module, exports) {

	module.exports = require("zlib");

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.name = 'h2';

	exports.constants = __webpack_require__(106);
	exports.parser = __webpack_require__(107);
	exports.framer = __webpack_require__(108);
	exports.compressionPool = __webpack_require__(109);


/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var transport = __webpack_require__(86);
	var base = transport.protocol.base;

	var util = __webpack_require__(77);
	var Buffer = __webpack_require__(78).Buffer;

	exports.PREFACE_SIZE = 24;
	exports.PREFACE = 'PRI * HTTP/2.0\r\n\r\nSM\r\n\r\n';
	exports.PREFACE_BUFFER = new Buffer(exports.PREFACE);

	exports.PING_OPAQUE_SIZE = 8;

	exports.FRAME_HEADER_SIZE = 9;
	exports.INITIAL_MAX_FRAME_SIZE = 16384;
	exports.ABSOLUTE_MAX_FRAME_SIZE = 16777215;
	exports.HEADER_TABLE_SIZE = 4096;
	exports.DEFAULT_MAX_HEADER_LIST_SIZE = 80 * 1024;  // as in http_parser
	exports.MAX_INITIAL_WINDOW_SIZE = 2147483647;

	exports.DEFAULT_WEIGHT = 16;

	exports.MAX_CONCURRENT_STREAMS = Infinity;

	exports.frameType = {
	  DATA: 0,
	  HEADERS: 1,
	  PRIORITY: 2,
	  RST_STREAM: 3,
	  SETTINGS: 4,
	  PUSH_PROMISE: 5,
	  PING: 6,
	  GOAWAY: 7,
	  WINDOW_UPDATE: 8,
	  CONTINUATION: 9,

	  // Custom
	  X_FORWARDED_FOR: 0xde
	};

	exports.flags = {
	  ACK: 0x01,  // SETTINGS-only
	  END_STREAM: 0x01,
	  END_HEADERS: 0x04,
	  PADDED: 0x08,
	  PRIORITY: 0x20
	};

	exports.settings = {
	  SETTINGS_HEADER_TABLE_SIZE: 0x01,
	  SETTINGS_ENABLE_PUSH: 0x02,
	  SETTINGS_MAX_CONCURRENT_STREAMS: 0x03,
	  SETTINGS_INITIAL_WINDOW_SIZE: 0x04,
	  SETTINGS_MAX_FRAME_SIZE: 0x05,
	  SETTINGS_MAX_HEADER_LIST_SIZE: 0x06
	};

	exports.settingsIndex = [
	  null,
	  'header_table_size',
	  'enable_push',
	  'max_concurrent_streams',
	  'initial_window_size',
	  'max_frame_size',
	  'max_header_list_size'
	];

	exports.error = {
	  OK: 0,
	  NO_ERROR: 0,

	  PROTOCOL_ERROR: 1,
	  INTERNAL_ERROR: 2,
	  FLOW_CONTROL_ERROR: 3,
	  SETTINGS_TIMEOUT: 4,

	  STREAM_CLOSED: 5,
	  INVALID_STREAM: 5,

	  FRAME_SIZE_ERROR: 6,
	  REFUSED_STREAM: 7,
	  CANCEL: 8,
	  COMPRESSION_ERROR: 9,
	  CONNECT_ERROR: 10,
	  ENHANCE_YOUR_CALM: 11,
	  INADEQUATE_SECURITY: 12,
	  HTTP_1_1_REQUIRED: 13
	};
	exports.errorByCode = base.utils.reverse(exports.error);

	exports.DEFAULT_WINDOW = 64 * 1024 - 1;

	exports.goaway = exports.error;
	exports.goawayByCode = util._extend({}, exports.errorByCode);
	exports.goawayByCode[0] = 'OK';


/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var parser = exports;

	var transport = __webpack_require__(86);
	var base = transport.protocol.base;
	var utils = base.utils;
	var constants = __webpack_require__(105).constants;

	var assert = __webpack_require__(75);
	var util = __webpack_require__(77);

	function Parser(options) {
	  base.Parser.call(this, options);

	  this.isServer = options.isServer;

	  this.waiting = constants.PREFACE_SIZE;
	  this.state = 'preface';
	  this.pendingHeader = null;

	  // Header Block queue
	  this._lastHeaderBlock = null;
	  this.maxFrameSize = constants.INITIAL_MAX_FRAME_SIZE;
	  this.maxHeaderListSize = constants.DEFAULT_MAX_HEADER_LIST_SIZE;
	}
	util.inherits(Parser, base.Parser);

	parser.create = function create(options) {
	  return new Parser(options);
	};

	Parser.prototype.setMaxFrameSize = function setMaxFrameSize(size) {
	  this.maxFrameSize = size;
	};

	Parser.prototype.setMaxHeaderListSize = function setMaxHeaderListSize(size) {
	  this.maxHeaderListSize = size;
	};

	// Only for testing
	Parser.prototype.skipPreface = function skipPreface() {
	  // Just some number bigger than 3.1, doesn't really matter for HTTP2
	  this.setVersion(4);

	  // Parse frame header!
	  this.state = 'frame-head';
	  this.waiting = constants.FRAME_HEADER_SIZE;
	};

	Parser.prototype.execute = function execute(buffer, callback) {
	  if (this.state === 'preface')
	    return this.onPreface(buffer, callback);

	  if (this.state === 'frame-head')
	    return this.onFrameHead(buffer, callback);

	  assert(this.state === 'frame-body' && this.pendingHeader !== null);

	  var self = this;
	  var header = this.pendingHeader;
	  this.pendingHeader = null;

	  this.onFrameBody(header, buffer, function(err, frame) {
	    if (err)
	      return callback(err);

	    self.state = 'frame-head';
	    self.partial = false;
	    self.waiting = constants.FRAME_HEADER_SIZE;
	    callback(null, frame);
	  });
	};

	Parser.prototype.executePartial = function executePartial(buffer, callback) {
	  var header = this.pendingHeader;

	  assert.equal(header.flags & constants.flags.PADDED, 0);

	  if (this.window)
	    this.window.recv.update(-buffer.size);

	  callback(null, {
	    type: 'DATA',
	    id: header.id,

	    // Partial DATA can't be FIN
	    fin: false,
	    data: buffer.take(buffer.size)
	  });
	};

	Parser.prototype.onPreface = function onPreface(buffer, callback) {
	  if (buffer.take(buffer.size).toString() !== constants.PREFACE) {
	    return callback(this.error(constants.error.PROTOCOL_ERROR,
	                               'Invalid preface'));
	  }

	  this.skipPreface();
	  callback(null, null);
	};

	Parser.prototype.onFrameHead = function onFrameHead(buffer, callback) {
	  var header = {
	    length: buffer.readUInt24BE(),
	    control: true,
	    type: buffer.readUInt8(),
	    flags: buffer.readUInt8(),
	    id: buffer.readUInt32BE() & 0x7fffffff
	  };

	  if (header.length > this.maxFrameSize) {
	    return callback(this.error(constants.error.FRAME_SIZE_ERROR,
	                               'Frame length OOB'));
	  }

	  header.control = header.type !== constants.frameType.DATA;

	  this.state = 'frame-body';
	  this.pendingHeader = header;
	  this.waiting = header.length;
	  this.partial = !header.control;

	  // TODO(indutny): eventually support partial padded DATA
	  if (this.partial)
	    this.partial = (header.flags & constants.flags.PADDED) === 0;

	  callback(null, null);
	};

	Parser.prototype.onFrameBody = function onFrameBody(header, buffer, callback) {
	  var frameType = constants.frameType;

	  if (header.type === frameType.DATA)
	    this.onDataFrame(header, buffer, callback);
	  else if (header.type === frameType.HEADERS)
	    this.onHeadersFrame(header, buffer, callback);
	  else if (header.type === frameType.CONTINUATION)
	    this.onContinuationFrame(header, buffer, callback);
	  else if (header.type === frameType.WINDOW_UPDATE)
	    this.onWindowUpdateFrame(header, buffer, callback);
	  else if (header.type === frameType.RST_STREAM)
	    this.onRSTFrame(header, buffer, callback);
	  else if (header.type === frameType.SETTINGS)
	    this.onSettingsFrame(header, buffer, callback);
	  else if (header.type === frameType.PUSH_PROMISE)
	    this.onPushPromiseFrame(header, buffer, callback);
	  else if (header.type === frameType.PING)
	    this.onPingFrame(header, buffer, callback);
	  else if (header.type === frameType.GOAWAY)
	    this.onGoawayFrame(header, buffer, callback);
	  else if (header.type === frameType.PRIORITY)
	    this.onPriorityFrame(header, buffer, callback);
	  else if (header.type === frameType.X_FORWARDED_FOR)
	    this.onXForwardedFrame(header, buffer, callback);
	  else
	    this.onUnknownFrame(header, buffer, callback);
	};

	Parser.prototype.onUnknownFrame = function onUnknownFrame(header, buffer, callback) {
	  if (this._lastHeaderBlock !== null) {
	    callback(this.error(constants.error.PROTOCOL_ERROR,
	                        'Received unknown frame in the middle of a header block'));
	    return;
	  }
	  callback(null, { type: 'unknown: ' + header.type });
	};

	Parser.prototype.unpadData = function unpadData(header, body, callback) {
	  var isPadded = (header.flags & constants.flags.PADDED) !== 0;

	  if (!isPadded)
	    return callback(null, body);

	  if (!body.has(1)) {
	    return callback(this.error(constants.error.FRAME_SIZE_ERROR,
	                               'Not enough space for padding'));
	  }

	  var pad = body.readUInt8();
	  if (!body.has(pad)) {
	    return callback(this.error(constants.error.PROTOCOL_ERROR,
	                               'Invalid padding size'));
	  }

	  var contents = body.clone(body.size - pad);
	  body.skip(body.size);
	  callback(null, contents);
	};

	Parser.prototype.onDataFrame = function onDataFrame(header, body, callback) {
	  var isEndStream = (header.flags & constants.flags.END_STREAM) !== 0;

	  if (header.id === 0) {
	    return callback(this.error(constants.error.PROTOCOL_ERROR,
	                               'Received DATA frame with stream=0'));
	  }

	  // Count received bytes
	  if (this.window)
	    this.window.recv.update(-body.size);

	  this.unpadData(header, body, function(err, data) {
	    if (err)
	      return callback(err);

	    callback(null, {
	      type: 'DATA',
	      id: header.id,
	      fin: isEndStream,
	      data: data.take(data.size)
	    });
	  });
	};

	Parser.prototype.initHeaderBlock = function initHeaderBlock(header,
	                                                            frame,
	                                                            block,
	                                                            callback) {

	  if (this._lastHeaderBlock) {
	    return callback(this.error(constants.error.PROTOCOL_ERROR,
	                               'Duplicate Stream ID'));
	  }

	  this._lastHeaderBlock = {
	    id: header.id,
	    frame: frame,
	    queue: [],
	    size: 0
	  };

	  this.queueHeaderBlock(header, block, callback);
	};

	Parser.prototype.queueHeaderBlock = function queueHeaderBlock(header,
	                                                              block,
	                                                              callback) {
	  var self = this;
	  var item = this._lastHeaderBlock;
	  if (!this._lastHeaderBlock || item.id !== header.id) {
	    return callback(this.error(constants.error.PROTOCOL_ERROR,
	                               'No matching stream for continuation'));
	  }

	  var fin = (header.flags & constants.flags.END_HEADERS) !== 0;

	  var chunks = block.toChunks();
	  for (var i = 0; i < chunks.length; i++) {
	    var chunk = chunks[i];
	    item.queue.push(chunk);
	    item.size += chunk.length;
	  }

	  if (item.size >= self.maxHeaderListSize) {
	    return callback(this.error(constants.error.PROTOCOL_ERROR,
	                               'Compressed header list is too large'));
	  }

	  if (!fin)
	    return callback(null, null);
	  this._lastHeaderBlock = null;

	  this.decompress.write(item.queue, function(err, chunks) {
	    if (err) {
	      return callback(self.error(constants.error.COMPRESSION_ERROR,
	                                 err.message));
	    }

	    var headers = {};
	    var size = 0;
	    for (var i = 0; i < chunks.length; i++) {
	      var header = chunks[i];

	      size += header.name.length + header.value.length + 32;
	      if (size >= self.maxHeaderListSize) {
	        return callback(self.error(constants.error.PROTOCOL_ERROR,
	                                   'Header list is too large'));
	      }

	      if (/[A-Z]/.test(header.name)) {
	        return callback(self.error(constants.error.PROTOCOL_ERROR,
	                                   'Header name must be lowercase'));
	      }

	      utils.addHeaderLine(header.name, header.value, headers);
	    }

	    item.frame.headers = headers;
	    item.frame.path = headers[':path'];

	    callback(null, item.frame);
	  });
	};

	Parser.prototype.onHeadersFrame = function onHeadersFrame(header,
	                                                          body,
	                                                          callback) {
	  var self = this;

	  if (header.id === 0) {
	    return callback(this.error(constants.error.PROTOCOL_ERROR,
	                               'Invalid stream id for HEADERS'));
	  }

	  this.unpadData(header, body, function(err, data) {
	    if (err)
	      return callback(err);

	    var isPriority = (header.flags & constants.flags.PRIORITY) !== 0;
	    if (!data.has(isPriority ? 5 : 0)) {
	      return callback(self.error(constants.error.FRAME_SIZE_ERROR,
	                                 'Not enough data for HEADERS'));
	    }

	    var exclusive = false;
	    var dependency = 0;
	    var weight = constants.DEFAULT_WEIGHT;
	    if (isPriority) {
	      dependency = data.readUInt32BE();
	      exclusive = (dependency & 0x80000000) !== 0;
	      dependency &= 0x7fffffff;

	      // Weight's range is [1, 256]
	      weight = data.readUInt8() + 1;
	    }

	    if (dependency === header.id) {
	      return callback(self.error(constants.error.PROTOCOL_ERROR,
	                                 'Stream can\'t dependend on itself'));
	    }

	    var streamInfo = {
	      type: 'HEADERS',
	      id: header.id,
	      priority: {
	        parent: dependency,
	        exclusive: exclusive,
	        weight: weight
	      },
	      fin: (header.flags & constants.flags.END_STREAM) !== 0,
	      writable: true,
	      headers: null,
	      path: null
	    };

	    self.initHeaderBlock(header, streamInfo, data, callback);
	  });
	};

	Parser.prototype.onContinuationFrame = function onContinuationFrame(header,
	                                                                    body,
	                                                                    callback) {
	  this.queueHeaderBlock(header, body, callback);
	};

	Parser.prototype.onRSTFrame = function onRSTFrame(header, body, callback) {
	  if (body.size !== 4) {
	    return callback(this.error(constants.error.FRAME_SIZE_ERROR,
	                               'RST_STREAM length not 4'));
	  }

	  if (header.id === 0) {
	    return callback(this.error(constants.error.PROTOCOL_ERROR,
	                               'Invalid stream id for RST_STREAM'));
	  }

	  callback(null, {
	    type: 'RST',
	    id: header.id,
	    code: constants.errorByCode[body.readUInt32BE()]
	  });
	};

	Parser.prototype._validateSettings = function _validateSettings(settings) {
	  if (settings['enable_push'] !== undefined &&
	      settings['enable_push'] !== 0 &&
	      settings['enable_push'] !== 1)
	    return this.error(constants.error.PROTOCOL_ERROR,
	                      'SETTINGS_ENABLE_PUSH must be 0 or 1');

	  if ( settings['initial_window_size'] !== undefined &&
	      (settings['initial_window_size'] > constants.MAX_INITIAL_WINDOW_SIZE ||
	       settings['initial_window_size'] < 0))
	    return this.error(constants.error.FLOW_CONTROL_ERROR,
	                      'SETTINGS_INITIAL_WINDOW_SIZE is OOB');

	  if ( settings['max_frame_size'] !== undefined &&
	      (settings['max_frame_size'] > constants.ABSOLUTE_MAX_FRAME_SIZE ||
	       settings['max_frame_size'] < constants.INITIAL_MAX_FRAME_SIZE))
	    return this.error(constants.error.PROTOCOL_ERROR,
	                      'SETTINGS_MAX_FRAME_SIZE is OOB');

	  return undefined;
	};

	Parser.prototype.onSettingsFrame = function onSettingsFrame(header,
	                                                            body,
	                                                            callback) {

	  if (header.id !== 0) {
	    return callback(this.error(constants.error.PROTOCOL_ERROR,
	                               'Invalid stream id for SETTINGS'));
	  }

	  var isAck = (header.flags & constants.flags.ACK) !== 0;
	  if (isAck && body.size !== 0) {
	    return callback(this.error(constants.error.FRAME_SIZE_ERROR,
	                               'SETTINGS with ACK and non-zero length'));
	  }

	  if (isAck)
	    return callback(null, { type: 'ACK_SETTINGS' });

	  if (body.size % 6 !== 0) {
	    return callback(this.error(constants.error.FRAME_SIZE_ERROR,
	                               'SETTINGS length not multiple of 6'));
	  }

	  var settings = {};
	  while (!body.isEmpty()) {
	    var id = body.readUInt16BE();
	    var value = body.readUInt32BE();
	    var name = constants.settingsIndex[id];

	    if (name)
	      settings[name] = value;
	  }

	  var err = this._validateSettings(settings);
	  if (err !== undefined) {
	    return callback(err);
	  }

	  callback(null, {
	    type: 'SETTINGS',
	    settings: settings
	  });
	};

	Parser.prototype.onPushPromiseFrame = function onPushPromiseFrame(header,
	                                                                  body,
	                                                                  callback) {

	  if (header.id === 0) {
	    return callback(this.error(constants.error.PROTOCOL_ERROR,
	                               'Invalid stream id for PUSH_PROMISE'));
	  }

	  var self = this;
	  this.unpadData(header, body, function(err, data) {
	    if (err)
	      return callback(err);

	    if (!data.has(4)) {
	      return callback(self.error(constants.error.FRAME_SIZE_ERROR,
	                                 'PUSH_PROMISE length less than 4'));
	    }

	    var streamInfo = {
	      type: 'PUSH_PROMISE',
	      id: header.id,
	      fin: false,
	      promisedId: data.readUInt32BE() & 0x7fffffff,
	      headers: null,
	      path: null
	    };

	    self.initHeaderBlock(header, streamInfo, data, callback);
	  });
	};

	Parser.prototype.onPingFrame = function onPingFrame(header, body, callback) {
	  if (body.size !== 8) {
	    return callback(this.error(constants.error.FRAME_SIZE_ERROR,
	                               'PING length != 8'));
	  }

	  if (header.id !== 0) {
	    return callback(this.error(constants.error.PROTOCOL_ERROR,
	                               'Invalid stream id for PING'));
	  }

	  var ack = (header.flags & constants.flags.ACK) !== 0;
	  callback(null, { type: 'PING', opaque: body.take(body.size), ack: ack });
	};

	Parser.prototype.onGoawayFrame = function onGoawayFrame(header,
	                                                        body,
	                                                        callback) {
	  if (!body.has(8)) {
	    return callback(this.error(constants.error.FRAME_SIZE_ERROR,
	                               'GOAWAY length < 8'));
	  }

	  if (header.id !== 0) {
	    return callback(this.error(constants.error.PROTOCOL_ERROR,
	                               'Invalid stream id for GOAWAY'));
	  }

	  var frame = {
	    type: 'GOAWAY',
	    lastId: body.readUInt32BE(),
	    code: constants.goawayByCode[body.readUInt32BE()]
	  };

	  if (body.size !== 0)
	    frame.debug = body.take(body.size);

	  callback(null, frame);
	};

	Parser.prototype.onPriorityFrame = function onPriorityFrame(header,
	                                                            body,
	                                                            callback) {
	  if (body.size !== 5) {
	    return callback(this.error(constants.error.FRAME_SIZE_ERROR,
	                               'PRIORITY length != 5'));
	  }

	  if (header.id === 0) {
	    return callback(this.error(constants.error.PROTOCOL_ERROR,
	                               'Invalid stream id for PRIORITY'));
	  }

	  var dependency = body.readUInt32BE();

	  // Again the range is from 1 to 256
	  var weight = body.readUInt8() + 1;

	  if (dependency === header.id) {
	    return callback(this.error(constants.error.PROTOCOL_ERROR,
	                               'Stream can\'t dependend on itself'));
	  }

	  callback(null, {
	    type: 'PRIORITY',
	    id: header.id,
	    priority: {
	      exclusive: (dependency & 0x80000000) !== 0,
	      parent: dependency & 0x7fffffff,
	      weight: weight
	    }
	  });
	};

	Parser.prototype.onWindowUpdateFrame = function onWindowUpdateFrame(header,
	                                                                    body,
	                                                                    callback) {
	  if (body.size !== 4) {
	    return callback(this.error(constants.error.FRAME_SIZE_ERROR,
	                               'WINDOW_UPDATE length != 4'));
	  }

	  var delta = body.readInt32BE();
	  if (delta === 0) {
	    return callback(this.error(constants.error.PROTOCOL_ERROR,
	                               'WINDOW_UPDATE delta == 0'));
	  }

	  callback(null, {
	    type: 'WINDOW_UPDATE',
	    id: header.id,
	    delta: delta
	  });
	};

	Parser.prototype.onXForwardedFrame = function onXForwardedFrame(header,
	                                                                body,
	                                                                callback) {
	  callback(null, {
	    type: 'X_FORWARDED_FOR',
	    host: body.take(body.size).toString()
	  });
	};


/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var transport = __webpack_require__(86);
	var base = transport.protocol.base;
	var constants = __webpack_require__(105).constants;

	var assert = __webpack_require__(75);
	var util = __webpack_require__(77);
	var WriteBuffer = __webpack_require__(101);
	var OffsetBuffer = __webpack_require__(94);
	var Buffer = __webpack_require__(78).Buffer;
	var debug = __webpack_require__(32)('spdy:framer');
	var debugExtra = __webpack_require__(32)('spdy:framer:extra');

	function Framer(options) {
	  base.Framer.call(this, options);

	  this.maxFrameSize = constants.INITIAL_MAX_FRAME_SIZE;
	}
	util.inherits(Framer, base.Framer);
	module.exports = Framer;

	Framer.create = function create(options) {
	  return new Framer(options);
	};

	Framer.prototype.setMaxFrameSize = function setMaxFrameSize(size) {
	  this.maxFrameSize = size;
	};

	Framer.prototype._frame = function _frame(frame, body, callback) {
	  debug('id=%d type=%s', frame.id, frame.type);

	  var buffer = new WriteBuffer();

	  buffer.reserve(constants.FRAME_HEADER_SIZE);
	  var len = buffer.skip(3);
	  buffer.writeUInt8(constants.frameType[frame.type]);
	  buffer.writeUInt8(frame.flags);
	  buffer.writeUInt32BE(frame.id & 0x7fffffff);

	  body(buffer);

	  var frameSize = buffer.size - constants.FRAME_HEADER_SIZE;
	  len.writeUInt24BE(frameSize);

	  var chunks = buffer.render();
	  var toWrite = {
	    stream: frame.id,
	    priority: frame.priority === undefined ? false : frame.priority,
	    chunks: chunks,
	    callback: callback
	  };

	  if (this.window && frame.type === 'DATA') {
	    var self = this;
	    this._resetTimeout();
	    this.window.send.update(-frameSize, function() {
	      self._resetTimeout();
	      self.schedule(toWrite);
	    });
	  } else {
	    this._resetTimeout();
	    this.schedule(toWrite);
	  }

	  return chunks;
	};

	Framer.prototype._split = function _split(frame) {
	  var buf = new OffsetBuffer();
	  for (var i = 0; i < frame.chunks.length; i++)
	    buf.push(frame.chunks[i]);

	  var frames = [];
	  while (!buf.isEmpty()) {
	    // First frame may have reserved bytes in it
	    var size = this.maxFrameSize;
	    if (frames.length === 0)
	      size -= frame.reserve;
	    size = Math.min(size, buf.size);

	    var frameBuf = buf.clone(size);
	    buf.skip(size);

	    frames.push({
	      size: frameBuf.size,
	      chunks: frameBuf.toChunks()
	    });
	  }

	  return frames;
	};

	Framer.prototype._continuationFrame = function _continuationFrame(frame,
	                                                                  body,
	                                                                  callback) {
	  var frames = this._split(frame);

	  frames.forEach(function(subFrame, i) {
	    var isFirst = i === 0;
	    var isLast = i === frames.length - 1;

	    var flags = isLast ? constants.flags.END_HEADERS : 0;

	    // PRIORITY and friends
	    if (isFirst)
	      flags |= frame.flags;

	    this._frame({
	      id: frame.id,
	      priority: false,
	      type: isFirst ? frame.type : 'CONTINUATION',
	      flags: flags
	    }, function(buf) {
	      // Fill those reserved bytes
	      if (isFirst && body)
	        body(buf);

	      buf.reserve(subFrame.size);
	      for (var i = 0; i < subFrame.chunks.length; i++)
	        buf.copyFrom(subFrame.chunks[i]);
	    }, isLast ? callback : null);
	  }, this);

	  if (frames.length === 0) {
	    this._frame({
	      id: frame.id,
	      priority: false,
	      type: frame.type,
	      flags: frame.flags | constants.flags.END_HEADERS
	    }, function(buf) {
	      if (body)
	        body(buf);
	    }, callback);
	  }
	};

	Framer.prototype._compressHeaders = function _compressHeaders(headers,
	                                                              pairs,
	                                                              callback) {
	  Object.keys(headers || {}).forEach(function(name) {
	    var lowName = name.toLowerCase();

	    // Not allowed in HTTP2
	    switch(lowName) {
	      case 'host':
	      case 'connection':
	      case 'keep-alive':
	      case 'proxy-connection':
	      case 'transfer-encoding':
	      case 'upgrade':
	        return;
	    }

	    // Should be in `pairs`
	    if (/^:/.test(lowName))
	      return;

	    // Do not compress, or index Cookie field (for security reasons)
	    var neverIndex = lowName === 'cookie' || lowName === 'set-cookie';

	    var value = headers[name];
	    if (Array.isArray(value)) {
	      for (var i = 0; i < value.length; i++) {
	        pairs.push({
	          name: lowName,
	          value: value[i] + '',
	          neverIndex: neverIndex,
	          huffman: !neverIndex
	        });
	      }
	    } else {
	      pairs.push({
	        name: lowName,
	        value: value + '',
	        neverIndex: neverIndex,
	        huffman: !neverIndex
	      });
	    }
	  });

	  var self = this;
	  assert(this.compress !== null, 'Framer version not initialized');
	  debugExtra('compressing headers=%j', pairs);
	  this.compress.write([ pairs ], callback);
	};

	Framer.prototype._isDefaultPriority = function _isDefaultPriority(priority) {
	  if (!priority)
	    return true;

	  return !priority.parent &&
	         priority.weight === constants.DEFAULT &&
	         !priority.exclusive;
	};

	Framer.prototype._defaultHeaders = function _defaultHeaders(frame, pairs) {
	  if (!frame.path)
	    throw new Error('`path` is required frame argument');

	  pairs.push({
	    name: ':method',
	    value: frame.method || base.constants.DEFAULT_METHOD
	  });
	  pairs.push({ name: ':path', value: frame.path });
	  pairs.push({ name: ':scheme', value: frame.scheme || 'https' });
	  pairs.push({
	    name: ':authority',
	    value: frame.host ||
	           frame.headers && frame.headers.host ||
	           base.constants.DEFAULT_HOST
	  });
	};

	Framer.prototype._headersFrame = function _headersFrame(kind, frame, callback) {
	  var pairs = [];

	  if (kind === 'request') {
	    this._defaultHeaders(frame, pairs);
	  } else if (kind === 'response') {
	    pairs.push({ name: ':status', value: (frame.status || 200) + '' });
	  }

	  var self = this;
	  this._compressHeaders(frame.headers, pairs, function(err, chunks) {
	    if (err) {
	      if (callback)
	        return callback(err);
	      else
	        return self.emit('error', err);
	    }

	    var reserve = 0;

	    // If priority info is present, and the values are not default ones
	    // reserve space for the priority info and add PRIORITY flag
	    var priority = frame.priority;
	    if (!self._isDefaultPriority(priority))
	      reserve = 5;

	    var flags = reserve === 0 ? 0 : constants.flags.PRIORITY;

	    // Mostly for testing
	    if (frame.fin)
	      flags |= constants.flags.END_STREAM;

	    self._continuationFrame({
	      id: frame.id,
	      type: 'HEADERS',
	      flags: flags,
	      reserve: reserve,
	      chunks: chunks
	    }, function(buf) {
	      if (reserve === 0)
	        return;

	      buf.writeUInt32BE((priority.exclusive ? 0x80000000 : 0) |
	                        priority.parent);
	      buf.writeUInt8((priority.weight | 0) - 1);
	    }, callback);
	  });
	};

	Framer.prototype.requestFrame = function requestFrame(frame, callback) {
	  return this._headersFrame('request', frame, callback);
	};

	Framer.prototype.responseFrame = function responseFrame(frame, callback) {
	  return this._headersFrame('response', frame, callback);
	};

	Framer.prototype.headersFrame = function headersFrame(frame, callback) {
	  return this._headersFrame('headers', frame, callback);
	};

	Framer.prototype.pushFrame = function pushFrame(frame, callback) {
	  var self = this;

	  function compress(headers, pairs, callback) {
	    self._compressHeaders(headers, pairs, function(err, chunks) {
	      if (err) {
	        if (callback)
	          return callback(err);
	        else
	          return self.emit('error', err);
	      }

	      callback(chunks);
	    });
	  }

	  function sendPromise(chunks) {
	    self._continuationFrame({
	      id: frame.id,
	      type: 'PUSH_PROMISE',
	      reserve: 4,
	      chunks: chunks
	    }, function(buf) {
	      buf.writeUInt32BE(frame.promisedId);
	    });
	  }

	  function sendResponse(chunks, callback) {
	    var priority = frame.priority;
	    var isDefaultPriority = self._isDefaultPriority(priority);
	    var flags = isDefaultPriority ? 0 : constants.flags.PRIORITY;

	    // Mostly for testing
	    if (frame.fin)
	      flags |= constants.flags.END_STREAM;

	    self._continuationFrame({
	      id: frame.promisedId,
	      type: 'HEADERS',
	      flags: flags,
	      reserve: isDefaultPriority ? 0 : 5,
	      chunks: chunks
	    }, function(buf) {
	      if (isDefaultPriority)
	        return;

	      buf.writeUInt32BE((priority.exclusive ? 0x80000000 : 0) |
	                        priority.parent);
	      buf.writeUInt8((priority.weight | 0) - 1);
	    }, callback);
	  }

	  this._checkPush(function(err) {
	    if (err)
	      return callback(err);

	    var pairs = {
	      promise: [],
	      response: []
	    };

	    self._defaultHeaders(frame, pairs.promise);
	    pairs.response.push({ name: ':status', value: (frame.status || 200) + '' });

	    compress(frame.headers, pairs.promise, function(promiseChunks) {
	      sendPromise(promiseChunks);
	      compress(frame.response, pairs.response, function(responseChunks) {
	        sendResponse(responseChunks, callback);
	      });
	    });
	  });
	};

	Framer.prototype.priorityFrame = function priorityFrame(frame, callback) {
	  this._frame({
	    id: frame.id,
	    priority: false,
	    type: 'PRIORITY',
	    flags: 0
	  }, function(buf) {
	    var priority = frame.priority;
	    buf.writeUInt32BE((priority.exclusive ? 0x80000000 : 0) |
	                      priority.parent);
	    buf.writeUInt8((priority.weight | 0) - 1);
	  }, callback);
	};

	Framer.prototype.dataFrame = function dataFrame(frame, callback) {
	  var frames = this._split({
	    reserve: 0,
	    chunks: [ frame.data ]
	  });

	  var fin = frame.fin ? constants.flags.END_STREAM : 0;

	  var self = this;
	  frames.forEach(function(subFrame, i) {
	    var isLast = i === frames.length - 1;
	    var flags = 0;
	    if (isLast)
	      flags |= fin;

	    self._frame({
	      id: frame.id,
	      priority: frame.priority,
	      type: 'DATA',
	      flags: flags
	    }, function(buf) {
	      buf.reserve(subFrame.size);
	      for (var i = 0; i < subFrame.chunks.length; i++)
	        buf.copyFrom(subFrame.chunks[i]);
	    }, isLast ? callback : null);
	  });

	  // Empty DATA
	  if (frames.length === 0) {
	    this._frame({
	      id: frame.id,
	      priority: frame.priority,
	      type: 'DATA',
	      flags: fin
	    }, function(buf) {
	      // No-op
	    }, callback);
	  }
	};

	Framer.prototype.pingFrame = function pingFrame(frame, callback) {
	  this._frame({
	    id: 0,
	    type: 'PING',
	    flags: frame.ack ? constants.flags.ACK : 0
	  }, function(buf) {
	    buf.copyFrom(frame.opaque);
	  }, callback);
	};

	Framer.prototype.rstFrame = function rstFrame(frame, callback) {
	  this._frame({
	    id: frame.id,
	    type: 'RST_STREAM',
	    flags: 0
	  }, function(buf) {
	    buf.writeUInt32BE(constants.error[frame.code]);
	  }, callback);
	};

	Framer.prototype.prefaceFrame = function prefaceFrame(callback) {
	  debug('preface');
	  this._resetTimeout();
	  this.schedule({
	    stream: 0,
	    priority: false,
	    chunks: [ constants.PREFACE_BUFFER ],
	    callback: callback
	  });
	};

	Framer.prototype.settingsFrame = function settingsFrame(options, callback) {
	  var key = JSON.stringify(options);

	  var settings = Framer.settingsCache[key];
	  if (settings) {
	    debug('cached settings');
	    this._resetTimeout();
	    this.schedule({
	      id: 0,
	      priority: false,
	      chunks: settings,
	      callback: callback
	    });
	    return;
	  }

	  var params = [];
	  for (var i = 0; i < constants.settingsIndex.length; i++) {
	    var name = constants.settingsIndex[i];
	    if (!name)
	      continue;

	    // value: Infinity
	    if (!isFinite(options[name]))
	      continue;

	    if (options[name] !== undefined)
	      params.push({ key: i, value: options[name] });
	  }

	  var bodySize = params.length * 6;

	  var chunks = this._frame({
	    id: 0,
	    type: 'SETTINGS',
	    flags: 0
	  }, function(buffer) {
	    buffer.reserve(bodySize);
	    for (var i = 0; i < params.length; i++) {
	      var param = params[i];

	      buffer.writeUInt16BE(param.key);
	      buffer.writeUInt32BE(param.value);
	    }
	  }, callback);

	  Framer.settingsCache[key] = chunks;
	};
	Framer.settingsCache = {};

	Framer.prototype.ackSettingsFrame = function ackSettingsFrame(callback) {
	  var chunks = this._frame({
	    id: 0,
	    type: 'SETTINGS',
	    flags: constants.flags.ACK
	  }, function(buffer) {
	    // No-op
	  }, callback);
	};

	Framer.prototype.windowUpdateFrame = function windowUpdateFrame(frame,
	                                                                callback) {
	  this._frame({
	    id: frame.id,
	    type: 'WINDOW_UPDATE',
	    flags: 0
	  }, function(buffer) {
	    buffer.reserve(4);
	    buffer.writeInt32BE(frame.delta);
	  }, callback);
	};

	Framer.prototype.goawayFrame = function goawayFrame(frame, callback) {
	  this._frame({
	    type: 'GOAWAY',
	    id: 0,
	    flags: 0
	  }, function(buf) {
	    buf.reserve(8);

	    // Last-good-stream-ID
	    buf.writeUInt32BE(frame.lastId & 0x7fffffff);
	    // Code
	    buf.writeUInt32BE(constants.goaway[frame.code]);

	    // Extra debugging information
	    if (frame.extra)
	      buf.write(frame.extra);
	  }, callback);
	};

	Framer.prototype.xForwardedFor = function xForwardedFor(frame, callback) {
	  this._frame({
	    type: 'X_FORWARDED_FOR',
	    id: 0,
	    flags: 0
	  }, function(buf) {
	    buf.write(frame.host);
	  }, callback);
	};


/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var transport = __webpack_require__(86);
	var constants = __webpack_require__(105).constants;

	var hpack = __webpack_require__(110);

	function Pool() {
	}
	module.exports = Pool;

	Pool.create = function create() {
	  return new Pool();
	};

	Pool.prototype.get = function get(version) {
	  var options = {
	    table: {
	      maxSize: constants.HEADER_TABLE_SIZE
	    }
	  };

	  var compress = hpack.compressor.create(options);
	  var decompress = hpack.decompressor.create(options);

	  return {
	    version: version,

	    compress: compress,
	    decompress: decompress
	  };
	};

	Pool.prototype.put = function put() {
	};


/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	var hpack = exports;

	hpack.utils = __webpack_require__(111);
	hpack.huffman = __webpack_require__(112);
	hpack['static-table'] = __webpack_require__(113);
	hpack.table = __webpack_require__(114);

	hpack.decoder = __webpack_require__(115);
	hpack.decompressor = __webpack_require__(116);

	hpack.encoder = __webpack_require__(118);
	hpack.compressor = __webpack_require__(119);


/***/ },
/* 111 */
/***/ function(module, exports) {

	exports.assert = function assert(cond, text) {
	  if (!cond)
	    throw new Error(text);
	};

	exports.stringify = function stringify(arr) {
	  var res = '';
	  for (var i = 0; i < arr.length; i++)
	    res += String.fromCharCode(arr[i]);
	  return res;
	};

	exports.toArray = function toArray(str) {
	  var res = [];
	  for (var i = 0; i < str.length; i++) {
	    var c = str.charCodeAt(i);
	    var hi = c >>> 8;
	    var lo = c & 0xff;
	    if (hi)
	      res.push(hi, lo);
	    else
	      res.push(lo);
	  }
	  return res;
	};


/***/ },
/* 112 */
/***/ function(module, exports) {

	exports.decode =
	    [2608,2609,2610,2657,2659,2661,2665,2671,2675,2676,0,0,0,0,0,0,0,0,0,0,
	    3104,3109,3117,3118,3119,3123,3124,3125,3126,3127,3128,3129,3133,3137,3167,
	    3170,3172,3174,3175,3176,3180,3181,3182,3184,3186,3189,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    3642,3650,3651,3652,3653,3654,3655,3656,3657,3658,3659,3660,3661,3662,3663,
	    3664,3665,3666,3667,3668,3669,3670,3671,3673,3690,3691,3697,3702,3703,3704,
	    3705,3706,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4134,4138,4140,4155,4184,4186,[1057,
	    1058,1064,1065,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	    [1087,0,1575,1579,1660,0,0,0,0,0,2083,2110,0,0,0,0,0,0,0,0,0,0,0,0,2560,
	    2596,2624,2651,2653,2686,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,3166,3197,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3644,
	    3680,3707,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,[1628,1731,1744,0,0,0,2176,2178,
	    2179,2210,2232,2242,2272,2274,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2713,2721,2727,
	    2732,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0],[2736,2737,2739,2769,2776,2777,2787,2789,2790,0,0,0,0,0,0,0,0,0,
	    3201,3204,3205,3206,3208,3218,3226,3228,3232,3235,3236,3241,3242,3245,3250,
	    3253,3257,3258,3259,3261,3262,3268,3270,3300,3304,3305,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3585,
	    3719,3721,3722,3723,3724,3725,3727,3731,3733,3734,3735,3736,3739,3741,3742,
	    3749,3750,3752,3758,3759,3764,3766,3767,3772,3775,3781,3815,3823,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,4105,4238,4240,4241,4244,4255,4267,4302,4311,4321,4332,4333,[711,719,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[746,747,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1216,1217,
	    1224,1225,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	    [1226,1229,1234,1237,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0],[1242,1243,1262,1264,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0],[1266,1267,1279,0,0,0,1739,1740,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0],[1747,1748,1750,1757,1758,1759,1777,1780,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1781,1782,1783,1784,1786,
	    1787,1788,1789,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1790,0,
	    2050,2051,2052,2053,2054,2055,2056,2059,2060,2062,2063,2064,2065,2066,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[2067,2068,2069,2071,2072,2073,2074,2075,
	    2076,2077,2078,2079,2175,2268,2297,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3082,3085,3094,3328,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	    0,0,0,0,0]]]];
	exports.encode =
	    [[13,8184],[23,8388568],[28,268435426],[28,268435427],[28,268435428],[28,
	    268435429],[28,268435430],[28,268435431],[28,268435432],[24,16777194],[30,
	    1073741820],[28,268435433],[28,268435434],[30,1073741821],[28,268435435],
	    [28,268435436],[28,268435437],[28,268435438],[28,268435439],[28,268435440],
	    [28,268435441],[28,268435442],[30,1073741822],[28,268435443],[28,
	    268435444],[28,268435445],[28,268435446],[28,268435447],[28,268435448],[28,
	    268435449],[28,268435450],[28,268435451],[6,20],[10,1016],[10,1017],[12,
	    4090],[13,8185],[6,21],[8,248],[11,2042],[10,1018],[10,1019],[8,249],[11,
	    2043],[8,250],[6,22],[6,23],[6,24],[5,0],[5,1],[5,2],[6,25],[6,26],[6,27],
	    [6,28],[6,29],[6,30],[6,31],[7,92],[8,251],[15,32764],[6,32],[12,4091],[10,
	    1020],[13,8186],[6,33],[7,93],[7,94],[7,95],[7,96],[7,97],[7,98],[7,99],[7,
	    100],[7,101],[7,102],[7,103],[7,104],[7,105],[7,106],[7,107],[7,108],[7,
	    109],[7,110],[7,111],[7,112],[7,113],[7,114],[8,252],[7,115],[8,253],[13,
	    8187],[19,524272],[13,8188],[14,16380],[6,34],[15,32765],[5,3],[6,35],[5,
	    4],[6,36],[5,5],[6,37],[6,38],[6,39],[5,6],[7,116],[7,117],[6,40],[6,41],
	    [6,42],[5,7],[6,43],[7,118],[6,44],[5,8],[5,9],[6,45],[7,119],[7,120],[7,
	    121],[7,122],[7,123],[15,32766],[11,2044],[14,16381],[13,8189],[28,
	    268435452],[20,1048550],[22,4194258],[20,1048551],[20,1048552],[22,
	    4194259],[22,4194260],[22,4194261],[23,8388569],[22,4194262],[23,8388570],
	    [23,8388571],[23,8388572],[23,8388573],[23,8388574],[24,16777195],[23,
	    8388575],[24,16777196],[24,16777197],[22,4194263],[23,8388576],[24,
	    16777198],[23,8388577],[23,8388578],[23,8388579],[23,8388580],[21,2097116],
	    [22,4194264],[23,8388581],[22,4194265],[23,8388582],[23,8388583],[24,
	    16777199],[22,4194266],[21,2097117],[20,1048553],[22,4194267],[22,4194268],
	    [23,8388584],[23,8388585],[21,2097118],[23,8388586],[22,4194269],[22,
	    4194270],[24,16777200],[21,2097119],[22,4194271],[23,8388587],[23,8388588],
	    [21,2097120],[21,2097121],[22,4194272],[21,2097122],[23,8388589],[22,
	    4194273],[23,8388590],[23,8388591],[20,1048554],[22,4194274],[22,4194275],
	    [22,4194276],[23,8388592],[22,4194277],[22,4194278],[23,8388593],[26,
	    67108832],[26,67108833],[20,1048555],[19,524273],[22,4194279],[23,8388594],
	    [22,4194280],[25,33554412],[26,67108834],[26,67108835],[26,67108836],[27,
	    134217694],[27,134217695],[26,67108837],[24,16777201],[25,33554413],[19,
	    524274],[21,2097123],[26,67108838],[27,134217696],[27,134217697],[26,
	    67108839],[27,134217698],[24,16777202],[21,2097124],[21,2097125],[26,
	    67108840],[26,67108841],[28,268435453],[27,134217699],[27,134217700],[27,
	    134217701],[20,1048556],[24,16777203],[20,1048557],[21,2097126],[22,
	    4194281],[21,2097127],[21,2097128],[23,8388595],[22,4194282],[22,4194283],
	    [25,33554414],[25,33554415],[24,16777204],[24,16777205],[26,67108842],[23,
	    8388596],[26,67108843],[27,134217702],[26,67108844],[26,67108845],[27,
	    134217703],[27,134217704],[27,134217705],[27,134217706],[27,134217707],[28,
	    268435454],[27,134217708],[27,134217709],[27,134217710],[27,134217711],[27,
	    134217712],[26,67108846],[30,1073741823]];


/***/ },
/* 113 */
/***/ function(module, exports) {

	exports.table = [
	  {
	    "name": ":authority",
	    "value": "",
	    "nameSize": 10,
	    "totalSize": 42
	  },
	  {
	    "name": ":method",
	    "value": "GET",
	    "nameSize": 7,
	    "totalSize": 42
	  },
	  {
	    "name": ":method",
	    "value": "POST",
	    "nameSize": 7,
	    "totalSize": 43
	  },
	  {
	    "name": ":path",
	    "value": "/",
	    "nameSize": 5,
	    "totalSize": 38
	  },
	  {
	    "name": ":path",
	    "value": "/index.html",
	    "nameSize": 5,
	    "totalSize": 48
	  },
	  {
	    "name": ":scheme",
	    "value": "http",
	    "nameSize": 7,
	    "totalSize": 43
	  },
	  {
	    "name": ":scheme",
	    "value": "https",
	    "nameSize": 7,
	    "totalSize": 44
	  },
	  {
	    "name": ":status",
	    "value": "200",
	    "nameSize": 7,
	    "totalSize": 42
	  },
	  {
	    "name": ":status",
	    "value": "204",
	    "nameSize": 7,
	    "totalSize": 42
	  },
	  {
	    "name": ":status",
	    "value": "206",
	    "nameSize": 7,
	    "totalSize": 42
	  },
	  {
	    "name": ":status",
	    "value": "304",
	    "nameSize": 7,
	    "totalSize": 42
	  },
	  {
	    "name": ":status",
	    "value": "400",
	    "nameSize": 7,
	    "totalSize": 42
	  },
	  {
	    "name": ":status",
	    "value": "404",
	    "nameSize": 7,
	    "totalSize": 42
	  },
	  {
	    "name": ":status",
	    "value": "500",
	    "nameSize": 7,
	    "totalSize": 42
	  },
	  {
	    "name": "accept-charset",
	    "value": "",
	    "nameSize": 14,
	    "totalSize": 46
	  },
	  {
	    "name": "accept-encoding",
	    "value": "gzip, deflate",
	    "nameSize": 15,
	    "totalSize": 60
	  },
	  {
	    "name": "accept-language",
	    "value": "",
	    "nameSize": 15,
	    "totalSize": 47
	  },
	  {
	    "name": "accept-ranges",
	    "value": "",
	    "nameSize": 13,
	    "totalSize": 45
	  },
	  {
	    "name": "accept",
	    "value": "",
	    "nameSize": 6,
	    "totalSize": 38
	  },
	  {
	    "name": "access-control-allow-origin",
	    "value": "",
	    "nameSize": 27,
	    "totalSize": 59
	  },
	  {
	    "name": "age",
	    "value": "",
	    "nameSize": 3,
	    "totalSize": 35
	  },
	  {
	    "name": "allow",
	    "value": "",
	    "nameSize": 5,
	    "totalSize": 37
	  },
	  {
	    "name": "authorization",
	    "value": "",
	    "nameSize": 13,
	    "totalSize": 45
	  },
	  {
	    "name": "cache-control",
	    "value": "",
	    "nameSize": 13,
	    "totalSize": 45
	  },
	  {
	    "name": "content-disposition",
	    "value": "",
	    "nameSize": 19,
	    "totalSize": 51
	  },
	  {
	    "name": "content-encoding",
	    "value": "",
	    "nameSize": 16,
	    "totalSize": 48
	  },
	  {
	    "name": "content-language",
	    "value": "",
	    "nameSize": 16,
	    "totalSize": 48
	  },
	  {
	    "name": "content-length",
	    "value": "",
	    "nameSize": 14,
	    "totalSize": 46
	  },
	  {
	    "name": "content-location",
	    "value": "",
	    "nameSize": 16,
	    "totalSize": 48
	  },
	  {
	    "name": "content-range",
	    "value": "",
	    "nameSize": 13,
	    "totalSize": 45
	  },
	  {
	    "name": "content-type",
	    "value": "",
	    "nameSize": 12,
	    "totalSize": 44
	  },
	  {
	    "name": "cookie",
	    "value": "",
	    "nameSize": 6,
	    "totalSize": 38
	  },
	  {
	    "name": "date",
	    "value": "",
	    "nameSize": 4,
	    "totalSize": 36
	  },
	  {
	    "name": "etag",
	    "value": "",
	    "nameSize": 4,
	    "totalSize": 36
	  },
	  {
	    "name": "expect",
	    "value": "",
	    "nameSize": 6,
	    "totalSize": 38
	  },
	  {
	    "name": "expires",
	    "value": "",
	    "nameSize": 7,
	    "totalSize": 39
	  },
	  {
	    "name": "from",
	    "value": "",
	    "nameSize": 4,
	    "totalSize": 36
	  },
	  {
	    "name": "host",
	    "value": "",
	    "nameSize": 4,
	    "totalSize": 36
	  },
	  {
	    "name": "if-match",
	    "value": "",
	    "nameSize": 8,
	    "totalSize": 40
	  },
	  {
	    "name": "if-modified-since",
	    "value": "",
	    "nameSize": 17,
	    "totalSize": 49
	  },
	  {
	    "name": "if-none-match",
	    "value": "",
	    "nameSize": 13,
	    "totalSize": 45
	  },
	  {
	    "name": "if-range",
	    "value": "",
	    "nameSize": 8,
	    "totalSize": 40
	  },
	  {
	    "name": "if-unmodified-since",
	    "value": "",
	    "nameSize": 19,
	    "totalSize": 51
	  },
	  {
	    "name": "last-modified",
	    "value": "",
	    "nameSize": 13,
	    "totalSize": 45
	  },
	  {
	    "name": "link",
	    "value": "",
	    "nameSize": 4,
	    "totalSize": 36
	  },
	  {
	    "name": "location",
	    "value": "",
	    "nameSize": 8,
	    "totalSize": 40
	  },
	  {
	    "name": "max-forwards",
	    "value": "",
	    "nameSize": 12,
	    "totalSize": 44
	  },
	  {
	    "name": "proxy-authenticate",
	    "value": "",
	    "nameSize": 18,
	    "totalSize": 50
	  },
	  {
	    "name": "proxy-authorization",
	    "value": "",
	    "nameSize": 19,
	    "totalSize": 51
	  },
	  {
	    "name": "range",
	    "value": "",
	    "nameSize": 5,
	    "totalSize": 37
	  },
	  {
	    "name": "referer",
	    "value": "",
	    "nameSize": 7,
	    "totalSize": 39
	  },
	  {
	    "name": "refresh",
	    "value": "",
	    "nameSize": 7,
	    "totalSize": 39
	  },
	  {
	    "name": "retry-after",
	    "value": "",
	    "nameSize": 11,
	    "totalSize": 43
	  },
	  {
	    "name": "server",
	    "value": "",
	    "nameSize": 6,
	    "totalSize": 38
	  },
	  {
	    "name": "set-cookie",
	    "value": "",
	    "nameSize": 10,
	    "totalSize": 42
	  },
	  {
	    "name": "strict-transport-security",
	    "value": "",
	    "nameSize": 25,
	    "totalSize": 57
	  },
	  {
	    "name": "transfer-encoding",
	    "value": "",
	    "nameSize": 17,
	    "totalSize": 49
	  },
	  {
	    "name": "user-agent",
	    "value": "",
	    "nameSize": 10,
	    "totalSize": 42
	  },
	  {
	    "name": "vary",
	    "value": "",
	    "nameSize": 4,
	    "totalSize": 36
	  },
	  {
	    "name": "via",
	    "value": "",
	    "nameSize": 3,
	    "totalSize": 35
	  },
	  {
	    "name": "www-authenticate",
	    "value": "",
	    "nameSize": 16,
	    "totalSize": 48
	  }
	];
	exports.map = {
	  ":authority": {
	    "index": 1,
	    "values": {
	      "": 1
	    }
	  },
	  ":method": {
	    "index": 2,
	    "values": {
	      "GET": 2,
	      "POST": 3
	    }
	  },
	  ":path": {
	    "index": 4,
	    "values": {
	      "/": 4,
	      "/index.html": 5
	    }
	  },
	  ":scheme": {
	    "index": 6,
	    "values": {
	      "http": 6,
	      "https": 7
	    }
	  },
	  ":status": {
	    "index": 8,
	    "values": {
	      "200": 8,
	      "204": 9,
	      "206": 10,
	      "304": 11,
	      "400": 12,
	      "404": 13,
	      "500": 14
	    }
	  },
	  "accept-charset": {
	    "index": 15,
	    "values": {
	      "": 15
	    }
	  },
	  "accept-encoding": {
	    "index": 16,
	    "values": {
	      "gzip, deflate": 16
	    }
	  },
	  "accept-language": {
	    "index": 17,
	    "values": {
	      "": 17
	    }
	  },
	  "accept-ranges": {
	    "index": 18,
	    "values": {
	      "": 18
	    }
	  },
	  "accept": {
	    "index": 19,
	    "values": {
	      "": 19
	    }
	  },
	  "access-control-allow-origin": {
	    "index": 20,
	    "values": {
	      "": 20
	    }
	  },
	  "age": {
	    "index": 21,
	    "values": {
	      "": 21
	    }
	  },
	  "allow": {
	    "index": 22,
	    "values": {
	      "": 22
	    }
	  },
	  "authorization": {
	    "index": 23,
	    "values": {
	      "": 23
	    }
	  },
	  "cache-control": {
	    "index": 24,
	    "values": {
	      "": 24
	    }
	  },
	  "content-disposition": {
	    "index": 25,
	    "values": {
	      "": 25
	    }
	  },
	  "content-encoding": {
	    "index": 26,
	    "values": {
	      "": 26
	    }
	  },
	  "content-language": {
	    "index": 27,
	    "values": {
	      "": 27
	    }
	  },
	  "content-length": {
	    "index": 28,
	    "values": {
	      "": 28
	    }
	  },
	  "content-location": {
	    "index": 29,
	    "values": {
	      "": 29
	    }
	  },
	  "content-range": {
	    "index": 30,
	    "values": {
	      "": 30
	    }
	  },
	  "content-type": {
	    "index": 31,
	    "values": {
	      "": 31
	    }
	  },
	  "cookie": {
	    "index": 32,
	    "values": {
	      "": 32
	    }
	  },
	  "date": {
	    "index": 33,
	    "values": {
	      "": 33
	    }
	  },
	  "etag": {
	    "index": 34,
	    "values": {
	      "": 34
	    }
	  },
	  "expect": {
	    "index": 35,
	    "values": {
	      "": 35
	    }
	  },
	  "expires": {
	    "index": 36,
	    "values": {
	      "": 36
	    }
	  },
	  "from": {
	    "index": 37,
	    "values": {
	      "": 37
	    }
	  },
	  "host": {
	    "index": 38,
	    "values": {
	      "": 38
	    }
	  },
	  "if-match": {
	    "index": 39,
	    "values": {
	      "": 39
	    }
	  },
	  "if-modified-since": {
	    "index": 40,
	    "values": {
	      "": 40
	    }
	  },
	  "if-none-match": {
	    "index": 41,
	    "values": {
	      "": 41
	    }
	  },
	  "if-range": {
	    "index": 42,
	    "values": {
	      "": 42
	    }
	  },
	  "if-unmodified-since": {
	    "index": 43,
	    "values": {
	      "": 43
	    }
	  },
	  "last-modified": {
	    "index": 44,
	    "values": {
	      "": 44
	    }
	  },
	  "link": {
	    "index": 45,
	    "values": {
	      "": 45
	    }
	  },
	  "location": {
	    "index": 46,
	    "values": {
	      "": 46
	    }
	  },
	  "max-forwards": {
	    "index": 47,
	    "values": {
	      "": 47
	    }
	  },
	  "proxy-authenticate": {
	    "index": 48,
	    "values": {
	      "": 48
	    }
	  },
	  "proxy-authorization": {
	    "index": 49,
	    "values": {
	      "": 49
	    }
	  },
	  "range": {
	    "index": 50,
	    "values": {
	      "": 50
	    }
	  },
	  "referer": {
	    "index": 51,
	    "values": {
	      "": 51
	    }
	  },
	  "refresh": {
	    "index": 52,
	    "values": {
	      "": 52
	    }
	  },
	  "retry-after": {
	    "index": 53,
	    "values": {
	      "": 53
	    }
	  },
	  "server": {
	    "index": 54,
	    "values": {
	      "": 54
	    }
	  },
	  "set-cookie": {
	    "index": 55,
	    "values": {
	      "": 55
	    }
	  },
	  "strict-transport-security": {
	    "index": 56,
	    "values": {
	      "": 56
	    }
	  },
	  "transfer-encoding": {
	    "index": 57,
	    "values": {
	      "": 57
	    }
	  },
	  "user-agent": {
	    "index": 58,
	    "values": {
	      "": 58
	    }
	  },
	  "vary": {
	    "index": 59,
	    "values": {
	      "": 59
	    }
	  },
	  "via": {
	    "index": 60,
	    "values": {
	      "": 60
	    }
	  },
	  "www-authenticate": {
	    "index": 61,
	    "values": {
	      "": 61
	    }
	  }
	};


/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	var hpack = __webpack_require__(110);
	var utils = hpack.utils;
	var assert = utils.assert;

	function Table(options) {
	  this['static'] = hpack['static-table'];
	  this.dynamic = [];
	  this.size = 0;
	  this.maxSize = 0;
	  this.length = this['static'].table.length;
	  this.protocolMaxSize = options.maxSize;
	  this.maxSize = this.protocolMaxSize;
	  this.lookupDepth = options.lookupDepth || 32;
	}
	module.exports = Table;

	Table.create = function create(options) {
	  return new Table(options);
	};

	Table.prototype.lookup = function lookup(index) {
	  assert(index !== 0, 'Zero indexed field');
	  assert(index <= this.length, 'Indexed field OOB')

	  if (index <= this['static'].table.length)
	    return this['static'].table[index - 1];
	  else
	    return this.dynamic[this.length - index];
	};

	Table.prototype.reverseLookup = function reverseLookup(name, value) {
	  var staticEntry = this['static'].map[name];
	  if (staticEntry && staticEntry.values[value])
	    return staticEntry.values[value];

	  // Reverse search dynamic table (new items are at the end of it)
	  var limit = Math.max(0, this.dynamic.length - this.lookupDepth);
	  for (var i = this.dynamic.length - 1; i >= limit; i--) {
	    var entry = this.dynamic[i];
	    if (entry.name === name && entry.value === value)
	      return this.length - i;

	    if (entry.name === name) {
	      // Prefer smaller index
	      if (staticEntry)
	        break;
	      return -(this.length - i);
	    }
	  }

	  if (staticEntry)
	    return -staticEntry.index;

	  return 0;
	};

	Table.prototype.add = function add(name, value, nameSize, valueSize) {
	  var totalSize = nameSize + valueSize + 32;

	  this.dynamic.push({
	    name: name,
	    value: value,
	    nameSize: nameSize,
	    totalSize: totalSize
	  });
	  this.size += totalSize;
	  this.length++;

	  this.evict();
	};

	Table.prototype.evict = function evict() {
	  while (this.size > this.maxSize) {
	    var entry = this.dynamic.shift();
	    this.size -= entry.totalSize;
	    this.length--;
	  }
	  assert(this.size >= 0, 'Table size sanity check failed');
	};

	Table.prototype.updateSize = function updateSize(size) {
	  assert(size <= this.protocolMaxSize, 'Table size bigger than maximum');
	  this.maxSize = size;
	  this.evict();
	};


/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	var hpack = __webpack_require__(110);
	var utils = hpack.utils;
	var huffman = hpack.huffman.decode;
	var assert = utils.assert;

	var OffsetBuffer = __webpack_require__(94);

	function Decoder() {
	  this.buffer = new OffsetBuffer();
	  this.bitOffset = 0;

	  // Used internally in decodeStr
	  this._huffmanNode = null;
	}
	module.exports = Decoder;

	Decoder.create = function create() {
	  return new Decoder();
	};

	Decoder.prototype.isEmpty = function isEmpty() {
	  return this.buffer.isEmpty();
	};

	Decoder.prototype.push = function push(chunk) {
	  this.buffer.push(chunk);
	};

	Decoder.prototype.decodeBit = function decodeBit() {
	  // Need at least one octet
	  assert(this.buffer.has(1), 'Buffer too small for an int');

	  var octet;
	  var offset = this.bitOffset;

	  if (++this.bitOffset === 8) {
	    octet = this.buffer.readUInt8();
	    this.bitOffset = 0;
	  } else {
	    octet = this.buffer.peekUInt8();
	  }
	  return (octet >>> (7 - offset)) & 1;
	};

	// Just for testing
	Decoder.prototype.skipBits = function skipBits(n) {
	  this.bitOffset += n;
	  this.buffer.skip(this.bitOffset >> 3);
	  this.bitOffset &= 0x7;
	};

	Decoder.prototype.decodeInt = function decodeInt() {
	  // Need at least one octet
	  assert(this.buffer.has(1), 'Buffer too small for an int');

	  var prefix = 8 - this.bitOffset;

	  // We are going to end up octet-aligned
	  this.bitOffset = 0;

	  var max = (1 << prefix) - 1;
	  var octet = this.buffer.readUInt8() & max;

	  // Fast case - int fits into the prefix
	  if (octet !== max)
	    return octet;

	  // TODO(indutny): what about > 32bit numbers?
	  var res = 0;
	  var isLast = false;
	  var len = 0;
	  do {
	    octet = this.buffer.readUInt8();
	    isLast = (octet & 0x80) === 0;

	    res <<= 7;
	    res |= octet & 0x7f;
	    len++;
	  } while (!isLast);
	  assert(isLast, 'Incomplete data for multi-octet integer');
	  assert(len <= 4, 'Integer does not fit into 32 bits');

	  // Reverse bits
	  res = (res >>> 21) |
	        (((res >> 14) & 0x7f) << 7) |
	        (((res >> 7) & 0x7f) << 14) |
	        ((res & 0x7f) << 21);
	  res >>= (4 - len) * 7;

	  // Append prefix max
	  res += max;

	  return res;
	};

	Decoder.prototype.decodeHuffmanWord = function decodeHuffmanWord(input,
	                                                                 inputBits,
	                                                                 out) {
	  var root = huffman;
	  var node = this._huffmanNode;
	  var word = input;
	  var bits = inputBits;

	  for (; bits > 0; word &= (1 << bits) - 1) {
	    // Nudge the word bit length to match it
	    for (var i = Math.max(0, bits - 8); i < bits; i++) {
	      var subnode = node[word >>> i];
	      if (typeof subnode !== 'number') {
	        node = subnode;
	        bits = i;
	        break;
	      }

	      if (subnode === 0)
	        continue;

	      // Word bit length should match
	      if ((subnode >>> 9) !== bits - i) {
	        subnode = 0;
	        continue;
	      }

	      var octet = subnode & 0x1ff;
	      assert(octet !== 256, 'EOS in encoding');
	      out.push(octet);
	      node = root;

	      bits = i;
	      break;
	    }
	    if (subnode === 0)
	      break;
	  }
	  this._huffmanNode = node;

	  return bits;
	};

	Decoder.prototype.decodeStr = function decodeStr() {
	  var isHuffman = this.decodeBit();
	  var len = this.decodeInt();
	  assert(this.buffer.has(len), 'Not enough octets for string');

	  if (!isHuffman)
	    return this.buffer.take(len);

	  this._huffmanNode = huffman;

	  var out = [];

	  var word = 0;
	  var bits = 0;
	  var lastKey = 0;
	  for (var i = 0; i < len; i++) {
	    word <<= 8;
	    word |= this.buffer.readUInt8();
	    bits += 8;

	    bits = this.decodeHuffmanWord(word, bits, out);
	    lastKey = word >> bits;
	    word &= (1 << bits) - 1;
	  }
	  assert(this._huffmanNode === huffman, '8-bit EOS');
	  assert(word + 1 === (1 << bits), 'Final sequence is not EOS');

	  this._huffmanNode = null;

	  return out;
	};


/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	var hpack = __webpack_require__(110);
	var utils = hpack.utils;
	var decoder = hpack.decoder;
	var table = hpack.table;
	var assert = utils.assert;

	var inherits = __webpack_require__(117);
	var Duplex = __webpack_require__(92).Duplex;

	function Decompressor(options) {
	  Duplex.call(this, {
	    readableObjectMode: true
	  });

	  this._decoder = decoder.create();
	  this._table = table.create(options.table);
	}
	inherits(Decompressor, Duplex);
	module.exports = Decompressor;

	Decompressor.create = function create(options) {
	  return new Decompressor(options);
	};

	Decompressor.prototype._read = function _read() {
	  // We only push!
	};

	Decompressor.prototype._write = function _write(data, enc, cb) {
	  this._decoder.push(data);

	  cb(null);
	};

	Decompressor.prototype.execute = function execute(cb) {
	  while (!this._decoder.isEmpty()) {
	    try {
	      this._execute();
	    } catch (err) {
	      if (cb)
	        return done(err);
	      else
	        return this.emit('error', err);
	    }
	  }

	  if (cb)
	    done(null);

	  function done(err) {
	    process.nextTick(function() {
	      cb(err);
	    });
	  }
	};

	Decompressor.prototype.updateTableSize = function updateTableSize(size) {
	  this._table.updateSize(size);
	};

	Decompressor.prototype._execute = function _execute() {
	  var isIndexed = this._decoder.decodeBit();
	  if (isIndexed)
	    return this._processIndexed();

	  var isIncremental = this._decoder.decodeBit();
	  var neverIndex = 0;
	  if (!isIncremental) {
	    var isUpdate = this._decoder.decodeBit();
	    if (isUpdate)
	      return this._processUpdate();

	    neverIndex = this._decoder.decodeBit();
	  }

	  this._processLiteral(isIncremental, neverIndex);
	};

	Decompressor.prototype._processIndexed = function _processIndexed() {
	  var index = this._decoder.decodeInt();

	  var lookup = this._table.lookup(index);
	  this.push({ name: lookup.name, value: lookup.value, neverIndex: false });
	};

	Decompressor.prototype._processLiteral = function _processLiteral(inc, never) {
	  var index = this._decoder.decodeInt();

	  var name;
	  var nameSize;

	  // Literal header-name too
	  if (index === 0) {
	    name = this._decoder.decodeStr();
	    nameSize = name.length;
	    name = utils.stringify(name);
	  } else {
	    var lookup = this._table.lookup(index);
	    nameSize = lookup.nameSize;
	    name = lookup.name;
	  }

	  var value = this._decoder.decodeStr();
	  var valueSize = value.length;
	  value = utils.stringify(value);

	  if (inc)
	    this._table.add(name, value, nameSize, valueSize);

	  this.push({ name: name, value: value, neverIndex: never !== 0});
	};

	Decompressor.prototype._processUpdate = function _processUpdate() {
	  var size = this._decoder.decodeInt();
	  this.updateTableSize(size);
	};


/***/ },
/* 117 */
/***/ function(module, exports) {

	module.exports = require("inherits");

/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	var hpack = __webpack_require__(110);
	var utils = hpack.utils;
	var huffman = hpack.huffman.encode;
	var assert = utils.assert;

	var WBuf = __webpack_require__(101);

	function Encoder() {
	  this.buffer = new WBuf();
	  this.word = 0;
	  this.bitOffset = 0;
	}
	module.exports = Encoder;

	Encoder.create = function create() {
	  return new Encoder();
	};

	Encoder.prototype.render = function render() {
	  return this.buffer.render();
	};

	Encoder.prototype.encodeBit = function encodeBit(bit) {
	  var octet;

	  this.word <<= 1;
	  this.word |= bit;
	  this.bitOffset++;

	  if (this.bitOffset === 8) {
	    this.buffer.writeUInt8(this.word);
	    this.word = 0;
	    this.bitOffset = 0;
	  }
	};

	Encoder.prototype.encodeBits = function encodeBits(bits, len) {
	  var left = bits;
	  var leftLen = len;

	  while (leftLen > 0) {
	    var avail = Math.min(leftLen, 8 - this.bitOffset);
	    var toWrite = left >>> (leftLen - avail);

	    if (avail === 8) {
	      this.buffer.writeUInt8(toWrite);
	    } else {
	      this.word <<= avail;
	      this.word |= toWrite;
	      this.bitOffset += avail;
	      if (this.bitOffset === 8) {
	        this.buffer.writeUInt8(this.word);
	        this.word = 0;
	        this.bitOffset = 0;
	      }
	    }

	    leftLen -= avail;
	    left &= (1 << leftLen) - 1;
	  }
	};

	// Just for testing
	Encoder.prototype.skipBits = function skipBits(num) {
	  this.bitOffset += num;
	  this.buffer.skip(this.bitOffset >> 3);
	  this.bitOffset &= 0x7;
	};

	Encoder.prototype.encodeInt = function encodeInt(num) {
	  var prefix = 8 - this.bitOffset;

	  // We are going to end up octet-aligned
	  this.bitOffset = 0;

	  var max = (1 << prefix) - 1;

	  // Fast case - int fits into the prefix
	  if (num < max) {
	    this.buffer.writeUInt8((this.word << prefix) | num);
	    return octet;
	  }

	  var left = num - max;
	  this.buffer.writeUInt8((this.word << prefix) | max);
	  do {
	    var octet = left & 0x7f;
	    left >>= 7;
	    if (left !== 0)
	      octet |= 0x80;

	    this.buffer.writeUInt8(octet);
	  } while (left !== 0);
	};

	Encoder.prototype.encodeStr = function encodeStr(value, isHuffman) {
	  this.encodeBit(isHuffman ? 1 : 0);

	  if (!isHuffman) {
	    this.buffer.reserve(value.length + 1);
	    this.encodeInt(value.length);
	    for (var i = 0; i < value.length; i++)
	      this.buffer.writeUInt8(value[i]);
	    return;
	  }

	  var codes = [];
	  var len = 0;
	  var pad = 0;

	  for (var i = 0; i < value.length; i++) {
	    var code = huffman[value[i]];
	    codes.push(code);
	    len += code[0];
	  }
	  if (len % 8 !== 0)
	    pad = 8 - (len % 8);
	  len += pad;

	  this.buffer.reserve((len / 8) + 1);
	  this.encodeInt(len / 8);
	  for (var i = 0; i < codes.length; i++) {
	    var code = codes[i];
	    this.encodeBits(code[1], code[0]);
	  }

	  // Append padding
	  this.encodeBits(0xff >>> (8 - pad), pad);
	};


/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	var hpack = __webpack_require__(110);
	var utils = hpack.utils;
	var encoder = hpack.encoder;
	var table = hpack.table;
	var assert = utils.assert;

	var inherits = __webpack_require__(117);
	var Duplex = __webpack_require__(92).Duplex;

	function Compressor(options) {
	  Duplex.call(this, {
	    writableObjectMode: true
	  });

	  this._encoder = null;
	  this._table = table.create(options.table);
	}
	inherits(Compressor, Duplex);
	module.exports = Compressor;

	Compressor.create = function create(options) {
	  return new Compressor(options);
	};

	Compressor.prototype._read = function _read() {
	  // We only push!
	};

	Compressor.prototype._write = function _write(data, enc, cb) {
	  assert(Array.isArray(data), 'Compressor.write() expects list of headers');

	  this._encoder = encoder.create();
	  for (var i = 0; i < data.length; i++)
	    this._encodeHeader(data[i]);

	  var data = this._encoder.render();
	  this._encoder = null;

	  cb(null);
	  for (var i = 0; i < data.length; i++)
	    this.push(data[i]);
	};

	Compressor.prototype.updateTableSize = function updateTableSize(size) {
	  if (size >= this._table.protocolMaxSize) {
	    size = this._table.protocolMaxSize;

	    var enc = encoder.create();

	    // indexed = 0
	    // incremental = 0
	    // update = 1
	    enc.encodeBits(1, 3);
	    enc.encodeInt(size);

	    var data = enc.render();
	    for (var i = 0; i < data.length; i++)
	      this.push(data[i]);
	  }

	  this._table.updateSize(size);
	};

	Compressor.prototype.reset = function reset() {
	  var enc = encoder.create();
	  var size = this._table.maxSize;

	  // indexed = 0
	  // incremental = 0
	  // update = 1
	  enc.encodeBits(1, 3);
	  enc.encodeInt(0);

	  // Evict everything
	  this._table.updateSize(0);

	  // indexed = 0
	  // incremental = 0
	  // update = 1
	  enc.encodeBits(1, 3);
	  enc.encodeInt(size);

	  // Revert size
	  this._table.updateSize(size);

	  var data = enc.render();
	  for (var i = 0; i < data.length; i++)
	    this.push(data[i]);
	};

	Compressor.prototype._encodeHeader = function _encodeHeader(header) {
	  if (header.neverIndex) {
	    var index = 0;
	    var neverIndex = 1;
	    var isIndexed = 0;
	    var isIncremental = 0;
	  } else {
	    var index = this._table.reverseLookup(header.name, header.value);
	    var isIndexed = index > 0;
	    var isIncremental = header.incremental !== false;
	    var neverIndex = 0;
	  }

	  this._encoder.encodeBit(isIndexed);
	  if (isIndexed) {
	    this._encoder.encodeInt(index);
	    return;
	  }

	  var name = utils.toArray(header.name);
	  var value = utils.toArray(header.value);

	  this._encoder.encodeBit(isIncremental);
	  if (isIncremental) {
	    this._table.add(header.name, header.value, name.length, value.length);
	  } else {
	    // Update = false
	    this._encoder.encodeBit(0);
	    this._encoder.encodeBit(neverIndex);
	  }

	  // index is negative for `name`-only headers
	  this._encoder.encodeInt(-index);
	  if (index === 0)
	    this._encoder.encodeStr(name, header.huffman !== false);
	  this._encoder.encodeStr(value, header.huffman !== false);
	};


/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var util = __webpack_require__(77);
	var EventEmitter = __webpack_require__(33).EventEmitter;
	var debug = {
	  server: __webpack_require__(32)('spdy:window:server'),
	  client: __webpack_require__(32)('spdy:window:client')
	};

	function Side(window, name, options) {
	  EventEmitter.call(this);

	  this.name = name;
	  this.window = window;
	  this.current = options.size;
	  this.max = options.size;
	  this.limit = options.max;
	  this.lowWaterMark = options.lowWaterMark === undefined ?
	      this.max / 2 :
	      options.lowWaterMark;

	  this._refilling = false;
	  this._refillQueue = [];
	}
	util.inherits(Side, EventEmitter);

	Side.prototype.setMax = function setMax(max) {
	  this.window.debug('id=%d side=%s setMax=%d',
	                    this.window.id,
	                    this.name,
	                    max);
	  this.max = max;
	  this.lowWaterMark = this.max / 2;
	};

	Side.prototype.updateMax = function updateMax(max) {
	  var delta = max - this.max;
	  this.window.debug('id=%d side=%s updateMax=%d delta=%d',
	                    this.window.id,
	                    this.name,
	                    max,
	                    delta);

	  this.max = max;
	  this.lowWaterMark = max / 2;

	  this.update(delta);
	};

	Side.prototype.setLowWaterMark = function setLowWaterMark(lwm) {
	  this.lowWaterMark = lwm;
	};

	Side.prototype.update = function update(size, callback) {
	  // Not enough space for the update, wait for refill
	  if (size <= 0 && callback && this.isEmpty()) {
	    this.window.debug('id=%d side=%s wait for refill=%d [%d/%d]',
	                      this.window.id,
	                      this.name,
	                      -size,
	                      this.current,
	                      this.max);
	    this._refillQueue.push({
	      size: size,
	      callback: callback
	    });
	    return;
	  }

	  this.current += size;

	  if (this.current > this.limit) {
	    this.emit('overflow');
	    return;
	  }

	  this.window.debug('id=%d side=%s update by=%d [%d/%d]',
	                    this.window.id,
	                    this.name,
	                    size,
	                    this.current,
	                    this.max);

	  // Time to send WINDOW_UPDATE
	  if (size < 0 && this.isDraining()) {
	    this.window.debug('id=%d side=%s drained', this.window.id, this.name);
	    this.emit('drain');
	  }

	  // Time to write
	  if (size > 0 && this.current > 0 && this.current <= size) {
	    this.window.debug('id=%d side=%s full', this.window.id, this.name);
	    this.emit('full');
	  }

	  this._processRefillQueue();

	  if (callback)
	    process.nextTick(callback);
	};

	Side.prototype.getCurrent = function getCurrent() {
	  return this.current;
	};

	Side.prototype.getMax = function getMax() {
	  return this.max;
	};

	Side.prototype.getDelta = function getDelta() {
	  return this.max - this.current;
	};

	Side.prototype.isDraining = function isDraining() {
	  return this.current <= this.lowWaterMark;
	};

	Side.prototype.isEmpty = function isEmpty() {
	  return this.current <= 0;
	};

	// Private

	Side.prototype._processRefillQueue = function _processRefillQueue() {
	  // Prevent recursion
	  if (this._refilling)
	    return;
	  this._refilling = true;

	  while (this._refillQueue.length > 0) {
	    var item = this._refillQueue[0];

	    if (this.isEmpty())
	      break;

	    this.window.debug('id=%d side=%s refilled for size=%d',
	                      this.window.id,
	                      this.name,
	                      -item.size);

	    this._refillQueue.shift();
	    this.update(item.size, item.callback);
	  }

	  this._refilling = false;
	};

	function Window(options) {
	  this.id = options.id;
	  this.isServer = options.isServer;
	  this.debug = this.isServer ? debug.server : debug.client;

	  this.recv = new Side(this, 'recv', options.recv);
	  this.send = new Side(this, 'send', options.send);
	}
	module.exports = Window;

	Window.prototype.clone = function clone(id) {
	  return new Window({
	    id: id,
	    isServer: this.isServer,
	    recv: {
	      size: this.recv.max,
	      max: this.recv.limit,
	      lowWaterMark: this.recv.lowWaterMark
	    },
	    send: {
	      size: this.send.max,
	      max: this.send.limit,
	      lowWaterMark: this.send.lowWaterMark
	    }
	  });
	};


/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var transport = __webpack_require__(86);
	var utils = transport.utils;

	var assert = __webpack_require__(75);
	var debug = __webpack_require__(32)('spdy:priority');

	function PriorityNode(tree, options) {
	  this.tree = tree;

	  this.id = options.id;
	  this.parent = options.parent;
	  this.weight = options.weight;

	  // To be calculated in `addChild`
	  this.priorityFrom = 0;
	  this.priorityTo = 1;
	  this.priority = 1;

	  this.children = {
	    list: [],
	    weight: 0
	  };

	  if (this.parent !== null)
	    this.parent.addChild(this);
	}

	function compareChildren(a, b) {
	  return a.weight === b.weight ? a.id - b.id : a.weight - b.weight;
	}

	PriorityNode.prototype.toJSON = function toJSON() {
	  return {
	    parent: this.parent,
	    weight: this.weight,
	    exclusive: this.exclusive
	  };
	};

	PriorityNode.prototype.getPriority = function getPriority() {
	  return this.priority;
	};

	PriorityNode.prototype.getPriorityRange = function getPriorityRange() {
	  return { from: this.priorityFrom, to: this.priorityTo };
	};

	PriorityNode.prototype.addChild = function addChild(child) {
	  child.parent = this;
	  utils.binaryInsert(this.children.list, child, compareChildren);
	  this.children.weight += child.weight;

	  this._updatePriority(this.priorityFrom, this.priorityTo);
	};

	PriorityNode.prototype.remove = function remove() {
	  assert(this.parent, 'Can\'t remove root node');

	  this.parent.removeChild(this);
	  this.tree._removeNode(this);

	  // Move all children to the parent
	  for (var i = 0; i < this.children.list.length; i++)
	    this.parent.addChild(this.children.list[i]);
	};

	PriorityNode.prototype.removeChild = function removeChild(child) {
	  this.children.weight -= child.weight;
	  var index = utils.binarySearch(this.children.list, child, compareChildren);
	  assert(index !== -1);

	  // Remove the child
	  this.children.list.splice(index, 1);
	};

	PriorityNode.prototype.removeChildren = function removeChildren() {
	  var children = this.children.list;
	  this.children.list = [];
	  this.children.weight = 0;
	  return children;
	};

	PriorityNode.prototype._updatePriority = function _updatePriority(from, to) {
	  this.priority = to - from;
	  this.priorityFrom = from;
	  this.priorityTo = to;

	  var weight = 0;
	  for (var i = 0; i < this.children.list.length; i++) {
	    var node = this.children.list[i];
	    var nextWeight = weight + node.weight;

	    node._updatePriority(
	      from + this.priority * (weight / this.children.weight),
	      from + this.priority * (nextWeight / this.children.weight)
	    );
	    weight = nextWeight;
	  }
	};

	function PriorityTree(options) {
	  this.map = {};
	  this.list = [];
	  this.defaultWeight = options.defaultWeight || 16;

	  this.count = 0;
	  this.maxCount = options.maxCount;

	  // Root
	  this.root = this.add({
	    id: 0,
	    parent: null,
	    weight: 1
	  });
	}
	module.exports = PriorityTree;

	PriorityTree.create = function create(options) {
	  return new PriorityTree(options);
	};

	PriorityTree.prototype.add = function add(options) {
	  if (options.id === options.parent)
	    return this.addDefault(options.id);

	  var parent = options.parent === null ? null : this.map[options.parent];
	  if (parent === undefined)
	    return this.addDefault(options.id);

	  debug('add node=%d parent=%d weight=%d exclusive=%d',
	        options.id,
	        options.parent === null ? -1 : options.parent,
	        options.weight || this.defaultWeight,
	        options.exclusive ? 1 : 0);

	  var children;
	  if (options.exclusive)
	    children = parent.removeChildren();

	  var node = new PriorityNode(this, {
	    id: options.id,
	    parent: parent,
	    weight: options.weight || this.defaultWeight
	  });
	  this.map[options.id] = node;

	  if (options.exclusive) {
	    for (var i = 0; i < children.length; i++)
	      node.addChild(children[i]);
	  }

	  this.count++;
	  if (this.count > this.maxCount) {
	    debug('hit maximum remove id=%d', this.list[0].id);
	    this.list.shift().remove();
	  }

	  // Root node is not subject to removal
	  if (node.parent !== null)
	    this.list.push(node);

	  return node;
	};

	// Only for testing, should use `node`'s methods
	PriorityTree.prototype.get = function get(id) {
	  return this.map[id];
	};

	PriorityTree.prototype.addDefault = function addDefault(id) {
	  debug('creating default node');
	  return this.add({ id: id, parent: 0, weight: this.defaultWeight });
	};

	PriorityTree.prototype._removeNode = function _removeNode(node) {
	  delete this.map[node.id];
	  this.count--;
	};


/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var transport = __webpack_require__(86);

	var assert = __webpack_require__(75);
	var util = __webpack_require__(77);
	var debug = {
	  client: __webpack_require__(32)('spdy:stream:client'),
	  server: __webpack_require__(32)('spdy:stream:server')
	};
	var Buffer = __webpack_require__(78).Buffer;
	var Duplex = __webpack_require__(92).Duplex;

	function Stream(connection, options) {
	  Duplex.call(this);

	  var connectionState = connection._spdyState;

	  var state = {};
	  this._spdyState = state;

	  this.id = options.id;
	  this.method = options.method;
	  this.path = options.path;
	  this.host = options.host;
	  this.headers = options.headers || {};
	  this.connection = connection;
	  this.parent = options.parent || null;

	  state.socket = null;
	  state.protocol = connectionState.protocol;
	  state.constants = state.protocol.constants;

	  // See _initPriority()
	  state.priority = null;

	  state.version = this.connection.getVersion();
	  state.isServer = this.connection.isServer();
	  state.debug = state.isServer ? debug.server : debug.client;

	  state.framer = connectionState.framer;
	  state.parser = connectionState.parser;

	  state.request = options.request;
	  state.needResponse = options.request;
	  state.window = connectionState.streamWindow.clone(options.id);
	  state.sessionWindow = connectionState.window;
	  state.maxChunk = connectionState.maxChunk;

	  // Can't send incoming request
	  // (See `.send()` method)
	  state.sent = !state.request;

	  state.readable = options.readable !== false;
	  state.writable = options.writable !== false;

	  state.aborted = false;

	  state.corked = 0;
	  state.corkQueue = [];

	  state.timeout = new transport.utils.Timeout(this);

	  this.on('finish', this._onFinish);
	  this.on('end', this._onEnd);

	  var self = this;
	  function _onWindowOverflow() {
	    self._onWindowOverflow();
	  }

	  state.window.recv.on('overflow', _onWindowOverflow);
	  state.window.send.on('overflow', _onWindowOverflow);

	  this._initPriority(options.priority);

	  if (!state.readable)
	    this.push(null);
	  if (!state.writable) {
	    this._writableState.ended = true;
	    this._writableState.finished = true;
	  }
	}
	util.inherits(Stream, Duplex);
	exports.Stream = Stream;

	Stream.prototype._init = function _init(socket) {
	  this.socket = socket;
	};

	Stream.prototype._initPriority = function _initPriority(priority) {
	  var state = this._spdyState;
	  var connectionState = this.connection._spdyState;
	  var root = connectionState.priorityRoot;

	  if (!priority) {
	    state.priority = root.addDefault(this.id);
	    return;
	  }

	  state.priority = root.add({
	    id: this.id,
	    parent: priority.parent,
	    weight: priority.weight,
	    exclusive: priority.exclusive
	  });
	};

	Stream.prototype._handleFrame = function _handleFrame(frame) {
	  var state = this._spdyState;

	  // Ignore any kind of data after abort
	  if (state.aborted) {
	    state.debug('id=%d ignoring frame=%s after abort', this.id, frame.type);
	    return;
	  }

	  // Restart the timer on incoming frames
	  state.timeout.reset();

	  if (frame.type === 'DATA')
	    this._handleData(frame);
	  else if (frame.type === 'HEADERS')
	    this._handleHeaders(frame);
	  else if (frame.type === 'RST')
	    this._handleRST(frame);
	  else if (frame.type === 'WINDOW_UPDATE')
	    this._handleWindowUpdate(frame);
	  else if (frame.type === 'PRIORITY')
	    this._handlePriority(frame);
	  else if (frame.type === 'PUSH_PROMISE')
	    this._handlePushPromise(frame);

	  if (frame.fin) {
	    state.debug('id=%d end', this.id);
	    this.push(null);
	  }
	};

	function checkAborted(stream, state, callback) {
	  if (state.aborted) {
	    state.debug('id=%d abort write', stream.id);
	    process.nextTick(function() {
	      callback(new Error('Stream write aborted'));
	    });
	    return true;
	  }

	  return false;
	}

	function _send(stream, state, data, callback) {
	  if (checkAborted(stream, state, callback))
	    return;

	  state.debug('id=%d presend=%d', stream.id, data.length);

	  state.timeout.reset();

	  state.window.send.update(-data.length, function() {
	    if (checkAborted(stream, state, callback))
	      return;

	    state.debug('id=%d send=%d', stream.id, data.length);

	    state.timeout.reset();

	    state.framer.dataFrame({
	      id: stream.id,
	      priority: state.priority.getPriority(),
	      fin: false,
	      data: data
	    }, function(err) {
	      state.debug('id=%d postsend=%d', stream.id, data.length);
	      callback(err);
	    });
	  });
	}

	Stream.prototype._write = function _write(data, enc, callback) {
	  var state = this._spdyState;

	  // Send the request if it wasn't sent
	  if (!state.sent)
	    this.send();

	  // Writes should come after pending control frames (response and headers)
	  if (state.corked !== 0) {
	    var self = this;
	    state.corkQueue.push(function() {
	      self._write(data, enc, callback);
	    });
	    return;
	  }

	  // Split DATA in chunks to prevent window from going negative
	  this._splitStart(data, _send, callback);
	};

	Stream.prototype._splitStart = function _splitStart(data, onChunk, callback) {
	  return this._split(data, 0, onChunk, callback);
	};

	Stream.prototype._split = function _split(data, offset, onChunk, callback) {
	  if (offset === data.length)
	    return process.nextTick(callback);

	  var state = this._spdyState;
	  var local = state.window.send;
	  var session = state.sessionWindow.send;

	  var availSession = Math.max(0, session.getCurrent());
	  if (availSession === 0)
	    availSession = session.getMax();
	  var availLocal = Math.max(0, local.getCurrent());
	  if (availLocal === 0)
	    availLocal = local.getMax();

	  var avail = Math.min(availSession, availLocal);
	  avail = Math.min(avail, state.maxChunk);

	  if (avail === 0) {
	    var self = this;
	    state.window.send.update(0, function() {
	      self._split(data, offset, onChunk, callback);
	    });
	    return;
	  }

	  // Split data in chunks in a following way:
	  var limit = avail;
	  var size = Math.min(data.length - offset, limit);

	  var chunk = data.slice(offset, offset + size);

	  var self = this;
	  onChunk(this, state, chunk, function(err) {
	    if (err)
	      return callback(err);

	    // Get the next chunk
	    self._split(data, offset + size, onChunk, callback);
	  });
	};

	Stream.prototype._read = function _read() {
	  var state = this._spdyState;

	  if (!state.window.recv.isDraining())
	    return;

	  var delta = state.window.recv.getDelta();

	  state.debug('id=%d window emptying, update by %d', this.id, delta);

	  state.window.recv.update(delta);
	  state.framer.windowUpdateFrame({
	    id: this.id,
	    delta: delta
	  });
	};

	Stream.prototype._handleData = function _handleData(frame) {
	  var state = this._spdyState;

	  // DATA on ended or not readable stream!
	  if (!state.readable || this._readableState.ended) {
	    state.framer.rstFrame({ id: this.id, code: 'STREAM_CLOSED' });
	    return;
	  }

	  state.debug('id=%d recv=%d', this.id, frame.data.length);
	  state.window.recv.update(-frame.data.length);

	  this.push(frame.data);
	};

	Stream.prototype._handleRST = function _handleRST(frame) {
	  if (frame.code !== 'CANCEL')
	    this.emit('error', new Error('Got RST: ' + frame.code));
	  this.abort();
	};

	Stream.prototype._handleWindowUpdate = function _handleWindowUpdate(frame) {
	  var state = this._spdyState;

	  state.window.send.update(frame.delta);
	};

	Stream.prototype._onWindowOverflow = function _onWindowOverflow() {
	  var state = this._spdyState;

	  state.debug('id=%d window overflow', this.id);
	  state.framer.rstFrame({ id: this.id, code: 'FLOW_CONTROL_ERROR' });

	  this.aborted = true;
	  this.emit('error', new Error('HTTP2 window overflow'));
	};

	Stream.prototype._handlePriority = function _handlePriority(frame) {
	  var state = this._spdyState;

	  state.priority.remove();
	  state.priority = null;
	  this._initPriority(frame.priority);

	  // Mostly for testing purposes
	  this.emit('priority', frame.priority);
	};

	Stream.prototype._handleHeaders = function _handleHeaders(frame) {
	  var state = this._spdyState;

	  if (!state.readable || this._readableState.ended) {
	    state.framer.rstFrame({ id: this.id, code: 'STREAM_CLOSED' });
	    return;
	  }

	  if (state.needResponse)
	    return this._handleResponse(frame);

	  this.emit('headers', frame.headers);
	};

	Stream.prototype._handleResponse = function _handleResponse(frame) {
	  var state = this._spdyState;

	  if (frame.headers[':status'] === undefined) {
	    state.framer.rstFrame({ id: this.id, code: 'PROTOCOL_ERROR' });
	    return;
	  }

	  state.needResponse = false;
	  this.emit('response', frame.headers[':status'] | 0, frame.headers);
	};

	Stream.prototype._onFinish = function _onFinish() {
	  var state = this._spdyState;

	  // Send the request if it wasn't sent
	  if (!state.sent) {
	    // NOTE: will send HEADERS with FIN flag
	    this.send();
	  } else {
	    // Just an `.end()` without any writes will trigger immediate `finish` event
	    // without any calls to `_write()`.
	    if (state.corked !== 0) {
	      var self = this;
	      state.corkQueue.push(function() {
	        self._onFinish();
	      });
	      return;
	    }

	    state.framer.dataFrame({
	      id: this.id,
	      priority: state.priority.getPriority(),
	      fin: true,
	      data: new Buffer(0)
	    });
	  }

	  this._maybeClose();
	};

	Stream.prototype._onEnd = function _onEnd() {
	  this._maybeClose();
	};

	Stream.prototype._checkEnded = function _checkEnded(callback) {
	  var state = this._spdyState;

	  var ended = false;
	  if (state.aborted)
	    ended = true;

	  if (!state.writable || this._writableState.finished)
	    ended = true;

	  if (!ended)
	    return true;

	  if (!callback)
	    return false;

	  var err = new Error('Ended stream can\'t send frames');
	  process.nextTick(function() {
	    callback(err);
	  });

	  return false;
	};

	Stream.prototype._maybeClose = function _maybeClose() {
	  var state = this._spdyState;

	  // .abort() emits `close`
	  if (state.aborted)
	    return;

	  if ((!state.readable || this._readableState.ended) &&
	      this._writableState.finished) {
	    // Clear timeout
	    state.timeout.set(0);

	    this.emit('close');
	  }
	};

	Stream.prototype._handlePushPromise = function _handlePushPromise(frame) {
	  var push = this.connection._createStream({
	    id: frame.promisedId,
	    parent: this,
	    push: true,
	    request: true,
	    method: frame.headers[':method'],
	    path: frame.headers[':path'],
	    host: frame.headers[':authority'],
	    priority: frame.priority,
	    headers: frame.headers,
	    writable: false
	  });

	  // GOAWAY
	  if (this.connection._isGoaway(push.id))
	    return;

	  if (!this.emit('pushPromise', push))
	    push.abort();
	};

	Stream.prototype._hardCork = function _hardCork() {
	  var state = this._spdyState;

	  this.cork();
	  state.corked++;
	};

	Stream.prototype._hardUncork = function _hardUncork() {
	  var state = this._spdyState;

	  this.uncork();
	  state.corked--;
	  if (state.corked !== 0)
	    return;

	  // Invoke callbacks
	  var queue = state.corkQueue;
	  state.corkQueue = [];
	  for (var i = 0; i < queue.length; i++)
	    queue[i]();
	};

	Stream.prototype._sendPush = function _sendPush(status, response, callback) {
	  var self = this;
	  var state = this._spdyState;

	  this._hardCork();
	  state.framer.pushFrame({
	    id: this.parent.id,
	    promisedId: this.id,
	    priority: state.priority.toJSON(),
	    path: this.path,
	    host: this.host,
	    method: this.method,
	    status: status,
	    headers: this.headers,
	    response: response
	  }, function(err) {
	    self._hardUncork();

	    callback(err);
	  });
	};

	Stream.prototype._wasSent = function _wasSent() {
	  var state = this._spdyState;
	  return state.sent;
	};

	// Public API

	Stream.prototype.send = function send(callback) {
	  var state = this._spdyState;

	  if (state.sent) {
	    var err = new Error('Stream was already sent');
	    process.nextTick(function() {
	      if (callback)
	        callback(err);
	    });
	    return;
	  }

	  state.sent = true;
	  state.timeout.reset();

	  // GET requests should always be auto-finished
	  if (this.method === 'GET') {
	    this._writableState.ended = true;
	    this._writableState.finished = true;
	  }

	  // TODO(indunty): ideally it should just take a stream object as an input
	  var self = this;
	  this._hardCork();
	  state.framer.requestFrame({
	    id: this.id,
	    method: this.method,
	    path: this.path,
	    host: this.host,
	    priority: state.priority.toJSON(),
	    headers: this.headers,
	    fin: this._writableState.finished
	  }, function(err) {
	    self._hardUncork();

	    if (!callback)
	      return;

	    callback(err);
	  });
	};

	Stream.prototype.respond = function respond(status, headers, callback) {
	  var self = this;
	  var state = this._spdyState;
	  assert(!state.request, 'Can\'t respond on request');

	  state.timeout.reset();

	  if (!this._checkEnded(callback))
	    return;

	  var frame = {
	    id: this.id,
	    status: status,
	    headers: headers
	  };
	  this._hardCork();
	  state.framer.responseFrame(frame, function(err) {
	    self._hardUncork();
	    if (callback)
	      callback(err);
	  });
	};

	Stream.prototype.setWindow = function setWindow(size) {
	  var state = this._spdyState;

	  state.timeout.reset();

	  if (!this._checkEnded())
	    return;

	  state.debug('id=%d force window max=%d', this.id, size);
	  state.window.recv.setMax(size);

	  var delta = state.window.recv.getDelta();
	  if (delta === 0)
	    return;

	  state.framer.windowUpdateFrame({
	    id: this.id,
	    delta: delta
	  });
	  state.window.recv.update(delta);
	};

	Stream.prototype.sendHeaders = function sendHeaders(headers, callback) {
	  var self = this;
	  var state = this._spdyState;

	  state.timeout.reset();

	  if (!this._checkEnded(callback))
	    return;

	  // Request wasn't yet send, coalesce headers
	  if (!state.sent) {
	    this.headers = util._extend({}, this.headers);
	    util._extend(this.headers, headers);
	    process.nextTick(function() {
	      if (callback)
	        callback(null);
	    });
	    return;
	  }

	  this._hardCork();
	  state.framer.headersFrame({
	    id: this.id,
	    headers: headers
	  }, function(err) {
	    self._hardUncork();
	    if (callback)
	      callback(err);
	  });
	};

	Stream.prototype.destroy = function destroy() {
	  this.abort();
	};

	Stream.prototype.abort = function abort(code, callback) {
	  var state = this._spdyState;

	  // .abort(callback)
	  if (typeof code === 'function') {
	    callback = code;
	    code = null;
	  }

	  if (this._readableState.ended && this._writableState.finished) {
	    state.debug('id=%d already closed', this.id);
	    if (callback)
	      process.nextTick(callback);
	    return;
	  }

	  if (state.aborted) {
	    state.debug('id=%d already aborted', this.id);
	    if (callback)
	      process.nextTick(callback);
	    return;
	  }

	  state.aborted = true;
	  state.debug('id=%d abort', this.id);

	  this.setTimeout(0);

	  var abortCode = code || 'CANCEL';

	  state.framer.rstFrame({
	    id: this.id,
	    code: abortCode
	  });

	  var self = this;
	  process.nextTick(function() {
	    if (callback)
	      callback(null);
	    self.emit('close', new Error('Aborted, code: ' + abortCode));
	  });
	};

	Stream.prototype.setPriority = function setPriority(info) {
	  var state = this._spdyState;

	  state.timeout.reset();

	  if (!this._checkEnded())
	    return;

	  state.debug('id=%d priority change', this.id, info);

	  var frame = { id: this.id, priority: info };

	  // Change priority on this side
	  this._handlePriority(frame);

	  // And on the other too
	  state.framer.priorityFrame(frame);
	};

	Stream.prototype.pushPromise = function pushPromise(uri, callback) {
	  if (!this._checkEnded(callback))
	    return;

	  var self = this;
	  this._hardCork();
	  var push = this.connection.pushPromise(this, uri, function(err) {
	    self._hardUncork();
	    if (!err)
	      push._hardUncork();

	    if (callback)
	      return callback(err, push);

	    if (err)
	      push.emit('error', err);
	  });
	  push._hardCork();

	  return push;
	};

	Stream.prototype.setMaxChunk = function setMaxChunk(size) {
	  var state = this._spdyState;
	  state.maxChunk = size;
	};

	Stream.prototype.setTimeout = function setTimeout(delay, callback) {
	  var state = this._spdyState;

	  state.timeout.set(delay, callback);
	};


/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var util = __webpack_require__(77);
	var transport = __webpack_require__(86);

	var debug = {
	  server: __webpack_require__(32)('spdy:connection:server'),
	  client: __webpack_require__(32)('spdy:connection:client')
	};
	var EventEmitter = __webpack_require__(33).EventEmitter;

	var Stream = transport.Stream;

	function Connection(socket, options) {
	  EventEmitter.call(this);

	  var state = {};
	  this._spdyState = state;

	  // NOTE: There's a big trick here. Connection is used as a `this` argument
	  // to the wrapped `connection` event listener.
	  // socket end doesn't necessarly mean connection drop
	  this.httpAllowHalfOpen = true;

	  state.timeout = new transport.utils.Timeout(this);

	  // Protocol info
	  state.protocol = transport.protocol[options.protocol];
	  state.version = null;
	  state.constants = state.protocol.constants;
	  state.pair = null;
	  state.isServer = options.isServer;

	  // Root of priority tree (i.e. stream id = 0)
	  state.priorityRoot = new transport.Priority({
	    defaultWeight: state.constants.DEFAULT_WEIGHT,
	    maxCount: transport.protocol.base.constants.MAX_PRIORITY_STREAMS
	  });

	  // Defaults
	  state.maxStreams = options.maxStreams ||
	                     state.constants.MAX_CONCURRENT_STREAMS;

	  state.autoSpdy31 = options.protocol.name !== 'h2' && options.autoSpdy31;
	  state.acceptPush = options.acceptPush === undefined ?
	      !state.isServer :
	      options.acceptPush;

	  if (options.maxChunk === false)
	    state.maxChunk = Infinity;
	  else if (options.maxChunk === undefined)
	    state.maxChunk = transport.protocol.base.constants.DEFAULT_MAX_CHUNK;
	  else
	    state.maxChunk = options.maxChunk;

	  // Connection-level flow control
	  var windowSize = options.windowSize || 1 << 20;
	  state.window = new transport.Window({
	    id: 0,
	    isServer: state.isServer,
	    recv: {
	      size: state.constants.DEFAULT_WINDOW,
	      max: state.constants.MAX_INITIAL_WINDOW_SIZE
	    },
	    send: {
	      size: state.constants.DEFAULT_WINDOW,
	      max: state.constants.MAX_INITIAL_WINDOW_SIZE
	    }
	  });

	  // It starts with DEFAULT_WINDOW, update must be sent to change it on client
	  state.window.recv.setMax(windowSize);

	  // Boilerplate for Stream constructor
	  state.streamWindow = new transport.Window({
	    id: -1,
	    isServer: state.isServer,
	    recv: {
	      size: windowSize,
	      max: state.constants.MAX_INITIAL_WINDOW_SIZE
	    },
	    send: {
	      size: state.constants.DEFAULT_WINDOW,
	      max: state.constants.MAX_INITIAL_WINDOW_SIZE
	    }
	  });

	  // Various state info
	  state.pool = state.protocol.compressionPool.create(options.headerCompression);
	  state.counters = {
	    push: 0,
	    stream: 0
	  };

	  // Init streams list
	  state.stream = {
	    map: {},
	    count: 0,
	    nextId: state.isServer ? 2 : 1,
	    lastId: {
	      both: 0,
	      received: 0
	    }
	  };
	  state.ping = {
	    nextId: state.isServer ? 2 : 1,
	    map: {}
	  };
	  state.goaway = false;

	  // Debug
	  state.debug = state.isServer ? debug.server : debug.client;

	  // X-Forwarded feature
	  state.xForward = null;

	  // Create parser and hole for framer
	  state.parser = state.protocol.parser.create({
	    // NOTE: needed to distinguish ping from ping ACK in SPDY
	    isServer: state.isServer,
	    window: state.window
	  });
	  state.framer = state.protocol.framer.create({
	    window: state.window,
	    timeout: state.timeout
	  });

	  // SPDY has PUSH enabled on servers
	  if (state.protocol.name === 'spdy')
	    state.framer.enablePush(state.isServer);

	  if (!state.isServer)
	    state.parser.skipPreface();

	  this.socket = socket;

	  this._init();
	}
	util.inherits(Connection, EventEmitter);
	exports.Connection = Connection;

	Connection.create = function create(socket, options) {
	  return new Connection(socket, options);
	};

	Connection.prototype._init = function init() {
	  var self = this;
	  var state = this._spdyState;
	  var pool = state.pool;

	  // Initialize session window
	  state.window.recv.on('drain', function() {
	    self._onSessionWindowDrain();
	  });

	  // Initialize parser
	  state.parser.on('data', function(frame) {
	    self._handleFrame(frame);
	  });
	  state.parser.once('version', function(version) {
	    self._onVersion(version);
	  });

	  // Propagate parser errors
	  state.parser.on('error', function(err) {
	    self._onParserError(err);
	  });

	  // Propagate framer errors
	  state.framer.on('error', function(err) {
	    self.emit('error', err);
	  });

	  this.socket.pipe(state.parser);
	  state.framer.pipe(this.socket);

	  // Allow high-level api to catch socket errors
	  this.socket.on('error', function onSocketError(e) {
	    self.emit('error', e);
	  });

	  this.socket.once('close', function onclose() {
	    var err = new Error('socket hang up');
	    err.code = 'ECONNRESET';
	    self.destroyStreams(err);
	    self.emit('close', err);

	    if (state.pair)
	      pool.put(state.pair);

	    state.framer.resume();
	  });

	  // Reset timeout on close
	  this.once('close', function() {
	    self.setTimeout(0);
	  });

	  function _onWindowOverflow() {
	    self._onWindowOverflow();
	  }

	  state.window.recv.on('overflow', _onWindowOverflow);
	  state.window.send.on('overflow', _onWindowOverflow);

	  // Do not allow half-open connections
	  this.socket.allowHalfOpen = false;
	};

	Connection.prototype._onVersion = function _onVersion(version) {
	  var state = this._spdyState;
	  var prev = state.version;
	  var parser = state.parser;
	  var framer = state.framer;
	  var pool = state.pool;

	  state.version = version;
	  state.debug('id=0 version=%d', version);

	  // Ignore transition to 3.1
	  if (!prev) {
	    state.pair = pool.get(version);
	    parser.setCompression(state.pair);
	    framer.setCompression(state.pair);
	  }
	  framer.setVersion(version);

	  if (!state.isServer) {
	    framer.prefaceFrame();
	    if (state.xForward !== null)
	      framer.xForwardedFor({ host: state.xForward });
	  }

	  // Send preface+settings frame (once)
	  framer.settingsFrame({
	    max_header_list_size: state.constants.DEFAULT_MAX_HEADER_LIST_SIZE,
	    max_concurrent_streams: state.maxStreams,
	    enable_push: state.acceptPush ? 1 : 0,
	    initial_window_size: state.window.recv.max
	  });

	  // Update session window
	  if (state.version >= 3.1 || (state.isServer && state.autoSpdy31))
	    this._onSessionWindowDrain();

	  this.emit('version', version);
	};

	Connection.prototype._onParserError = function _onParserError(err) {
	  var state = this._spdyState;

	  // Prevent further errors
	  state.parser.kill();

	  // Send GOAWAY
	  if (err instanceof transport.protocol.base.utils.ProtocolError) {
	    this._goaway({
	      lastId: state.stream.lastId.both,
	      code: err.code,
	      extra: err.message,
	      send: true
	    });
	  }

	  this.emit('error', err);
	};

	Connection.prototype._handleFrame = function _handleFrame(frame) {
	  var state = this._spdyState;

	  state.debug('id=0 frame', frame);
	  state.timeout.reset();

	  // For testing purposes
	  this.emit('frame', frame);

	  var stream;

	  // Session window update
	  if (frame.type === 'WINDOW_UPDATE' && frame.id === 0) {
	    if (state.version < 3.1 && state.autoSpdy31) {
	      state.debug('id=0 switch version to 3.1');
	      state.version = 3.1;
	      this.emit('version', 3.1);
	    }
	    state.window.send.update(frame.delta);
	    return;
	  }

	  if (state.isServer && frame.type === 'PUSH_PROMISE') {
	    state.debug('id=0 server PUSH_PROMISE');
	    this._goaway({
	      lastId: state.stream.lastId.both,
	      code: 'PROTOCOL_ERROR',
	      send: true
	    });
	    return;
	  }

	  if (!stream && frame.id !== undefined) {
	    // Load created one
	    stream = state.stream.map[frame.id];

	    // Fail if not found
	    if (!stream &&
	        frame.type !== 'HEADERS' &&
	        frame.type !== 'PRIORITY' &&
	        frame.type !== 'RST') {
	      // Other side should destroy the stream upon receiving GOAWAY
	      if (this._isGoaway(frame.id))
	        return;

	      state.debug('id=0 stream=%d not found', frame.id);
	      state.framer.rstFrame({ id: frame.id, code: 'INVALID_STREAM' });
	      return;
	    }
	  }

	  // Create new stream
	  if (!stream && frame.type === 'HEADERS') {
	    this._handleHeaders(frame);
	    return;
	  }

	  if (stream) {
	    stream._handleFrame(frame);
	  } else if (frame.type === 'SETTINGS') {
	    this._handleSettings(frame.settings);
	  } else if (frame.type === 'ACK_SETTINGS') {
	    // TODO(indutny): handle it one day
	  } else if (frame.type === 'PING') {
	    this._handlePing(frame);
	  } else if (frame.type === 'GOAWAY') {
	    this._handleGoaway(frame);
	  } else if (frame.type === 'X_FORWARDED_FOR') {
	    // Set X-Forwarded-For only once
	    if (state.xForward === null)
	      state.xForward = frame.host;
	  } else if (frame.type === 'PRIORITY') {
	    // TODO(indutny): handle this
	  } else {
	    state.debug('id=0 unknown frame type: %s', frame.type);
	  }
	};

	Connection.prototype._onWindowOverflow = function _onWindowOverflow() {
	  var state = this._spdyState;
	  state.debug('id=0 window overflow');
	  this._goaway({
	    lastId: state.stream.lastId.both,
	    code: 'FLOW_CONTROL_ERROR',
	    send: true
	  });
	};

	Connection.prototype._isGoaway = function _isGoaway(id) {
	  var state = this._spdyState;
	  if (state.goaway !== false && state.goaway < id)
	    return true;
	  return false;
	};

	Connection.prototype._getId = function _getId() {
	  var state = this._spdyState;

	  var id = state.stream.nextId;
	  state.stream.nextId += 2;
	  return id;
	};

	Connection.prototype._createStream = function _createStream(uri) {
	  var state = this._spdyState;
	  var id = uri.id;
	  if (id === undefined)
	    id = this._getId();

	  var isGoaway = this._isGoaway(id);

	  if (uri.push && !state.acceptPush) {
	    state.debug('id=0 push disabled promisedId=%d', id);

	    // Fatal error
	    this._goaway({
	      lastId: state.stream.lastId.both,
	      code: 'PROTOCOL_ERROR',
	      send: true
	    });
	    isGoaway = true;
	  }

	  var stream = new Stream(this, {
	    id: id,
	    request: uri.request !== false,
	    method: uri.method,
	    path: uri.path,
	    host: uri.host,
	    priority: uri.priority,
	    headers: uri.headers,
	    parent: uri.parent,
	    readable: !isGoaway && uri.readable,
	    writable: !isGoaway && uri.writable
	  });
	  var self = this;

	  // Just an empty stream for API consistency
	  if (isGoaway)
	    return stream;

	  state.stream.lastId.both = Math.max(state.stream.lastId.both, id);

	  state.debug('id=0 add stream=%d', stream.id);
	  state.stream.map[stream.id] = stream;
	  state.stream.count++;
	  state.counters.stream++;
	  if (stream.parent !== null)
	    state.counters.push++;

	  stream.once('close', function() {
	    self._removeStream(stream);
	  });

	  return stream;
	};

	Connection.prototype._handleHeaders = function _handleHeaders(frame) {
	  var state = this._spdyState;

	  // Must be HEADERS frame after stream close
	  if (frame.id <= state.stream.lastId.received)
	    return;

	  // Someone is using our ids!
	  if ((frame.id + state.stream.nextId) % 2 === 0) {
	    state.framer.rstFrame({ id: frame.id, code: 'PROTOCOL_ERROR' });
	    return;
	  }

	  var stream = this._createStream({
	    id: frame.id,
	    request: false,
	    method: frame.headers[':method'],
	    path: frame.headers[':path'],
	    host: frame.headers[':authority'],
	    priority: frame.priority,
	    headers: frame.headers,
	    writable: frame.writable
	  });

	  // GOAWAY
	  if (this._isGoaway(stream.id))
	    return;

	  state.stream.lastId.received = Math.max(state.stream.lastId.received,
	                                          stream.id);

	  // TODO(indutny) handle stream limit
	  if (!this.emit('stream', stream)) {
	    // No listeners was set - abort the stream
	    stream.abort();
	    return;
	  }

	  // Create fake frame to simulate end of the data
	  if (frame.fin)
	    stream._handleFrame({ type: 'FIN', fin: true });

	  return stream;
	};

	Connection.prototype._onSessionWindowDrain = function _onSessionWindowDrain() {
	  var state = this._spdyState;
	  if (state.version < 3.1 && !(state.isServer && state.autoSpdy31))
	    return;

	  var delta = state.window.recv.getDelta();
	  if (delta === 0)
	    return;

	  state.debug('id=0 session window drain, update by %d', delta);

	  state.framer.windowUpdateFrame({
	    id: 0,
	    delta: delta
	  });
	  state.window.recv.update(delta);
	};

	Connection.prototype.start = function start(version) {
	  this._spdyState.parser.setVersion(version);
	};

	// Mostly for testing
	Connection.prototype.getVersion = function getVersion() {
	  return this._spdyState.version;
	};

	Connection.prototype._handleSettings = function _handleSettings(settings) {
	  var state = this._spdyState;

	  state.framer.ackSettingsFrame();

	  this._setDefaultWindow(settings);
	  if (settings.max_frame_size)
	    state.framer.setMaxFrameSize(settings.max_frame_size);

	  // TODO(indutny): handle max_header_list_size
	  if (settings.header_table_size) {
	    try {
	      state.pair.compress.updateTableSize(settings.header_table_size);
	    } catch (e) {
	      this._goaway({
	        lastId: 0,
	        code: 'PROTOCOL_ERROR',
	        send: true
	      });
	      return;
	    }
	  }

	  // HTTP2 clients needs to enable PUSH streams explicitly
	  if (state.protocol.name !== 'spdy') {
	    if (settings.enable_push === undefined)
	      state.framer.enablePush(state.isServer);
	    else
	      state.framer.enablePush(settings.enable_push === 1);
	  }

	  // TODO(indutny): handle max_concurrent_streams
	};

	Connection.prototype._setDefaultWindow = function _setDefaultWindow(settings) {
	  if (settings.initial_window_size === undefined)
	    return;

	  var state = this._spdyState;

	  // Update defaults
	  var window = state.streamWindow;
	  window.send.setMax(settings.initial_window_size);

	  // Update existing streams
	  Object.keys(state.stream.map).forEach(function(id) {
	    var stream = state.stream.map[id];
	    var window = stream._spdyState.window;

	    window.send.updateMax(settings.initial_window_size);
	  });
	};

	Connection.prototype._handlePing = function handlePing(frame) {
	  var self = this;
	  var state = this._spdyState;

	  // Handle incoming PING
	  if (!frame.ack) {
	    state.framer.pingFrame({
	      opaque: frame.opaque,
	      ack: true
	    });

	    self.emit('ping', frame.opaque);
	    return;
	  }

	  // Handle reply PING
	  var hex = frame.opaque.toString('hex');
	  if (!state.ping.map[hex])
	    return;
	  var ping = state.ping.map[hex];
	  delete state.ping.map[hex];

	  if (ping.cb)
	    ping.cb(null);
	};

	Connection.prototype._handleGoaway = function handleGoaway(frame) {
	  this._goaway({
	    lastId: frame.lastId,
	    code: frame.code,
	    send: false
	  });
	};

	Connection.prototype.ping = function ping(callback) {
	  var state = this._spdyState;

	  // HTTP2 is using 8-byte opaque
	  var opaque = new Buffer(state.constants.PING_OPAQUE_SIZE);
	  opaque.fill(0);
	  opaque.writeUInt32BE(state.ping.nextId, opaque.length - 4);
	  state.ping.nextId += 2;

	  state.ping.map[opaque.toString('hex')] = { cb: callback };
	  state.framer.pingFrame({
	    opaque: opaque,
	    ack: false
	  });
	};

	Connection.prototype.getCounter = function getCounter(name) {
	  return this._spdyState.counters[name];
	};

	Connection.prototype.reserveStream = function reserveStream(uri, callback) {
	  var stream = this._createStream(uri);

	  // GOAWAY
	  if (this._isGoaway(stream.id)) {
	    var err = new Error('Can\'t send request after GOAWAY');
	    process.nextTick(function() {
	      if (callback)
	        callback(err);
	      else
	        stream.emit('error', err);
	    });
	    return stream;
	  }

	  if (callback) {
	    process.nextTick(function() {
	      callback(null, stream);
	    });
	  }

	  return stream;
	};

	Connection.prototype.request = function request(uri, callback) {
	  var stream = this.reserveStream(uri, function(err) {
	    if (err) {
	      if (callback)
	        callback(err);
	      else
	        stream.emit('error', err);
	      return;
	    }

	    if (stream._wasSent()) {
	      if (callback)
	        callback(null, stream);
	      return;
	    }

	    stream.send(function(err) {
	      if (err) {
	        if (callback)
	          return callback(err);
	        else
	          return stream.emit('error', err);
	      }

	      if (callback)
	        callback(null, stream);
	    });
	  });

	  return stream;
	};

	Connection.prototype._removeStream = function _removeStream(stream) {
	  var state = this._spdyState;

	  state.debug('id=0 remove stream=%d', stream.id);
	  delete state.stream.map[stream.id];
	  state.stream.count--;

	  if (state.stream.count === 0)
	    this.emit('_streamDrain');
	};

	Connection.prototype._goaway = function _goaway(params) {
	  var state = this._spdyState;
	  var self = this;

	  state.goaway = params.lastId;
	  state.debug('id=0 goaway from=%d', state.goaway);

	  Object.keys(state.stream.map).forEach(function(id) {
	    var stream = state.stream.map[id];

	    // Abort every stream started after GOAWAY
	    if (stream.id <= params.lastId)
	      return;

	    stream.abort();
	    stream.emit('error', new Error('New stream after GOAWAY'));
	  });

	  function finish() {
	    // Destroy socket if there are no streams
	    if (state.stream.count === 0 || params.code !== 'OK') {
	      // No further frames should be processed
	      state.parser.kill();

	      process.nextTick(function() {
	        var err = new Error('Fatal error: ' + params.code);
	        self._onStreamDrain(err);
	      });
	      return;
	    }

	    self.on('_streamDrain', self._onStreamDrain);
	  }

	  if (params.send) {
	    // Make sure that GOAWAY frame is sent before dumping framer
	    state.framer.goawayFrame({
	      lastId: params.lastId,
	      code: params.code,
	      extra: params.extra
	    }, finish);
	  } else {
	    finish();
	  }
	};

	Connection.prototype._onStreamDrain = function _onStreamDrain(error) {
	  var state = this._spdyState;

	  state.debug('id=0 _onStreamDrain');

	  state.framer.dump();
	  state.framer.unpipe(this.socket);
	  state.framer.resume();

	  if (this.socket.destroySoon)
	    this.socket.destroySoon();
	  this.emit('close', error);
	};

	Connection.prototype.end = function end(callback) {
	  var state = this._spdyState;

	  if (callback)
	    this.once('close', callback);
	  this._goaway({
	    lastId: state.stream.lastId.both,
	    code: 'OK',
	    send: true
	  });
	};

	Connection.prototype.destroyStreams = function destroyStreams(err) {
	  var state = this._spdyState;
	  Object.keys(state.stream.map).forEach(function(id) {
	    var stream = state.stream.map[id];

	    stream.abort();
	    stream.emit('error', err);
	  });
	};

	Connection.prototype.isServer = function isServer() {
	  return this._spdyState.isServer;
	};

	Connection.prototype.getXForwardedFor = function getXForwardFor() {
	  return this._spdyState.xForward;
	};

	Connection.prototype.sendXForwardedFor = function sendXForwardedFor(host) {
	  var state = this._spdyState;
	  if (state.version !== null)
	    state.framer.xForwardedFor({ host: host });
	  else
	    state.xForward = host;
	};

	Connection.prototype.pushPromise = function pushPromise(parent, uri, callback) {
	  var state = this._spdyState;

	  var stream = this._createStream({
	    request: false,
	    parent: parent,
	    method: uri.method,
	    path: uri.path,
	    host: uri.host,
	    priority: uri.priority,
	    headers: uri.headers,
	    readable: false
	  });

	  // TODO(indutny): deduplicate this logic somehow
	  if (this._isGoaway(stream.id)) {
	    var err = new Error('Can\'t send PUSH_PROMISE after GOAWAY');
	    process.nextTick(function() {
	      if (callback)
	        callback(err);
	      else
	        stream.emit('error', err);
	    });
	    return stream;
	  }

	  if (uri.push && !state.acceptPush) {
	    var err = new Error(
	        'Can\'t send PUSH_PROMISE, other side won\'t accept it');
	    process.nextTick(function() {
	      if (callback)
	        callback(err);
	      else
	        stream.emit('error', err);
	    });
	    return stream;
	  }

	  stream._sendPush(uri.status, uri.response, function(err) {
	    if (!callback) {
	      if (err)
	        stream.emit('error', err);
	      return;
	    }

	    if (err)
	      return callback(err);
	    callback(null, stream);
	  });

	  return stream;
	};

	Connection.prototype.setTimeout = function setTimeout(delay, callback) {
	  var state = this._spdyState;

	  state.timeout.set(delay, callback);
	};


/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var assert = __webpack_require__(75);
	var https = __webpack_require__(21);
	var http = __webpack_require__(22);
	var tls = __webpack_require__(125);
	var net = __webpack_require__(84);
	var util = __webpack_require__(77);
	var selectHose = __webpack_require__(126);
	var transport = __webpack_require__(86);
	var debug = __webpack_require__(32)('spdy:server');
	var EventEmitter = __webpack_require__(33).EventEmitter;

	var spdy = __webpack_require__(73);

	var proto = {};

	function instantiate(base) {
	  function Server(options, handler) {
	    this._init(base, options, handler);
	  }
	  util.inherits(Server, base);

	  Server.create = function create(options, handler) {
	    return new Server(options, handler);
	  };

	  Object.keys(proto).forEach(function(key) {
	    Server.prototype[key] = proto[key];
	  });

	  return Server;
	}

	proto._init = function _init(base, options, handler) {
	  var state = {};
	  this._spdyState = state;

	  state.options = options.spdy || {};

	  var protocols = state.options.protocols || [
	    'h2',
	    'spdy/3.1', 'spdy/3', 'spdy/2',
	    'http/1.1', 'http/1.0'
	  ];

	  var actualOptions = util._extend({
	    NPNProtocols: protocols,

	    // Future-proof
	    ALPNProtocols: protocols
	  }, options);

	  state.secure = this instanceof tls.Server;

	  if (state.secure)
	    base.call(this, actualOptions);
	  else
	    base.call(this);

	  // Support HEADERS+FIN
	  this.httpAllowHalfOpen = true;

	  var event = state.secure ? 'secureConnection' : 'connection';

	  state.listeners = this.listeners(event).slice();
	  assert(state.listeners.length > 0, 'Server does not have default listeners');
	  this.removeAllListeners(event);

	  if (state.options.plain)
	    this.on(event, this._onPlainConnection);
	  else
	    this.on(event, this._onConnection);

	  if (handler)
	    this.on('request', handler);

	  debug('server init secure=%d', state.secure);
	};

	proto._onConnection = function _onConnection(socket) {
	  var state = this._spdyState;

	  var protocol;
	  if (state.secure)
	    protocol = socket.npnProtocol || socket.alpnProtocol;

	  this._handleConnection(socket, protocol);
	};

	proto._handleConnection = function _handleConnection(socket, protocol) {
	  var state = this._spdyState;

	  if (!protocol)
	    protocol = state.options.protocol;

	  debug('incoming socket protocol=%j', protocol);

	  // No way we can do anything with the socket
	  if (!protocol || protocol === 'http/1.1' || protocol === 'http/1.0') {
	    debug('to default handler it goes');
	    return this._invokeDefault(socket);
	  }

	  socket.setNoDelay(true);

	  var connection = transport.connection.create(socket, util._extend({
	    protocol: /spdy/.test(protocol) ? 'spdy' : 'http2',
	    isServer: true
	  }, state.options.connection || {}));

	  // Set version when we are certain
	  if (protocol === 'http2')
	    connection.start(4);
	  else if (protocol === 'spdy/3.1')
	    connection.start(3.1);
	  else if (protocol === 'spdy/3')
	    connection.start(3);
	  else if (protocol === 'spdy/2')
	    connection.start(2);

	  connection.on('error', function() {
	    socket.destroy();
	  });

	  var self = this;
	  connection.on('stream', function(stream) {
	    self._onStream(stream);
	  });
	};

	// HTTP2 preface
	var PREFACE = 'PRI * HTTP/2.0\r\n\r\nSM\r\n\r\n';
	var PREFACE_BUFFER = new Buffer(PREFACE);

	function hoseFilter(data, callback) {
	  if (data.length < 1)
	    return callback(null, null);

	  // SPDY!
	  if (data[0] === 0x80)
	    return callback(null, 'spdy');

	  var avail = Math.min(data.length, PREFACE_BUFFER.length);
	  for (var i = 0; i < avail; i++)
	    if (data[i] !== PREFACE_BUFFER[i])
	      return callback(null, 'http/1.1');

	  // Not enough bytes to be sure about HTTP2
	  if (avail !== PREFACE_BUFFER.length)
	    return callback(null, null);

	  return callback(null, 'h2');
	}

	proto._onPlainConnection = function _onPlainConnection(socket) {
	  var hose = selectHose.create(socket, {}, hoseFilter);

	  var self = this;
	  hose.on('select', function(protocol, socket) {
	    self._handleConnection(socket, protocol);
	  });

	  hose.on('error', function(err) {
	    debug('hose error %j', err.message);
	    socket.destroy();
	  });
	};

	proto._invokeDefault = function _invokeDefault(socket) {
	  var state = this._spdyState;

	  for (var i = 0; i < state.listeners.length; i++)
	    state.listeners[i].call(this, socket);
	};

	proto._onStream = function _onStream(stream) {
	  var state = this._spdyState;

	  var handle = spdy.handle.create(this._spdyState.options, stream);

	  var socketOptions = {
	    handle: handle,
	    allowHalfOpen: true
	  };

	  var socket;
	  if (state.secure)
	    socket = new spdy.Socket(stream.connection.socket, socketOptions);
	  else
	    socket = new net.Socket(socketOptions);

	  handle.assignSocket(socket);

	  // For v0.8
	  socket.readable = true;
	  socket.writable = true;

	  this._invokeDefault(socket);

	  // Add lazy `checkContinue` listener, otherwise `res.writeContinue` will be
	  // called before the response object was patched by us.
	  if (stream.headers.expect !== undefined &&
	      /100-continue/i.test(stream.headers.expect) &&
	      EventEmitter.listenerCount(this, 'checkContinue') === 0) {
	    this.once('checkContinue', function(req, res) {
	      res.writeContinue();

	      this.emit('request', req, res);
	    });
	  }

	  handle.emitRequest();
	};

	proto.emit = function emit(event, req, res) {
	  if (event !== 'request' && event !== 'checkContinue')
	    return EventEmitter.prototype.emit.apply(this, arguments);

	  if (!(req.socket._handle instanceof spdy.handle)) {
	    debug('not spdy req/res');
	    req.isSpdy = false;
	    req.spdyVersion = 1;
	    res.isSpdy = false;
	    res.spdyVersion = 1;
	    return EventEmitter.prototype.emit.apply(this, arguments);
	  }

	  var handle = req.connection._handle;

	  req.isSpdy = true;
	  req.spdyVersion = handle.getStream().connection.getVersion();
	  res.isSpdy = true;
	  res.spdyVersion = req.spdyVersion;
	  req.spdyStream = handle.getStream();

	  debug('override req/res');
	  res.writeHead = spdy.response.writeHead;
	  res.end = spdy.response.end;
	  res.push = spdy.response.push;
	  res.writeContinue = spdy.response.writeContinue;
	  res.spdyStream = handle.getStream();

	  res._req = req;

	  handle.assignRequest(req);
	  handle.assignResponse(res);

	  return EventEmitter.prototype.emit.apply(this, arguments);
	};

	exports.Server = instantiate(https.Server);
	exports.PlainServer = instantiate(http.Server);

	exports.create = function create(base, options, handler) {
	  if (typeof base === 'object') {
	    handler = options;
	    options = base;
	    base = null;
	  }

	  if (base)
	    return instantiate(base).create(options, handler);

	  if (options.spdy && options.spdy.plain)
	    return exports.PlainServer.create(options, handler);
	  else
	    return exports.Server.create(options, handler);
	};


/***/ },
/* 125 */
/***/ function(module, exports) {

	module.exports = require("tls");

/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var util = __webpack_require__(77);
	var EventEmitter = __webpack_require__(33).EventEmitter;

	function Hose(socket, options, filter) {
	  EventEmitter.call(this);

	  if (typeof options === 'function') {
	    filter = options;
	    options = {};
	  }

	  this.socket = socket;
	  this.options = options;
	  this.filter = filter;

	  this.buffer = null;

	  var self = this;
	  this.listeners = {
	    error: function(err) {
	      return self.onError(err);
	    },
	    data: function(chunk) {
	      return self.onData(chunk);
	    },
	    end: function() {
	      return self.onEnd();
	    }
	  };

	  this.socket.on('error', this.listeners.error);
	  this.socket.on('data', this.listeners.data);
	  this.socket.on('end', this.listeners.end);
	}
	util.inherits(Hose, EventEmitter);
	module.exports = Hose;

	Hose.create = function create(socket, options, filter) {
	  return new Hose(socket, options, filter);
	};

	Hose.prototype.detach = function detach() {
	  // Stop the flow
	  this.socket.pause();

	  this.socket.removeListener('error', this.listeners.error);
	  this.socket.removeListener('data', this.listeners.data);
	  this.socket.removeListener('end', this.listeners.end);
	};

	Hose.prototype.reemit = function reemit() {
	  var buffer = this.buffer;
	  this.buffer = null;

	  // Modern age
	  if (this.socket.unshift) {
	    this.socket.unshift(buffer);
	    if (this.socket.listeners('data').length > 0)
	      this.socket.resume();
	    return;
	  }

	  // Rusty node v0.8
	  if (this.socket.ondata)
	    this.socket.ondata(buffer, 0, buffer.length);
	  this.socket.emit('data', buffer);
	  this.socket.resume();
	};

	Hose.prototype.onError = function onError(err) {
	  this.detach();
	  this.emit('error', err);
	};

	Hose.prototype.onData = function onData(chunk) {
	  if (this.buffer)
	    this.buffer = Buffer.concat([ this.buffer, chunk ]);
	  else
	    this.buffer = chunk;

	  var self = this;
	  this.filter(this.buffer, function(err, protocol) {
	    if (err)
	      return self.onError(err);

	    // No protocol selected yet
	    if (!protocol)
	      return;

	    self.detach();
	    self.emit('select', protocol, self.socket);
	    self.reemit();
	  });
	};

	Hose.prototype.onEnd = function onEnd() {
	  this.detach();
	  this.emit('error', new Error('Not enough data to recognize protocol'));
	};


/***/ }
/******/ ]);