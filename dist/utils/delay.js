"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * delay - Promisified setTimeout.
 *
 * @param  {number} time Time (ms)
 * @returns {Promise} Promise that resolves after time ms
 */
const delay = time => new Promise(resolve => setTimeout(() => resolve(), time));

var _default = delay;
exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9kZWxheS5qcyJdLCJuYW1lcyI6WyJkZWxheSIsInRpbWUiLCJQcm9taXNlIiwicmVzb2x2ZSIsInNldFRpbWVvdXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNQSxLQUFLLEdBQUlDLElBQUQsSUFBVSxJQUFJQyxPQUFKLENBQWFDLE9BQUQsSUFBYUMsVUFBVSxDQUFDLE1BQU1ELE9BQU8sRUFBZCxFQUFrQkYsSUFBbEIsQ0FBbkMsQ0FBeEI7O2VBRWVELEsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGRlbGF5IC0gUHJvbWlzaWZpZWQgc2V0VGltZW91dC5cbiAqXG4gKiBAcGFyYW0gIHtudW1iZXJ9IHRpbWUgVGltZSAobXMpXG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0aGF0IHJlc29sdmVzIGFmdGVyIHRpbWUgbXNcbiAqL1xuY29uc3QgZGVsYXkgPSAodGltZSkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQoKCkgPT4gcmVzb2x2ZSgpLCB0aW1lKSlcblxuZXhwb3J0IGRlZmF1bHQgZGVsYXlcbiJdfQ==