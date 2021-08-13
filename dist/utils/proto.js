"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getClosestProtoVersion = exports.getLatestProtoVersion = exports.getProtoVersions = exports.getProtoDir = exports.GRPC_HIGHEST_STABLE_VERSION = exports.GRPC_LOWEST_VERSION = void 0;

var _path = require("path");

var _semver = _interopRequireDefault(require("semver"));

var _debug = _interopRequireDefault(require("debug"));

var _registry = _interopRequireDefault(require("../registry"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

const debug = (0, _debug.default)('lnrpc:proto');
const GRPC_LOWEST_VERSION = '0.4.2-beta';
exports.GRPC_LOWEST_VERSION = GRPC_LOWEST_VERSION;
const GRPC_HIGHEST_STABLE_VERSION = '0.13.1-beta';
/**
 * Get the directory where rpc.proto files are stored.
 * @return {String} Directory where rpoc.proto files are stored.
 */

exports.GRPC_HIGHEST_STABLE_VERSION = GRPC_HIGHEST_STABLE_VERSION;

const getProtoDir = () => {
  return (0, _path.join)(__dirname, '..', '..', 'proto');
};
/**
 * Get a list of all rpc.proto versions that we provide.
 * @return {Promise<Array>} List of available rpc.proto versions.
 */


exports.getProtoDir = getProtoDir;

const getProtoVersions = () => {
  return Object.keys(_registry.default);
};
/**
 * Get the latest rpc.proto version that we provide.
 * @return {Promise<String>} The latest rpc.proto version that we provide.
 */


exports.getProtoVersions = getProtoVersions;

const getLatestProtoVersion = () => {
  const versions = getProtoVersions();
  return _semver.default.maxSatisfying(versions, `> ${GRPC_LOWEST_VERSION}`, {
    includePrerelease: true
  });
};
/**
 * Find the closest supported rpc.proto version based on an lnd version string.
 * @param  {[type]}  info [description]
 * @return {Promise}      [description]
 */


exports.getLatestProtoVersion = getLatestProtoVersion;

const getClosestProtoVersion = async versionString => {
  debug('Testing version string: %s', versionString);

  let _versionString$split = versionString.split(' '),
      _versionString$split2 = _slicedToArray(_versionString$split, 2),
      version = _versionString$split2[0],
      commitString = _versionString$split2[1];

  debug('Parsed version string into version: %s, commitString: %s', version, commitString); // If this looks like a pre-release.

  if (version.endsWith('99-beta')) {
    throw new Error(`Unsupported prerelease version: ${versionString}`);
  }

  const supportedVersions = getProtoVersions();
  debug('Searching for closest match for version %s in range: %o', version, supportedVersions);

  let match = _semver.default.maxSatisfying(supportedVersions, `<= ${version}`, {
    includePrerelease: true
  });

  debug('Determined closest rpc.proto match as: %s', match);
  return match;
};

exports.getClosestProtoVersion = getClosestProtoVersion;
var _default = {
  getProtoDir,
  getProtoVersions,
  getLatestProtoVersion,
  getClosestProtoVersion
};
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9wcm90by5qcyJdLCJuYW1lcyI6WyJkZWJ1ZyIsIkdSUENfTE9XRVNUX1ZFUlNJT04iLCJHUlBDX0hJR0hFU1RfU1RBQkxFX1ZFUlNJT04iLCJnZXRQcm90b0RpciIsIl9fZGlybmFtZSIsImdldFByb3RvVmVyc2lvbnMiLCJPYmplY3QiLCJrZXlzIiwicmVnaXN0cnkiLCJnZXRMYXRlc3RQcm90b1ZlcnNpb24iLCJ2ZXJzaW9ucyIsInNlbXZlciIsIm1heFNhdGlzZnlpbmciLCJpbmNsdWRlUHJlcmVsZWFzZSIsImdldENsb3Nlc3RQcm90b1ZlcnNpb24iLCJ2ZXJzaW9uU3RyaW5nIiwic3BsaXQiLCJ2ZXJzaW9uIiwiY29tbWl0U3RyaW5nIiwiZW5kc1dpdGgiLCJFcnJvciIsInN1cHBvcnRlZFZlcnNpb25zIiwibWF0Y2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLE1BQU1BLEtBQUssR0FBRyxvQkFBWSxhQUFaLENBQWQ7QUFFTyxNQUFNQyxtQkFBbUIsR0FBRyxZQUE1Qjs7QUFDQSxNQUFNQywyQkFBMkIsR0FBRyxhQUFwQztBQUVQO0FBQ0E7QUFDQTtBQUNBOzs7O0FBQ08sTUFBTUMsV0FBVyxHQUFHLE1BQU07QUFDL0IsU0FBTyxnQkFBS0MsU0FBTCxFQUFnQixJQUFoQixFQUFzQixJQUF0QixFQUE0QixPQUE1QixDQUFQO0FBQ0QsQ0FGTTtBQUlQO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUNPLE1BQU1DLGdCQUFnQixHQUFHLE1BQU07QUFDcEMsU0FBT0MsTUFBTSxDQUFDQyxJQUFQLENBQVlDLGlCQUFaLENBQVA7QUFDRCxDQUZNO0FBSVA7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBQ08sTUFBTUMscUJBQXFCLEdBQUcsTUFBTTtBQUN6QyxRQUFNQyxRQUFRLEdBQUdMLGdCQUFnQixFQUFqQztBQUNBLFNBQU9NLGdCQUFPQyxhQUFQLENBQXFCRixRQUFyQixFQUFnQyxLQUFJVCxtQkFBb0IsRUFBeEQsRUFBMkQ7QUFBRVksSUFBQUEsaUJBQWlCLEVBQUU7QUFBckIsR0FBM0QsQ0FBUDtBQUNELENBSE07QUFLUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUNPLE1BQU1DLHNCQUFzQixHQUFHLE1BQU9DLGFBQVAsSUFBeUI7QUFDN0RmLEVBQUFBLEtBQUssQ0FBQyw0QkFBRCxFQUErQmUsYUFBL0IsQ0FBTDs7QUFDQSw2QkFBOEJBLGFBQWEsQ0FBQ0MsS0FBZCxDQUFvQixHQUFwQixDQUE5QjtBQUFBO0FBQUEsTUFBS0MsT0FBTDtBQUFBLE1BQWNDLFlBQWQ7O0FBRUFsQixFQUFBQSxLQUFLLENBQUMsMERBQUQsRUFBNkRpQixPQUE3RCxFQUFzRUMsWUFBdEUsQ0FBTCxDQUo2RCxDQU03RDs7QUFDQSxNQUFJRCxPQUFPLENBQUNFLFFBQVIsQ0FBaUIsU0FBakIsQ0FBSixFQUFpQztBQUMvQixVQUFNLElBQUlDLEtBQUosQ0FBVyxtQ0FBa0NMLGFBQWMsRUFBM0QsQ0FBTjtBQUNEOztBQUVELFFBQU1NLGlCQUFpQixHQUFHaEIsZ0JBQWdCLEVBQTFDO0FBQ0FMLEVBQUFBLEtBQUssQ0FBQyx5REFBRCxFQUE0RGlCLE9BQTVELEVBQXFFSSxpQkFBckUsQ0FBTDs7QUFFQSxNQUFJQyxLQUFLLEdBQUdYLGdCQUFPQyxhQUFQLENBQXFCUyxpQkFBckIsRUFBeUMsTUFBS0osT0FBUSxFQUF0RCxFQUF5RDtBQUNuRUosSUFBQUEsaUJBQWlCLEVBQUU7QUFEZ0QsR0FBekQsQ0FBWjs7QUFJQWIsRUFBQUEsS0FBSyxDQUFDLDJDQUFELEVBQThDc0IsS0FBOUMsQ0FBTDtBQUVBLFNBQU9BLEtBQVA7QUFDRCxDQXJCTTs7O2VBdUJRO0FBQ2JuQixFQUFBQSxXQURhO0FBRWJFLEVBQUFBLGdCQUZhO0FBR2JJLEVBQUFBLHFCQUhhO0FBSWJLLEVBQUFBO0FBSmEsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJ1xuaW1wb3J0IHNlbXZlciBmcm9tICdzZW12ZXInXG5pbXBvcnQgY3JlYXRlRGVidWcgZnJvbSAnZGVidWcnXG5pbXBvcnQgcmVnaXN0cnkgZnJvbSAnLi4vcmVnaXN0cnknXG5cbmNvbnN0IGRlYnVnID0gY3JlYXRlRGVidWcoJ2xucnBjOnByb3RvJylcblxuZXhwb3J0IGNvbnN0IEdSUENfTE9XRVNUX1ZFUlNJT04gPSAnMC40LjItYmV0YSdcbmV4cG9ydCBjb25zdCBHUlBDX0hJR0hFU1RfU1RBQkxFX1ZFUlNJT04gPSAnMC4xMy4xLWJldGEnXG5cbi8qKlxuICogR2V0IHRoZSBkaXJlY3Rvcnkgd2hlcmUgcnBjLnByb3RvIGZpbGVzIGFyZSBzdG9yZWQuXG4gKiBAcmV0dXJuIHtTdHJpbmd9IERpcmVjdG9yeSB3aGVyZSBycG9jLnByb3RvIGZpbGVzIGFyZSBzdG9yZWQuXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRQcm90b0RpciA9ICgpID0+IHtcbiAgcmV0dXJuIGpvaW4oX19kaXJuYW1lLCAnLi4nLCAnLi4nLCAncHJvdG8nKVxufVxuXG4vKipcbiAqIEdldCBhIGxpc3Qgb2YgYWxsIHJwYy5wcm90byB2ZXJzaW9ucyB0aGF0IHdlIHByb3ZpZGUuXG4gKiBAcmV0dXJuIHtQcm9taXNlPEFycmF5Pn0gTGlzdCBvZiBhdmFpbGFibGUgcnBjLnByb3RvIHZlcnNpb25zLlxuICovXG5leHBvcnQgY29uc3QgZ2V0UHJvdG9WZXJzaW9ucyA9ICgpID0+IHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHJlZ2lzdHJ5KVxufVxuXG4vKipcbiAqIEdldCB0aGUgbGF0ZXN0IHJwYy5wcm90byB2ZXJzaW9uIHRoYXQgd2UgcHJvdmlkZS5cbiAqIEByZXR1cm4ge1Byb21pc2U8U3RyaW5nPn0gVGhlIGxhdGVzdCBycGMucHJvdG8gdmVyc2lvbiB0aGF0IHdlIHByb3ZpZGUuXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRMYXRlc3RQcm90b1ZlcnNpb24gPSAoKSA9PiB7XG4gIGNvbnN0IHZlcnNpb25zID0gZ2V0UHJvdG9WZXJzaW9ucygpXG4gIHJldHVybiBzZW12ZXIubWF4U2F0aXNmeWluZyh2ZXJzaW9ucywgYD4gJHtHUlBDX0xPV0VTVF9WRVJTSU9OfWAsIHsgaW5jbHVkZVByZXJlbGVhc2U6IHRydWUgfSlcbn1cblxuLyoqXG4gKiBGaW5kIHRoZSBjbG9zZXN0IHN1cHBvcnRlZCBycGMucHJvdG8gdmVyc2lvbiBiYXNlZCBvbiBhbiBsbmQgdmVyc2lvbiBzdHJpbmcuXG4gKiBAcGFyYW0gIHtbdHlwZV19ICBpbmZvIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1Byb21pc2V9ICAgICAgW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgY29uc3QgZ2V0Q2xvc2VzdFByb3RvVmVyc2lvbiA9IGFzeW5jICh2ZXJzaW9uU3RyaW5nKSA9PiB7XG4gIGRlYnVnKCdUZXN0aW5nIHZlcnNpb24gc3RyaW5nOiAlcycsIHZlcnNpb25TdHJpbmcpXG4gIGxldCBbdmVyc2lvbiwgY29tbWl0U3RyaW5nXSA9IHZlcnNpb25TdHJpbmcuc3BsaXQoJyAnKVxuXG4gIGRlYnVnKCdQYXJzZWQgdmVyc2lvbiBzdHJpbmcgaW50byB2ZXJzaW9uOiAlcywgY29tbWl0U3RyaW5nOiAlcycsIHZlcnNpb24sIGNvbW1pdFN0cmluZylcblxuICAvLyBJZiB0aGlzIGxvb2tzIGxpa2UgYSBwcmUtcmVsZWFzZS5cbiAgaWYgKHZlcnNpb24uZW5kc1dpdGgoJzk5LWJldGEnKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgcHJlcmVsZWFzZSB2ZXJzaW9uOiAke3ZlcnNpb25TdHJpbmd9YClcbiAgfVxuXG4gIGNvbnN0IHN1cHBvcnRlZFZlcnNpb25zID0gZ2V0UHJvdG9WZXJzaW9ucygpXG4gIGRlYnVnKCdTZWFyY2hpbmcgZm9yIGNsb3Nlc3QgbWF0Y2ggZm9yIHZlcnNpb24gJXMgaW4gcmFuZ2U6ICVvJywgdmVyc2lvbiwgc3VwcG9ydGVkVmVyc2lvbnMpXG5cbiAgbGV0IG1hdGNoID0gc2VtdmVyLm1heFNhdGlzZnlpbmcoc3VwcG9ydGVkVmVyc2lvbnMsIGA8PSAke3ZlcnNpb259YCwge1xuICAgIGluY2x1ZGVQcmVyZWxlYXNlOiB0cnVlLFxuICB9KVxuXG4gIGRlYnVnKCdEZXRlcm1pbmVkIGNsb3Nlc3QgcnBjLnByb3RvIG1hdGNoIGFzOiAlcycsIG1hdGNoKVxuXG4gIHJldHVybiBtYXRjaFxufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGdldFByb3RvRGlyLFxuICBnZXRQcm90b1ZlcnNpb25zLFxuICBnZXRMYXRlc3RQcm90b1ZlcnNpb24sXG4gIGdldENsb3Nlc3RQcm90b1ZlcnNpb24sXG59XG4iXX0=