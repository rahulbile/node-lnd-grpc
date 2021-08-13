"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = promisifiedCall;

var _util = require("util");

/**
 * Promisifies specified method and calls it with @thisArg as this and passes @args as an object
 * @param {*} thisArg
 * @param {*} method
 * @param {*} args
 */
function promisifiedCall(thisArg, method, ...args) {
  return (0, _util.promisify)(method).call(thisArg, ...args);
}

module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9wcm9taXNpZmllZENhbGwuanMiXSwibmFtZXMiOlsicHJvbWlzaWZpZWRDYWxsIiwidGhpc0FyZyIsIm1ldGhvZCIsImFyZ3MiLCJjYWxsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2UsU0FBU0EsZUFBVCxDQUF5QkMsT0FBekIsRUFBa0NDLE1BQWxDLEVBQTBDLEdBQUdDLElBQTdDLEVBQW1EO0FBQ2hFLFNBQU8scUJBQVVELE1BQVYsRUFBa0JFLElBQWxCLENBQXVCSCxPQUF2QixFQUFnQyxHQUFHRSxJQUFuQyxDQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwcm9taXNpZnkgfSBmcm9tICd1dGlsJ1xuXG4vKipcbiAqIFByb21pc2lmaWVzIHNwZWNpZmllZCBtZXRob2QgYW5kIGNhbGxzIGl0IHdpdGggQHRoaXNBcmcgYXMgdGhpcyBhbmQgcGFzc2VzIEBhcmdzIGFzIGFuIG9iamVjdFxuICogQHBhcmFtIHsqfSB0aGlzQXJnXG4gKiBAcGFyYW0geyp9IG1ldGhvZFxuICogQHBhcmFtIHsqfSBhcmdzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHByb21pc2lmaWVkQ2FsbCh0aGlzQXJnLCBtZXRob2QsIC4uLmFyZ3MpIHtcbiAgcmV0dXJuIHByb21pc2lmeShtZXRob2QpLmNhbGwodGhpc0FyZywgLi4uYXJncylcbn1cbiJdfQ==