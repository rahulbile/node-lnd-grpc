"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TOR_WAIT_TIMEOUT = exports.FILE_WAIT_TIMEOUT = exports.SERVICE_CONNECT_TIMEOUT = exports.CONNECT_WAIT_TIMEOUT_TOR = exports.CONNECT_WAIT_TIMEOUT = exports.PROBE_RETRY_INTERVAL = exports.PROBE_TIMEOUT = exports.WALLET_STATE_ACTIVE = exports.WALLET_STATE_LOCKED = void 0;
// Wallet states.
const WALLET_STATE_LOCKED = 'WALLET_STATE_LOCKED';
exports.WALLET_STATE_LOCKED = WALLET_STATE_LOCKED;
const WALLET_STATE_ACTIVE = 'WALLET_STATE_ACTIVE'; // Time (in seconds) to wait for interface probe calls to complete.

exports.WALLET_STATE_ACTIVE = WALLET_STATE_ACTIVE;
const PROBE_TIMEOUT = 25; // Time (in ms) to wait before retrying a connection attempt.

exports.PROBE_TIMEOUT = PROBE_TIMEOUT;
const PROBE_RETRY_INTERVAL = 250; // Time (in seconds) to wait for a grpc connection to be established.

exports.PROBE_RETRY_INTERVAL = PROBE_RETRY_INTERVAL;
const CONNECT_WAIT_TIMEOUT = 15; // Time (in seconds) to wait for a grpc connection to be established.

exports.CONNECT_WAIT_TIMEOUT = CONNECT_WAIT_TIMEOUT;
const CONNECT_WAIT_TIMEOUT_TOR = 30; // Time (in seconds) to wait before aborting service connection attempts.

exports.CONNECT_WAIT_TIMEOUT_TOR = CONNECT_WAIT_TIMEOUT_TOR;
const SERVICE_CONNECT_TIMEOUT = 35; // Time (in ms) to wait for a cert/macaroon file to become present.

exports.SERVICE_CONNECT_TIMEOUT = SERVICE_CONNECT_TIMEOUT;
const FILE_WAIT_TIMEOUT = 10 * 1000; // Time (in ms) to wait for Tor to become ready after starting.

exports.FILE_WAIT_TIMEOUT = FILE_WAIT_TIMEOUT;
const TOR_WAIT_TIMEOUT = 1000;
exports.TOR_WAIT_TIMEOUT = TOR_WAIT_TIMEOUT;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9jb25zdGFudHMuanMiXSwibmFtZXMiOlsiV0FMTEVUX1NUQVRFX0xPQ0tFRCIsIldBTExFVF9TVEFURV9BQ1RJVkUiLCJQUk9CRV9USU1FT1VUIiwiUFJPQkVfUkVUUllfSU5URVJWQUwiLCJDT05ORUNUX1dBSVRfVElNRU9VVCIsIkNPTk5FQ1RfV0FJVF9USU1FT1VUX1RPUiIsIlNFUlZJQ0VfQ09OTkVDVF9USU1FT1VUIiwiRklMRV9XQUlUX1RJTUVPVVQiLCJUT1JfV0FJVF9USU1FT1VUIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNPLE1BQU1BLG1CQUFtQixHQUFHLHFCQUE1Qjs7QUFDQSxNQUFNQyxtQkFBbUIsR0FBRyxxQkFBNUIsQyxDQUVQOzs7QUFDTyxNQUFNQyxhQUFhLEdBQUcsRUFBdEIsQyxDQUVQOzs7QUFDTyxNQUFNQyxvQkFBb0IsR0FBRyxHQUE3QixDLENBRVA7OztBQUNPLE1BQU1DLG9CQUFvQixHQUFHLEVBQTdCLEMsQ0FFUDs7O0FBQ08sTUFBTUMsd0JBQXdCLEdBQUcsRUFBakMsQyxDQUVQOzs7QUFDTyxNQUFNQyx1QkFBdUIsR0FBRyxFQUFoQyxDLENBRVA7OztBQUNPLE1BQU1DLGlCQUFpQixHQUFHLEtBQUssSUFBL0IsQyxDQUVQOzs7QUFDTyxNQUFNQyxnQkFBZ0IsR0FBRyxJQUF6QiIsInNvdXJjZXNDb250ZW50IjpbIi8vIFdhbGxldCBzdGF0ZXMuXG5leHBvcnQgY29uc3QgV0FMTEVUX1NUQVRFX0xPQ0tFRCA9ICdXQUxMRVRfU1RBVEVfTE9DS0VEJ1xuZXhwb3J0IGNvbnN0IFdBTExFVF9TVEFURV9BQ1RJVkUgPSAnV0FMTEVUX1NUQVRFX0FDVElWRSdcblxuLy8gVGltZSAoaW4gc2Vjb25kcykgdG8gd2FpdCBmb3IgaW50ZXJmYWNlIHByb2JlIGNhbGxzIHRvIGNvbXBsZXRlLlxuZXhwb3J0IGNvbnN0IFBST0JFX1RJTUVPVVQgPSAyNVxuXG4vLyBUaW1lIChpbiBtcykgdG8gd2FpdCBiZWZvcmUgcmV0cnlpbmcgYSBjb25uZWN0aW9uIGF0dGVtcHQuXG5leHBvcnQgY29uc3QgUFJPQkVfUkVUUllfSU5URVJWQUwgPSAyNTBcblxuLy8gVGltZSAoaW4gc2Vjb25kcykgdG8gd2FpdCBmb3IgYSBncnBjIGNvbm5lY3Rpb24gdG8gYmUgZXN0YWJsaXNoZWQuXG5leHBvcnQgY29uc3QgQ09OTkVDVF9XQUlUX1RJTUVPVVQgPSAxNVxuXG4vLyBUaW1lIChpbiBzZWNvbmRzKSB0byB3YWl0IGZvciBhIGdycGMgY29ubmVjdGlvbiB0byBiZSBlc3RhYmxpc2hlZC5cbmV4cG9ydCBjb25zdCBDT05ORUNUX1dBSVRfVElNRU9VVF9UT1IgPSAzMFxuXG4vLyBUaW1lIChpbiBzZWNvbmRzKSB0byB3YWl0IGJlZm9yZSBhYm9ydGluZyBzZXJ2aWNlIGNvbm5lY3Rpb24gYXR0ZW1wdHMuXG5leHBvcnQgY29uc3QgU0VSVklDRV9DT05ORUNUX1RJTUVPVVQgPSAzNVxuXG4vLyBUaW1lIChpbiBtcykgdG8gd2FpdCBmb3IgYSBjZXJ0L21hY2Fyb29uIGZpbGUgdG8gYmVjb21lIHByZXNlbnQuXG5leHBvcnQgY29uc3QgRklMRV9XQUlUX1RJTUVPVVQgPSAxMCAqIDEwMDBcblxuLy8gVGltZSAoaW4gbXMpIHRvIHdhaXQgZm9yIFRvciB0byBiZWNvbWUgcmVhZHkgYWZ0ZXIgc3RhcnRpbmcuXG5leHBvcnQgY29uc3QgVE9SX1dBSVRfVElNRU9VVCA9IDEwMDBcbiJdfQ==