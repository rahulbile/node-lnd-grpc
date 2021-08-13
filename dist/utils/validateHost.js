"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dns = _interopRequireDefault(require("dns"));

var _util = require("util");

var _isFQDN = _interopRequireDefault(require("validator/lib/isFQDN"));

var _isIP = _interopRequireDefault(require("validator/lib/isIP"));

var _isPort = _interopRequireDefault(require("validator/lib/isPort"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

const dnsLookup = (0, _util.promisify)(_dns.default.lookup);
/**
 * Helper function to check a hostname in the format hostname:port is valid for passing to node-grpc.
 * @param {string} host A hostname + optional port in the format [hostname]:[port?]
 * @returns {Promise<Boolean>}
 */

const validateHost = async host => {
  const createError = (msg, code) => {
    const error = new Error(msg);
    error.code = code;
    return Promise.reject(error);
  };

  try {
    const _host$split = host.split(':'),
          _host$split2 = _slicedToArray(_host$split, 2),
          lndHost = _host$split2[0],
          lndPort = _host$split2[1]; // If the host includes a port, ensure that it is a valid.


    if (lndPort && !(0, _isPort.default)(lndPort)) {
      return createError(`${lndPort} is not a valid port`, 'LND_GRPC_HOST_ERROR');
    }

    if (lndHost.endsWith('.onion')) {
      return true;
    } // If the hostname starts with a number, ensure that it is a valid IP address.


    if (!(0, _isFQDN.default)(lndHost, {
      require_tld: false
    }) && !(0, _isIP.default)(lndHost)) {
      return createError(`${lndHost} is not a valid IP address or hostname`, 'LND_GRPC_HOST_ERROR');
    }

    try {
      // Do a DNS lookup to ensure that the host is reachable.
      await dnsLookup(lndHost);
      return true;
    } catch (e) {
      return createError(`${lndHost} is not accessible: ${e.message}`);
    }
  } catch (e) {
    return createError(`Host is invalid: ${e.message}`, 'LND_GRPC_HOST_ERROR');
  }
};

var _default = validateHost;
exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy92YWxpZGF0ZUhvc3QuanMiXSwibmFtZXMiOlsiZG5zTG9va3VwIiwiZG5zIiwibG9va3VwIiwidmFsaWRhdGVIb3N0IiwiaG9zdCIsImNyZWF0ZUVycm9yIiwibXNnIiwiY29kZSIsImVycm9yIiwiRXJyb3IiLCJQcm9taXNlIiwicmVqZWN0Iiwic3BsaXQiLCJsbmRIb3N0IiwibG5kUG9ydCIsImVuZHNXaXRoIiwicmVxdWlyZV90bGQiLCJlIiwibWVzc2FnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsTUFBTUEsU0FBUyxHQUFHLHFCQUFVQyxhQUFJQyxNQUFkLENBQWxCO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxNQUFNQyxZQUFZLEdBQUcsTUFBT0MsSUFBUCxJQUFnQjtBQUNuQyxRQUFNQyxXQUFXLEdBQUcsQ0FBQ0MsR0FBRCxFQUFNQyxJQUFOLEtBQWU7QUFDakMsVUFBTUMsS0FBSyxHQUFHLElBQUlDLEtBQUosQ0FBVUgsR0FBVixDQUFkO0FBQ0FFLElBQUFBLEtBQUssQ0FBQ0QsSUFBTixHQUFhQSxJQUFiO0FBQ0EsV0FBT0csT0FBTyxDQUFDQyxNQUFSLENBQWVILEtBQWYsQ0FBUDtBQUNELEdBSkQ7O0FBTUEsTUFBSTtBQUNGLHdCQUEyQkosSUFBSSxDQUFDUSxLQUFMLENBQVcsR0FBWCxDQUEzQjtBQUFBO0FBQUEsVUFBT0MsT0FBUDtBQUFBLFVBQWdCQyxPQUFoQixtQkFERSxDQUdGOzs7QUFDQSxRQUFJQSxPQUFPLElBQUksQ0FBQyxxQkFBT0EsT0FBUCxDQUFoQixFQUFpQztBQUMvQixhQUFPVCxXQUFXLENBQUUsR0FBRVMsT0FBUSxzQkFBWixFQUFtQyxxQkFBbkMsQ0FBbEI7QUFDRDs7QUFFRCxRQUFJRCxPQUFPLENBQUNFLFFBQVIsQ0FBaUIsUUFBakIsQ0FBSixFQUFnQztBQUM5QixhQUFPLElBQVA7QUFDRCxLQVZDLENBWUY7OztBQUNBLFFBQUksQ0FBQyxxQkFBT0YsT0FBUCxFQUFnQjtBQUFFRyxNQUFBQSxXQUFXLEVBQUU7QUFBZixLQUFoQixDQUFELElBQTRDLENBQUMsbUJBQUtILE9BQUwsQ0FBakQsRUFBZ0U7QUFDOUQsYUFBT1IsV0FBVyxDQUFFLEdBQUVRLE9BQVEsd0NBQVosRUFBcUQscUJBQXJELENBQWxCO0FBQ0Q7O0FBRUQsUUFBSTtBQUNGO0FBQ0EsWUFBTWIsU0FBUyxDQUFDYSxPQUFELENBQWY7QUFDQSxhQUFPLElBQVA7QUFDRCxLQUpELENBSUUsT0FBT0ksQ0FBUCxFQUFVO0FBQ1YsYUFBT1osV0FBVyxDQUFFLEdBQUVRLE9BQVEsdUJBQXNCSSxDQUFDLENBQUNDLE9BQVEsRUFBNUMsQ0FBbEI7QUFDRDtBQUNGLEdBeEJELENBd0JFLE9BQU9ELENBQVAsRUFBVTtBQUNWLFdBQU9aLFdBQVcsQ0FBRSxvQkFBbUJZLENBQUMsQ0FBQ0MsT0FBUSxFQUEvQixFQUFrQyxxQkFBbEMsQ0FBbEI7QUFDRDtBQUNGLENBbENEOztlQW9DZWYsWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkbnMgZnJvbSAnZG5zJ1xuaW1wb3J0IHsgcHJvbWlzaWZ5IH0gZnJvbSAndXRpbCdcbmltcG9ydCBpc0ZRRE4gZnJvbSAndmFsaWRhdG9yL2xpYi9pc0ZRRE4nXG5pbXBvcnQgaXNJUCBmcm9tICd2YWxpZGF0b3IvbGliL2lzSVAnXG5pbXBvcnQgaXNQb3J0IGZyb20gJ3ZhbGlkYXRvci9saWIvaXNQb3J0J1xuXG5jb25zdCBkbnNMb29rdXAgPSBwcm9taXNpZnkoZG5zLmxvb2t1cClcblxuLyoqXG4gKiBIZWxwZXIgZnVuY3Rpb24gdG8gY2hlY2sgYSBob3N0bmFtZSBpbiB0aGUgZm9ybWF0IGhvc3RuYW1lOnBvcnQgaXMgdmFsaWQgZm9yIHBhc3NpbmcgdG8gbm9kZS1ncnBjLlxuICogQHBhcmFtIHtzdHJpbmd9IGhvc3QgQSBob3N0bmFtZSArIG9wdGlvbmFsIHBvcnQgaW4gdGhlIGZvcm1hdCBbaG9zdG5hbWVdOltwb3J0P11cbiAqIEByZXR1cm5zIHtQcm9taXNlPEJvb2xlYW4+fVxuICovXG5jb25zdCB2YWxpZGF0ZUhvc3QgPSBhc3luYyAoaG9zdCkgPT4ge1xuICBjb25zdCBjcmVhdGVFcnJvciA9IChtc2csIGNvZGUpID0+IHtcbiAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcihtc2cpXG4gICAgZXJyb3IuY29kZSA9IGNvZGVcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpXG4gIH1cblxuICB0cnkge1xuICAgIGNvbnN0IFtsbmRIb3N0LCBsbmRQb3J0XSA9IGhvc3Quc3BsaXQoJzonKVxuXG4gICAgLy8gSWYgdGhlIGhvc3QgaW5jbHVkZXMgYSBwb3J0LCBlbnN1cmUgdGhhdCBpdCBpcyBhIHZhbGlkLlxuICAgIGlmIChsbmRQb3J0ICYmICFpc1BvcnQobG5kUG9ydCkpIHtcbiAgICAgIHJldHVybiBjcmVhdGVFcnJvcihgJHtsbmRQb3J0fSBpcyBub3QgYSB2YWxpZCBwb3J0YCwgJ0xORF9HUlBDX0hPU1RfRVJST1InKVxuICAgIH1cblxuICAgIGlmIChsbmRIb3N0LmVuZHNXaXRoKCcub25pb24nKSkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgaG9zdG5hbWUgc3RhcnRzIHdpdGggYSBudW1iZXIsIGVuc3VyZSB0aGF0IGl0IGlzIGEgdmFsaWQgSVAgYWRkcmVzcy5cbiAgICBpZiAoIWlzRlFETihsbmRIb3N0LCB7IHJlcXVpcmVfdGxkOiBmYWxzZSB9KSAmJiAhaXNJUChsbmRIb3N0KSkge1xuICAgICAgcmV0dXJuIGNyZWF0ZUVycm9yKGAke2xuZEhvc3R9IGlzIG5vdCBhIHZhbGlkIElQIGFkZHJlc3Mgb3IgaG9zdG5hbWVgLCAnTE5EX0dSUENfSE9TVF9FUlJPUicpXG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIC8vIERvIGEgRE5TIGxvb2t1cCB0byBlbnN1cmUgdGhhdCB0aGUgaG9zdCBpcyByZWFjaGFibGUuXG4gICAgICBhd2FpdCBkbnNMb29rdXAobG5kSG9zdClcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGNyZWF0ZUVycm9yKGAke2xuZEhvc3R9IGlzIG5vdCBhY2Nlc3NpYmxlOiAke2UubWVzc2FnZX1gKVxuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBjcmVhdGVFcnJvcihgSG9zdCBpcyBpbnZhbGlkOiAke2UubWVzc2FnZX1gLCAnTE5EX0dSUENfSE9TVF9FUlJPUicpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgdmFsaWRhdGVIb3N0XG4iXX0=