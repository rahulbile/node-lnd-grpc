"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _grpcJs = require("@grpc/grpc-js");

var _utils = require("../utils");

var _service = _interopRequireDefault(require("../service"));

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

/**
 * Lightning service controller.
 * @extends Service
 */
let Lightning = /*#__PURE__*/function (_Service) {
  _inherits(Lightning, _Service);

  var _super = _createSuper(Lightning);

  function Lightning(options) {
    var _this;

    _classCallCheck(this, Lightning);

    _this = _super.call(this, 'Lightning', options);
    _this.useMacaroon = true;
    return _this;
  }
  /**
   * Reconnect using closest rpc.proto file match.
   */


  _createClass(Lightning, [{
    key: "onBeforeConnect",
    value: async function onBeforeConnect() {
      this.debug(`Connecting to ${this.serviceName} gRPC service`); // Establish a connection, as normal.

      await this.establishConnection(); // Try to make a call to ensure that the connection is usable.
      // We call to getInfo in order to determine the api version.

      const info = await this.getInfo({}, {
        deadline: (0, _utils.getDeadline)(_utils.PROBE_TIMEOUT)
      });
      this.debug('Connected to Lightning gRPC: %O', info); // Determine most relevant proto version based on the api info.

      const _await$Promise$all = await Promise.all([(0, _utils.getClosestProtoVersion)(info.version), (0, _utils.getLatestProtoVersion)()]),
            _await$Promise$all2 = _slicedToArray(_await$Promise$all, 2),
            closestProtoVersion = _await$Promise$all2[0],
            latestProtoVersion = _await$Promise$all2[1]; // Reconnect using best matching rpc proto if needed.


      if (closestProtoVersion !== latestProtoVersion) {
        this.debug('Found better match. Reconnecting using rpc.proto version: %s', closestProtoVersion);
        this.service.close();
        await this.establishConnection({
          version: closestProtoVersion
        });
      }
    }
  }]);

  return Lightning;
}(_service.default);

var _default = Lightning;
exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9saWdodG5pbmcuanMiXSwibmFtZXMiOlsiTGlnaHRuaW5nIiwib3B0aW9ucyIsInVzZU1hY2Fyb29uIiwiZGVidWciLCJzZXJ2aWNlTmFtZSIsImVzdGFibGlzaENvbm5lY3Rpb24iLCJpbmZvIiwiZ2V0SW5mbyIsImRlYWRsaW5lIiwiUFJPQkVfVElNRU9VVCIsIlByb21pc2UiLCJhbGwiLCJ2ZXJzaW9uIiwiY2xvc2VzdFByb3RvVmVyc2lvbiIsImxhdGVzdFByb3RvVmVyc2lvbiIsInNlcnZpY2UiLCJjbG9zZSIsIlNlcnZpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7SUFDTUEsUzs7Ozs7QUFDSixxQkFBWUMsT0FBWixFQUFxQjtBQUFBOztBQUFBOztBQUNuQiw4QkFBTSxXQUFOLEVBQW1CQSxPQUFuQjtBQUNBLFVBQUtDLFdBQUwsR0FBbUIsSUFBbkI7QUFGbUI7QUFHcEI7QUFFRDtBQUNGO0FBQ0E7Ozs7O1dBQ0UsaUNBQXdCO0FBQ3RCLFdBQUtDLEtBQUwsQ0FBWSxpQkFBZ0IsS0FBS0MsV0FBWSxlQUE3QyxFQURzQixDQUd0Qjs7QUFDQSxZQUFNLEtBQUtDLG1CQUFMLEVBQU4sQ0FKc0IsQ0FNdEI7QUFDQTs7QUFDQSxZQUFNQyxJQUFJLEdBQUcsTUFBTSxLQUFLQyxPQUFMLENBQWEsRUFBYixFQUFpQjtBQUFFQyxRQUFBQSxRQUFRLEVBQUUsd0JBQVlDLG9CQUFaO0FBQVosT0FBakIsQ0FBbkI7QUFDQSxXQUFLTixLQUFMLENBQVcsaUNBQVgsRUFBOENHLElBQTlDLEVBVHNCLENBV3RCOztBQUNBLGlDQUFrRCxNQUFNSSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxDQUNsRSxtQ0FBdUJMLElBQUksQ0FBQ00sT0FBNUIsQ0FEa0UsRUFFbEUsbUNBRmtFLENBQVosQ0FBeEQ7QUFBQTtBQUFBLFlBQU9DLG1CQUFQO0FBQUEsWUFBNEJDLGtCQUE1QiwwQkFac0IsQ0FpQnRCOzs7QUFDQSxVQUFJRCxtQkFBbUIsS0FBS0Msa0JBQTVCLEVBQWdEO0FBQzlDLGFBQUtYLEtBQUwsQ0FBVyw4REFBWCxFQUEyRVUsbUJBQTNFO0FBQ0EsYUFBS0UsT0FBTCxDQUFhQyxLQUFiO0FBQ0EsY0FBTSxLQUFLWCxtQkFBTCxDQUF5QjtBQUFFTyxVQUFBQSxPQUFPLEVBQUVDO0FBQVgsU0FBekIsQ0FBTjtBQUNEO0FBQ0Y7Ozs7RUFoQ3FCSSxnQjs7ZUFtQ1RqQixTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgc3RhdHVzIH0gZnJvbSAnQGdycGMvZ3JwYy1qcydcbmltcG9ydCB7IGdldERlYWRsaW5lLCBnZXRDbG9zZXN0UHJvdG9WZXJzaW9uLCBnZXRMYXRlc3RQcm90b1ZlcnNpb24sIFBST0JFX1RJTUVPVVQgfSBmcm9tICcuLi91dGlscydcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL3NlcnZpY2UnXG5cbi8qKlxuICogTGlnaHRuaW5nIHNlcnZpY2UgY29udHJvbGxlci5cbiAqIEBleHRlbmRzIFNlcnZpY2VcbiAqL1xuY2xhc3MgTGlnaHRuaW5nIGV4dGVuZHMgU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcignTGlnaHRuaW5nJywgb3B0aW9ucylcbiAgICB0aGlzLnVzZU1hY2Fyb29uID0gdHJ1ZVxuICB9XG5cbiAgLyoqXG4gICAqIFJlY29ubmVjdCB1c2luZyBjbG9zZXN0IHJwYy5wcm90byBmaWxlIG1hdGNoLlxuICAgKi9cbiAgYXN5bmMgb25CZWZvcmVDb25uZWN0KCkge1xuICAgIHRoaXMuZGVidWcoYENvbm5lY3RpbmcgdG8gJHt0aGlzLnNlcnZpY2VOYW1lfSBnUlBDIHNlcnZpY2VgKVxuXG4gICAgLy8gRXN0YWJsaXNoIGEgY29ubmVjdGlvbiwgYXMgbm9ybWFsLlxuICAgIGF3YWl0IHRoaXMuZXN0YWJsaXNoQ29ubmVjdGlvbigpXG5cbiAgICAvLyBUcnkgdG8gbWFrZSBhIGNhbGwgdG8gZW5zdXJlIHRoYXQgdGhlIGNvbm5lY3Rpb24gaXMgdXNhYmxlLlxuICAgIC8vIFdlIGNhbGwgdG8gZ2V0SW5mbyBpbiBvcmRlciB0byBkZXRlcm1pbmUgdGhlIGFwaSB2ZXJzaW9uLlxuICAgIGNvbnN0IGluZm8gPSBhd2FpdCB0aGlzLmdldEluZm8oe30sIHsgZGVhZGxpbmU6IGdldERlYWRsaW5lKFBST0JFX1RJTUVPVVQpIH0pXG4gICAgdGhpcy5kZWJ1ZygnQ29ubmVjdGVkIHRvIExpZ2h0bmluZyBnUlBDOiAlTycsIGluZm8pXG5cbiAgICAvLyBEZXRlcm1pbmUgbW9zdCByZWxldmFudCBwcm90byB2ZXJzaW9uIGJhc2VkIG9uIHRoZSBhcGkgaW5mby5cbiAgICBjb25zdCBbY2xvc2VzdFByb3RvVmVyc2lvbiwgbGF0ZXN0UHJvdG9WZXJzaW9uXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgIGdldENsb3Nlc3RQcm90b1ZlcnNpb24oaW5mby52ZXJzaW9uKSxcbiAgICAgIGdldExhdGVzdFByb3RvVmVyc2lvbigpLFxuICAgIF0pXG5cbiAgICAvLyBSZWNvbm5lY3QgdXNpbmcgYmVzdCBtYXRjaGluZyBycGMgcHJvdG8gaWYgbmVlZGVkLlxuICAgIGlmIChjbG9zZXN0UHJvdG9WZXJzaW9uICE9PSBsYXRlc3RQcm90b1ZlcnNpb24pIHtcbiAgICAgIHRoaXMuZGVidWcoJ0ZvdW5kIGJldHRlciBtYXRjaC4gUmVjb25uZWN0aW5nIHVzaW5nIHJwYy5wcm90byB2ZXJzaW9uOiAlcycsIGNsb3Nlc3RQcm90b1ZlcnNpb24pXG4gICAgICB0aGlzLnNlcnZpY2UuY2xvc2UoKVxuICAgICAgYXdhaXQgdGhpcy5lc3RhYmxpc2hDb25uZWN0aW9uKHsgdmVyc2lvbjogY2xvc2VzdFByb3RvVmVyc2lvbiB9KVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBMaWdodG5pbmdcbiJdfQ==