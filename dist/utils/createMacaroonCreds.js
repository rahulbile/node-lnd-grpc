"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getMacaroon = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _util = require("util");

var _path = require("path");

var _untildify = _interopRequireDefault(require("untildify"));

var _decodeMacaroon = _interopRequireDefault(require("lndconnect/decodeMacaroon"));

var _grpcJs = require("@grpc/grpc-js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const readFile = (0, _util.promisify)(_fs.default.readFile);
/**
 * Extract macaroon hex from various sources.
 * @param {String} macaroonPath
 * @returns {String} Hex encoded macaroon.
 */

const getMacaroon = async macaroonPath => {
  let lndMacaroon;

  if (macaroonPath) {
    // If the macaroon is already in hex format, add as is.
    const isHex = /^[0-9a-fA-F]+$/.test(macaroonPath);

    if (isHex) {
      lndMacaroon = macaroonPath;
    } // If it's not a filepath, then assume it is a base64url encoded string.
    else if (macaroonPath === (0, _path.basename)(macaroonPath)) {
        lndMacaroon = (0, _decodeMacaroon.default)(macaroonPath);
      } // Otherwise, treat it as a file path - load the file and convert to hex.
      else {
          const macaroon = await readFile((0, _untildify.default)(macaroonPath)).catch(e => {
            const error = new Error(`Macaroon path could not be accessed: ${e.message}`);
            error.code = 'LND_GRPC_MACAROON_ERROR';
            throw error;
          });
          lndMacaroon = macaroon.toString('hex');
        }
  }

  return lndMacaroon;
};
/**
 * Validates and creates the macaroon authorization credentials from the specified file path
 * @param {String} macaroonPath
 * @returns {grpc.CallCredentials}
 */


exports.getMacaroon = getMacaroon;

const createMacaroonCreds = async macaroonPath => {
  let lndMacaroon = await getMacaroon(macaroonPath);
  const metadata = new _grpcJs.Metadata();
  metadata.add('macaroon', lndMacaroon);
  return _grpcJs.credentials.createFromMetadataGenerator((params, callback) => callback(null, metadata));
};

var _default = createMacaroonCreds;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9jcmVhdGVNYWNhcm9vbkNyZWRzLmpzIl0sIm5hbWVzIjpbInJlYWRGaWxlIiwiZnMiLCJnZXRNYWNhcm9vbiIsIm1hY2Fyb29uUGF0aCIsImxuZE1hY2Fyb29uIiwiaXNIZXgiLCJ0ZXN0IiwibWFjYXJvb24iLCJjYXRjaCIsImUiLCJlcnJvciIsIkVycm9yIiwibWVzc2FnZSIsImNvZGUiLCJ0b1N0cmluZyIsImNyZWF0ZU1hY2Fyb29uQ3JlZHMiLCJtZXRhZGF0YSIsIk1ldGFkYXRhIiwiYWRkIiwiY3JlZGVudGlhbHMiLCJjcmVhdGVGcm9tTWV0YWRhdGFHZW5lcmF0b3IiLCJwYXJhbXMiLCJjYWxsYmFjayJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRUEsTUFBTUEsUUFBUSxHQUFHLHFCQUFVQyxZQUFHRCxRQUFiLENBQWpCO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDTyxNQUFNRSxXQUFXLEdBQUcsTUFBT0MsWUFBUCxJQUF3QjtBQUNqRCxNQUFJQyxXQUFKOztBQUVBLE1BQUlELFlBQUosRUFBa0I7QUFDaEI7QUFDQSxVQUFNRSxLQUFLLEdBQUcsaUJBQWlCQyxJQUFqQixDQUFzQkgsWUFBdEIsQ0FBZDs7QUFDQSxRQUFJRSxLQUFKLEVBQVc7QUFDVEQsTUFBQUEsV0FBVyxHQUFHRCxZQUFkO0FBQ0QsS0FGRCxDQUdBO0FBSEEsU0FJSyxJQUFJQSxZQUFZLEtBQUssb0JBQVNBLFlBQVQsQ0FBckIsRUFBNkM7QUFDaERDLFFBQUFBLFdBQVcsR0FBRyw2QkFBZUQsWUFBZixDQUFkO0FBQ0QsT0FGSSxDQUdMO0FBSEssV0FJQTtBQUNILGdCQUFNSSxRQUFRLEdBQUcsTUFBTVAsUUFBUSxDQUFDLHdCQUFVRyxZQUFWLENBQUQsQ0FBUixDQUFrQ0ssS0FBbEMsQ0FBeUNDLENBQUQsSUFBTztBQUNwRSxrQkFBTUMsS0FBSyxHQUFHLElBQUlDLEtBQUosQ0FBVyx3Q0FBdUNGLENBQUMsQ0FBQ0csT0FBUSxFQUE1RCxDQUFkO0FBQ0FGLFlBQUFBLEtBQUssQ0FBQ0csSUFBTixHQUFhLHlCQUFiO0FBQ0Esa0JBQU1ILEtBQU47QUFDRCxXQUpzQixDQUF2QjtBQUtBTixVQUFBQSxXQUFXLEdBQUdHLFFBQVEsQ0FBQ08sUUFBVCxDQUFrQixLQUFsQixDQUFkO0FBQ0Q7QUFDRjs7QUFFRCxTQUFPVixXQUFQO0FBQ0QsQ0F6Qk07QUEyQlA7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFDQSxNQUFNVyxtQkFBbUIsR0FBRyxNQUFPWixZQUFQLElBQXdCO0FBQ2xELE1BQUlDLFdBQVcsR0FBRyxNQUFNRixXQUFXLENBQUNDLFlBQUQsQ0FBbkM7QUFFQSxRQUFNYSxRQUFRLEdBQUcsSUFBSUMsZ0JBQUosRUFBakI7QUFDQUQsRUFBQUEsUUFBUSxDQUFDRSxHQUFULENBQWEsVUFBYixFQUF5QmQsV0FBekI7QUFFQSxTQUFPZSxvQkFBWUMsMkJBQVosQ0FBd0MsQ0FBQ0MsTUFBRCxFQUFTQyxRQUFULEtBQXNCQSxRQUFRLENBQUMsSUFBRCxFQUFPTixRQUFQLENBQXRFLENBQVA7QUFDRCxDQVBEOztlQVNlRCxtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCB7IHByb21pc2lmeSB9IGZyb20gJ3V0aWwnXG5pbXBvcnQgeyBiYXNlbmFtZSB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgdW50aWxkaWZ5IGZyb20gJ3VudGlsZGlmeSdcbmltcG9ydCBkZWNvZGVNYWNhcm9vbiBmcm9tICdsbmRjb25uZWN0L2RlY29kZU1hY2Fyb29uJ1xuaW1wb3J0IHsgY3JlZGVudGlhbHMsIE1ldGFkYXRhIH0gZnJvbSAnQGdycGMvZ3JwYy1qcydcblxuY29uc3QgcmVhZEZpbGUgPSBwcm9taXNpZnkoZnMucmVhZEZpbGUpXG5cbi8qKlxuICogRXh0cmFjdCBtYWNhcm9vbiBoZXggZnJvbSB2YXJpb3VzIHNvdXJjZXMuXG4gKiBAcGFyYW0ge1N0cmluZ30gbWFjYXJvb25QYXRoXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBIZXggZW5jb2RlZCBtYWNhcm9vbi5cbiAqL1xuZXhwb3J0IGNvbnN0IGdldE1hY2Fyb29uID0gYXN5bmMgKG1hY2Fyb29uUGF0aCkgPT4ge1xuICBsZXQgbG5kTWFjYXJvb25cblxuICBpZiAobWFjYXJvb25QYXRoKSB7XG4gICAgLy8gSWYgdGhlIG1hY2Fyb29uIGlzIGFscmVhZHkgaW4gaGV4IGZvcm1hdCwgYWRkIGFzIGlzLlxuICAgIGNvbnN0IGlzSGV4ID0gL15bMC05YS1mQS1GXSskLy50ZXN0KG1hY2Fyb29uUGF0aClcbiAgICBpZiAoaXNIZXgpIHtcbiAgICAgIGxuZE1hY2Fyb29uID0gbWFjYXJvb25QYXRoXG4gICAgfVxuICAgIC8vIElmIGl0J3Mgbm90IGEgZmlsZXBhdGgsIHRoZW4gYXNzdW1lIGl0IGlzIGEgYmFzZTY0dXJsIGVuY29kZWQgc3RyaW5nLlxuICAgIGVsc2UgaWYgKG1hY2Fyb29uUGF0aCA9PT0gYmFzZW5hbWUobWFjYXJvb25QYXRoKSkge1xuICAgICAgbG5kTWFjYXJvb24gPSBkZWNvZGVNYWNhcm9vbihtYWNhcm9vblBhdGgpXG4gICAgfVxuICAgIC8vIE90aGVyd2lzZSwgdHJlYXQgaXQgYXMgYSBmaWxlIHBhdGggLSBsb2FkIHRoZSBmaWxlIGFuZCBjb252ZXJ0IHRvIGhleC5cbiAgICBlbHNlIHtcbiAgICAgIGNvbnN0IG1hY2Fyb29uID0gYXdhaXQgcmVhZEZpbGUodW50aWxkaWZ5KG1hY2Fyb29uUGF0aCkpLmNhdGNoKChlKSA9PiB7XG4gICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKGBNYWNhcm9vbiBwYXRoIGNvdWxkIG5vdCBiZSBhY2Nlc3NlZDogJHtlLm1lc3NhZ2V9YClcbiAgICAgICAgZXJyb3IuY29kZSA9ICdMTkRfR1JQQ19NQUNBUk9PTl9FUlJPUidcbiAgICAgICAgdGhyb3cgZXJyb3JcbiAgICAgIH0pXG4gICAgICBsbmRNYWNhcm9vbiA9IG1hY2Fyb29uLnRvU3RyaW5nKCdoZXgnKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBsbmRNYWNhcm9vblxufVxuXG4vKipcbiAqIFZhbGlkYXRlcyBhbmQgY3JlYXRlcyB0aGUgbWFjYXJvb24gYXV0aG9yaXphdGlvbiBjcmVkZW50aWFscyBmcm9tIHRoZSBzcGVjaWZpZWQgZmlsZSBwYXRoXG4gKiBAcGFyYW0ge1N0cmluZ30gbWFjYXJvb25QYXRoXG4gKiBAcmV0dXJucyB7Z3JwYy5DYWxsQ3JlZGVudGlhbHN9XG4gKi9cbmNvbnN0IGNyZWF0ZU1hY2Fyb29uQ3JlZHMgPSBhc3luYyAobWFjYXJvb25QYXRoKSA9PiB7XG4gIGxldCBsbmRNYWNhcm9vbiA9IGF3YWl0IGdldE1hY2Fyb29uKG1hY2Fyb29uUGF0aClcblxuICBjb25zdCBtZXRhZGF0YSA9IG5ldyBNZXRhZGF0YSgpXG4gIG1ldGFkYXRhLmFkZCgnbWFjYXJvb24nLCBsbmRNYWNhcm9vbilcblxuICByZXR1cm4gY3JlZGVudGlhbHMuY3JlYXRlRnJvbU1ldGFkYXRhR2VuZXJhdG9yKChwYXJhbXMsIGNhbGxiYWNrKSA9PiBjYWxsYmFjayhudWxsLCBtZXRhZGF0YSkpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZU1hY2Fyb29uQ3JlZHNcbiJdfQ==