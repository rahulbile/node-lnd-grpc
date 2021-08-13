"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _util = require("util");

var _path = require("path");

var _untildify = _interopRequireDefault(require("untildify"));

var _decodeCert = _interopRequireDefault(require("lndconnect/decodeCert"));

var _grpcJs = require("@grpc/grpc-js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const readFile = (0, _util.promisify)(_fs.default.readFile);
/**
 * Validates and creates the ssl channel credentials from the specified file path
 * @param {String} certPath
 * @returns {grpc.ChanelCredentials}
 */

const createSslCreds = async certPath => {
  let lndCert;

  if (certPath) {
    // If the cert has been provided in PEM format, use as is.
    if (certPath.split(/\n/)[0] === '-----BEGIN CERTIFICATE-----') {
      lndCert = new Buffer.from(certPath);
    } // If it's not a filepath, then assume it is a base64url encoded string.
    else if (certPath === (0, _path.basename)(certPath)) {
        lndCert = (0, _decodeCert.default)(certPath);
        lndCert = new Buffer.from(lndCert);
      } // Otherwise, lets treat it as a file path.
      else {
          lndCert = await readFile((0, _untildify.default)(certPath)).catch(e => {
            const error = new Error(`SSL cert path could not be accessed: ${e.message}`);
            error.code = 'LND_GRPC_CERT_ERROR';
            throw error;
          });
        }
  }

  return _grpcJs.credentials.createSsl(lndCert);
};

var _default = createSslCreds;
exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9jcmVhdGVTc2xDcmVkcy5qcyJdLCJuYW1lcyI6WyJyZWFkRmlsZSIsImZzIiwiY3JlYXRlU3NsQ3JlZHMiLCJjZXJ0UGF0aCIsImxuZENlcnQiLCJzcGxpdCIsIkJ1ZmZlciIsImZyb20iLCJjYXRjaCIsImUiLCJlcnJvciIsIkVycm9yIiwibWVzc2FnZSIsImNvZGUiLCJjcmVkZW50aWFscyIsImNyZWF0ZVNzbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRUEsTUFBTUEsUUFBUSxHQUFHLHFCQUFVQyxZQUFHRCxRQUFiLENBQWpCO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxNQUFNRSxjQUFjLEdBQUcsTUFBT0MsUUFBUCxJQUFvQjtBQUN6QyxNQUFJQyxPQUFKOztBQUNBLE1BQUlELFFBQUosRUFBYztBQUNaO0FBQ0EsUUFBSUEsUUFBUSxDQUFDRSxLQUFULENBQWUsSUFBZixFQUFxQixDQUFyQixNQUE0Qiw2QkFBaEMsRUFBK0Q7QUFDN0RELE1BQUFBLE9BQU8sR0FBRyxJQUFJRSxNQUFNLENBQUNDLElBQVgsQ0FBZ0JKLFFBQWhCLENBQVY7QUFDRCxLQUZELENBR0E7QUFIQSxTQUlLLElBQUlBLFFBQVEsS0FBSyxvQkFBU0EsUUFBVCxDQUFqQixFQUFxQztBQUN4Q0MsUUFBQUEsT0FBTyxHQUFHLHlCQUFXRCxRQUFYLENBQVY7QUFDQUMsUUFBQUEsT0FBTyxHQUFHLElBQUlFLE1BQU0sQ0FBQ0MsSUFBWCxDQUFnQkgsT0FBaEIsQ0FBVjtBQUNELE9BSEksQ0FJTDtBQUpLLFdBS0E7QUFDSEEsVUFBQUEsT0FBTyxHQUFHLE1BQU1KLFFBQVEsQ0FBQyx3QkFBVUcsUUFBVixDQUFELENBQVIsQ0FBOEJLLEtBQTlCLENBQXFDQyxDQUFELElBQU87QUFDekQsa0JBQU1DLEtBQUssR0FBRyxJQUFJQyxLQUFKLENBQVcsd0NBQXVDRixDQUFDLENBQUNHLE9BQVEsRUFBNUQsQ0FBZDtBQUNBRixZQUFBQSxLQUFLLENBQUNHLElBQU4sR0FBYSxxQkFBYjtBQUNBLGtCQUFNSCxLQUFOO0FBQ0QsV0FKZSxDQUFoQjtBQUtEO0FBQ0Y7O0FBQ0QsU0FBT0ksb0JBQVlDLFNBQVosQ0FBc0JYLE9BQXRCLENBQVA7QUFDRCxDQXRCRDs7ZUF3QmVGLGMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgZnJvbSAnZnMnXG5pbXBvcnQgeyBwcm9taXNpZnkgfSBmcm9tICd1dGlsJ1xuaW1wb3J0IHsgYmFzZW5hbWUgfSBmcm9tICdwYXRoJ1xuaW1wb3J0IHVudGlsZGlmeSBmcm9tICd1bnRpbGRpZnknXG5pbXBvcnQgZGVjb2RlQ2VydCBmcm9tICdsbmRjb25uZWN0L2RlY29kZUNlcnQnXG5pbXBvcnQgeyBjcmVkZW50aWFscyB9IGZyb20gJ0BncnBjL2dycGMtanMnXG5cbmNvbnN0IHJlYWRGaWxlID0gcHJvbWlzaWZ5KGZzLnJlYWRGaWxlKVxuXG4vKipcbiAqIFZhbGlkYXRlcyBhbmQgY3JlYXRlcyB0aGUgc3NsIGNoYW5uZWwgY3JlZGVudGlhbHMgZnJvbSB0aGUgc3BlY2lmaWVkIGZpbGUgcGF0aFxuICogQHBhcmFtIHtTdHJpbmd9IGNlcnRQYXRoXG4gKiBAcmV0dXJucyB7Z3JwYy5DaGFuZWxDcmVkZW50aWFsc31cbiAqL1xuY29uc3QgY3JlYXRlU3NsQ3JlZHMgPSBhc3luYyAoY2VydFBhdGgpID0+IHtcbiAgbGV0IGxuZENlcnRcbiAgaWYgKGNlcnRQYXRoKSB7XG4gICAgLy8gSWYgdGhlIGNlcnQgaGFzIGJlZW4gcHJvdmlkZWQgaW4gUEVNIGZvcm1hdCwgdXNlIGFzIGlzLlxuICAgIGlmIChjZXJ0UGF0aC5zcGxpdCgvXFxuLylbMF0gPT09ICctLS0tLUJFR0lOIENFUlRJRklDQVRFLS0tLS0nKSB7XG4gICAgICBsbmRDZXJ0ID0gbmV3IEJ1ZmZlci5mcm9tKGNlcnRQYXRoKVxuICAgIH1cbiAgICAvLyBJZiBpdCdzIG5vdCBhIGZpbGVwYXRoLCB0aGVuIGFzc3VtZSBpdCBpcyBhIGJhc2U2NHVybCBlbmNvZGVkIHN0cmluZy5cbiAgICBlbHNlIGlmIChjZXJ0UGF0aCA9PT0gYmFzZW5hbWUoY2VydFBhdGgpKSB7XG4gICAgICBsbmRDZXJ0ID0gZGVjb2RlQ2VydChjZXJ0UGF0aClcbiAgICAgIGxuZENlcnQgPSBuZXcgQnVmZmVyLmZyb20obG5kQ2VydClcbiAgICB9XG4gICAgLy8gT3RoZXJ3aXNlLCBsZXRzIHRyZWF0IGl0IGFzIGEgZmlsZSBwYXRoLlxuICAgIGVsc2Uge1xuICAgICAgbG5kQ2VydCA9IGF3YWl0IHJlYWRGaWxlKHVudGlsZGlmeShjZXJ0UGF0aCkpLmNhdGNoKChlKSA9PiB7XG4gICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKGBTU0wgY2VydCBwYXRoIGNvdWxkIG5vdCBiZSBhY2Nlc3NlZDogJHtlLm1lc3NhZ2V9YClcbiAgICAgICAgZXJyb3IuY29kZSA9ICdMTkRfR1JQQ19DRVJUX0VSUk9SJ1xuICAgICAgICB0aHJvdyBlcnJvclxuICAgICAgfSlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNyZWRlbnRpYWxzLmNyZWF0ZVNzbChsbmRDZXJ0KVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVTc2xDcmVkc1xuIl19