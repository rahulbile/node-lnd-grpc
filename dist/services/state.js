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

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/**
 * State service controller.
 * @extends Service
 */
let State = /*#__PURE__*/function (_Service) {
  _inherits(State, _Service);

  var _super = _createSuper(State);

  function State(options) {
    var _this;

    _classCallCheck(this, State);

    _this = _super.call(this, 'State', options);
    _this.useMacaroon = false;
    return _this;
  }

  return State;
}(_service.default);

var _default = State;
exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9zdGF0ZS5qcyJdLCJuYW1lcyI6WyJTdGF0ZSIsIm9wdGlvbnMiLCJ1c2VNYWNhcm9vbiIsIlNlcnZpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtJQUNNQSxLOzs7OztBQUNKLGlCQUFZQyxPQUFaLEVBQXFCO0FBQUE7O0FBQUE7O0FBQ25CLDhCQUFNLE9BQU4sRUFBZUEsT0FBZjtBQUNBLFVBQUtDLFdBQUwsR0FBbUIsS0FBbkI7QUFGbUI7QUFHcEI7OztFQUppQkMsZ0I7O2VBT0xILEsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBzdGF0dXMgfSBmcm9tICdAZ3JwYy9ncnBjLWpzJ1xuaW1wb3J0IHsgcHJvbWlzaWZpZWRDYWxsIH0gZnJvbSAnLi4vdXRpbHMnXG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9zZXJ2aWNlJ1xuXG4vKipcbiAqIFN0YXRlIHNlcnZpY2UgY29udHJvbGxlci5cbiAqIEBleHRlbmRzIFNlcnZpY2VcbiAqL1xuY2xhc3MgU3RhdGUgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKCdTdGF0ZScsIG9wdGlvbnMpXG4gICAgdGhpcy51c2VNYWNhcm9vbiA9IGZhbHNlXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU3RhdGVcbiJdfQ==