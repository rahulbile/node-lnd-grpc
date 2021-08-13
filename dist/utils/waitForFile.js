"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _util = require("util");

var _debug = _interopRequireDefault(require("debug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = (0, _debug.default)('lnrpc:util');
const stat = (0, _util.promisify)(_fs.default.stat);
/**
 * Wait for a file to exist.
 * @param {String} filepath
 */

const waitForFile = (filepath, timeout = 1000) => {
  let timeoutId;
  let intervalId; // This promise rejects after the timeout has passed.

  let timeoutPromise = new Promise((resolve, reject) => {
    timeoutId = setTimeout(() => {
      debug('deadline (%sms) exceeded before file (%s) was found', timeout, filepath); // Timout was reached, so clear all remaining timers.

      clearInterval(intervalId);
      clearTimeout(timeoutId);
      reject(new Error(`Unable to find file: ${filepath}`));
    }, timeout);
  }); // This promise checks the filsystem every 200ms looking for the file, and resolves when the file has been found.

  let checkFileExists = new Promise(resolve => {
    let intervalId = setInterval(async () => {
      debug('waiting for file: %s', filepath);

      try {
        await stat(filepath);
        debug('found file: %s', filepath); // The file was found, so clear all remaining timers.

        clearInterval(intervalId);
        clearTimeout(timeoutId);
        resolve();
      } catch (e) {
        // If the file wasn't found with stat, do nothing, we will check again in 200ms.
        return;
      }
    }, 200);
  }); // Let's race our promises.

  return Promise.race([timeoutPromise, checkFileExists]);
};

var _default = waitForFile;
exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy93YWl0Rm9yRmlsZS5qcyJdLCJuYW1lcyI6WyJkZWJ1ZyIsInN0YXQiLCJmcyIsIndhaXRGb3JGaWxlIiwiZmlsZXBhdGgiLCJ0aW1lb3V0IiwidGltZW91dElkIiwiaW50ZXJ2YWxJZCIsInRpbWVvdXRQcm9taXNlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJzZXRUaW1lb3V0IiwiY2xlYXJJbnRlcnZhbCIsImNsZWFyVGltZW91dCIsIkVycm9yIiwiY2hlY2tGaWxlRXhpc3RzIiwic2V0SW50ZXJ2YWwiLCJlIiwicmFjZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOzs7O0FBRUEsTUFBTUEsS0FBSyxHQUFHLG9CQUFZLFlBQVosQ0FBZDtBQUVBLE1BQU1DLElBQUksR0FBRyxxQkFBVUMsWUFBR0QsSUFBYixDQUFiO0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsTUFBTUUsV0FBVyxHQUFHLENBQUNDLFFBQUQsRUFBV0MsT0FBTyxHQUFHLElBQXJCLEtBQThCO0FBQ2hELE1BQUlDLFNBQUo7QUFDQSxNQUFJQyxVQUFKLENBRmdELENBSWhEOztBQUNBLE1BQUlDLGNBQWMsR0FBRyxJQUFJQyxPQUFKLENBQVksQ0FBQ0MsT0FBRCxFQUFVQyxNQUFWLEtBQXFCO0FBQ3BETCxJQUFBQSxTQUFTLEdBQUdNLFVBQVUsQ0FBQyxNQUFNO0FBQzNCWixNQUFBQSxLQUFLLENBQUMscURBQUQsRUFBd0RLLE9BQXhELEVBQWlFRCxRQUFqRSxDQUFMLENBRDJCLENBRTNCOztBQUNBUyxNQUFBQSxhQUFhLENBQUNOLFVBQUQsQ0FBYjtBQUNBTyxNQUFBQSxZQUFZLENBQUNSLFNBQUQsQ0FBWjtBQUNBSyxNQUFBQSxNQUFNLENBQUMsSUFBSUksS0FBSixDQUFXLHdCQUF1QlgsUUFBUyxFQUEzQyxDQUFELENBQU47QUFDRCxLQU5xQixFQU1uQkMsT0FObUIsQ0FBdEI7QUFPRCxHQVJvQixDQUFyQixDQUxnRCxDQWVoRDs7QUFDQSxNQUFJVyxlQUFlLEdBQUcsSUFBSVAsT0FBSixDQUFhQyxPQUFELElBQWE7QUFDN0MsUUFBSUgsVUFBVSxHQUFHVSxXQUFXLENBQUMsWUFBWTtBQUN2Q2pCLE1BQUFBLEtBQUssQ0FBQyxzQkFBRCxFQUF5QkksUUFBekIsQ0FBTDs7QUFDQSxVQUFJO0FBQ0YsY0FBTUgsSUFBSSxDQUFDRyxRQUFELENBQVY7QUFDQUosUUFBQUEsS0FBSyxDQUFDLGdCQUFELEVBQW1CSSxRQUFuQixDQUFMLENBRkUsQ0FHRjs7QUFDQVMsUUFBQUEsYUFBYSxDQUFDTixVQUFELENBQWI7QUFDQU8sUUFBQUEsWUFBWSxDQUFDUixTQUFELENBQVo7QUFDQUksUUFBQUEsT0FBTztBQUNSLE9BUEQsQ0FPRSxPQUFPUSxDQUFQLEVBQVU7QUFDVjtBQUNBO0FBQ0Q7QUFDRixLQWIyQixFQWF6QixHQWJ5QixDQUE1QjtBQWNELEdBZnFCLENBQXRCLENBaEJnRCxDQWlDaEQ7O0FBQ0EsU0FBT1QsT0FBTyxDQUFDVSxJQUFSLENBQWEsQ0FBQ1gsY0FBRCxFQUFpQlEsZUFBakIsQ0FBYixDQUFQO0FBQ0QsQ0FuQ0Q7O2VBcUNlYixXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IHsgcHJvbWlzaWZ5IH0gZnJvbSAndXRpbCdcbmltcG9ydCBjcmVhdGVEZWJ1ZyBmcm9tICdkZWJ1ZydcblxuY29uc3QgZGVidWcgPSBjcmVhdGVEZWJ1ZygnbG5ycGM6dXRpbCcpXG5cbmNvbnN0IHN0YXQgPSBwcm9taXNpZnkoZnMuc3RhdClcblxuLyoqXG4gKiBXYWl0IGZvciBhIGZpbGUgdG8gZXhpc3QuXG4gKiBAcGFyYW0ge1N0cmluZ30gZmlsZXBhdGhcbiAqL1xuY29uc3Qgd2FpdEZvckZpbGUgPSAoZmlsZXBhdGgsIHRpbWVvdXQgPSAxMDAwKSA9PiB7XG4gIGxldCB0aW1lb3V0SWRcbiAgbGV0IGludGVydmFsSWRcblxuICAvLyBUaGlzIHByb21pc2UgcmVqZWN0cyBhZnRlciB0aGUgdGltZW91dCBoYXMgcGFzc2VkLlxuICBsZXQgdGltZW91dFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgdGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBkZWJ1ZygnZGVhZGxpbmUgKCVzbXMpIGV4Y2VlZGVkIGJlZm9yZSBmaWxlICglcykgd2FzIGZvdW5kJywgdGltZW91dCwgZmlsZXBhdGgpXG4gICAgICAvLyBUaW1vdXQgd2FzIHJlYWNoZWQsIHNvIGNsZWFyIGFsbCByZW1haW5pbmcgdGltZXJzLlxuICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbElkKVxuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZClcbiAgICAgIHJlamVjdChuZXcgRXJyb3IoYFVuYWJsZSB0byBmaW5kIGZpbGU6ICR7ZmlsZXBhdGh9YCkpXG4gICAgfSwgdGltZW91dClcbiAgfSlcblxuICAvLyBUaGlzIHByb21pc2UgY2hlY2tzIHRoZSBmaWxzeXN0ZW0gZXZlcnkgMjAwbXMgbG9va2luZyBmb3IgdGhlIGZpbGUsIGFuZCByZXNvbHZlcyB3aGVuIHRoZSBmaWxlIGhhcyBiZWVuIGZvdW5kLlxuICBsZXQgY2hlY2tGaWxlRXhpc3RzID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBsZXQgaW50ZXJ2YWxJZCA9IHNldEludGVydmFsKGFzeW5jICgpID0+IHtcbiAgICAgIGRlYnVnKCd3YWl0aW5nIGZvciBmaWxlOiAlcycsIGZpbGVwYXRoKVxuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgc3RhdChmaWxlcGF0aClcbiAgICAgICAgZGVidWcoJ2ZvdW5kIGZpbGU6ICVzJywgZmlsZXBhdGgpXG4gICAgICAgIC8vIFRoZSBmaWxlIHdhcyBmb3VuZCwgc28gY2xlYXIgYWxsIHJlbWFpbmluZyB0aW1lcnMuXG4gICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxJZClcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZClcbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIElmIHRoZSBmaWxlIHdhc24ndCBmb3VuZCB3aXRoIHN0YXQsIGRvIG5vdGhpbmcsIHdlIHdpbGwgY2hlY2sgYWdhaW4gaW4gMjAwbXMuXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgIH0sIDIwMClcbiAgfSlcblxuICAvLyBMZXQncyByYWNlIG91ciBwcm9taXNlcy5cbiAgcmV0dXJuIFByb21pc2UucmFjZShbdGltZW91dFByb21pc2UsIGNoZWNrRmlsZUV4aXN0c10pXG59XG5cbmV4cG9ydCBkZWZhdWx0IHdhaXRGb3JGaWxlXG4iXX0=