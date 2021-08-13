"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/**
 * Helper function to determine if a hostname is on Tor.
 *
 * @param {string} host Hostname
 * @return {boolean} Boolean indicating if host is Tor
 */
const isTor = host => {
  const _host$split = host.split(':'),
        _host$split2 = _slicedToArray(_host$split, 1),
        lndHost = _host$split2[0];

  return lndHost.endsWith('.onion');
};

var _default = isTor;
exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9pc1Rvci5qcyJdLCJuYW1lcyI6WyJpc1RvciIsImhvc3QiLCJzcGxpdCIsImxuZEhvc3QiLCJlbmRzV2l0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU1BLEtBQUssR0FBSUMsSUFBRCxJQUFVO0FBQ3RCLHNCQUFrQkEsSUFBSSxDQUFDQyxLQUFMLENBQVcsR0FBWCxDQUFsQjtBQUFBO0FBQUEsUUFBT0MsT0FBUDs7QUFDQSxTQUFPQSxPQUFPLENBQUNDLFFBQVIsQ0FBaUIsUUFBakIsQ0FBUDtBQUNELENBSEQ7O2VBS2VKLEsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEhlbHBlciBmdW5jdGlvbiB0byBkZXRlcm1pbmUgaWYgYSBob3N0bmFtZSBpcyBvbiBUb3IuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGhvc3QgSG9zdG5hbWVcbiAqIEByZXR1cm4ge2Jvb2xlYW59IEJvb2xlYW4gaW5kaWNhdGluZyBpZiBob3N0IGlzIFRvclxuICovXG5jb25zdCBpc1RvciA9IChob3N0KSA9PiB7XG4gIGNvbnN0IFtsbmRIb3N0XSA9IGhvc3Quc3BsaXQoJzonKVxuICByZXR1cm4gbG5kSG9zdC5lbmRzV2l0aCgnLm9uaW9uJylcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNUb3JcbiJdfQ==