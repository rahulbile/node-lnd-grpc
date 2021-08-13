"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _events = _interopRequireDefault(require("events"));

var _javascriptStateMachine = _interopRequireDefault(require("javascript-state-machine"));

var _debug = _interopRequireDefault(require("debug"));

var _parse = _interopRequireDefault(require("lndconnect/parse"));

var _grpcJs = require("@grpc/grpc-js");

var _utils = require("./utils");

var _services = require("./services");

var _registry = _interopRequireDefault(require("./registry"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

const debug = (0, _debug.default)('lnrpc:grpc'); // Set up SSL with the cypher suits that we need.

if (!process.env.GRPC_SSL_CIPHER_SUITES) {
  process.env.GRPC_SSL_CIPHER_SUITES = _utils.grpcSslCipherSuites;
}
/**
 * Lnd gRPC service wrapper.
 * @extends EventEmitter
 */


let LndGrpc = /*#__PURE__*/function (_EventEmitter) {
  _inherits(LndGrpc, _EventEmitter);

  var _super = _createSuper(LndGrpc);

  function LndGrpc(options = {}) {
    var _this;

    _classCallCheck(this, LndGrpc);

    _this = _super.call(this);
    debug(`Initializing LndGrpc with config: %o`, options);
    _this.options = options; // If an lndconnect uri was provided, extract the connection details from that.

    if (options.lndconnectUri) {
      const connectionInfo = (0, _parse.default)(options.lndconnectUri);
      Object.assign(_this.options, connectionInfo);
    } // Define state machine.


    _this.fsm = new _javascriptStateMachine.default({
      init: 'ready',
      transitions: [{
        name: 'activateWalletUnlocker',
        from: ['ready', 'active'],
        to: 'locked'
      }, {
        name: 'activateLightning',
        from: ['ready', 'locked'],
        to: 'active'
      }, {
        name: 'disconnect',
        from: ['locked', 'active'],
        to: 'ready'
      }],
      methods: {
        onBeforeActivateWalletUnlocker: _this.onBeforeActivateWalletUnlocker.bind(_assertThisInitialized(_this)),
        onBeforeActivateLightning: _this.onBeforeActivateLightning.bind(_assertThisInitialized(_this)),
        onBeforeDisconnect: _this.onBeforeDisconnect.bind(_assertThisInitialized(_this)),
        onAfterDisconnect: _this.onAfterDisconnect.bind(_assertThisInitialized(_this)),
        onInvalidTransition: _utils.onInvalidTransition,
        onPendingTransition: _utils.onPendingTransition
      },

      onInvalidTransition(transition, from, to) {
        throw Object.assign(new Error(`transition is invalid in current state`), {
          transition,
          from,
          to
        });
      }

    }); // Define services.

    _this.supportedServices = [_services.WalletUnlocker, _services.Lightning, _services.Autopilot, _services.ChainNotifier, _services.Invoices, _services.Router, _services.Signer, _services.State, _services.Versioner, _services.WalletKit];
    _this.services = {};
    _this.tor = (0, _utils.tor)(); // Instantiate services.

    _this.supportedServices.forEach(Service => {
      const instance = new Service(_this.options);
      _this.services[instance.serviceName] = instance;
    });

    return _this;
  } // ------------------------------------
  // FSM Proxies
  // ------------------------------------


  _createClass(LndGrpc, [{
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
    value: async function connect() {
      debug(`Connecting to lnd gRPC service`); // Verify that the host is valid.

      const host = this.options.host;
      await (0, _utils.validateHost)(host); // Start tor service if needed.

      if ((0, _utils.isTor)(host) && !this.tor.isStarted()) {
        this.emit('tor.starting');
        await this.tor.start();
        this.emit('tor.started');
      } // For lnd >= 0.13.*, the state service is available which provides with
      // the wallet state. For lower version of lnd continue to use WalletUnlocker
      // error codes


      let walletState;
      this.checkRPCStatus = false;

      try {
        // Subscribe to wallet state and get current state
        let currentState = await this.subscribeWalletState();

        switch (currentState.state) {
          case 'NON_EXISTING':
          case 'LOCKED':
          case 'WAITING_TO_START':
            walletState = _utils.WALLET_STATE_LOCKED;
            break;

          case 'UNLOCKED':
            // Do nothing.
            break;

          case 'RPC_ACTIVE':
            walletState = _utils.WALLET_STATE_ACTIVE;
            break;
        }

        this.checkRPCStatus = true;
      } catch (error) {
        if (error.code === _grpcJs.status.UNIMPLEMENTED) {
          // Probe the services to determine the wallet state.
          walletState = await this.determineWalletState();
        }
      }

      switch (walletState) {
        case _utils.WALLET_STATE_LOCKED:
          await this.activateWalletUnlocker();
          break;

        case _utils.WALLET_STATE_ACTIVE:
          await this.activateLightning();
          break;
      }
    }
  }, {
    key: "activateWalletUnlocker",
    value: async function activateWalletUnlocker(...args) {
      await this.fsm.activateWalletUnlocker(...args);
      this.emit('locked');
    }
  }, {
    key: "activateLightning",
    value: async function activateLightning(...args) {
      try {
        await this.fsm.activateLightning(...args);
        this.emit('active');
      } catch (e) {
        await this.disconnectAll();
        throw e;
      }
    }
  }, {
    key: "disconnect",
    value: async function disconnect(...args) {
      if (this.can('disconnect')) {
        await this.fsm.disconnect(...args);
      }

      if (this.tor.isStarted()) {
        this.emit('tor.stopping');
        await this.tor.stop();
        this.emit('tor.stopped');
      }

      this.emit('disconnected');
    } // ------------------------------------
    // FSM Observers
    // ------------------------------------

    /**
     * Disconnect from the gRPC service.
     */

  }, {
    key: "onBeforeDisconnect",
    value: async function onBeforeDisconnect() {
      debug(`Disconnecting from lnd gRPC service`);
      await this.disconnectAll();
    }
    /**
     * Log successful disconnect.
     */

  }, {
    key: "onAfterDisconnect",
    value: async function onAfterDisconnect() {
      debug('Disconnected from lnd gRPC service');
    }
    /**
     * Connect to and activate the wallet unlocker api.
     */

  }, {
    key: "onBeforeActivateWalletUnlocker",
    value: async function onBeforeActivateWalletUnlocker() {
      if (this.services.WalletUnlocker.can('connect')) {
        await this.services.WalletUnlocker.connect();
      }
    }
    /**
     * Connect to and activate the main api.
     */

  }, {
    key: "onBeforeActivateLightning",
    value: async function onBeforeActivateLightning() {
      const _this$services = this.services,
            Lightning = _this$services.Lightning,
            WalletUnlocker = _this$services.WalletUnlocker; // await for RPC_ACTIVE state before interacting if needed

      if (this.checkRPCStatus) {
        await this.checkWalletState('RPC_ACTIVE');
      } // Disconnect wallet unlocker if its connected.


      if (WalletUnlocker.can('disconnect')) {
        await WalletUnlocker.disconnect();
      } // First connect to the Lightning service.


      await Lightning.connect(); // Fetch the determined version.

      const version = Lightning.version; // Get a list of all other available and supported services.

      const availableServices = _registry.default[version].services.map(s => s.name).filter(s => Object.keys(this.services).includes(s)).filter(s => !['WalletUnlocker', 'Lightning'].includes(s)); // Connect to the other services.


      await Promise.all(availableServices.filter(serviceName => this.services[serviceName].can('connect')).map(serviceName => {
        const service = this.services[serviceName];
        service.version = version; // Disable waiting for cert/macaroon for sub-services.

        return service.connect({
          waitForCert: false,
          waitForMacaroon: false
        });
      }));
    } // ------------------------------------
    // Helpers
    // ------------------------------------

    /**
     * Disconnect all services.
     */

  }, {
    key: "disconnectAll",
    value: async function disconnectAll() {
      debug('Disconnecting from all gRPC services');
      await Promise.all(Object.keys(this.services).map(serviceName => {
        const service = this.services[serviceName];

        if (service.can('disconnect')) {
          return service.disconnect();
        }
      }));
      debug('Disconnected from all gRPC services');
    }
    /**
     * Probe to determine what state lnd is in.
     */

  }, {
    key: "determineWalletState",
    value: async function determineWalletState(options = {
      keepalive: false
    }) {
      debug('Attempting to determine wallet state');
      let walletState;

      try {
        await this.services.WalletUnlocker.connect(); // Call the unlockWallet method with a missing password argument.
        // This is a way of probing the api to determine it's state.

        await this.services.WalletUnlocker.unlockWallet();
      } catch (error) {
        switch (error.code) {
          /*
            `UNIMPLEMENTED` indicates that the requested operation is not implemented or not supported/enabled in the
             service. This implies that the wallet is already unlocked, since the WalletUnlocker service is not active.
             See
              `DEADLINE_EXCEEDED` indicates that the deadline expired before the operation could complete. In the case of
             our probe here the likely cause of this is that we are connecting to an lnd node where the `noseedbackup`
             flag has been set and therefore the `WalletUnlocker` interace is non-functional.
              https://github.com/grpc/grpc-node/blob/master/packages/grpc-native-core/src/constants.js#L129.
           */
          case _grpcJs.status.UNIMPLEMENTED:
          case _grpcJs.status.DEADLINE_EXCEEDED:
            debug('Determined wallet state as:', _utils.WALLET_STATE_ACTIVE);
            walletState = _utils.WALLET_STATE_ACTIVE;
            return walletState;

          /**
            `UNKNOWN` indicates that unlockWallet was called without an argument which is invalid.
            This implies that the wallet is waiting to be unlocked.
          */

          case _grpcJs.status.UNKNOWN:
            debug('Determined wallet state as:', _utils.WALLET_STATE_LOCKED);
            walletState = _utils.WALLET_STATE_LOCKED;
            return walletState;

          /**
            Bubble all other errors back to the caller and abort the connection attempt.
            Disconnect all services.
          */

          default:
            debug('Unable to determine wallet state', error);
            throw error;
        }
      } finally {
        if (!options.keepalive && this.can('disconnect')) {
          await this.disconnect();
        }
      }
    }
    /**
     * Wait for wallet  to enter a particular state.
     * @param  {string} state state to wait for (RPC_ACTIVE, LOCKED, UNLOCKED)
     * @return {Promise<Object>}.
     */

  }, {
    key: "checkWalletState",
    value: function checkWalletState(state) {
      const waitForState = resolve => {
        return this.services.State.getState().then(currentState => {
          if (currentState.state === state) {
            resolve(true);
          } else {
            setTimeout(_ => waitForState(resolve), 400);
          }
        });
      };

      return new Promise(waitForState);
    }
    /**
     * Wait for lnd to enter a particular state.
     * @param  {string} state Name of state to wait for (locked, active, disconnected)
     * @return {Promise<Object>} Object with `isDone` and `cancel` properties.
     */

  }, {
    key: "waitForState",
    value: function waitForState(stateName) {
      let successHandler;
      /**
       * Promise that resolves when service is active.
       */

      const isDone = new Promise(resolve => {
        // If the service is already in the requested state, return immediately.
        if (this.fsm.state === stateName) {
          return resolve();
        } // Otherwise, wait until we receive a relevant state change event.


        successHandler = () => resolve();

        this.prependOnceListener(stateName, successHandler);
      });
      /**
       * Method to abort the wait (prevent the isDone from resolving and remove activation event listener).
       */

      const cancel = () => {
        if (successHandler) {
          this.off(stateName, successHandler);
          successHandler = null;
        }
      };

      return {
        isDone,
        cancel
      };
    }
    /**
     * Subscribe to Wallet State Stream
     * And return the current state
     * @return {Promise<Object>}.
     */

  }, {
    key: "subscribeWalletState",
    value: async function subscribeWalletState() {
      if (this.services.State.can('connect')) {
        await this.services.State.connect();
      }

      let subscribeState = await this.services.State.subscribeState();
      return new Promise((resolve, reject) => {
        subscribeState.on('data', response => {
          debug(`Got wallet state as ${response.state}`);
        });
        subscribeState.on('error', () => {
          debug('Stopped listening to wallet state');
        });
        resolve(this.services.State.getState());
      });
    }
  }]);

  return LndGrpc;
}(_events.default);

var _default = LndGrpc;
exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9ncnBjLmpzIl0sIm5hbWVzIjpbImRlYnVnIiwicHJvY2VzcyIsImVudiIsIkdSUENfU1NMX0NJUEhFUl9TVUlURVMiLCJncnBjU3NsQ2lwaGVyU3VpdGVzIiwiTG5kR3JwYyIsIm9wdGlvbnMiLCJsbmRjb25uZWN0VXJpIiwiY29ubmVjdGlvbkluZm8iLCJPYmplY3QiLCJhc3NpZ24iLCJmc20iLCJTdGF0ZU1hY2hpbmUiLCJpbml0IiwidHJhbnNpdGlvbnMiLCJuYW1lIiwiZnJvbSIsInRvIiwibWV0aG9kcyIsIm9uQmVmb3JlQWN0aXZhdGVXYWxsZXRVbmxvY2tlciIsImJpbmQiLCJvbkJlZm9yZUFjdGl2YXRlTGlnaHRuaW5nIiwib25CZWZvcmVEaXNjb25uZWN0Iiwib25BZnRlckRpc2Nvbm5lY3QiLCJvbkludmFsaWRUcmFuc2l0aW9uIiwib25QZW5kaW5nVHJhbnNpdGlvbiIsInRyYW5zaXRpb24iLCJFcnJvciIsInN1cHBvcnRlZFNlcnZpY2VzIiwiV2FsbGV0VW5sb2NrZXIiLCJMaWdodG5pbmciLCJBdXRvcGlsb3QiLCJDaGFpbk5vdGlmaWVyIiwiSW52b2ljZXMiLCJSb3V0ZXIiLCJTaWduZXIiLCJTdGF0ZSIsIlZlcnNpb25lciIsIldhbGxldEtpdCIsInNlcnZpY2VzIiwidG9yIiwiZm9yRWFjaCIsIlNlcnZpY2UiLCJpbnN0YW5jZSIsInNlcnZpY2VOYW1lIiwiYXJncyIsImlzIiwiY2FuIiwib2JzZXJ2ZSIsInN0YXRlIiwiaG9zdCIsImlzU3RhcnRlZCIsImVtaXQiLCJzdGFydCIsIndhbGxldFN0YXRlIiwiY2hlY2tSUENTdGF0dXMiLCJjdXJyZW50U3RhdGUiLCJzdWJzY3JpYmVXYWxsZXRTdGF0ZSIsIldBTExFVF9TVEFURV9MT0NLRUQiLCJXQUxMRVRfU1RBVEVfQUNUSVZFIiwiZXJyb3IiLCJjb2RlIiwic3RhdHVzIiwiVU5JTVBMRU1FTlRFRCIsImRldGVybWluZVdhbGxldFN0YXRlIiwiYWN0aXZhdGVXYWxsZXRVbmxvY2tlciIsImFjdGl2YXRlTGlnaHRuaW5nIiwiZSIsImRpc2Nvbm5lY3RBbGwiLCJkaXNjb25uZWN0Iiwic3RvcCIsImNvbm5lY3QiLCJjaGVja1dhbGxldFN0YXRlIiwidmVyc2lvbiIsImF2YWlsYWJsZVNlcnZpY2VzIiwicmVnaXN0cnkiLCJtYXAiLCJzIiwiZmlsdGVyIiwia2V5cyIsImluY2x1ZGVzIiwiUHJvbWlzZSIsImFsbCIsInNlcnZpY2UiLCJ3YWl0Rm9yQ2VydCIsIndhaXRGb3JNYWNhcm9vbiIsImtlZXBhbGl2ZSIsInVubG9ja1dhbGxldCIsIkRFQURMSU5FX0VYQ0VFREVEIiwiVU5LTk9XTiIsIndhaXRGb3JTdGF0ZSIsInJlc29sdmUiLCJnZXRTdGF0ZSIsInRoZW4iLCJzZXRUaW1lb3V0IiwiXyIsInN0YXRlTmFtZSIsInN1Y2Nlc3NIYW5kbGVyIiwiaXNEb25lIiwicHJlcGVuZE9uY2VMaXN0ZW5lciIsImNhbmNlbCIsIm9mZiIsInN1YnNjcmliZVN0YXRlIiwicmVqZWN0Iiwib24iLCJyZXNwb25zZSIsIkV2ZW50RW1pdHRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQVVBOztBQVlBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxNQUFNQSxLQUFLLEdBQUcsb0JBQVksWUFBWixDQUFkLEMsQ0FFQTs7QUFDQSxJQUFJLENBQUNDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxzQkFBakIsRUFBeUM7QUFDdkNGLEVBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxzQkFBWixHQUFxQ0MsMEJBQXJDO0FBQ0Q7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7O0lBQ01DLE87Ozs7O0FBQ0osbUJBQVlDLE9BQU8sR0FBRyxFQUF0QixFQUEwQjtBQUFBOztBQUFBOztBQUN4QjtBQUNBTixJQUFBQSxLQUFLLENBQUUsc0NBQUYsRUFBeUNNLE9BQXpDLENBQUw7QUFDQSxVQUFLQSxPQUFMLEdBQWVBLE9BQWYsQ0FId0IsQ0FLeEI7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Q0FBNkI7QUFDM0IsVUFBSSxLQUFLN0QsUUFBTCxDQUFjSCxLQUFkLENBQW9CVyxHQUFwQixDQUF3QixTQUF4QixDQUFKLEVBQXdDO0FBQ3RDLGNBQU0sS0FBS1IsUUFBTCxDQUFjSCxLQUFkLENBQW9CbUMsT0FBcEIsRUFBTjtBQUNEOztBQUVELFVBQUkrQixjQUFjLEdBQUcsTUFBTSxLQUFLL0QsUUFBTCxDQUFjSCxLQUFkLENBQW9Ca0UsY0FBcEIsRUFBM0I7QUFDQSxhQUFPLElBQUlyQixPQUFKLENBQVksQ0FBQ1UsT0FBRCxFQUFVWSxNQUFWLEtBQXFCO0FBQ3RDRCxRQUFBQSxjQUFjLENBQUNFLEVBQWYsQ0FBa0IsTUFBbEIsRUFBMEJDLFFBQVEsSUFBSTtBQUNwQ3pHLFVBQUFBLEtBQUssQ0FBRSx1QkFBc0J5RyxRQUFRLENBQUN4RCxLQUFNLEVBQXZDLENBQUw7QUFDRCxTQUZEO0FBR0FxRCxRQUFBQSxjQUFjLENBQUNFLEVBQWYsQ0FBa0IsT0FBbEIsRUFBMkIsTUFBTTtBQUMvQnhHLFVBQUFBLEtBQUssQ0FBQyxtQ0FBRCxDQUFMO0FBQ0QsU0FGRDtBQUdBMkYsUUFBQUEsT0FBTyxDQUFDLEtBQUtwRCxRQUFMLENBQWNILEtBQWQsQ0FBb0J3RCxRQUFwQixFQUFELENBQVA7QUFDQSxPQVJLLENBQVA7QUFTRDs7OztFQXBYbUJjLGU7O2VBdVhQckcsTyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnZXZlbnRzJ1xuaW1wb3J0IFN0YXRlTWFjaGluZSBmcm9tICdqYXZhc2NyaXB0LXN0YXRlLW1hY2hpbmUnXG5pbXBvcnQgY3JlYXRlRGVidWcgZnJvbSAnZGVidWcnXG5pbXBvcnQgcGFyc2UgZnJvbSAnbG5kY29ubmVjdC9wYXJzZSdcbmltcG9ydCB7IHN0YXR1cyB9IGZyb20gJ0BncnBjL2dycGMtanMnXG5pbXBvcnQgeyB0b3IsIGlzVG9yIH0gZnJvbSAnLi91dGlscydcbmltcG9ydCB7XG4gIGdldERlYWRsaW5lLFxuICBncnBjU3NsQ2lwaGVyU3VpdGVzLFxuICB2YWxpZGF0ZUhvc3QsXG4gIG9uSW52YWxpZFRyYW5zaXRpb24sXG4gIG9uUGVuZGluZ1RyYW5zaXRpb24sXG4gIFdBTExFVF9TVEFURV9MT0NLRUQsXG4gIFdBTExFVF9TVEFURV9BQ1RJVkUsXG59IGZyb20gJy4vdXRpbHMnXG5pbXBvcnQge1xuICBXYWxsZXRVbmxvY2tlcixcbiAgTGlnaHRuaW5nLFxuICBBdXRvcGlsb3QsXG4gIENoYWluTm90aWZpZXIsXG4gIEludm9pY2VzLFxuICBSb3V0ZXIsXG4gIFNpZ25lcixcbiAgU3RhdGUsXG4gIFZlcnNpb25lcixcbiAgV2FsbGV0S2l0LFxufSBmcm9tICcuL3NlcnZpY2VzJ1xuaW1wb3J0IHJlZ2lzdHJ5IGZyb20gJy4vcmVnaXN0cnknXG5cbmNvbnN0IGRlYnVnID0gY3JlYXRlRGVidWcoJ2xucnBjOmdycGMnKVxuXG4vLyBTZXQgdXAgU1NMIHdpdGggdGhlIGN5cGhlciBzdWl0cyB0aGF0IHdlIG5lZWQuXG5pZiAoIXByb2Nlc3MuZW52LkdSUENfU1NMX0NJUEhFUl9TVUlURVMpIHtcbiAgcHJvY2Vzcy5lbnYuR1JQQ19TU0xfQ0lQSEVSX1NVSVRFUyA9IGdycGNTc2xDaXBoZXJTdWl0ZXNcbn1cblxuLyoqXG4gKiBMbmQgZ1JQQyBzZXJ2aWNlIHdyYXBwZXIuXG4gKiBAZXh0ZW5kcyBFdmVudEVtaXR0ZXJcbiAqL1xuY2xhc3MgTG5kR3JwYyBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKClcbiAgICBkZWJ1ZyhgSW5pdGlhbGl6aW5nIExuZEdycGMgd2l0aCBjb25maWc6ICVvYCwgb3B0aW9ucylcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG5cbiAgICAvLyBJZiBhbiBsbmRjb25uZWN0IHVyaSB3YXMgcHJvdmlkZWQsIGV4dHJhY3QgdGhlIGNvbm5lY3Rpb24gZGV0YWlscyBmcm9tIHRoYXQuXG4gICAgaWYgKG9wdGlvbnMubG5kY29ubmVjdFVyaSkge1xuICAgICAgY29uc3QgY29ubmVjdGlvbkluZm8gPSBwYXJzZShvcHRpb25zLmxuZGNvbm5lY3RVcmkpXG4gICAgICBPYmplY3QuYXNzaWduKHRoaXMub3B0aW9ucywgY29ubmVjdGlvbkluZm8pXG4gICAgfVxuXG4gICAgLy8gRGVmaW5lIHN0YXRlIG1hY2hpbmUuXG4gICAgdGhpcy5mc20gPSBuZXcgU3RhdGVNYWNoaW5lKHtcbiAgICAgIGluaXQ6ICdyZWFkeScsXG4gICAgICB0cmFuc2l0aW9uczogW1xuICAgICAgICB7IG5hbWU6ICdhY3RpdmF0ZVdhbGxldFVubG9ja2VyJywgZnJvbTogWydyZWFkeScsICdhY3RpdmUnXSwgdG86ICdsb2NrZWQnIH0sXG4gICAgICAgIHsgbmFtZTogJ2FjdGl2YXRlTGlnaHRuaW5nJywgZnJvbTogWydyZWFkeScsICdsb2NrZWQnXSwgdG86ICdhY3RpdmUnIH0sXG4gICAgICAgIHsgbmFtZTogJ2Rpc2Nvbm5lY3QnLCBmcm9tOiBbJ2xvY2tlZCcsICdhY3RpdmUnXSwgdG86ICdyZWFkeScgfSxcbiAgICAgIF0sXG4gICAgICBtZXRob2RzOiB7XG4gICAgICAgIG9uQmVmb3JlQWN0aXZhdGVXYWxsZXRVbmxvY2tlcjogdGhpcy5vbkJlZm9yZUFjdGl2YXRlV2FsbGV0VW5sb2NrZXIuYmluZCh0aGlzKSxcbiAgICAgICAgb25CZWZvcmVBY3RpdmF0ZUxpZ2h0bmluZzogdGhpcy5vbkJlZm9yZUFjdGl2YXRlTGlnaHRuaW5nLmJpbmQodGhpcyksXG4gICAgICAgIG9uQmVmb3JlRGlzY29ubmVjdDogdGhpcy5vbkJlZm9yZURpc2Nvbm5lY3QuYmluZCh0aGlzKSxcbiAgICAgICAgb25BZnRlckRpc2Nvbm5lY3Q6IHRoaXMub25BZnRlckRpc2Nvbm5lY3QuYmluZCh0aGlzKSxcbiAgICAgICAgb25JbnZhbGlkVHJhbnNpdGlvbixcbiAgICAgICAgb25QZW5kaW5nVHJhbnNpdGlvbixcbiAgICAgIH0sXG5cbiAgICAgIG9uSW52YWxpZFRyYW5zaXRpb24odHJhbnNpdGlvbiwgZnJvbSwgdG8pIHtcbiAgICAgICAgdGhyb3cgT2JqZWN0LmFzc2lnbihuZXcgRXJyb3IoYHRyYW5zaXRpb24gaXMgaW52YWxpZCBpbiBjdXJyZW50IHN0YXRlYCksIHsgdHJhbnNpdGlvbiwgZnJvbSwgdG8gfSlcbiAgICAgIH0sXG4gICAgfSlcblxuICAgIC8vIERlZmluZSBzZXJ2aWNlcy5cbiAgICB0aGlzLnN1cHBvcnRlZFNlcnZpY2VzID0gW1xuICAgICAgV2FsbGV0VW5sb2NrZXIsXG4gICAgICBMaWdodG5pbmcsXG4gICAgICBBdXRvcGlsb3QsXG4gICAgICBDaGFpbk5vdGlmaWVyLFxuICAgICAgSW52b2ljZXMsXG4gICAgICBSb3V0ZXIsXG4gICAgICBTaWduZXIsXG4gICAgICBTdGF0ZSxcbiAgICAgIFZlcnNpb25lcixcbiAgICAgIFdhbGxldEtpdCxcbiAgICBdXG4gICAgdGhpcy5zZXJ2aWNlcyA9IHt9XG4gICAgdGhpcy50b3IgPSB0b3IoKVxuXG4gICAgLy8gSW5zdGFudGlhdGUgc2VydmljZXMuXG4gICAgdGhpcy5zdXBwb3J0ZWRTZXJ2aWNlcy5mb3JFYWNoKChTZXJ2aWNlKSA9PiB7XG4gICAgICBjb25zdCBpbnN0YW5jZSA9IG5ldyBTZXJ2aWNlKHRoaXMub3B0aW9ucylcbiAgICAgIHRoaXMuc2VydmljZXNbaW5zdGFuY2Uuc2VydmljZU5hbWVdID0gaW5zdGFuY2VcbiAgICB9KVxuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEZTTSBQcm94aWVzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGlzKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5mc20uaXMoLi4uYXJncylcbiAgfVxuICBjYW4oLi4uYXJncykge1xuICAgIHJldHVybiB0aGlzLmZzbS5jYW4oLi4uYXJncylcbiAgfVxuICBvYnNlcnZlKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5mc20ub2JzZXJ2ZSguLi5hcmdzKVxuICB9XG4gIGdldCBzdGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5mc20uc3RhdGVcbiAgfVxuXG4gIGFzeW5jIGNvbm5lY3QoKSB7XG4gICAgZGVidWcoYENvbm5lY3RpbmcgdG8gbG5kIGdSUEMgc2VydmljZWApXG5cbiAgICAvLyBWZXJpZnkgdGhhdCB0aGUgaG9zdCBpcyB2YWxpZC5cbiAgICBjb25zdCB7IGhvc3QgfSA9IHRoaXMub3B0aW9uc1xuICAgIGF3YWl0IHZhbGlkYXRlSG9zdChob3N0KVxuXG4gICAgLy8gU3RhcnQgdG9yIHNlcnZpY2UgaWYgbmVlZGVkLlxuICAgIGlmIChpc1Rvcihob3N0KSAmJiAhdGhpcy50b3IuaXNTdGFydGVkKCkpIHtcbiAgICAgIHRoaXMuZW1pdCgndG9yLnN0YXJ0aW5nJylcbiAgICAgIGF3YWl0IHRoaXMudG9yLnN0YXJ0KClcbiAgICAgIHRoaXMuZW1pdCgndG9yLnN0YXJ0ZWQnKVxuICAgIH1cblxuICAgIC8vIEZvciBsbmQgPj0gMC4xMy4qLCB0aGUgc3RhdGUgc2VydmljZSBpcyBhdmFpbGFibGUgd2hpY2ggcHJvdmlkZXMgd2l0aFxuICAgIC8vIHRoZSB3YWxsZXQgc3RhdGUuIEZvciBsb3dlciB2ZXJzaW9uIG9mIGxuZCBjb250aW51ZSB0byB1c2UgV2FsbGV0VW5sb2NrZXJcbiAgICAvLyBlcnJvciBjb2Rlc1xuICAgIGxldCB3YWxsZXRTdGF0ZVxuICAgIHRoaXMuY2hlY2tSUENTdGF0dXMgPSBmYWxzZVxuXG4gICAgdHJ5IHtcbiAgICAgIC8vIFN1YnNjcmliZSB0byB3YWxsZXQgc3RhdGUgYW5kIGdldCBjdXJyZW50IHN0YXRlXG4gICAgICBsZXQgY3VycmVudFN0YXRlID0gYXdhaXQgdGhpcy5zdWJzY3JpYmVXYWxsZXRTdGF0ZSgpXG5cbiAgICAgIHN3aXRjaCAoY3VycmVudFN0YXRlLnN0YXRlKSB7XG4gICAgICAgIGNhc2UgJ05PTl9FWElTVElORyc6XG4gICAgICAgIGNhc2UgJ0xPQ0tFRCc6XG4gICAgICAgIGNhc2UgJ1dBSVRJTkdfVE9fU1RBUlQnOlxuICAgICAgICAgIHdhbGxldFN0YXRlID0gV0FMTEVUX1NUQVRFX0xPQ0tFRFxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ1VOTE9DS0VEJzogLy8gRG8gbm90aGluZy5cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdSUENfQUNUSVZFJzpcbiAgICAgICAgICB3YWxsZXRTdGF0ZSA9IFdBTExFVF9TVEFURV9BQ1RJVkVcbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgdGhpcy5jaGVja1JQQ1N0YXR1cyA9IHRydWVcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgaWYgKGVycm9yLmNvZGUgPT09IHN0YXR1cy5VTklNUExFTUVOVEVEKSB7XG4gICAgICAgIC8vIFByb2JlIHRoZSBzZXJ2aWNlcyB0byBkZXRlcm1pbmUgdGhlIHdhbGxldCBzdGF0ZS5cbiAgICAgICAgd2FsbGV0U3RhdGUgPSBhd2FpdCB0aGlzLmRldGVybWluZVdhbGxldFN0YXRlKClcbiAgICAgIH1cbiAgICB9XG4gICAgc3dpdGNoICh3YWxsZXRTdGF0ZSkge1xuICAgICAgY2FzZSBXQUxMRVRfU1RBVEVfTE9DS0VEOlxuICAgICAgICBhd2FpdCB0aGlzLmFjdGl2YXRlV2FsbGV0VW5sb2NrZXIoKVxuICAgICAgICBicmVha1xuXG4gICAgICBjYXNlIFdBTExFVF9TVEFURV9BQ1RJVkU6XG4gICAgICAgIGF3YWl0IHRoaXMuYWN0aXZhdGVMaWdodG5pbmcoKVxuICAgICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGFjdGl2YXRlV2FsbGV0VW5sb2NrZXIoLi4uYXJncykge1xuICAgIGF3YWl0IHRoaXMuZnNtLmFjdGl2YXRlV2FsbGV0VW5sb2NrZXIoLi4uYXJncylcbiAgICB0aGlzLmVtaXQoJ2xvY2tlZCcpXG4gIH1cblxuICBhc3luYyBhY3RpdmF0ZUxpZ2h0bmluZyguLi5hcmdzKSB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRoaXMuZnNtLmFjdGl2YXRlTGlnaHRuaW5nKC4uLmFyZ3MpXG4gICAgICB0aGlzLmVtaXQoJ2FjdGl2ZScpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgYXdhaXQgdGhpcy5kaXNjb25uZWN0QWxsKClcbiAgICAgIHRocm93IGVcbiAgICB9XG4gIH1cblxuICBhc3luYyBkaXNjb25uZWN0KC4uLmFyZ3MpIHtcbiAgICBpZiAodGhpcy5jYW4oJ2Rpc2Nvbm5lY3QnKSkge1xuICAgICAgYXdhaXQgdGhpcy5mc20uZGlzY29ubmVjdCguLi5hcmdzKVxuICAgIH1cbiAgICBpZiAodGhpcy50b3IuaXNTdGFydGVkKCkpIHtcbiAgICAgIHRoaXMuZW1pdCgndG9yLnN0b3BwaW5nJylcbiAgICAgIGF3YWl0IHRoaXMudG9yLnN0b3AoKVxuICAgICAgdGhpcy5lbWl0KCd0b3Iuc3RvcHBlZCcpXG4gICAgfVxuICAgIHRoaXMuZW1pdCgnZGlzY29ubmVjdGVkJylcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBGU00gT2JzZXJ2ZXJzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBEaXNjb25uZWN0IGZyb20gdGhlIGdSUEMgc2VydmljZS5cbiAgICovXG4gIGFzeW5jIG9uQmVmb3JlRGlzY29ubmVjdCgpIHtcbiAgICBkZWJ1ZyhgRGlzY29ubmVjdGluZyBmcm9tIGxuZCBnUlBDIHNlcnZpY2VgKVxuICAgIGF3YWl0IHRoaXMuZGlzY29ubmVjdEFsbCgpXG4gIH1cbiAgLyoqXG4gICAqIExvZyBzdWNjZXNzZnVsIGRpc2Nvbm5lY3QuXG4gICAqL1xuICBhc3luYyBvbkFmdGVyRGlzY29ubmVjdCgpIHtcbiAgICBkZWJ1ZygnRGlzY29ubmVjdGVkIGZyb20gbG5kIGdSUEMgc2VydmljZScpXG4gIH1cblxuICAvKipcbiAgICogQ29ubmVjdCB0byBhbmQgYWN0aXZhdGUgdGhlIHdhbGxldCB1bmxvY2tlciBhcGkuXG4gICAqL1xuICBhc3luYyBvbkJlZm9yZUFjdGl2YXRlV2FsbGV0VW5sb2NrZXIoKSB7XG4gICAgaWYgKHRoaXMuc2VydmljZXMuV2FsbGV0VW5sb2NrZXIuY2FuKCdjb25uZWN0JykpIHtcbiAgICAgIGF3YWl0IHRoaXMuc2VydmljZXMuV2FsbGV0VW5sb2NrZXIuY29ubmVjdCgpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvbm5lY3QgdG8gYW5kIGFjdGl2YXRlIHRoZSBtYWluIGFwaS5cbiAgICovXG4gIGFzeW5jIG9uQmVmb3JlQWN0aXZhdGVMaWdodG5pbmcoKSB7XG4gICAgY29uc3QgeyBMaWdodG5pbmcsIFdhbGxldFVubG9ja2VyIH0gPSB0aGlzLnNlcnZpY2VzXG5cbiAgICAvLyBhd2FpdCBmb3IgUlBDX0FDVElWRSBzdGF0ZSBiZWZvcmUgaW50ZXJhY3RpbmcgaWYgbmVlZGVkXG4gICAgaWYgKHRoaXMuY2hlY2tSUENTdGF0dXMpIHtcbiAgICAgIGF3YWl0IHRoaXMuY2hlY2tXYWxsZXRTdGF0ZSgnUlBDX0FDVElWRScpXG4gICAgfVxuXG4gICAgLy8gRGlzY29ubmVjdCB3YWxsZXQgdW5sb2NrZXIgaWYgaXRzIGNvbm5lY3RlZC5cbiAgICBpZiAoV2FsbGV0VW5sb2NrZXIuY2FuKCdkaXNjb25uZWN0JykpIHtcbiAgICAgIGF3YWl0IFdhbGxldFVubG9ja2VyLmRpc2Nvbm5lY3QoKVxuICAgIH1cbiAgICAvLyBGaXJzdCBjb25uZWN0IHRvIHRoZSBMaWdodG5pbmcgc2VydmljZS5cbiAgICBhd2FpdCBMaWdodG5pbmcuY29ubmVjdCgpXG5cbiAgICAvLyBGZXRjaCB0aGUgZGV0ZXJtaW5lZCB2ZXJzaW9uLlxuICAgIGNvbnN0IHsgdmVyc2lvbiB9ID0gTGlnaHRuaW5nXG5cbiAgICAvLyBHZXQgYSBsaXN0IG9mIGFsbCBvdGhlciBhdmFpbGFibGUgYW5kIHN1cHBvcnRlZCBzZXJ2aWNlcy5cbiAgICBjb25zdCBhdmFpbGFibGVTZXJ2aWNlcyA9IHJlZ2lzdHJ5W3ZlcnNpb25dLnNlcnZpY2VzXG4gICAgICAubWFwKChzKSA9PiBzLm5hbWUpXG4gICAgICAuZmlsdGVyKChzKSA9PiBPYmplY3Qua2V5cyh0aGlzLnNlcnZpY2VzKS5pbmNsdWRlcyhzKSlcbiAgICAgIC5maWx0ZXIoKHMpID0+ICFbJ1dhbGxldFVubG9ja2VyJywgJ0xpZ2h0bmluZyddLmluY2x1ZGVzKHMpKVxuXG4gICAgLy8gQ29ubmVjdCB0byB0aGUgb3RoZXIgc2VydmljZXMuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICBhdmFpbGFibGVTZXJ2aWNlc1xuICAgICAgICAuZmlsdGVyKChzZXJ2aWNlTmFtZSkgPT4gdGhpcy5zZXJ2aWNlc1tzZXJ2aWNlTmFtZV0uY2FuKCdjb25uZWN0JykpXG4gICAgICAgIC5tYXAoKHNlcnZpY2VOYW1lKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc2VydmljZSA9IHRoaXMuc2VydmljZXNbc2VydmljZU5hbWVdXG4gICAgICAgICAgc2VydmljZS52ZXJzaW9uID0gdmVyc2lvblxuICAgICAgICAgIC8vIERpc2FibGUgd2FpdGluZyBmb3IgY2VydC9tYWNhcm9vbiBmb3Igc3ViLXNlcnZpY2VzLlxuICAgICAgICAgIHJldHVybiBzZXJ2aWNlLmNvbm5lY3Qoe1xuICAgICAgICAgICAgd2FpdEZvckNlcnQ6IGZhbHNlLFxuICAgICAgICAgICAgd2FpdEZvck1hY2Fyb29uOiBmYWxzZSxcbiAgICAgICAgICB9KVxuICAgICAgICB9KSxcbiAgICApXG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gSGVscGVyc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogRGlzY29ubmVjdCBhbGwgc2VydmljZXMuXG4gICAqL1xuICBhc3luYyBkaXNjb25uZWN0QWxsKCkge1xuICAgIGRlYnVnKCdEaXNjb25uZWN0aW5nIGZyb20gYWxsIGdSUEMgc2VydmljZXMnKVxuICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgT2JqZWN0LmtleXModGhpcy5zZXJ2aWNlcykubWFwKChzZXJ2aWNlTmFtZSkgPT4ge1xuICAgICAgICBjb25zdCBzZXJ2aWNlID0gdGhpcy5zZXJ2aWNlc1tzZXJ2aWNlTmFtZV1cbiAgICAgICAgaWYgKHNlcnZpY2UuY2FuKCdkaXNjb25uZWN0JykpIHtcbiAgICAgICAgICByZXR1cm4gc2VydmljZS5kaXNjb25uZWN0KClcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgKVxuICAgIGRlYnVnKCdEaXNjb25uZWN0ZWQgZnJvbSBhbGwgZ1JQQyBzZXJ2aWNlcycpXG4gIH1cblxuICAvKipcbiAgICogUHJvYmUgdG8gZGV0ZXJtaW5lIHdoYXQgc3RhdGUgbG5kIGlzIGluLlxuICAgKi9cbiAgYXN5bmMgZGV0ZXJtaW5lV2FsbGV0U3RhdGUob3B0aW9ucyA9IHsga2VlcGFsaXZlOiBmYWxzZSB9KSB7XG4gICAgZGVidWcoJ0F0dGVtcHRpbmcgdG8gZGV0ZXJtaW5lIHdhbGxldCBzdGF0ZScpXG4gICAgbGV0IHdhbGxldFN0YXRlXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRoaXMuc2VydmljZXMuV2FsbGV0VW5sb2NrZXIuY29ubmVjdCgpXG4gICAgICAvLyBDYWxsIHRoZSB1bmxvY2tXYWxsZXQgbWV0aG9kIHdpdGggYSBtaXNzaW5nIHBhc3N3b3JkIGFyZ3VtZW50LlxuICAgICAgLy8gVGhpcyBpcyBhIHdheSBvZiBwcm9iaW5nIHRoZSBhcGkgdG8gZGV0ZXJtaW5lIGl0J3Mgc3RhdGUuXG4gICAgICBhd2FpdCB0aGlzLnNlcnZpY2VzLldhbGxldFVubG9ja2VyLnVubG9ja1dhbGxldCgpXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHN3aXRjaCAoZXJyb3IuY29kZSkge1xuICAgICAgICAvKlxuICAgICAgICAgIGBVTklNUExFTUVOVEVEYCBpbmRpY2F0ZXMgdGhhdCB0aGUgcmVxdWVzdGVkIG9wZXJhdGlvbiBpcyBub3QgaW1wbGVtZW50ZWQgb3Igbm90IHN1cHBvcnRlZC9lbmFibGVkIGluIHRoZVxuICAgICAgICAgICBzZXJ2aWNlLiBUaGlzIGltcGxpZXMgdGhhdCB0aGUgd2FsbGV0IGlzIGFscmVhZHkgdW5sb2NrZWQsIHNpbmNlIHRoZSBXYWxsZXRVbmxvY2tlciBzZXJ2aWNlIGlzIG5vdCBhY3RpdmUuXG4gICAgICAgICAgIFNlZVxuXG4gICAgICAgICAgIGBERUFETElORV9FWENFRURFRGAgaW5kaWNhdGVzIHRoYXQgdGhlIGRlYWRsaW5lIGV4cGlyZWQgYmVmb3JlIHRoZSBvcGVyYXRpb24gY291bGQgY29tcGxldGUuIEluIHRoZSBjYXNlIG9mXG4gICAgICAgICAgIG91ciBwcm9iZSBoZXJlIHRoZSBsaWtlbHkgY2F1c2Ugb2YgdGhpcyBpcyB0aGF0IHdlIGFyZSBjb25uZWN0aW5nIHRvIGFuIGxuZCBub2RlIHdoZXJlIHRoZSBgbm9zZWVkYmFja3VwYFxuICAgICAgICAgICBmbGFnIGhhcyBiZWVuIHNldCBhbmQgdGhlcmVmb3JlIHRoZSBgV2FsbGV0VW5sb2NrZXJgIGludGVyYWNlIGlzIG5vbi1mdW5jdGlvbmFsLlxuXG4gICAgICAgICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9ncnBjL2dycGMtbm9kZS9ibG9iL21hc3Rlci9wYWNrYWdlcy9ncnBjLW5hdGl2ZS1jb3JlL3NyYy9jb25zdGFudHMuanMjTDEyOS5cbiAgICAgICAgICovXG4gICAgICAgIGNhc2Ugc3RhdHVzLlVOSU1QTEVNRU5URUQ6XG4gICAgICAgIGNhc2Ugc3RhdHVzLkRFQURMSU5FX0VYQ0VFREVEOlxuICAgICAgICAgIGRlYnVnKCdEZXRlcm1pbmVkIHdhbGxldCBzdGF0ZSBhczonLCBXQUxMRVRfU1RBVEVfQUNUSVZFKVxuICAgICAgICAgIHdhbGxldFN0YXRlID0gV0FMTEVUX1NUQVRFX0FDVElWRVxuICAgICAgICAgIHJldHVybiB3YWxsZXRTdGF0ZVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgIGBVTktOT1dOYCBpbmRpY2F0ZXMgdGhhdCB1bmxvY2tXYWxsZXQgd2FzIGNhbGxlZCB3aXRob3V0IGFuIGFyZ3VtZW50IHdoaWNoIGlzIGludmFsaWQuXG4gICAgICAgICAgVGhpcyBpbXBsaWVzIHRoYXQgdGhlIHdhbGxldCBpcyB3YWl0aW5nIHRvIGJlIHVubG9ja2VkLlxuICAgICAgICAqL1xuICAgICAgICBjYXNlIHN0YXR1cy5VTktOT1dOOlxuICAgICAgICAgIGRlYnVnKCdEZXRlcm1pbmVkIHdhbGxldCBzdGF0ZSBhczonLCBXQUxMRVRfU1RBVEVfTE9DS0VEKVxuICAgICAgICAgIHdhbGxldFN0YXRlID0gV0FMTEVUX1NUQVRFX0xPQ0tFRFxuICAgICAgICAgIHJldHVybiB3YWxsZXRTdGF0ZVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgIEJ1YmJsZSBhbGwgb3RoZXIgZXJyb3JzIGJhY2sgdG8gdGhlIGNhbGxlciBhbmQgYWJvcnQgdGhlIGNvbm5lY3Rpb24gYXR0ZW1wdC5cbiAgICAgICAgICBEaXNjb25uZWN0IGFsbCBzZXJ2aWNlcy5cbiAgICAgICAgKi9cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBkZWJ1ZygnVW5hYmxlIHRvIGRldGVybWluZSB3YWxsZXQgc3RhdGUnLCBlcnJvcilcbiAgICAgICAgICB0aHJvdyBlcnJvclxuICAgICAgfVxuICAgIH0gZmluYWxseSB7XG4gICAgICBpZiAoIW9wdGlvbnMua2VlcGFsaXZlICYmIHRoaXMuY2FuKCdkaXNjb25uZWN0JykpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5kaXNjb25uZWN0KClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogV2FpdCBmb3Igd2FsbGV0ICB0byBlbnRlciBhIHBhcnRpY3VsYXIgc3RhdGUuXG4gICAqIEBwYXJhbSAge3N0cmluZ30gc3RhdGUgc3RhdGUgdG8gd2FpdCBmb3IgKFJQQ19BQ1RJVkUsIExPQ0tFRCwgVU5MT0NLRUQpXG4gICAqIEByZXR1cm4ge1Byb21pc2U8T2JqZWN0Pn0uXG4gICAqL1xuICBjaGVja1dhbGxldFN0YXRlKHN0YXRlKSB7XG4gICAgY29uc3Qgd2FpdEZvclN0YXRlID0gcmVzb2x2ZSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5zZXJ2aWNlcy5TdGF0ZS5nZXRTdGF0ZSgpXG4gICAgICAgIC50aGVuKGN1cnJlbnRTdGF0ZSA9PiB7XG4gICAgICAgICAgaWYoY3VycmVudFN0YXRlLnN0YXRlID09PSBzdGF0ZSkge1xuICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KF8gPT4gd2FpdEZvclN0YXRlKHJlc29sdmUpLCA0MDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHdhaXRGb3JTdGF0ZSlcbiAgfVxuXG4gIC8qKlxuICAgKiBXYWl0IGZvciBsbmQgdG8gZW50ZXIgYSBwYXJ0aWN1bGFyIHN0YXRlLlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHN0YXRlIE5hbWUgb2Ygc3RhdGUgdG8gd2FpdCBmb3IgKGxvY2tlZCwgYWN0aXZlLCBkaXNjb25uZWN0ZWQpXG4gICAqIEByZXR1cm4ge1Byb21pc2U8T2JqZWN0Pn0gT2JqZWN0IHdpdGggYGlzRG9uZWAgYW5kIGBjYW5jZWxgIHByb3BlcnRpZXMuXG4gICAqL1xuICB3YWl0Rm9yU3RhdGUoc3RhdGVOYW1lKSB7XG4gICAgbGV0IHN1Y2Nlc3NIYW5kbGVyXG5cbiAgICAvKipcbiAgICAgKiBQcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiBzZXJ2aWNlIGlzIGFjdGl2ZS5cbiAgICAgKi9cbiAgICBjb25zdCBpc0RvbmUgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgLy8gSWYgdGhlIHNlcnZpY2UgaXMgYWxyZWFkeSBpbiB0aGUgcmVxdWVzdGVkIHN0YXRlLCByZXR1cm4gaW1tZWRpYXRlbHkuXG4gICAgICBpZiAodGhpcy5mc20uc3RhdGUgPT09IHN0YXRlTmFtZSkge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZSgpXG4gICAgICB9XG4gICAgICAvLyBPdGhlcndpc2UsIHdhaXQgdW50aWwgd2UgcmVjZWl2ZSBhIHJlbGV2YW50IHN0YXRlIGNoYW5nZSBldmVudC5cbiAgICAgIHN1Y2Nlc3NIYW5kbGVyID0gKCkgPT4gcmVzb2x2ZSgpXG4gICAgICB0aGlzLnByZXBlbmRPbmNlTGlzdGVuZXIoc3RhdGVOYW1lLCBzdWNjZXNzSGFuZGxlcilcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogTWV0aG9kIHRvIGFib3J0IHRoZSB3YWl0IChwcmV2ZW50IHRoZSBpc0RvbmUgZnJvbSByZXNvbHZpbmcgYW5kIHJlbW92ZSBhY3RpdmF0aW9uIGV2ZW50IGxpc3RlbmVyKS5cbiAgICAgKi9cbiAgICBjb25zdCBjYW5jZWwgPSAoKSA9PiB7XG4gICAgICBpZiAoc3VjY2Vzc0hhbmRsZXIpIHtcbiAgICAgICAgdGhpcy5vZmYoc3RhdGVOYW1lLCBzdWNjZXNzSGFuZGxlcilcbiAgICAgICAgc3VjY2Vzc0hhbmRsZXIgPSBudWxsXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgaXNEb25lLCBjYW5jZWwgfVxuICB9XG5cbiAgLyoqXG4gICAqIFN1YnNjcmliZSB0byBXYWxsZXQgU3RhdGUgU3RyZWFtXG4gICAqIEFuZCByZXR1cm4gdGhlIGN1cnJlbnQgc3RhdGVcbiAgICogQHJldHVybiB7UHJvbWlzZTxPYmplY3Q+fS5cbiAgICovXG4gIGFzeW5jIHN1YnNjcmliZVdhbGxldFN0YXRlKCkge1xuICAgIGlmICh0aGlzLnNlcnZpY2VzLlN0YXRlLmNhbignY29ubmVjdCcpKSB7XG4gICAgICBhd2FpdCB0aGlzLnNlcnZpY2VzLlN0YXRlLmNvbm5lY3QoKVxuICAgIH1cblxuICAgIGxldCBzdWJzY3JpYmVTdGF0ZSA9IGF3YWl0IHRoaXMuc2VydmljZXMuU3RhdGUuc3Vic2NyaWJlU3RhdGUoKVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBzdWJzY3JpYmVTdGF0ZS5vbignZGF0YScsIHJlc3BvbnNlID0+IHtcbiAgICAgICAgZGVidWcoYEdvdCB3YWxsZXQgc3RhdGUgYXMgJHtyZXNwb25zZS5zdGF0ZX1gKVxuICAgICAgfSlcbiAgICAgIHN1YnNjcmliZVN0YXRlLm9uKCdlcnJvcicsICgpID0+IHtcbiAgICAgICAgZGVidWcoJ1N0b3BwZWQgbGlzdGVuaW5nIHRvIHdhbGxldCBzdGF0ZScpXG4gICAgICB9KVxuICAgICAgcmVzb2x2ZSh0aGlzLnNlcnZpY2VzLlN0YXRlLmdldFN0YXRlKCkpXG4gICAgIH0pXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTG5kR3JwY1xuIl19