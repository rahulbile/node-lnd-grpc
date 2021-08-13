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
 * Versioner service controller.
 * @extends Service
 */
let Versioner = /*#__PURE__*/function (_Service) {
  _inherits(Versioner, _Service);

  var _super = _createSuper(Versioner);

  function Versioner(options) {
    var _this;

    _classCallCheck(this, Versioner);

    _this = _super.call(this, 'Versioner', options);
    _this.useMacaroon = true;
    return _this;
  }

  return Versioner;
}(_service.default);

var _default = Versioner;
exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy92ZXJzaW9uZXIuanMiXSwibmFtZXMiOlsiVmVyc2lvbmVyIiwib3B0aW9ucyIsInVzZU1hY2Fyb29uIiwiU2VydmljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0lBQ01BLFM7Ozs7O0FBQ0oscUJBQVlDLE9BQVosRUFBcUI7QUFBQTs7QUFBQTs7QUFDbkIsOEJBQU0sV0FBTixFQUFtQkEsT0FBbkI7QUFDQSxVQUFLQyxXQUFMLEdBQW1CLElBQW5CO0FBRm1CO0FBR3BCOzs7RUFKcUJDLGdCOztlQU9USCxTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vc2VydmljZSdcblxuLyoqXG4gKiBWZXJzaW9uZXIgc2VydmljZSBjb250cm9sbGVyLlxuICogQGV4dGVuZHMgU2VydmljZVxuICovXG5jbGFzcyBWZXJzaW9uZXIgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKCdWZXJzaW9uZXInLCBvcHRpb25zKVxuICAgIHRoaXMudXNlTWFjYXJvb24gPSB0cnVlXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVmVyc2lvbmVyXG4iXX0=