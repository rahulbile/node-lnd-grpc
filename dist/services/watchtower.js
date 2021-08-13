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
 * Watchtower service controller.
 * @extends Service
 */
let Watchtower = /*#__PURE__*/function (_Service) {
  _inherits(Watchtower, _Service);

  var _super = _createSuper(Watchtower);

  function Watchtower(options) {
    var _this;

    _classCallCheck(this, Watchtower);

    _this = _super.call(this, 'Watchtower', options);
    _this.useMacaroon = true;
    return _this;
  }

  return Watchtower;
}(_service.default);

var _default = Watchtower;
exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy93YXRjaHRvd2VyLmpzIl0sIm5hbWVzIjpbIldhdGNodG93ZXIiLCJvcHRpb25zIiwidXNlTWFjYXJvb24iLCJTZXJ2aWNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7SUFDTUEsVTs7Ozs7QUFDSixzQkFBWUMsT0FBWixFQUFxQjtBQUFBOztBQUFBOztBQUNuQiw4QkFBTSxZQUFOLEVBQW9CQSxPQUFwQjtBQUNBLFVBQUtDLFdBQUwsR0FBbUIsSUFBbkI7QUFGbUI7QUFHcEI7OztFQUpzQkMsZ0I7O2VBT1ZILFUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmljZSBmcm9tICcuLi9zZXJ2aWNlJ1xuXG4vKipcbiAqIFdhdGNodG93ZXIgc2VydmljZSBjb250cm9sbGVyLlxuICogQGV4dGVuZHMgU2VydmljZVxuICovXG5jbGFzcyBXYXRjaHRvd2VyIGV4dGVuZHMgU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcignV2F0Y2h0b3dlcicsIG9wdGlvbnMpXG4gICAgdGhpcy51c2VNYWNhcm9vbiA9IHRydWVcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBXYXRjaHRvd2VyXG4iXX0=