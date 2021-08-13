"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = require("path");

var _events = _interopRequireDefault(require("events"));

var _lodash = _interopRequireDefault(require("lodash.defaultsdeep"));

var _grpcJs = require("@grpc/grpc-js");

var _protoLoader = require("@grpc/proto-loader");

var _javascriptStateMachine = _interopRequireDefault(require("javascript-state-machine"));

var _debug = _interopRequireDefault(require("debug"));

var _utils = require("./utils");

var _registry = _interopRequireDefault(require("./registry"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

const DEFAULT_OPTIONS = {
  grpcOptions: _utils.grpcOptions,
  // Disable message size size enforcement.
  connectionOptions: {
    'grpc.max_send_message_length': -1,
    'grpc.max_receive_message_length': -1,
    'grpc.keepalive_permit_without_calls': 1
  }
};
/**
 * Base class for lnd gRPC services.
 * @extends EventEmitter
 */

let Service = /*#__PURE__*/function (_EventEmitter) {
  _inherits(Service, _EventEmitter);

  var _super = _createSuper(Service);

  function Service(serviceName, options) {
    var _this;

    _classCallCheck(this, Service);

    _this = _super.call(this);
    _this.serviceName = serviceName;
    _this.fsm = new _javascriptStateMachine.default({
      init: 'ready',
      transitions: [{
        name: 'connect',
        from: 'ready',
        to: 'connected'
      }, {
        name: 'disconnect',
        from: 'connected',
        to: 'ready'
      }],
      methods: {
        onBeforeConnect: _this.onBeforeConnect.bind(_assertThisInitialized(_this)),
        onAfterConnect: _this.onAfterConnect.bind(_assertThisInitialized(_this)),
        onBeforeDisconnect: _this.onBeforeDisconnect.bind(_assertThisInitialized(_this)),
        onAfterDisconnect: _this.onAfterDisconnect.bind(_assertThisInitialized(_this)),
        onInvalidTransition: _utils.onInvalidTransition,
        onPendingTransition: _utils.onPendingTransition
      }
    });
    _this.useMacaroon = true;
    _this.service = null;
    _this.options = (0, _lodash.default)(options, DEFAULT_OPTIONS);
    _this.debug = (0, _debug.default)(`lnrpc:service:${_this.serviceName}`);
    return _this;
  } // ------------------------------------
  // FSM Proxies
  // ------------------------------------


  _createClass(Service, [{
    key: "is",
    value: function is(...args) {
      return this.fsm.is(...args);
    }
  }, {
    key: "can",
    value: function can(...args) {
      return this.fsm.can(...args);
    }
  }, {
    key: "observe",
    value: function observe(...args) {
      return this.fsm.observe(...args);
    }
  }, {
    key: "state",
    get: function () {
      return this.fsm.state;
    }
  }, {
    key: "connect",
    value: function connect(...args) {
      return this.fsm.connect(...args);
    }
  }, {
    key: "disconnect",
    value: function disconnect(...args) {
      return this.fsm.disconnect(...args);
    } // ------------------------------------
    // FSM Callbacks
    // ------------------------------------

    /**
     * Connect to the gRPC interface.
     */

  }, {
    key: "onBeforeConnect",
    value: async function onBeforeConnect(lifecycle, options) {
      this.debug(`Connecting to ${this.serviceName} gRPC service`);
      await (0, _utils.promiseTimeout)(_utils.SERVICE_CONNECT_TIMEOUT * 1000, this.establishConnection(options), 'Connection timeout out.');
    }
    /**
     * Log successful connection.
     */

  }, {
    key: "onAfterConnect",
    value: function onAfterConnect() {
      this.debug(`Connected to ${this.serviceName} gRPC service`);
    }
    /**
     * Disconnect from the gRPC service.
     */

  }, {
    key: "onBeforeDisconnect",
    value: async function onBeforeDisconnect() {
      this.debug(`Disconnecting from ${this.serviceName} gRPC service`);

      if (this.service) {
        this.service.close();
      }
    }
    /**
     * Log successful disconnect.
     */

  }, {
    key: "onAfterDisconnect",
    value: function onAfterDisconnect() {
      this.debug(`Disconnected from ${this.serviceName} gRPC service`);
    } // ------------------------------------
    // Helpers
    // ------------------------------------

    /**
     * Establish a connection to the Lightning interface.
     */

  }, {
    key: "establishConnection",
    value: async function establishConnection(options = {}) {
      const opts = (0, _lodash.default)(options, this.options);
      const host = opts.host,
            cert = opts.cert,
            macaroon = opts.macaroon,
            protoDir = opts.protoDir,
            waitForCert = opts.waitForCert,
            waitForMacaroon = opts.waitForMacaroon,
            grpcOptions = opts.grpcOptions,
            connectionOptions = opts.connectionOptions,
            version = opts.version;

      try {
        // Find the most recent proto file for this service if a specific version was not requested.
        this.version = version || this.version || (0, _utils.getLatestProtoVersion)();

        const serviceDefinition = _registry.default[this.version].services.find(s => s.name === this.serviceName);

        const _serviceDefinition$pr = serviceDefinition.proto.split('/'),
              _serviceDefinition$pr2 = _slicedToArray(_serviceDefinition$pr, 2),
              protoPackage = _serviceDefinition$pr2[0],
              protoFile = _serviceDefinition$pr2[1];

        const filepath = (0, _path.join)(protoDir || (0, _utils.getProtoDir)(), this.version, protoPackage, protoFile);
        this.debug(`Establishing gRPC connection to ${this.serviceName} with proto file %s and connection options %o`, filepath, connectionOptions); // Load gRPC package definition as a gRPC object hierarchy.

        const packageDefinition = await (0, _protoLoader.load)(filepath, grpcOptions);
        const rpc = (0, _grpcJs.loadPackageDefinition)(packageDefinition); // Wait for the cert to exist (this can take some time immediately after starting lnd).

        if (waitForCert) {
          const waitTime = Number.isFinite(waitForCert) ? waitForCert : _utils.FILE_WAIT_TIMEOUT;
          await (0, _utils.waitForFile)(cert, waitTime);
        } // Create ssl credentials to use with the gRPC client.


        let creds = await (0, _utils.createSslCreds)(cert); // Add macaroon to credentials if service requires macaroons.

        if (this.useMacaroon && macaroon) {
          // Wait for the macaroon to exist (this can take some time immediately after Initializing a wallet).
          if (waitForMacaroon) {
            const waitTime = Number.isFinite(waitForMacaroon) ? waitForMacaroon : _utils.FILE_WAIT_TIMEOUT;
            await (0, _utils.waitForFile)(macaroon, waitTime);
          }

          const macaroonCreds = await (0, _utils.createMacaroonCreds)(macaroon);
          creds = _grpcJs.credentials.combineChannelCredentials(creds, macaroonCreds);
        } // Create a new gRPC client instance.


        const rpcService = rpc[protoPackage][this.serviceName];
        this.service = new rpcService(host, creds, connectionOptions); // Wait up to CONNECT_WAIT_TIMEOUT seconds for the gRPC connection to be established.

        const timeeout = (0, _utils.isTor)(host) ? _utils.CONNECT_WAIT_TIMEOUT_TOR : _utils.CONNECT_WAIT_TIMEOUT;
        await (0, _utils.promisifiedCall)(this.service, this.service.waitForReady, (0, _utils.getDeadline)(timeeout)); // Set up helper methods to proxy service methods.

        this.wrapAsync(rpcService.service);
      } catch (e) {
        this.debug(`Unable to connect to ${this.serviceName} service`, e);

        if (this.service) {
          this.service.close();
        }

        throw e;
      }
    }
  }, {
    key: "waitForCall",
    value: async function waitForCall(method, args) {
      this.debug('Attempting to call %s.%s with args %o (will keep trying to up to %s seconds)', this.serviceName, method, args, _utils.PROBE_TIMEOUT);
      const deadline = (0, _utils.getDeadline)(_utils.PROBE_TIMEOUT);

      const checkState = async err => {
        let now = new Date().getTime();
        const isExpired = now > deadline;

        if (err && isExpired) {
          throw err;
        }

        try {
          return await this[method](args);
        } catch (error) {
          if (error.code === _grpcJs.status.UNAVAILABLE) {
            await (0, _utils.delay)(_utils.PROBE_RETRY_INTERVAL);
            return checkState(error);
          }

          throw error;
        }
      };

      return await checkState();
    }
    /**
     * Add promisified helper methods for each method in the gRPC service.
     * Inspiration from https://github.com/altangent/lnd-async
     * @param {Object} service service description used to extract apply method details
     */

  }, {
    key: "wrapAsync",
    value: function wrapAsync(service) {
      Object.values(service).forEach(method => {
        const originalName = method.originalName; // Do not override existing methods.

        if (this[originalName]) {
          return;
        } // If this method is a stream, bind it to the service instance as is.


        if (method.requestStream || method.responseStream) {
          this[originalName] = (payload = {}, options = {}) => {
            this.debug(`Calling ${this.serviceName}.${originalName} sync with: %o`, {
              payload,
              options
            });
            return this.service[originalName].bind(this.service).call(this.service, payload, options);
          };
        } // Otherwise, promisify and bind to the service instance.
        else {
            this[originalName] = (payload = {}, options = {}) => {
              this.debug(`Calling ${this.serviceName}.${originalName} async with: %o`, {
                payload,
                options
              });
              return (0, _utils.promisifiedCall)(this.service, this.service[originalName], payload, options);
            };
          }
      });
    }
  }]);

  return Service;
}(_events.default);

var _default = Service;
exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zZXJ2aWNlLmpzIl0sIm5hbWVzIjpbIkRFRkFVTFRfT1BUSU9OUyIsImdycGNPcHRpb25zIiwiY29ubmVjdGlvbk9wdGlvbnMiLCJTZXJ2aWNlIiwic2VydmljZU5hbWUiLCJvcHRpb25zIiwiZnNtIiwiU3RhdGVNYWNoaW5lIiwiaW5pdCIsInRyYW5zaXRpb25zIiwibmFtZSIsImZyb20iLCJ0byIsIm1ldGhvZHMiLCJvbkJlZm9yZUNvbm5lY3QiLCJiaW5kIiwib25BZnRlckNvbm5lY3QiLCJvbkJlZm9yZURpc2Nvbm5lY3QiLCJvbkFmdGVyRGlzY29ubmVjdCIsIm9uSW52YWxpZFRyYW5zaXRpb24iLCJvblBlbmRpbmdUcmFuc2l0aW9uIiwidXNlTWFjYXJvb24iLCJzZXJ2aWNlIiwiZGVidWciLCJhcmdzIiwiaXMiLCJjYW4iLCJvYnNlcnZlIiwic3RhdGUiLCJjb25uZWN0IiwiZGlzY29ubmVjdCIsImxpZmVjeWNsZSIsIlNFUlZJQ0VfQ09OTkVDVF9USU1FT1VUIiwiZXN0YWJsaXNoQ29ubmVjdGlvbiIsImNsb3NlIiwib3B0cyIsImhvc3QiLCJjZXJ0IiwibWFjYXJvb24iLCJwcm90b0RpciIsIndhaXRGb3JDZXJ0Iiwid2FpdEZvck1hY2Fyb29uIiwidmVyc2lvbiIsInNlcnZpY2VEZWZpbml0aW9uIiwicmVnaXN0cnkiLCJzZXJ2aWNlcyIsImZpbmQiLCJzIiwicHJvdG8iLCJzcGxpdCIsInByb3RvUGFja2FnZSIsInByb3RvRmlsZSIsImZpbGVwYXRoIiwicGFja2FnZURlZmluaXRpb24iLCJycGMiLCJ3YWl0VGltZSIsIk51bWJlciIsImlzRmluaXRlIiwiRklMRV9XQUlUX1RJTUVPVVQiLCJjcmVkcyIsIm1hY2Fyb29uQ3JlZHMiLCJjcmVkZW50aWFscyIsImNvbWJpbmVDaGFubmVsQ3JlZGVudGlhbHMiLCJycGNTZXJ2aWNlIiwidGltZWVvdXQiLCJDT05ORUNUX1dBSVRfVElNRU9VVF9UT1IiLCJDT05ORUNUX1dBSVRfVElNRU9VVCIsIndhaXRGb3JSZWFkeSIsIndyYXBBc3luYyIsImUiLCJtZXRob2QiLCJQUk9CRV9USU1FT1VUIiwiZGVhZGxpbmUiLCJjaGVja1N0YXRlIiwiZXJyIiwibm93IiwiRGF0ZSIsImdldFRpbWUiLCJpc0V4cGlyZWQiLCJlcnJvciIsImNvZGUiLCJzdGF0dXMiLCJVTkFWQUlMQUJMRSIsIlBST0JFX1JFVFJZX0lOVEVSVkFMIiwiT2JqZWN0IiwidmFsdWVzIiwiZm9yRWFjaCIsIm9yaWdpbmFsTmFtZSIsInJlcXVlc3RTdHJlYW0iLCJyZXNwb25zZVN0cmVhbSIsInBheWxvYWQiLCJjYWxsIiwiRXZlbnRFbWl0dGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBcUJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxNQUFNQSxlQUFlLEdBQUc7QUFDdEJDLEVBQUFBLFdBQVcsRUFBWEEsa0JBRHNCO0FBRXRCO0FBQ0FDLEVBQUFBLGlCQUFpQixFQUFFO0FBQ2pCLG9DQUFnQyxDQUFDLENBRGhCO0FBRWpCLHVDQUFtQyxDQUFDLENBRm5CO0FBR2pCLDJDQUF1QztBQUh0QjtBQUhHLENBQXhCO0FBVUE7QUFDQTtBQUNBO0FBQ0E7O0lBQ01DLE87Ozs7O0FBQ0osbUJBQVlDLFdBQVosRUFBeUJDLE9BQXpCLEVBQWtDO0FBQUE7O0FBQUE7O0FBQ2hDO0FBQ0EsVUFBS0QsV0FBTCxHQUFtQkEsV0FBbkI7QUFFQSxVQUFLRSxHQUFMLEdBQVcsSUFBSUMsK0JBQUosQ0FBaUI7QUFDMUJDLE1BQUFBLElBQUksRUFBRSxPQURvQjtBQUUxQkMsTUFBQUEsV0FBVyxFQUFFLENBQ1g7QUFBRUMsUUFBQUEsSUFBSSxFQUFFLFNBQVI7QUFBbUJDLFFBQUFBLElBQUksRUFBRSxPQUF6QjtBQUFrQ0MsUUFBQUEsRUFBRSxFQUFFO0FBQXRDLE9BRFcsRUFFWDtBQUFFRixRQUFBQSxJQUFJLEVBQUUsWUFBUjtB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ekYsTyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJ1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICdldmVudHMnXG5pbXBvcnQgZGVmYXVsdHNEZWVwIGZyb20gJ2xvZGFzaC5kZWZhdWx0c2RlZXAnXG5pbXBvcnQgeyBjcmVkZW50aWFscywgbG9hZFBhY2thZ2VEZWZpbml0aW9uLCBzdGF0dXMsIE1ldGFkYXRhIH0gZnJvbSAnQGdycGMvZ3JwYy1qcydcbmltcG9ydCB7IGxvYWQgfSBmcm9tICdAZ3JwYy9wcm90by1sb2FkZXInXG5pbXBvcnQgU3RhdGVNYWNoaW5lIGZyb20gJ2phdmFzY3JpcHQtc3RhdGUtbWFjaGluZSdcbmltcG9ydCBkZWJ1ZyBmcm9tICdkZWJ1ZydcbmltcG9ydCB7XG4gIGRlbGF5LFxuICBwcm9taXNpZmllZENhbGwsXG4gIHdhaXRGb3JGaWxlLFxuICBncnBjT3B0aW9ucyxcbiAgZ2V0RGVhZGxpbmUsXG4gIGNyZWF0ZVNzbENyZWRzLFxuICBjcmVhdGVNYWNhcm9vbkNyZWRzLFxuICBnZXRMYXRlc3RQcm90b1ZlcnNpb24sXG4gIGdldFByb3RvRGlyLFxuICBpc1RvcixcbiAgb25JbnZhbGlkVHJhbnNpdGlvbixcbiAgcHJvbWlzZVRpbWVvdXQsXG4gIG9uUGVuZGluZ1RyYW5zaXRpb24sXG4gIEZJTEVfV0FJVF9USU1FT1VULFxuICBTRVJWSUNFX0NPTk5FQ1RfVElNRU9VVCxcbiAgUFJPQkVfVElNRU9VVCxcbiAgUFJPQkVfUkVUUllfSU5URVJWQUwsXG4gIENPTk5FQ1RfV0FJVF9USU1FT1VULFxuICBDT05ORUNUX1dBSVRfVElNRU9VVF9UT1IsXG59IGZyb20gJy4vdXRpbHMnXG5pbXBvcnQgcmVnaXN0cnkgZnJvbSAnLi9yZWdpc3RyeSdcblxuY29uc3QgREVGQVVMVF9PUFRJT05TID0ge1xuICBncnBjT3B0aW9ucyxcbiAgLy8gRGlzYWJsZSBtZXNzYWdlIHNpemUgc2l6ZSBlbmZvcmNlbWVudC5cbiAgY29ubmVjdGlvbk9wdGlvbnM6IHtcbiAgICAnZ3JwYy5tYXhfc2VuZF9tZXNzYWdlX2xlbmd0aCc6IC0xLFxuICAgICdncnBjLm1heF9yZWNlaXZlX21lc3NhZ2VfbGVuZ3RoJzogLTEsXG4gICAgJ2dycGMua2VlcGFsaXZlX3Blcm1pdF93aXRob3V0X2NhbGxzJzogMSxcbiAgfSxcbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBsbmQgZ1JQQyBzZXJ2aWNlcy5cbiAqIEBleHRlbmRzIEV2ZW50RW1pdHRlclxuICovXG5jbGFzcyBTZXJ2aWNlIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3Ioc2VydmljZU5hbWUsIG9wdGlvbnMpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5zZXJ2aWNlTmFtZSA9IHNlcnZpY2VOYW1lXG5cbiAgICB0aGlzLmZzbSA9IG5ldyBTdGF0ZU1hY2hpbmUoe1xuICAgICAgaW5pdDogJ3JlYWR5JyxcbiAgICAgIHRyYW5zaXRpb25zOiBbXG4gICAgICAgIHsgbmFtZTogJ2Nvbm5lY3QnLCBmcm9tOiAncmVhZHknLCB0bzogJ2Nvbm5lY3RlZCcgfSxcbiAgICAgICAgeyBuYW1lOiAnZGlzY29ubmVjdCcsIGZyb206ICdjb25uZWN0ZWQnLCB0bzogJ3JlYWR5JyB9LFxuICAgICAgXSxcbiAgICAgIG1ldGhvZHM6IHtcbiAgICAgICAgb25CZWZvcmVDb25uZWN0OiB0aGlzLm9uQmVmb3JlQ29ubmVjdC5iaW5kKHRoaXMpLFxuICAgICAgICBvbkFmdGVyQ29ubmVjdDogdGhpcy5vbkFmdGVyQ29ubmVjdC5iaW5kKHRoaXMpLFxuICAgICAgICBvbkJlZm9yZURpc2Nvbm5lY3Q6IHRoaXMub25CZWZvcmVEaXNjb25uZWN0LmJpbmQodGhpcyksXG4gICAgICAgIG9uQWZ0ZXJEaXNjb25uZWN0OiB0aGlzLm9uQWZ0ZXJEaXNjb25uZWN0LmJpbmQodGhpcyksXG4gICAgICAgIG9uSW52YWxpZFRyYW5zaXRpb24sXG4gICAgICAgIG9uUGVuZGluZ1RyYW5zaXRpb24sXG4gICAgICB9LFxuICAgIH0pXG5cbiAgICB0aGlzLnVzZU1hY2Fyb29uID0gdHJ1ZVxuICAgIHRoaXMuc2VydmljZSA9IG51bGxcbiAgICB0aGlzLm9wdGlvbnMgPSBkZWZhdWx0c0RlZXAob3B0aW9ucywgREVGQVVMVF9PUFRJT05TKVxuICAgIHRoaXMuZGVidWcgPSBkZWJ1ZyhgbG5ycGM6c2VydmljZToke3RoaXMuc2VydmljZU5hbWV9YClcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBGU00gUHJveGllc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBpcyguLi5hcmdzKSB7XG4gICAgcmV0dXJuIHRoaXMuZnNtLmlzKC4uLmFyZ3MpXG4gIH1cbiAgY2FuKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5mc20uY2FuKC4uLmFyZ3MpXG4gIH1cbiAgb2JzZXJ2ZSguLi5hcmdzKSB7XG4gICAgcmV0dXJuIHRoaXMuZnNtLm9ic2VydmUoLi4uYXJncylcbiAgfVxuICBnZXQgc3RhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZnNtLnN0YXRlXG4gIH1cbiAgY29ubmVjdCguLi5hcmdzKSB7XG4gICAgcmV0dXJuIHRoaXMuZnNtLmNvbm5lY3QoLi4uYXJncylcbiAgfVxuICBkaXNjb25uZWN0KC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5mc20uZGlzY29ubmVjdCguLi5hcmdzKVxuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEZTTSBDYWxsYmFja3NcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIENvbm5lY3QgdG8gdGhlIGdSUEMgaW50ZXJmYWNlLlxuICAgKi9cbiAgYXN5bmMgb25CZWZvcmVDb25uZWN0KGxpZmVjeWNsZSwgb3B0aW9ucykge1xuICAgIHRoaXMuZGVidWcoYENvbm5lY3RpbmcgdG8gJHt0aGlzLnNlcnZpY2VOYW1lfSBnUlBDIHNlcnZpY2VgKVxuICAgIGF3YWl0IHByb21pc2VUaW1lb3V0KFNFUlZJQ0VfQ09OTkVDVF9USU1FT1VUICogMTAwMCwgdGhpcy5lc3RhYmxpc2hDb25uZWN0aW9uKG9wdGlvbnMpLCAnQ29ubmVjdGlvbiB0aW1lb3V0IG91dC4nKVxuICB9XG5cbiAgLyoqXG4gICAqIExvZyBzdWNjZXNzZnVsIGNvbm5lY3Rpb24uXG4gICAqL1xuICBvbkFmdGVyQ29ubmVjdCgpIHtcbiAgICB0aGlzLmRlYnVnKGBDb25uZWN0ZWQgdG8gJHt0aGlzLnNlcnZpY2VOYW1lfSBnUlBDIHNlcnZpY2VgKVxuICB9XG5cbiAgLyoqXG4gICAqIERpc2Nvbm5lY3QgZnJvbSB0aGUgZ1JQQyBzZXJ2aWNlLlxuICAgKi9cbiAgYXN5bmMgb25CZWZvcmVEaXNjb25uZWN0KCkge1xuICAgIHRoaXMuZGVidWcoYERpc2Nvbm5lY3RpbmcgZnJvbSAke3RoaXMuc2VydmljZU5hbWV9IGdSUEMgc2VydmljZWApXG4gICAgaWYgKHRoaXMuc2VydmljZSkge1xuICAgICAgdGhpcy5zZXJ2aWNlLmNsb3NlKClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTG9nIHN1Y2Nlc3NmdWwgZGlzY29ubmVjdC5cbiAgICovXG4gIG9uQWZ0ZXJEaXNjb25uZWN0KCkge1xuICAgIHRoaXMuZGVidWcoYERpc2Nvbm5lY3RlZCBmcm9tICR7dGhpcy5zZXJ2aWNlTmFtZX0gZ1JQQyBzZXJ2aWNlYClcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBIZWxwZXJzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBFc3RhYmxpc2ggYSBjb25uZWN0aW9uIHRvIHRoZSBMaWdodG5pbmcgaW50ZXJmYWNlLlxuICAgKi9cbiAgYXN5bmMgZXN0YWJsaXNoQ29ubmVjdGlvbihvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBvcHRzID0gZGVmYXVsdHNEZWVwKG9wdGlvbnMsIHRoaXMub3B0aW9ucylcbiAgICBjb25zdCB7XG4gICAgICBob3N0LFxuICAgICAgY2VydCxcbiAgICAgIG1hY2Fyb29uLFxuICAgICAgcHJvdG9EaXIsXG4gICAgICB3YWl0Rm9yQ2VydCxcbiAgICAgIHdhaXRGb3JNYWNhcm9vbixcbiAgICAgIGdycGNPcHRpb25zLFxuICAgICAgY29ubmVjdGlvbk9wdGlvbnMsXG4gICAgICB2ZXJzaW9uLFxuICAgIH0gPSBvcHRzXG5cbiAgICB0cnkge1xuICAgICAgLy8gRmluZCB0aGUgbW9zdCByZWNlbnQgcHJvdG8gZmlsZSBmb3IgdGhpcyBzZXJ2aWNlIGlmIGEgc3BlY2lmaWMgdmVyc2lvbiB3YXMgbm90IHJlcXVlc3RlZC5cbiAgICAgIHRoaXMudmVyc2lvbiA9IHZlcnNpb24gfHwgdGhpcy52ZXJzaW9uIHx8IGdldExhdGVzdFByb3RvVmVyc2lvbigpXG4gICAgICBjb25zdCBzZXJ2aWNlRGVmaW5pdGlvbiA9IHJlZ2lzdHJ5W3RoaXMudmVyc2lvbl0uc2VydmljZXMuZmluZCgocykgPT4gcy5uYW1lID09PSB0aGlzLnNlcnZpY2VOYW1lKVxuICAgICAgY29uc3QgW3Byb3RvUGFja2FnZSwgcHJvdG9GaWxlXSA9IHNlcnZpY2VEZWZpbml0aW9uLnByb3RvLnNwbGl0KCcvJylcbiAgICAgIGNvbnN0IGZpbGVwYXRoID0gam9pbihwcm90b0RpciB8fCBnZXRQcm90b0RpcigpLCB0aGlzLnZlcnNpb24sIHByb3RvUGFja2FnZSwgcHJvdG9GaWxlKVxuICAgICAgdGhpcy5kZWJ1ZyhcbiAgICAgICAgYEVzdGFibGlzaGluZyBnUlBDIGNvbm5lY3Rpb24gdG8gJHt0aGlzLnNlcnZpY2VOYW1lfSB3aXRoIHByb3RvIGZpbGUgJXMgYW5kIGNvbm5lY3Rpb24gb3B0aW9ucyAlb2AsXG4gICAgICAgIGZpbGVwYXRoLFxuICAgICAgICBjb25uZWN0aW9uT3B0aW9ucyxcbiAgICAgIClcblxuICAgICAgLy8gTG9hZCBnUlBDIHBhY2thZ2UgZGVmaW5pdGlvbiBhcyBhIGdSUEMgb2JqZWN0IGhpZXJhcmNoeS5cbiAgICAgIGNvbnN0IHBhY2thZ2VEZWZpbml0aW9uID0gYXdhaXQgbG9hZChmaWxlcGF0aCwgZ3JwY09wdGlvbnMpXG4gICAgICBjb25zdCBycGMgPSBsb2FkUGFja2FnZURlZmluaXRpb24ocGFja2FnZURlZmluaXRpb24pXG5cbiAgICAgIC8vIFdhaXQgZm9yIHRoZSBjZXJ0IHRvIGV4aXN0ICh0aGlzIGNhbiB0YWtlIHNvbWUgdGltZSBpbW1lZGlhdGVseSBhZnRlciBzdGFydGluZyBsbmQpLlxuICAgICAgaWYgKHdhaXRGb3JDZXJ0KSB7XG4gICAgICAgIGNvbnN0IHdhaXRUaW1lID0gTnVtYmVyLmlzRmluaXRlKHdhaXRGb3JDZXJ0KSA/IHdhaXRGb3JDZXJ0IDogRklMRV9XQUlUX1RJTUVPVVRcbiAgICAgICAgYXdhaXQgd2FpdEZvckZpbGUoY2VydCwgd2FpdFRpbWUpXG4gICAgICB9XG5cbiAgICAgIC8vIENyZWF0ZSBzc2wgY3JlZGVudGlhbHMgdG8gdXNlIHdpdGggdGhlIGdSUEMgY2xpZW50LlxuICAgICAgbGV0IGNyZWRzID0gYXdhaXQgY3JlYXRlU3NsQ3JlZHMoY2VydClcblxuICAgICAgLy8gQWRkIG1hY2Fyb29uIHRvIGNyZWRlbnRpYWxzIGlmIHNlcnZpY2UgcmVxdWlyZXMgbWFjYXJvb25zLlxuICAgICAgaWYgKHRoaXMudXNlTWFjYXJvb24gJiYgbWFjYXJvb24pIHtcbiAgICAgICAgLy8gV2FpdCBmb3IgdGhlIG1hY2Fyb29uIHRvIGV4aXN0ICh0aGlzIGNhbiB0YWtlIHNvbWUgdGltZSBpbW1lZGlhdGVseSBhZnRlciBJbml0aWFsaXppbmcgYSB3YWxsZXQpLlxuICAgICAgICBpZiAod2FpdEZvck1hY2Fyb29uKSB7XG4gICAgICAgICAgY29uc3Qgd2FpdFRpbWUgPSBOdW1iZXIuaXNGaW5pdGUod2FpdEZvck1hY2Fyb29uKSA/IHdhaXRGb3JNYWNhcm9vbiA6IEZJTEVfV0FJVF9USU1FT1VUXG4gICAgICAgICAgYXdhaXQgd2FpdEZvckZpbGUobWFjYXJvb24sIHdhaXRUaW1lKVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG1hY2Fyb29uQ3JlZHMgPSBhd2FpdCBjcmVhdGVNYWNhcm9vbkNyZWRzKG1hY2Fyb29uKVxuICAgICAgICBjcmVkcyA9IGNyZWRlbnRpYWxzLmNvbWJpbmVDaGFubmVsQ3JlZGVudGlhbHMoY3JlZHMsIG1hY2Fyb29uQ3JlZHMpXG4gICAgICB9XG5cbiAgICAgIC8vIENyZWF0ZSBhIG5ldyBnUlBDIGNsaWVudCBpbnN0YW5jZS5cbiAgICAgIGNvbnN0IHJwY1NlcnZpY2UgPSBycGNbcHJvdG9QYWNrYWdlXVt0aGlzLnNlcnZpY2VOYW1lXVxuICAgICAgdGhpcy5zZXJ2aWNlID0gbmV3IHJwY1NlcnZpY2UoaG9zdCwgY3JlZHMsIGNvbm5lY3Rpb25PcHRpb25zKVxuXG4gICAgICAvLyBXYWl0IHVwIHRvIENPTk5FQ1RfV0FJVF9USU1FT1VUIHNlY29uZHMgZm9yIHRoZSBnUlBDIGNvbm5lY3Rpb24gdG8gYmUgZXN0YWJsaXNoZWQuXG4gICAgICBjb25zdCB0aW1lZW91dCA9IGlzVG9yKGhvc3QpID8gQ09OTkVDVF9XQUlUX1RJTUVPVVRfVE9SIDogQ09OTkVDVF9XQUlUX1RJTUVPVVRcbiAgICAgIGF3YWl0IHByb21pc2lmaWVkQ2FsbCh0aGlzLnNlcnZpY2UsIHRoaXMuc2VydmljZS53YWl0Rm9yUmVhZHksIGdldERlYWRsaW5lKHRpbWVlb3V0KSlcblxuICAgICAgLy8gU2V0IHVwIGhlbHBlciBtZXRob2RzIHRvIHByb3h5IHNlcnZpY2UgbWV0aG9kcy5cbiAgICAgIHRoaXMud3JhcEFzeW5jKHJwY1NlcnZpY2Uuc2VydmljZSlcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aGlzLmRlYnVnKGBVbmFibGUgdG8gY29ubmVjdCB0byAke3RoaXMuc2VydmljZU5hbWV9IHNlcnZpY2VgLCBlKVxuICAgICAgaWYgKHRoaXMuc2VydmljZSkge1xuICAgICAgICB0aGlzLnNlcnZpY2UuY2xvc2UoKVxuICAgICAgfVxuICAgICAgdGhyb3cgZVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHdhaXRGb3JDYWxsKG1ldGhvZCwgYXJncykge1xuICAgIHRoaXMuZGVidWcoXG4gICAgICAnQXR0ZW1wdGluZyB0byBjYWxsICVzLiVzIHdpdGggYXJncyAlbyAod2lsbCBrZWVwIHRyeWluZyB0byB1cCB0byAlcyBzZWNvbmRzKScsXG4gICAgICB0aGlzLnNlcnZpY2VOYW1lLFxuICAgICAgbWV0aG9kLFxuICAgICAgYXJncyxcbiAgICAgIFBST0JFX1RJTUVPVVQsXG4gICAgKVxuICAgIGNvbnN0IGRlYWRsaW5lID0gZ2V0RGVhZGxpbmUoUFJPQkVfVElNRU9VVClcbiAgICBjb25zdCBjaGVja1N0YXRlID0gYXN5bmMgKGVycikgPT4ge1xuICAgICAgbGV0IG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXG4gICAgICBjb25zdCBpc0V4cGlyZWQgPSBub3cgPiBkZWFkbGluZVxuICAgICAgaWYgKGVyciAmJiBpc0V4cGlyZWQpIHtcbiAgICAgICAgdGhyb3cgZXJyXG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gYXdhaXQgdGhpc1ttZXRob2RdKGFyZ3MpXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBpZiAoZXJyb3IuY29kZSA9PT0gc3RhdHVzLlVOQVZBSUxBQkxFKSB7XG4gICAgICAgICAgYXdhaXQgZGVsYXkoUFJPQkVfUkVUUllfSU5URVJWQUwpXG4gICAgICAgICAgcmV0dXJuIGNoZWNrU3RhdGUoZXJyb3IpXG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgZXJyb3JcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGF3YWl0IGNoZWNrU3RhdGUoKVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBwcm9taXNpZmllZCBoZWxwZXIgbWV0aG9kcyBmb3IgZWFjaCBtZXRob2QgaW4gdGhlIGdSUEMgc2VydmljZS5cbiAgICogSW5zcGlyYXRpb24gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vYWx0YW5nZW50L2xuZC1hc3luY1xuICAgKiBAcGFyYW0ge09iamVjdH0gc2VydmljZSBzZXJ2aWNlIGRlc2NyaXB0aW9uIHVzZWQgdG8gZXh0cmFjdCBhcHBseSBtZXRob2QgZGV0YWlsc1xuICAgKi9cbiAgd3JhcEFzeW5jKHNlcnZpY2UpIHtcbiAgICBPYmplY3QudmFsdWVzKHNlcnZpY2UpLmZvckVhY2goKG1ldGhvZCkgPT4ge1xuICAgICAgY29uc3QgeyBvcmlnaW5hbE5hbWUgfSA9IG1ldGhvZFxuICAgICAgLy8gRG8gbm90IG92ZXJyaWRlIGV4aXN0aW5nIG1ldGhvZHMuXG4gICAgICBpZiAodGhpc1tvcmlnaW5hbE5hbWVdKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgLy8gSWYgdGhpcyBtZXRob2QgaXMgYSBzdHJlYW0sIGJpbmQgaXQgdG8gdGhlIHNlcnZpY2UgaW5zdGFuY2UgYXMgaXMuXG4gICAgICBpZiAobWV0aG9kLnJlcXVlc3RTdHJlYW0gfHwgbWV0aG9kLnJlc3BvbnNlU3RyZWFtKSB7XG4gICAgICAgIHRoaXNbb3JpZ2luYWxOYW1lXSA9IChwYXlsb2FkID0ge30sIG9wdGlvbnMgPSB7fSkgPT4ge1xuICAgICAgICAgIHRoaXMuZGVidWcoYENhbGxpbmcgJHt0aGlzLnNlcnZpY2VOYW1lfS4ke29yaWdpbmFsTmFtZX0gc3luYyB3aXRoOiAlb2AsIHsgcGF5bG9hZCwgb3B0aW9ucyB9KVxuICAgICAgICAgIHJldHVybiB0aGlzLnNlcnZpY2Vbb3JpZ2luYWxOYW1lXS5iaW5kKHRoaXMuc2VydmljZSkuY2FsbCh0aGlzLnNlcnZpY2UsIHBheWxvYWQsIG9wdGlvbnMpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIE90aGVyd2lzZSwgcHJvbWlzaWZ5IGFuZCBiaW5kIHRvIHRoZSBzZXJ2aWNlIGluc3RhbmNlLlxuICAgICAgZWxzZSB7XG4gICAgICAgIHRoaXNbb3JpZ2luYWxOYW1lXSA9IChwYXlsb2FkID0ge30sIG9wdGlvbnMgPSB7fSkgPT4ge1xuICAgICAgICAgIHRoaXMuZGVidWcoYENhbGxpbmcgJHt0aGlzLnNlcnZpY2VOYW1lfS4ke29yaWdpbmFsTmFtZX0gYXN5bmMgd2l0aDogJW9gLCB7IHBheWxvYWQsIG9wdGlvbnMgfSlcbiAgICAgICAgICByZXR1cm4gcHJvbWlzaWZpZWRDYWxsKHRoaXMuc2VydmljZSwgdGhpcy5zZXJ2aWNlW29yaWdpbmFsTmFtZV0sIHBheWxvYWQsIG9wdGlvbnMpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNlcnZpY2VcbiJdfQ==