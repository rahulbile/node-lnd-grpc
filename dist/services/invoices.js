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
 * Invoices service controller.
 * @extends Service
 */
let Invoices = /*#__PURE__*/function (_Service) {
  _inherits(Invoices, _Service);

  var _super = _createSuper(Invoices);

  function Invoices(options) {
    var _this;

    _classCallCheck(this, Invoices);

    _this = _super.call(this, 'Invoices', options);
    _this.useMacaroon = true;
    return _this;
  }

  return Invoices;
}(_service.default);

var _default = Invoices;
exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9pbnZvaWNlcy5qcyJdLCJuYW1lcyI6WyJJbnZvaWNlcyIsIm9wdGlvbnMiLCJ1c2VNYWNhcm9vbiIsIlNlcnZpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtJQUNNQSxROzs7OztBQUNKLG9CQUFZQyxPQUFaLEVBQXFCO0FBQUE7O0FBQUE7O0FBQ25CLDhCQUFNLFVBQU4sRUFBa0JBLE9BQWxCO0FBQ0EsVUFBS0MsV0FBTCxHQUFtQixJQUFuQjtBQUZtQjtBQUdwQjs7O0VBSm9CQyxnQjs7ZUFPUkgsUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL3NlcnZpY2UnXG5cbi8qKlxuICogSW52b2ljZXMgc2VydmljZSBjb250cm9sbGVyLlxuICogQGV4dGVuZHMgU2VydmljZVxuICovXG5jbGFzcyBJbnZvaWNlcyBleHRlbmRzIFNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIoJ0ludm9pY2VzJywgb3B0aW9ucylcbiAgICB0aGlzLnVzZU1hY2Fyb29uID0gdHJ1ZVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEludm9pY2VzXG4iXX0=