(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('axios'), require('base-64')) :
    typeof define === 'function' && define.amd ? define(['exports', 'axios', 'base-64'], factory) :
    (global = global || self, factory(global.DirectusSDK = {}, global.axios, global.base64));
}(this, function (exports, axios, base64) { 'use strict';

    axios = axios && axios.hasOwnProperty('default') ? axios['default'] : axios;

    /**
     * @module Configuration
     */
    var __assign = (undefined && undefined.__assign) || function () {
        __assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    var STORAGE_KEY = "directus-sdk-js";
    /**
     * Configuration holder for directus implementations
     * @author Jan Biasi <biasijan@gmail.com>
     */
    var Configuration = /** @class */ (function () {
        /**
         * Creates a new configuration instance, will be used once for each directus instance (passing refs).
         * @constructor
         * @param {IConfigurationOptions} initialConfig   Initial configuration values
         * @param {IStorageAPI?} storage                  Storage adapter for persistence
         */
        function Configuration(initialConfig, storage) {
            if (initialConfig === void 0) { initialConfig = {}; }
            this.storage = storage;
            var dehydratedConfig = {};
            if (storage && Boolean(initialConfig && initialConfig.persist)) {
                // dehydrate if storage was provided and persist flag is set
                dehydratedConfig = this.dehydratedInitialConfiguration(storage);
            }
            var persist = Boolean(dehydratedConfig.persist || initialConfig.persist);
            var project = dehydratedConfig.project || initialConfig.project;
            var mode = dehydratedConfig.mode || initialConfig.mode || Configuration.defaults.mode;
            var tokenExpirationTime = dehydratedConfig.tokenExpirationTime ||
                initialConfig.tokenExpirationTime ||
                Configuration.defaults.tokenExpirationTime;
            this.internalConfiguration = __assign({}, initialConfig, dehydratedConfig, { persist: persist,
                mode: mode,
                project: project,
                tokenExpirationTime: tokenExpirationTime });
        }
        Object.defineProperty(Configuration.prototype, "token", {
            // ACCESSORS =================================================================
            get: function () {
                return this.internalConfiguration.token;
            },
            set: function (token) {
                this.partialUpdate({ token: token });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Configuration.prototype, "tokenExpirationTime", {
            get: function () {
                return this.internalConfiguration.tokenExpirationTime;
            },
            set: function (tokenExpirationTime) {
                // TODO: Optionally re-compute the localExp property for the auto-refresh
                this.partialUpdate({
                    tokenExpirationTime: tokenExpirationTime * 60000,
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Configuration.prototype, "url", {
            get: function () {
                return this.internalConfiguration.url;
            },
            set: function (url) {
                this.partialUpdate({ url: url });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Configuration.prototype, "project", {
            get: function () {
                return this.internalConfiguration.project;
            },
            set: function (project) {
                this.partialUpdate({
                    project: project,
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Configuration.prototype, "localExp", {
            get: function () {
                return this.internalConfiguration.localExp;
            },
            set: function (localExp) {
                this.partialUpdate({ localExp: localExp });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Configuration.prototype, "persist", {
            get: function () {
                return this.internalConfiguration.persist;
            },
            set: function (persist) {
                this.internalConfiguration.persist = persist;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Configuration.prototype, "mode", {
            get: function () {
                return this.internalConfiguration.mode;
            },
            set: function (mode) {
                this.internalConfiguration.mode = mode;
            },
            enumerable: true,
            configurable: true
        });
        // HELPER METHODS ============================================================
        /**
         * Update the configuration values, will also hydrate them if persistance activated
         * @param {IConfigurationValues} config
         */
        Configuration.prototype.update = function (config) {
            this.internalConfiguration = config;
            this.hydrate(config);
        };
        /**
         * Update partials of the configuration, behaves like the [update] method
         * @param {Partial<IConfigurationValues>} config
         */
        Configuration.prototype.partialUpdate = function (config) {
            this.internalConfiguration = __assign({}, this.internalConfiguration, config);
            this.hydrate(this.internalConfiguration);
        };
        /**
         * Reset the whole confiugration and remove hydrated values from storage as well
         */
        Configuration.prototype.reset = function () {
            delete this.internalConfiguration.token;
            delete this.internalConfiguration.url;
            delete this.internalConfiguration.project;
            delete this.internalConfiguration.localExp;
            this.deleteHydratedConfig();
        };
        // STORAGE METHODS ===========================================================
        Configuration.prototype.dehydrate = function () {
            if (!this.storage || !this.persist) {
                return;
            }
            var nativeValue = this.storage.getItem(STORAGE_KEY);
            if (!nativeValue) {
                return;
            }
            var parsedConfig = JSON.parse(nativeValue);
            this.internalConfiguration = parsedConfig;
            return parsedConfig;
        };
        Configuration.prototype.hydrate = function (props) {
            if (!this.storage || !this.persist) {
                return;
            }
            this.storage.setItem(STORAGE_KEY, JSON.stringify(props));
        };
        Configuration.prototype.deleteHydratedConfig = function () {
            if (!this.storage || !this.persist) {
                return;
            }
            this.storage.removeItem(STORAGE_KEY);
        };
        Configuration.prototype.dehydratedInitialConfiguration = function (storage) {
            if (!storage) {
                return {};
            }
            var nativeValue = storage.getItem(STORAGE_KEY);
            if (!nativeValue) {
                return;
            }
            try {
                return JSON.parse(nativeValue);
            }
            catch (err) {
                return {};
            }
        };
        /**
         * Defaults for all directus sdk instances, can be modified if preferred
         * @type {IConfigurationDefaults}
         */
        Configuration.defaults = {
            tokenExpirationTime: 5 * 6 * 1000,
            mode: "jwt"
        };
        return Configuration;
    }());

    /**
     * @module utils
     */
    var DIRECTUS_COLLECTION_PREFIX = "directus_";
    /**
     * Returns the correct API path for the collection. It will
     * strip the prefix {@link DIRECTUS_COLLECTION_PREFIX | collection-prefix} or will add the
     * '/items/' path as prefix if not provided. The 'substr(9)' defines
     * the length of the defined {@link DIRECTUS_COLLECTION_PREFIX | collection-prefix}.
     * @param {string} collection     The name of the collection
     * @returns {string}
     * @internal
     *
     * @example
     * getCollectionItemPath('directus_users');
     * // => '/users'
     * getCollectionItemPath('users');
     * // => '/items/users'
     */
    function getCollectionItemPath(collection) {
        if (collection.startsWith(DIRECTUS_COLLECTION_PREFIX)) {
            return "/" + collection.substr(9);
        }
        return "/items/" + collection;
    }

    /**
     * @module utils
     */
    /**
     * @internal
     */
    var isType = function (t, v) { return Object.prototype.toString.call(v) === "[object " + t + "]"; };
    /**
     * @internal
     */
    var isString = function (v) { return v && typeof v === "string" && /\S/.test(v); };
    /**
     * @internal
     */
    var isNumber = function (v) { return isType("Number", v) && isFinite(v) && !isNaN(parseFloat(v)); };
    /**
     * @internal
     */
    var isFunction = function (v) { return v instanceof Function; };

    /**
     * @module utils
     */
    /**
     * Retrieves the payload from a JWT
     * @internal
     * @param  {String} token The JWT to retrieve the payload from
     * @return {Object}       The JWT payload
     */
    function getPayload(token) {
        if (!token || token.length < 0 || token.split(".").length <= 0) {
            // no token or invalid token equals no payload
            return {};
        }
        try {
            var payloadBase64 = token
                .split(".")[1]
                .replace("-", "+")
                .replace("_", "/");
            var payloadDecoded = base64.decode(payloadBase64);
            var payloadObject = JSON.parse(payloadDecoded);
            if (isNumber(payloadObject.exp)) {
                payloadObject.exp = new Date(payloadObject.exp * 1000);
            }
            return payloadObject;
        }
        catch (err) {
            // return empty payload in case of an error
            return {};
        }
    }

    /**
     * @module Authentication
     */
    var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    /**
     * Handles all authentication related logic, decoupled from the core
     * @internal
     * @author Jan Biasi <biasijan@gmail.com>
     */
    var Authentication = /** @class */ (function () {
        /**
         * Creates a new authentication instance
         * @constructor
         * @param {IConfiguration} config
         * @param {IAuthenticationInjectableProps} inject
         */
        function Authentication(config, inject) {
            this.config = config;
            this.inject = inject;
            // Only start the auto refresh interval if the token exists and it's a JWT
            if (config.token && config.token.includes(".")) {
                this.startInterval(true);
            }
        }
        /**
         * Login to the API; Gets a new token from the API and stores it in this.token.
         * @param {ILoginCredentials} credentials   User login credentials
         * @param {ILoginOptions?} options          Additional options regarding persistance and co.
         * @return {Promise<IAuthenticateResponse>}
         */
        Authentication.prototype.login = function (credentials, options) {
            var _this = this;
            this.config.token = null;
            if (isString(credentials.url)) {
                this.config.url = credentials.url;
            }
            if (isString(credentials.project)) {
                this.config.project = credentials.project;
            }
            if (options && isString(options.mode)) {
                this.config.mode = options.mode;
            }
            if (credentials.persist || (options && options.persist) || this.config.persist) {
                // use interval for login refresh when option persist enabled
                this.startInterval();
            }
            var body = {
                email: credentials.email,
                password: credentials.password,
                mode: "jwt"
            };
            if (this.config.mode === 'cookie') {
                body.mode = 'cookie';
            }
            if (credentials.otp) {
                body.otp = credentials.otp;
            }
            var activeRequest = this.inject.post("/auth/authenticate", body);
            if (this.config.mode === 'jwt') {
                activeRequest
                    .then(function (res) {
                    // save new token in configuration
                    _this.config.token = res.data.token;
                    return res;
                })
                    .then(function (res) {
                    _this.config.token = res.data.token;
                    _this.config.localExp = new Date(Date.now() + _this.config.tokenExpirationTime).getTime();
                    return res;
                });
            }
            return activeRequest;
        };
        /**
         * Logs the user out by "forgetting" the token, and clearing the refresh interval
         */
        Authentication.prototype.logout = function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.inject.post("/auth/logout")];
                        case 1:
                            response = _a.sent();
                            this.config.token = null;
                            if (this.refreshInterval) {
                                this.stopInterval();
                            }
                            return [2 /*return*/, response];
                    }
                });
            });
        };
        /// REFRESH METHODS ----------------------------------------------------------
        /**
         * Refresh the token if it is about to expire (within 30 seconds of expiry date).
         * - Calls onAutoRefreshSuccess with the new token if the refreshing is successful.
         * - Calls onAutoRefreshError if refreshing the token fails for some reason.
         * @return {RefreshIfNeededResponse}
         */
        Authentication.prototype.refreshIfNeeded = function () {
            var _this = this;
            var payload = this.getPayload();
            var _a = this.config, token = _a.token, url = _a.url, project = _a.project, localExp = _a.localExp;
            if (!isString(token) || !isString(url) || !isString(project)) {
                return;
            }
            if (!payload || !payload.exp) {
                return;
            }
            var timeDiff = (localExp || 0) - Date.now();
            if (timeDiff <= 0) {
                // token has expired, skipping auto refresh
                if (isFunction(this.onAutoRefreshError)) {
                    this.onAutoRefreshError({
                        code: 102,
                        message: "auth_expired_token",
                    });
                }
                return;
            }
            if (timeDiff < 30000) {
                return new Promise(function (resolve) {
                    _this.refresh(token)
                        .then(function (res) {
                        _this.config.localExp = new Date(Date.now() + _this.config.tokenExpirationTime).getTime();
                        _this.config.token = res.data.token || token;
                        // if autorefresh succeeded
                        if (isFunction(_this.onAutoRefreshSuccess)) {
                            _this.onAutoRefreshSuccess(_this.config);
                        }
                        resolve([true]);
                    })
                        .catch(function (error) {
                        if (isFunction(_this.onAutoRefreshError)) {
                            _this.onAutoRefreshError(error);
                        }
                        resolve([true, error]);
                    });
                });
            }
        };
        /**
         * Use the passed token to request a new one.
         * @param {string} token
         */
        Authentication.prototype.refresh = function (token) {
            return this.inject.post("/auth/refresh", { token: token });
        };
        /**
         * Starts an interval of 10 seconds that will check if the token needs refreshing
         * @param {boolean?} fireImmediately    If it should immediately call [refreshIfNeeded]
         */
        Authentication.prototype.startInterval = function (fireImmediately) {
            if (fireImmediately) {
                this.refreshIfNeeded();
            }
            this.refreshInterval = setInterval(this.refreshIfNeeded.bind(this), 10000);
        };
        /**
         * Clears and nullifies the token refreshing interval
         */
        Authentication.prototype.stopInterval = function () {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        };
        /**
         * Gets the payload of the current token, return type can be generic
         * @typeparam T     The payload response type, arbitrary object
         * @return {T}
         */
        Authentication.prototype.getPayload = function () {
            if (!isString(this.config.token)) {
                return null;
            }
            return getPayload(this.config.token);
        };
        return Authentication;
    }());

    /**
     * @module ConcurrencyManager
     */
    /**
     * Handling and limiting concurrent requests for the API.
     * @param {AxiosInstance} axios   Reference to the caller instance
     * @param {number=10} limit       How many requests to allow at once
     *
     * Based on https://github.com/bernawil/axios-concurrency/blob/master/index.js
     */
    var concurrencyManager = function (axios, limit) {
        if (limit === void 0) { limit = 10; }
        if (limit < 1) {
            throw new Error("ConcurrencyManager Error: minimun concurrent requests is 1");
        }
        var instance = {
            queue: [],
            running: [],
            interceptors: {
                request: null,
                response: null,
            },
            shiftInitial: function () {
                setTimeout(function () {
                    if (instance.running.length < limit) {
                        instance.shift();
                    }
                }, 0);
            },
            push: function (reqHandler) {
                instance.queue.push(reqHandler);
                instance.shiftInitial();
            },
            shift: function () {
                if (instance.queue.length) {
                    var queued = instance.queue.shift();
                    queued.resolver(queued.request);
                    instance.running.push(queued);
                }
            },
            // use as interceptor. Queue outgoing requests
            requestHandler: function (req) {
                return new Promise(function (resolve) {
                    instance.push({
                        request: req,
                        resolver: resolve,
                    });
                });
            },
            // use as interceptor. Execute queued request upon receiving a response
            responseHandler: function (res) {
                instance.running.shift();
                instance.shift();
                return res;
            },
            responseErrorHandler: function (res) {
                return Promise.reject(instance.responseHandler(res));
            },
            detach: function () {
                axios.interceptors.request.eject(instance.interceptors.request);
                axios.interceptors.response.eject(instance.interceptors.response);
            }
        };
        // queue concurrent requests
        instance.interceptors.request = axios.interceptors.request.use(instance.requestHandler);
        instance.interceptors.response = axios.interceptors.response.use(instance.responseHandler, instance.responseErrorHandler);
        return instance;
    };

    var defaultSerializeTransform = function (key, value) { return key + "=" + encodeURIComponent(value); };
    function querify(obj, prefix, serializer) {
        if (serializer === void 0) { serializer = defaultSerializeTransform; }
        var qs = [], prop;
        for (prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                var key = prefix ? prefix + "[" + prop + "]" : prop;
                var val = obj[prop];
                qs.push((val !== null && typeof val === "object")
                    ? querify(val, key)
                    : serializer(key, val));
            }
        }
        return qs.join('&');
    }

    /**
     * @module API
     */
    var __extends = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __assign$1 = (undefined && undefined.__assign) || function () {
        __assign$1 = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign$1.apply(this, arguments);
    };
    var APIError = /** @class */ (function (_super) {
        __extends(APIError, _super);
        function APIError(message, info) {
            var _newTarget = this.constructor;
            var _this = _super.call(this, message) || this;
            _this.message = message;
            _this.info = info;
            Object.setPrototypeOf(_this, _newTarget.prototype); // restore prototype chain
            return _this;
        }
        Object.defineProperty(APIError.prototype, "url", {
            get: function () {
                return this.info.url;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(APIError.prototype, "method", {
            get: function () {
                return this.info.method.toUpperCase();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(APIError.prototype, "code", {
            get: function () {
                return "" + (this.info.code || -1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(APIError.prototype, "params", {
            get: function () {
                return this.info.params || {};
            },
            enumerable: true,
            configurable: true
        });
        APIError.prototype.toString = function () {
            return [
                'Directus call failed:',
                this.method + " " + this.url + " " + JSON.stringify(this.params) + " -",
                this.message,
                "(code " + this.code + ")"
            ].join(' ');
        };
        return APIError;
    }(Error));
    /**
     * API definition for HTTP transactions
     * @uses Authentication
     * @uses axios
     * @author Jan Biasi <biasijan@gmail.com>
     */
    var API = /** @class */ (function () {
        function API(config) {
            this.config = config;
            var axiosOptions = {
                paramsSerializer: querify,
                timeout: 10 * 60 * 1000,
                withCredentials: false
            };
            if (config.mode === 'cookie') {
                axiosOptions.withCredentials = true;
            }
            this.xhr = axios.create(axiosOptions);
            this.auth = new Authentication(config, {
                post: this.post.bind(this),
                xhr: this.xhr
            });
            this.concurrent = concurrencyManager(this.xhr, 10);
        }
        /**
         * Resets the client instance by logging out and removing the URL and project
         */
        API.prototype.reset = function () {
            this.auth.logout();
            this.config.deleteHydratedConfig();
        };
        /// REQUEST METHODS ----------------------------------------------------------
        /**
         * GET convenience method. Calls the request method for you
         * @typeparam T   response type
         * @return {Promise<T>}
         */
        API.prototype.get = function (endpoint, params) {
            if (params === void 0) { params = {}; }
            return this.request("get", endpoint, params);
        };
        /**
         * POST convenience method. Calls the request method for you
         * @typeparam T   response type
         * @return {Promise<T>}
         */
        API.prototype.post = function (endpoint, body, params) {
            if (body === void 0) { body = {}; }
            if (params === void 0) { params = {}; }
            return this.request("post", endpoint, params, body);
        };
        /**
         * PATCH convenience method. Calls the request method for you
         * @typeparam T   response type
         * @return {Promise<T>}
         */
        API.prototype.patch = function (endpoint, body, params) {
            if (body === void 0) { body = {}; }
            if (params === void 0) { params = {}; }
            return this.request("patch", endpoint, params, body);
        };
        /**
         * PUT convenience method. Calls the request method for you
         * @typeparam T   response type
         * @return {Promise<T>}
         */
        API.prototype.put = function (endpoint, body, params) {
            if (body === void 0) { body = {}; }
            if (params === void 0) { params = {}; }
            return this.request("put", endpoint, params, body);
        };
        /**
         * DELETE convenience method. Calls the request method for you
         * @typeparam T   response type
         * @return {Promise<T>}
         */
        API.prototype.delete = function (endpoint) {
            return this.request("delete", endpoint);
        };
        /**
         * Gets the payload of the current token, return type can be generic
         * @typeparam T   extends object, payload type
         * @return {Promise<T>}
         */
        API.prototype.getPayload = function () {
            if (!isString(this.config.token)) {
                return null;
            }
            return getPayload(this.config.token);
        };
        /**
         * Perform an API request to the Directus API
         * @param {RequestMethod} method    Selected HTTP method
         * @param {string} endpoint         Endpoint definition as path
         * @param {object={}} params        Query parameters
         * @param {object={}} data          Data passed to directus
         * @param {boolean=false} noProject Do not include the `project` in the url (for system calls)
         * @param {object={}} headers       Optional headers to include
         * @param {boolean=false} skipParseToJSON  Whether to skip `JSON.parse` or not
         * @typeparam T                     Response type definition, defaults to `any`
         * @return {Promise<T>}
         */
        API.prototype.request = function (method, endpoint, params, data, noProject, headers, skipParseToJSON) {
            if (params === void 0) { params = {}; }
            if (data === void 0) { data = {}; }
            if (noProject === void 0) { noProject = false; }
            if (headers === void 0) { headers = {}; }
            if (skipParseToJSON === void 0) { skipParseToJSON = false; }
            if (!this.config.url) {
                throw new Error('SDK has no URL configured to send requests to, please check the docs.');
            }
            if (noProject === false && !this.config.project) {
                throw new Error('SDK has no project configured to send requests to, please check the docs.');
            }
            var baseURL = "" + this.config.url;
            if (baseURL.endsWith('/') === false)
                baseURL += '/';
            if (noProject === false) {
                baseURL += this.config.project + "/";
            }
            var requestOptions = {
                baseURL: baseURL,
                data: data,
                headers: headers,
                method: method,
                params: params,
                url: endpoint,
            };
            if (this.config.token && isString(this.config.token) && this.config.token.length > 0) {
                requestOptions.headers = headers;
                requestOptions.headers.Authorization = "Bearer " + this.config.token;
            }
            if (this.config.project) {
                requestOptions.headers['X-Directus-Project'] = this.config.project;
            }
            return this.xhr
                .request(requestOptions)
                .then(function (res) { return res.data; })
                .then(function (responseData) {
                if (!responseData || responseData.length === 0) {
                    return responseData;
                }
                if (typeof responseData !== "object") {
                    try {
                        return skipParseToJSON ? responseData : JSON.parse(responseData);
                    }
                    catch (error) {
                        throw {
                            data: responseData,
                            error: error,
                            json: true,
                        };
                    }
                }
                return responseData;
            })
                .catch(function (error) {
                var errorResponse = error
                    ? error.response || {}
                    : {};
                var errorResponseData = errorResponse.data || {};
                var baseErrorInfo = {
                    error: error,
                    url: requestOptions.url,
                    method: requestOptions.method,
                    params: requestOptions.params,
                    code: errorResponseData.error ? errorResponseData.error.code || error.code : -1
                };
                if (error.response) {
                    throw new APIError(errorResponseData.error.message || 'Unknown error occured', baseErrorInfo);
                }
                else if (error.response && error.response.json === true) {
                    throw new APIError("API returned invalid JSON", __assign$1({}, baseErrorInfo, { code: 422 }));
                }
                else {
                    throw new APIError("Network error", __assign$1({}, baseErrorInfo, { code: -1 }));
                }
            });
        };
        return API;
    }());

    /**
     * @module SDK
     */
    var __awaiter$1 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator$1 = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    /**
     * Main SDK implementation provides the public API to interact with a
     * remote directus instance.
     * @uses API
     * @uses Configuration
     */
    var SDK = /** @class */ (function () {
        // create a new instance with an API
        function SDK(options) {
            this.config = new Configuration(options);
            this.api = new API(this.config);
        }
        // #region authentication
        /**
         * Login to the API; Gets a new token from the API and stores it in this.api.token.
         */
        SDK.prototype.login = function (credentials, options) {
            return this.api.auth.login(credentials, options);
        };
        /**
         * Logs the user out by "forgetting" the token, and clearing the refresh interval
         */
        SDK.prototype.logout = function () {
            return this.api.auth.logout();
        };
        /**
         * Resets the client instance by logging out and removing the URL and project
         */
        SDK.prototype.reset = function () {
            this.api.reset();
        };
        /**
         * Refresh the token if it is about to expire (within 30 seconds of expiry date).
         * - Calls onAutoRefreshSuccess with the new token if the refreshing is successful.
         * - Calls onAutoRefreshError if refreshing the token fails for some reason.
         * @returns {[boolean, Error?]}
         */
        SDK.prototype.refreshIfNeeded = function () {
            return this.api.auth.refreshIfNeeded();
        };
        /**
         * Use the passed token to request a new one
         */
        SDK.prototype.refresh = function (token) {
            return this.api.auth.refresh(token);
        };
        /**
         * Request to reset the password of the user with the given email address.
         * The API will send an email to the given email address with a link to generate a new
         * temporary password.
         */
        SDK.prototype.requestPasswordReset = function (email) {
            return this.api.post("/auth/password/request", {
                email: email,
            });
        };
        // #endregion authentication
        // #endregion collection presets
        // #region activity
        /**
         * Get activity
         */
        SDK.prototype.getActivity = function (params) {
            if (params === void 0) { params = {}; }
            return this.api.get("/activity", params);
        };
        // #endregion activity
        // #region bookmarks
        /**
         * Get the bookmarks of the current user
         * @deprecated Will be removed in the next major version, please use {@link SDK.getCollectionPresets} instead
         * @see https://docs.directus.io/advanced/legacy-upgrades.html#directus-bookmarks
         */
        SDK.prototype.getMyBookmarks = function (params) {
            if (params === void 0) { params = {}; }
            return this.getCollectionPresets(params);
        };
        // #endregion bookmarks
        // #region collections
        /**
         * Get all available collections
         */
        SDK.prototype.getCollections = function (params) {
            if (params === void 0) { params = {}; }
            return this.api.get("/collections", params);
        };
        /**
         * Get collection info by name
         */
        SDK.prototype.getCollection = function (collection, params) {
            if (params === void 0) { params = {}; }
            return this.api.get("/collections/" + collection, params);
        };
        /**
         * Create a collection
         */
        SDK.prototype.createCollection = function (data) {
            return this.api.post("/collections", data);
        };
        /**
         * Updates a certain collection
         */
        SDK.prototype.updateCollection = function (collection, data) {
            return this.api.patch("/collections/" + collection, data);
        };
        /**
         * Deletes a certain collection
         */
        SDK.prototype.deleteCollection = function (collection) {
            return this.api.delete("/collections/" + collection);
        };
        // #endregion collections
        // #region collection presets
        /**
         * Get the collection presets of the current user
         * @see https://docs.directus.io/api/reference.html#collection-presets
         */
        SDK.prototype.getCollectionPresets = function (params) {
            return __awaiter$1(this, void 0, void 0, function () {
                var user, id, role;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getMe({ fields: "*.*" })];
                        case 1:
                            user = (_a.sent()).data;
                            id = user.id;
                            role = user.role.id;
                            return [2 /*return*/, Promise.all([
                                    this.api.get("/collection_presets", {
                                        "filter[title][nnull]": 1,
                                        "filter[user][eq]": id,
                                    }),
                                    this.api.get("/collection_presets", {
                                        "filter[role][eq]": role,
                                        "filter[title][nnull]": 1,
                                        "filter[user][null]": 1,
                                    }),
                                    this.api.get("/collection_presets", {
                                        "filter[role][null]": 1,
                                        "filter[title][nnull]": 1,
                                        "filter[user][null]": 1,
                                    })
                                ]).then(function (values) {
                                    var user = values[0], role = values[1], globalBookmarks = values[2];
                                    return (user.data || []).concat((role.data || []), (globalBookmarks.data || []));
                                })];
                    }
                });
            });
        };
        /**
         * Create a new collection preset (bookmark / listing preferences)
         * @see https://docs.directus.io/api/reference.html#collection-presets
         */
        SDK.prototype.createCollectionPreset = function (data) {
            return this.api.post("/collection_presets", data);
        };
        /**
         * Update collection preset (bookmark / listing preference)
         * @see https://docs.directus.io/api/reference.html#collection-presets
         */
        // tslint:disable-next-line: max-line-length
        SDK.prototype.updateCollectionPreset = function (primaryKey, data) {
            return this.api.patch("/collection_presets/" + primaryKey, data);
        };
        /**
         * Delete collection preset by primarykey
         * @see https://docs.directus.io/api/reference.html#collection-presets
         */
        SDK.prototype.deleteCollectionPreset = function (primaryKey) {
            return this.api.delete("/collection_presets/" + primaryKey);
        };
        // #endregion collection presets
        // #region extensions
        /**
         * Get the information of all installed interfaces
         * @see https://docs.directus.io/api/reference.html#get-extensions
         */
        SDK.prototype.getInterfaces = function () {
            return this.api.request("get", "/interfaces", {}, {}, true);
        };
        /**
         * Get the information of all installed layouts
         * @see https://docs.directus.io/api/reference.html#get-extensions
         */
        SDK.prototype.getLayouts = function () {
            return this.api.request("get", "/layouts", {}, {}, true);
        };
        /**
         * Get the information of all installed modules
         * @see https://docs.directus.io/api/reference.html#get-extensions
         */
        SDK.prototype.getModules = function () {
            return this.api.request("get", "/modules", {}, {}, true);
        };
        // #endregion extensions
        // #region fields
        /**
         * Get all fields that are in Directus
         * @see https://docs.directus.io/api/reference.html#fields-2
         */
        SDK.prototype.getAllFields = function (params) {
            if (params === void 0) { params = {}; }
            return this.api.get("/fields", params);
        };
        /**
         * Get the fields that have been setup for a given collection
         * @see https://docs.directus.io/api/reference.html#fields-2
         */
        SDK.prototype.getFields = function (collection, params) {
            if (params === void 0) { params = {}; }
            return this.api.get("/fields/" + collection, params);
        };
        /**
         * Get the field information for a single given field
         * @see https://docs.directus.io/api/reference.html#fields-2
         */
        SDK.prototype.getField = function (collection, fieldName, params) {
            if (params === void 0) { params = {}; }
            return this.api.get("/fields/" + collection + "/" + fieldName, params);
        };
        /**
         * Create a field in the given collection
         * @see https://docs.directus.io/api/reference.html#fields-2
         */
        SDK.prototype.createField = function (collection, fieldInfo) {
            return this.api.post("/fields/" + collection, fieldInfo);
        };
        /**
         * Update a given field in a given collection
         * @see https://docs.directus.io/api/reference.html#fields-2
         */
        SDK.prototype.updateField = function (collection, fieldName, fieldInfo) {
            return this.api.patch("/fields/" + collection + "/" + fieldName, fieldInfo);
        };
        SDK.prototype.updateFields = function (collection, fieldsInfoOrFieldNames, fieldInfo) {
            if (fieldInfo === void 0) { fieldInfo = null; }
            if (fieldInfo) {
                return this.api.patch("/fields/" + collection + "/" + fieldsInfoOrFieldNames.join(","), fieldInfo);
            }
            return this.api.patch("/fields/" + collection, fieldsInfoOrFieldNames);
        };
        /**
         * Delete a field from a collection
         * @see @see https://docs.directus.io/api/reference.html#fields-2
         */
        SDK.prototype.deleteField = function (collection, fieldName) {
            return this.api.delete("/fields/" + collection + "/" + fieldName);
        };
        // #endregion fields
        // #region files
        /**
         * Get a list of available files from Directus
         * @see https://docs.directus.io/api/reference.html#files
         */
        SDK.prototype.getFiles = function (params) {
            if (params === void 0) { params = {}; }
            return __awaiter$1(this, void 0, void 0, function () {
                return __generator$1(this, function (_a) {
                    return [2 /*return*/, this.api.get("/files", params)];
                });
            });
        };
        /**
         * Get a certain file or certain file list from Directus
         * @see https://docs.directus.io/api/reference.html#files
         */
        SDK.prototype.getFile = function (fileName, params) {
            if (params === void 0) { params = {}; }
            return __awaiter$1(this, void 0, void 0, function () {
                var files;
                return __generator$1(this, function (_a) {
                    files = typeof fileName === "string" ? fileName : fileName.join(",");
                    return [2 /*return*/, this.api.get("/files/" + files, params)];
                });
            });
        };
        /**
         * Upload multipart files in multipart/form-data
         * @see https://docs.directus.io/api/reference.html#files
         */
        SDK.prototype.uploadFiles = function (data, // TODO: fix type definition
        onUploadProgress) {
            if (onUploadProgress === void 0) { onUploadProgress = function () { return ({}); }; }
            var headers = {
                "Content-Type": "multipart/form-data",
                "X-Directus-Project": this.config.project
            };
            if (this.config.token && isString(this.config.token) && this.config.token.length > 0) {
                headers['Authorization'] = "Bearer " + this.config.token;
            }
            return this.api.xhr
                .post("" + this.config.url + this.config.project + "/files", data, {
                headers: headers,
                onUploadProgress: onUploadProgress,
            });
        };
        // #endregion files
        // #region items
        /**
         * Update an existing item
         * @see https://docs.directus.io/api/reference.html#update-item
         * @typeparam TTPartialItem Defining the item type in object schema
         * @typeparam TTResult Extension of [TPartialItem] as expected result
         */
        SDK.prototype.updateItem = function (collection, primaryKey, body, params) {
            if (params === void 0) { params = {}; }
            var collectionBasePath = getCollectionItemPath(collection);
            return this.api.patch(collectionBasePath + "/" + primaryKey, body, params);
        };
        /**
         * Update multiple items
         * @see https://docs.directus.io/api/reference.html#update-items
         * @typeparam TPartialItem Defining an array of items, each in object schema
         * @typeparam TResult Extension of [TPartialItem] as expected result
         * @return {Promise<IItemsResponse<TPartialItem & TResult>>}
         */
        SDK.prototype.updateItems = function (collection, body, params) {
            if (params === void 0) { params = {}; }
            var collectionBasePath = getCollectionItemPath(collection);
            return this.api.patch(collectionBasePath, body, params);
        };
        /**
         * Create a new item
         * @typeparam TItemType Defining an item and its fields in object schema
         * @return {Promise<IItemsResponse<TItemType>>}
         */
        SDK.prototype.createItem = function (collection, body) {
            var collectionBasePath = getCollectionItemPath(collection);
            return this.api.post(collectionBasePath, body);
        };
        /**
         * Create multiple items
         * @see https://docs.directus.io/api/reference.html#create-items
         * @typeparam TItemsType Defining an array of items, each in object schema
         */
        SDK.prototype.createItems = function (collection, body) {
            var collectionBasePath = getCollectionItemPath(collection);
            return this.api.post(collectionBasePath, body);
        };
        /**
         * Get items from a given collection
         * @see https://docs.directus.io/api/reference.html#get-multiple-items
         * @typeparam TItemsType Defining an array of items, each in object schema
         */
        SDK.prototype.getItems = function (collection, params) {
            if (params === void 0) { params = {}; }
            var collectionBasePath = getCollectionItemPath(collection);
            return this.api.get(collectionBasePath, params);
        };
        /**
         * Get a single item by primary key
         * @see https://docs.directus.io/api/reference.html#get-item
         * @typeparam TItemType Defining fields of an item in object schema
         */
        SDK.prototype.getItem = function (collection, primaryKey, params) {
            if (params === void 0) { params = {}; }
            var collectionBasePath = getCollectionItemPath(collection);
            return this.api.get(collectionBasePath + "/" + primaryKey, params);
        };
        /**
         * Delete a single item by primary key
         * @see https://docs.directus.io/api/reference.html#delete-items
         */
        SDK.prototype.deleteItem = function (collection, primaryKey) {
            var collectionBasePath = getCollectionItemPath(collection);
            return this.api.delete(collectionBasePath + "/" + primaryKey);
        };
        /**
         * Delete multiple items by primary key
         * @see https://docs.directus.io/api/reference.html#delete-items
         */
        SDK.prototype.deleteItems = function (collection, primaryKeys) {
            var collectionBasePath = getCollectionItemPath(collection);
            return this.api.delete(collectionBasePath + "/" + primaryKeys.join());
        };
        // #endregion items
        // #region listing preferences
        /**
         * Get the collection presets of the current user for a single collection
         */
        SDK.prototype.getMyListingPreferences = function (collection, params) {
            return __awaiter$1(this, void 0, void 0, function () {
                var user, id, role;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getMe({ fields: "*.*" })];
                        case 1:
                            user = (_a.sent()).data;
                            id = user.id;
                            role = user.role.id;
                            return [2 /*return*/, Promise.all([
                                    this.api.get("/collection_presets", {
                                        "filter[collection][eq]": collection,
                                        "filter[role][null]": 1,
                                        "filter[title][null]": 1,
                                        "filter[user][null]": 1,
                                        limit: 1,
                                        sort: "-id",
                                    }),
                                    this.api.get("/collection_presets", {
                                        "filter[collection][eq]": collection,
                                        "filter[role][eq]": role,
                                        "filter[title][null]": 1,
                                        "filter[user][null]": 1,
                                        limit: 1,
                                        sort: "-id",
                                    }),
                                    this.api.get("/collection_presets", {
                                        "filter[collection][eq]": collection,
                                        "filter[title][null]": 1,
                                        "filter[user][eq]": id,
                                        limit: 1,
                                        sort: "-id",
                                    }),
                                ]).then(function (values) {
                                    var col = values[0], role = values[1], user = values[2];
                                    if (user.data && user.data.length > 0) {
                                        return user.data[0];
                                    }
                                    if (role.data && role.data.length > 0) {
                                        return role.data[0];
                                    }
                                    if (col.data && col.data.length > 0) {
                                        return col.data[0];
                                    }
                                    return {};
                                })];
                    }
                });
            });
        };
        // #endregion listing preferences
        // #region permissions
        /**
         * Get permissions
         * @param {QueryParamsType?} params
         * @return {Promise<IPermission>}
         */
        SDK.prototype.getPermissions = function (params) {
            if (params === void 0) { params = {}; }
            return this.getItems("directus_permissions", params);
        };
        /**
         * TODO: Fix type-def for return
         * Get the currently logged in user's permissions
         * @typeparam TResponse Permissions type as array extending any[]
         */
        SDK.prototype.getMyPermissions = function (params) {
            if (params === void 0) { params = {}; }
            return this.api.get("/permissions/me", params);
        };
        /**
         * TODO: Fix type-def for param and return
         * Create multiple new permissions
         * @typeparam TResponse Permissions type as array extending any[]
         */
        SDK.prototype.createPermissions = function (data) {
            return this.api.post("/permissions", data);
        };
        /**
         * TODO: Fix type-def for param and return
         * Update multiple permission records
         * @typeparam TResponse Permissions type as array extending any[]
         */
        SDK.prototype.updatePermissions = function (data) {
            return this.api.patch("/permissions", data);
        };
        // #endregion permissions
        // #region relations
        /**
         * Get all relationships
         * @param {QueryParamsType?} params
         * @return {Promise<IRelationsResponse>}
         */
        SDK.prototype.getRelations = function (params) {
            if (params === void 0) { params = {}; }
            return this.api.get("/relations", params);
        };
        /**
         * Creates new relation
         * @param {IRelation} data
         * @return {Promise<IRelationResponse>}
         */
        SDK.prototype.createRelation = function (data) {
            return this.api.post("/relations", data);
        };
        /**
         * Updates existing relation
         */
        SDK.prototype.updateRelation = function (primaryKey, data) {
            return this.api.patch("/relations/" + primaryKey, data);
        };
        /**
         * TODO: Add type-def for return value(s)
         * Get the relationship information for the given collection
         */
        SDK.prototype.getCollectionRelations = function (collection, params) {
            return Promise.all([
                this.api.get("/relations", {
                    "filter[collection_a][eq]": collection,
                }),
                this.api.get("/relations", {
                    "filter[collection_b][eq]": collection,
                }),
            ]);
        };
        // #endregion relations
        // #region revisions
        /**
         * Get a single item's revisions by primary key
         * @typeparam DataAndDelta  The data including delta type for the revision
         * @param {string} collection
         * @param {PrimaryKeyType} primaryKey
         * @param {QueryParamsType?} params
         */
        SDK.prototype.getItemRevisions = function (collection, primaryKey, params) {
            if (params === void 0) { params = {}; }
            var collectionBasePath = getCollectionItemPath(collection);
            return this.api.get(collectionBasePath + "/" + primaryKey + "/revisions", params);
        };
        /**
         * Revert an item to a previous state
         * @param {string} collection
         * @param {PrimaryKeyType} primaryKey
         * @param {number} revisionID
         */
        SDK.prototype.revert = function (collection, primaryKey, revisionID) {
            var collectionBasePath = getCollectionItemPath(collection);
            return this.api.patch(collectionBasePath + "/" + primaryKey + "/revert/" + revisionID);
        };
        // #endregion revisions
        // #region roles
        /**
         * Get a single user role
         * @param {PrimaryKeyType} primaryKey
         * @param {QueryParamsType?} params
         */
        SDK.prototype.getRole = function (primaryKey, params) {
            if (params === void 0) { params = {}; }
            return this.api.get("/roles/" + primaryKey, params);
        };
        /**
         * Get the user roles
         * @param {QueryParamsType?} params
         */
        SDK.prototype.getRoles = function (params) {
            if (params === void 0) { params = {}; }
            return this.api.get("/roles", params);
        };
        /**
         * Update a user role
         * @param {PrimaryKeyType} primaryKey
         * @param {Role} body
         */
        SDK.prototype.updateRole = function (primaryKey, body) {
            return this.updateItem("directus_roles", primaryKey, body);
        };
        /**
         * Create a new user role
         * @param {Role} body
         */
        SDK.prototype.createRole = function (body) {
            return this.createItem("directus_roles", body);
        };
        /**
         * Delete a user rol by primary key
         * @param {PrimaryKeyType} primaryKey
         */
        SDK.prototype.deleteRole = function (primaryKey) {
            return this.deleteItem("directus_roles", primaryKey);
        };
        // #endregion roles
        // #region settings
        /**
         * Get Directus' global settings
         * @param {QueryParamsType?} params
         */
        SDK.prototype.getSettings = function (params) {
            if (params === void 0) { params = {}; }
            return this.api.get("/settings", params);
        };
        /**
         * Get the "fields" for directus_settings
         * @param {QueryParamsType?} params
         */
        SDK.prototype.getSettingsFields = function (params) {
            if (params === void 0) { params = {}; }
            return this.api.get("/settings/fields", params);
        };
        // #endregion settings
        // #region users
        /**
         * Get a list of available users in Directus
         * @param {QueryParamsType?} params
         */
        SDK.prototype.getUsers = function (params) {
            if (params === void 0) { params = {}; }
            return this.api.get("/users", params);
        };
        /**
         * Get a single Directus user
         * @param {PrimaryKeyType} primaryKey
         * @param {QueryParamsType?} params
         */
        SDK.prototype.getUser = function (primaryKey, params) {
            if (params === void 0) { params = {}; }
            return this.api.get("/users/" + primaryKey, params);
        };
        /**
         * Get the user info of the currently logged in user
         * @param {QueryParamsType?} params
         */
        SDK.prototype.getMe = function (params) {
            if (params === void 0) { params = {}; }
            return this.api.get("/users/me", params);
        };
        /**
         * Update a single user based on primaryKey
         * @param {PrimaryKeyType} primaryKey
         * @param {QueryParamsType?} params
         */
        SDK.prototype.updateUser = function (primaryKey, body) {
            return this.updateItem("directus_users", primaryKey, body);
        };
        // #endregion users
        // #region server admin
        /**
         * This will update the database of the API instance to the latest version
         * using the migrations in the API
         * @return {Promise<void>}
         */
        SDK.prototype.updateDatabase = function () {
            return this.api.post("/update");
        };
        /**
         * Ping the API to check if it exists / is up and running, returns "pong"
         * @return {Promise<string>}
         */
        SDK.prototype.ping = function () {
            return this.api.request("get", "/server/ping", {}, {}, true, {}, true);
        };
        /**
         * Get the server info from the API
         * @return {Promise<IServerInformationResponse>}
         */
        SDK.prototype.serverInfo = function () {
            return this.api.request("get", "/", {}, {}, true);
        };
        /**
         * TODO: Add response type-def
         * Get the server info from the project
         * @return {Promise<any>}
         */
        SDK.prototype.projectInfo = function () {
            return this.api.request("get", "/");
        };
        /**
         * TODO: Add response type-def
         * Get all the setup third party auth providers
         * @return {Promise<any>}
         */
        SDK.prototype.getThirdPartyAuthProviders = function () {
            return this.api.get("/auth/sso");
        };
        /**
         * Do a test call to check if you're logged in
         * @return {Promise<boolean>}
         */
        SDK.prototype.isLoggedIn = function () {
            var _this = this;
            return new Promise(function (resolve) {
                _this.api.get('/')
                    .then(function (res) {
                    if (res.public === undefined) {
                        return resolve(true);
                    }
                    else {
                        return resolve(false);
                    }
                })
                    .catch(function () { return resolve(false); });
            });
        };
        return SDK;
    }());

    /**
     * @module exports
     */

    exports.Configuration = Configuration;
    exports.SDK = SDK;
    exports.concurrencyManager = concurrencyManager;
    exports.default = SDK;
    exports.getCollectionItemPath = getCollectionItemPath;
    exports.getPayload = getPayload;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=directus-sdk.js.map
