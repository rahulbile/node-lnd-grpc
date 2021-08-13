"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

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
 * WatchtowerClient service controller.
 * @extends Service
 */
let WatchtowerClient = /*#__PURE__*/function (_Service) {
  _inherits(WatchtowerClient, _Service);

  var _super = _createSuper(WatchtowerClient);

  function WatchtowerClient(options) {
    var _this;

    _classCallCheck(this, WatchtowerClient);

    _this = _super.call(this, 'WatchtowerClient', options);
    _this.useMacaroon = true;
    return _this;
  }

  return WatchtowerClient;
}(_service.default);

var _default = WatchtowerClient;
exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy93YXRjaHRvd2VyQ2xpZW50LmpzIl0sIm5hbWVzIjpbIldhdGNodG93ZXJDbGllbnQiLCJvcHRpb25zIiwidXNlTWFjYXJvb24iLCJTZXJ2aWNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7SUFDTUEsZ0I7Ozs7O0FBQ0osNEJBQVlDLE9BQVosRUFBcUI7QUFBQTs7QUFBQTs7QUFDbkIsOEJBQU0sa0JBQU4sRUFBMEJBLE9BQTFCO0FBQ0EsVUFBS0MsV0FBTCxHQUFtQixJQUFuQjtBQUZtQjtBQUdwQjs7O0VBSjRCQyxnQjs7ZUFPaEJILGdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vc2VydmljZSdcblxuLyoqXG4gKiBXYXRjaHRvd2VyQ2xpZW50IHNlcnZpY2UgY29udHJvbGxlci5cbiAqIEBleHRlbmRzIFNlcnZpY2VcbiAqL1xuY2xhc3MgV2F0Y2h0b3dlckNsaWVudCBleHRlbmRzIFNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIoJ1dhdGNodG93ZXJDbGllbnQnLCBvcHRpb25zKVxuICAgIHRoaXMudXNlTWFjYXJvb24gPSB0cnVlXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgV2F0Y2h0b3dlckNsaWVudFxuIl19