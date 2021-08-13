"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _grpcJs = require("@grpc/grpc-js");

var _utils = require("../utils");

var _service = _interopRequireDefault(require("../service"));

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

/**
 * WalletUnlocker service controller.
 * @extends Service
 */
let WalletUnlocker = /*#__PURE__*/function (_Service) {
  _inherits(WalletUnlocker, _Service);

  var _super = _createSuper(WalletUnlocker);

  function WalletUnlocker(options) {
    var _this;

    _classCallCheck(this, WalletUnlocker);

    _this = _super.call(this, 'WalletUnlocker', options);
    _this.useMacaroon = false;
    return _this;
  }

  _createClass(WalletUnlocker, [{
    key: "initWallet",
    value: async function initWallet(payload = {}, options = {}) {
      this.debug(`Calling ${this.serviceName}.initWallet with payload: %o`, {
        payload,
        options
      });
      const res = await (0, _utils.promisifiedCall)(this.service, this.service.initWallet, payload, options);
      this.emit('unlocked');
      return res;
    }
  }, {
    key: "unlockWallet",
    value: async function unlockWallet(payload = {}, options = {}) {
      this.debug(`Calling ${this.serviceName}.unlockWallet with payload: %o`, {
        payload,
        options
      });
      const res = await (0, _utils.promisifiedCall)(this.service, this.service.unlockWallet, payload, options);
      this.emit('unlocked');
      return res;
    }
  }]);

  return WalletUnlocker;
}(_service.default);

var _default = WalletUnlocker;
exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy93YWxsZXRVbmxvY2tlci5qcyJdLCJuYW1lcyI6WyJXYWxsZXRVbmxvY2tlciIsIm9wdGlvbnMiLCJ1c2VNYWNhcm9vbiIsInBheWxvYWQiLCJkZWJ1ZyIsInNlcnZpY2VOYW1lIiwicmVzIiwic2VydmljZSIsImluaXRXYWxsZXQiLCJlbWl0IiwidW5sb2NrV2FsbGV0IiwiU2VydmljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtJQUNNQSxjOzs7OztBQUNKLDBCQUFZQyxPQUFaLEVBQXFCO0FBQUE7O0FBQUE7O0FBQ25CLDhCQUFNLGdCQUFOLEVBQXdCQSxPQUF4QjtBQUNBLFVBQUtDLFdBQUwsR0FBbUIsS0FBbkI7QUFGbUI7QUFHcEI7Ozs7V0FFRCwwQkFBaUJDLE9BQU8sR0FBRyxFQUEzQixFQUErQkYsT0FBTyxHQUFHLEVBQXpDLEVBQTZDO0FBQzNDLFdBQUtHLEtBQUwsQ0FBWSxXQUFVLEtBQUtDLFdBQVksOEJBQXZDLEVBQXNFO0FBQUVGLFFBQUFBLE9BQUY7QUFBV0YsUUFBQUE7QUFBWCxPQUF0RTtBQUNBLFlBQU1LLEdBQUcsR0FBRyxNQUFNLDRCQUFnQixLQUFLQyxPQUFyQixFQUE4QixLQUFLQSxPQUFMLENBQWFDLFVBQTNDLEVBQXVETCxPQUF2RCxFQUFnRUYsT0FBaEUsQ0FBbEI7QUFDQSxXQUFLUSxJQUFMLENBQVUsVUFBVjtBQUNBLGFBQU9ILEdBQVA7QUFDRDs7O1dBRUQsNEJBQW1CSCxPQUFPLEdBQUcsRUFBN0IsRUFBaUNGLE9BQU8sR0FBRyxFQUEzQyxFQUErQztBQUM3QyxXQUFLRyxLQUFMLENBQVksV0FBVSxLQUFLQyxXQUFZLGdDQUF2QyxFQUF3RTtBQUFFRixRQUFBQSxPQUFGO0FBQVdGLFFBQUFBO0FBQVgsT0FBeEU7QUFDQSxZQUFNSyxHQUFHLEdBQUcsTUFBTSw0QkFBZ0IsS0FBS0MsT0FBckIsRUFBOEIsS0FBS0EsT0FBTCxDQUFhRyxZQUEzQyxFQUF5RFAsT0FBekQsRUFBa0VGLE9BQWxFLENBQWxCO0FBQ0EsV0FBS1EsSUFBTCxDQUFVLFVBQVY7QUFDQSxhQUFPSCxHQUFQO0FBQ0Q7Ozs7RUFsQjBCSyxnQjs7ZUFxQmRYLGMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBzdGF0dXMgfSBmcm9tICdAZ3JwYy9ncnBjLWpzJ1xuaW1wb3J0IHsgcHJvbWlzaWZpZWRDYWxsIH0gZnJvbSAnLi4vdXRpbHMnXG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9zZXJ2aWNlJ1xuXG4vKipcbiAqIFdhbGxldFVubG9ja2VyIHNlcnZpY2UgY29udHJvbGxlci5cbiAqIEBleHRlbmRzIFNlcnZpY2VcbiAqL1xuY2xhc3MgV2FsbGV0VW5sb2NrZXIgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKCdXYWxsZXRVbmxvY2tlcicsIG9wdGlvbnMpXG4gICAgdGhpcy51c2VNYWNhcm9vbiA9IGZhbHNlXG4gIH1cblxuICBhc3luYyBpbml0V2FsbGV0KHBheWxvYWQgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5kZWJ1ZyhgQ2FsbGluZyAke3RoaXMuc2VydmljZU5hbWV9LmluaXRXYWxsZXQgd2l0aCBwYXlsb2FkOiAlb2AsIHsgcGF5bG9hZCwgb3B0aW9ucyB9KVxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IHByb21pc2lmaWVkQ2FsbCh0aGlzLnNlcnZpY2UsIHRoaXMuc2VydmljZS5pbml0V2FsbGV0LCBwYXlsb2FkLCBvcHRpb25zKVxuICAgIHRoaXMuZW1pdCgndW5sb2NrZWQnKVxuICAgIHJldHVybiByZXNcbiAgfVxuXG4gIGFzeW5jIHVubG9ja1dhbGxldChwYXlsb2FkID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuZGVidWcoYENhbGxpbmcgJHt0aGlzLnNlcnZpY2VOYW1lfS51bmxvY2tXYWxsZXQgd2l0aCBwYXlsb2FkOiAlb2AsIHsgcGF5bG9hZCwgb3B0aW9ucyB9KVxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IHByb21pc2lmaWVkQ2FsbCh0aGlzLnNlcnZpY2UsIHRoaXMuc2VydmljZS51bmxvY2tXYWxsZXQsIHBheWxvYWQsIG9wdGlvbnMpXG4gICAgdGhpcy5lbWl0KCd1bmxvY2tlZCcpXG4gICAgcmV0dXJuIHJlc1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFdhbGxldFVubG9ja2VyXG4iXX0=