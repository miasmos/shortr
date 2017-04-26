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
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _Log = __webpack_require__(2);

	var _enums = __webpack_require__(3);

	var _Response = __webpack_require__(4);

	var _db = __webpack_require__(5);

	var _db2 = _interopRequireDefault(_db);

	var _params = __webpack_require__(11);

	var _messages = __webpack_require__(14);

	var _Error = __webpack_require__(12);

	var _server = __webpack_require__(15);

	var _server2 = _interopRequireDefault(_server);

	var _crypto = __webpack_require__(22);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var server = new _server2.default(443),
	    path = __webpack_require__(25),
	    credentials = __webpack_require__(26),
	    html = __webpack_require__(27);

	var App = function App() {
		var _this = this;

		_classCallCheck(this, App);

		this.db = new _db2.default(credentials.database);

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

		server.Route('/api/hash/create/:url', function (request, response) {
			var url = request.params.url,
			    regex = url.match(/^(http|https|ftp):\/\//g);
			if (!(!!regex && regex.length)) {
				url = 'http://' + url;
			}

			var hash = _crypto.instance.TimestampHash(url);

			_this.db.Links.Create(url, hash).then(function (result) {
				_Response.Response.Ok(response, _messages.Messages.Link(hash, url));
			}).catch(function (error) {
				console.log(error);
				_Response.Response.Error(response, new _Error.ErrorExtended(_enums.instance.error.message.GENERIC_ERROR, _enums.instance.error.code.ERROR));
			});
		});

		server.Route('/api*', function (request, response) {
			_Response.Response.Error(response, new _Error.ErrorExtended(_enums.instance.error.message.NOT_FOUND, _enums.instance.error.code.NOT_FOUND));
		});

		server.Route('/:hash', function (request, response) {
			_this.db.Links.Get(request.params.hash).then(function (result) {
				if (result !== null) {
					var link = result.get('link'); //https://localhost:1111/59USV

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

/***/ }),
/* 2 */
/***/ (function(module, exports) {

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

/***/ }),
/* 3 */
/***/ (function(module, exports) {

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

		this.error = {
			message: {
				"NOT_FOUND": "Whoops. That page doesn't exist.",
				"INVALID_PARAM_HASH": "Invalid hash supplied.",
				"INVALID_PARAM_URL": "Invalid URL supplied.",
				"RATE_LIMITED": "Your request was rate limited. Try again later.",
				"GENERIC_ERROR": "An undiagnosed error has occurred.",
				"CORS": "This resource is restricted to the shortr.li domain.",
				"NO_RESULTS": "The request was made, but returned no results.",
				"SERVICE_UNAVAILABLE": "The requested service is unavailable. It is either down or slow to respond."
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

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Response = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _enums = __webpack_require__(3);

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

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _models = __webpack_require__(6);

	var _models2 = _interopRequireDefault(_models);

	var _links = __webpack_require__(8);

	var _links2 = _interopRequireDefault(_links);

	var _users = __webpack_require__(10);

	var _users2 = _interopRequireDefault(_users);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Sequelize = __webpack_require__(7);


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

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Sequelize = __webpack_require__(7);

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

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	module.exports = require("sequelize");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _table = __webpack_require__(9);

	var _table2 = _interopRequireDefault(_table);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Sequelize = __webpack_require__(7);

	var Links = function (_Table) {
		_inherits(Links, _Table);

		function Links() {
			_classCallCheck(this, Links);

			return _possibleConstructorReturn(this, (Links.__proto__ || Object.getPrototypeOf(Links)).apply(this, arguments));
		}

		_createClass(Links, [{
			key: 'Create',
			value: function Create(link, hash) {
				return this.model.create({
					link: link,
					hash: hash
				});
			}
		}, {
			key: 'UpdatePassword',
			value: function UpdatePassword(salt, hash, email) {
				return this.model.update({
					salt: salt,
					hash: hash
				}, {
					where: {
						email: email
					}
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

/***/ }),
/* 9 */
/***/ (function(module, exports) {

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

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _table = __webpack_require__(9);

	var _table2 = _interopRequireDefault(_table);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Sequelize = __webpack_require__(7);

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

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.instance = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Response = __webpack_require__(4);

	var _Error = __webpack_require__(12);

	var _enums = __webpack_require__(3);

	var _validator = __webpack_require__(13);

	var _validator2 = _interopRequireDefault(_validator);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Params = function () {
		function Params() {
			_classCallCheck(this, Params);

			this.routes = ['hash', 'url'];
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
		}]);

		return Validate;
	}();

	var instance = exports.instance = new Params();

/***/ }),
/* 12 */
/***/ (function(module, exports) {

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

/***/ }),
/* 13 */
/***/ (function(module, exports) {

	module.exports = require("validator");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

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

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _enums = __webpack_require__(3);

	var _Error = __webpack_require__(12);

	var _Response = __webpack_require__(4);

	var _Log = __webpack_require__(2);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var express = __webpack_require__(16),
	    https = __webpack_require__(18),
	    http = __webpack_require__(19),
	    fs = __webpack_require__(20),
	    config = __webpack_require__(21);

	var Server = function () {
		function Server(port) {
			_classCallCheck(this, Server);

			this.port = port;

			var app = express();
			app.set('json spaces', 4);
			app.use(function (request, response, next) {
				var host = request.headers.host.replace(/(.*):([0-9]+)/g, "$1");
				if (['localhost', '127.0.0.1', 'shortr.li', 'www.shortr.li'].indexOf(host) === -1) {
					_Response.Response.Error(response, new _Error.ErrorExtended(_enums.instance.error.message.CORS, _enums.instance.error.code.FORBIDDEN));
					return;
				}

				response.header('Access-Control-Allow-Origin', host);
				response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
				response.header('Access-Control-Allow-Headers', 'Content-Type');
				next();
			});
			app.use('/static', express.static('static'));
			this.app = app;
		}

		_createClass(Server, [{
			key: 'Start',
			value: function Start() {
				var _this = this;

				var server = https.createServer({
					key: fs.readFileSync(config.certificate.key, 'utf8'),
					cert: fs.readFileSync(config.certificate.cert, 'utf8')
				}, this.app);

				server.listen(this.port, function () {
					_Log.instance.Say('Server listening on port ' + _this.port);
				});

				this.server = server;

				var httpServer = http.createServer(function (request, response) {
					response.writeHead(301, { "Location": "https://" + request.headers['host'] + request.url });
					response.end();
				}).listen(80);
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

/***/ }),
/* 16 */
/***/ (function(module, exports) {

	module.exports = require("express");

/***/ }),
/* 17 */,
/* 18 */
/***/ (function(module, exports) {

	module.exports = require("https");

/***/ }),
/* 19 */
/***/ (function(module, exports) {

	module.exports = require("http");

/***/ }),
/* 20 */
/***/ (function(module, exports) {

	module.exports = require("fs");

/***/ }),
/* 21 */
/***/ (function(module, exports) {

	module.exports = {
		"certificate": {
			"key": "/etc/letsencrypt/live/shortr.li/privkey.pem",
			"cert": "/etc/letsencrypt/live/shortr.li/cert.pem"
		},
		"localCertificate": {
			"key": "A:\\http\\htdocs\\shortr.li\\server\\app\\cert\\privkey.pem",
			"cert": "A:\\http\\htdocs\\shortr.li\\server\\app\\cert\\cert.pem"
		},
		"host": "shortr.li",
		"protocol": "https"
	};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.instance = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	__webpack_require__(23);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var shorthash = __webpack_require__(24);

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

/***/ }),
/* 23 */
/***/ (function(module, exports) {

	module.exports = require("bluebird");

/***/ }),
/* 24 */
/***/ (function(module, exports) {

	module.exports = require("shorthash");

/***/ }),
/* 25 */
/***/ (function(module, exports) {

	module.exports = require("path");

/***/ }),
/* 26 */
/***/ (function(module, exports) {

	module.exports = {
		"database": {
			"user": "postgres",
			"password": "B=jfCHn?akpHC7ymqQL5LhqVc2@F9dRb",
			"database": "shortr",
			"host": "localhost",
			"port": 5432
		}
	};

/***/ }),
/* 27 */
/***/ (function(module, exports) {

	module.exports = "<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n\t<meta charset=\"UTF-8\">\r\n\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1\">\r\n\t<meta name=\"description\" content=\"Shortr is a premium link shortening service focusing on ease of use.\">\r\n\t<link href=\"https://fonts.googleapis.com/css?family=Oswald|Roboto+Condensed\" rel=\"stylesheet\">\r\n\t<link rel=\"apple-touch-icon\" sizes=\"180x180\" href=\"/static/images/apple-touch-icon.png\">\r\n\t<link rel=\"icon\" type=\"image/png\" sizes=\"32x32\" href=\"/static/images/favicon-32x32.png\">\r\n\t<link rel=\"icon\" type=\"image/png\" sizes=\"16x16\" href=\"/static/images/favicon-16x16.png\">\r\n\t<link rel=\"manifest\" href=\"/static/images/manifest.json\">\r\n\t<link rel=\"mask-icon\" href=\"/static/images/safari-pinned-tab.svg\" color=\"#5bbad5\">\r\n\t<link rel=\"shortcut icon\" href=\"/static/images/favicon.ico\">\r\n\t<meta name=\"msapplication-config\" content=\"/static/images/browserconfig.xml\">\r\n\t<meta name=\"theme-color\" content=\"#ffffff\">\r\n\t<title>Shortr | Shorten your links. Easily.</title>\r\n\t<style>\r\n\t\tbody {width: 100%; height: 100%; overflow: hidden;}\r\n\t\thtml,body,canvas {padding: 0; margin: 0;}\r\n\t</style>\r\n\t<div id=\"app\"></div>\r\n</head>\r\n<body>\r\n<script type=\"text/javascript\" src=\"static/js/index.compiled.js\"></script></body>\r\n</html>";

/***/ })
/******/ ]);