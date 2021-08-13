"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = tor;

var _child_process = _interopRequireDefault(require("child_process"));

var _fs = _interopRequireDefault(require("fs"));

var _os = _interopRequireDefault(require("os"));

var _path = _interopRequireDefault(require("path"));

var _debug = _interopRequireDefault(require("debug"));

var _getPort = _interopRequireDefault(require("get-port"));

var _delay = _interopRequireDefault(require("./delay"));

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = (0, _debug.default)('lnrpc:tor');
const debugTor = (0, _debug.default)('lnrpc:torproc');

function tor({
  cwd
} = {}) {
  let proc = null;

  const isStarted = () => Boolean(proc && proc.pid);
  /**
   * start - Start Tor tunnel service.
   * @param  {object}  settings Settings
   * @param  {string}  settings.datadir Data dir
   *
   * @return {Promise} Promise that resolves once the service is ready to use
   */


  const start = async () => {
    if (isStarted()) {
      throw new Error('Tor is already already running');
    }

    const datadir = cwd || _fs.default.mkdtempSync(_path.default.join(_os.default.tmpdir(), 'lnd-grpc-'));

    const torrcpath = _path.default.join(datadir, 'torrc');

    const datapath = _path.default.join(datadir, 'data');

    const host = '127.0.0.1';
    const port = await (0, _getPort.default)({
      host,
      port: _getPort.default.makeRange(9065, 9999)
    });
    const httpTunnelPort = `${host}:${port}`;
    const settings = {
      DataDirectory: datapath,
      HTTPTunnelPort: httpTunnelPort,
      SocksPort: 0
    };
    debug('Starting tor with settings: %o', settings);
    const torrc = Object.entries(settings).reduce((acc, [key, value]) => {
      return acc += `${key} ${value}\n`;
    }, '');

    _fs.default.writeFileSync(torrcpath, torrc);

    debug('Generated torrc at %s:\n%s', torrcpath, torrc);
    process.env.grpc_proxy = `http://${httpTunnelPort}`;
    debug('Setting grpc_proxy as: %s', process.env.grpc_proxy);
    proc = _child_process.default.spawn('tor', ['-f', torrcpath], {
      cwd: datadir
    });
    debug('Started tor process with pid: %s', proc.pid);
    process.on('exit', () => {
      proc.kill();
    });
    process.on('uncaughtException', () => {
      proc.kill();
    });
    return new Promise((resolve, reject) => {
      proc.stdout.on('data', async data => {
        debugTor(data.toString().trim());

        if (data.toString().indexOf('Bootstrapped 100%') !== -1) {
          await (0, _delay.default)(_constants.TOR_WAIT_TIMEOUT);
          resolve(true);
        }

        if (data.toString().indexOf('[error]') !== -1) {
          reject(data.toString());
        }
      });
    });
  };
  /**
   * Stop Tor service.
   */


  const stop = async () => {
    if (isStarted()) {
      debug('Stopping tor with pid: %o', proc.pid);
      const waitForExit = new Promise((resolve, reject) => {
        proc.on('exit', () => {
          debug('Stopped tor with pid: %o', proc.pid);
          delete process.env.grpc_proxy;
          resolve();
        });
      });
      proc.kill('SIGKILL');
      return waitForExit;
    }
  };

  return {
    start,
    stop,
    isStarted
  };
}

module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy90b3IuanMiXSwibmFtZXMiOlsiZGVidWciLCJkZWJ1Z1RvciIsInRvciIsImN3ZCIsInByb2MiLCJpc1N0YXJ0ZWQiLCJCb29sZWFuIiwicGlkIiwic3RhcnQiLCJFcnJvciIsImRhdGFkaXIiLCJmcyIsIm1rZHRlbXBTeW5jIiwicGF0aCIsImpvaW4iLCJvcyIsInRtcGRpciIsInRvcnJjcGF0aCIsImRhdGFwYXRoIiwiaG9zdCIsInBvcnQiLCJnZXRQb3J0IiwibWFrZVJhbmdlIiwiaHR0cFR1bm5lbFBvcnQiLCJzZXR0aW5ncyIsIkRhdGFEaXJlY3RvcnkiLCJIVFRQVHVubmVsUG9ydCIsIlNvY2tzUG9ydCIsInRvcnJjIiwiT2JqZWN0IiwiZW50cmllcyIsInJlZHVjZSIsImFjYyIsImtleSIsInZhbHVlIiwid3JpdGVGaWxlU3luYyIsInByb2Nlc3MiLCJlbnYiLCJncnBjX3Byb3h5IiwiY2hpbGQiLCJzcGF3biIsIm9uIiwia2lsbCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwic3Rkb3V0IiwiZGF0YSIsInRvU3RyaW5nIiwidHJpbSIsImluZGV4T2YiLCJUT1JfV0FJVF9USU1FT1VUIiwic3RvcCIsIndhaXRGb3JFeGl0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFQSxNQUFNQSxLQUFLLEdBQUcsb0JBQVksV0FBWixDQUFkO0FBQ0EsTUFBTUMsUUFBUSxHQUFHLG9CQUFZLGVBQVosQ0FBakI7O0FBRWUsU0FBU0MsR0FBVCxDQUFhO0FBQUVDLEVBQUFBO0FBQUYsSUFBVSxFQUF2QixFQUEyQjtBQUN4QyxNQUFJQyxJQUFJLEdBQUcsSUFBWDs7QUFFQSxRQUFNQyxTQUFTLEdBQUcsTUFBTUMsT0FBTyxDQUFDRixJQUFJLElBQUlBLElBQUksQ0FBQ0csR0FBZCxDQUEvQjtBQUVBO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFD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UCxVQUFBQSxPQUFPLENBQUMsSUFBRCxDQUFQO0FBQ0Q7O0FBQ0QsWUFBSUcsSUFBSSxDQUFDQyxRQUFMLEdBQWdCRSxPQUFoQixDQUF3QixTQUF4QixNQUF1QyxDQUFDLENBQTVDLEVBQStDO0FBQzdDTCxVQUFBQSxNQUFNLENBQUNFLElBQUksQ0FBQ0MsUUFBTCxFQUFELENBQU47QUFDRDtBQUNGLE9BVEQ7QUFVRCxLQVhNLENBQVA7QUFZRCxHQW5ERDtBQXFEQTtBQUNGO0FBQ0E7OztBQUNFLFFBQU1JLElBQUksR0FBRyxZQUFZO0FBQ3ZCLFFBQUkvQyxTQUFTLEVBQWIsRUFBaUI7QUFDZkwsTUFBQUEsS0FBSyxDQUFDLDJCQUFELEVBQThCSSxJQUFJLENBQUNHLEdBQW5DLENBQUw7QUFFQSxZQUFNOEMsV0FBVyxHQUFHLElBQUlWLE9BQUosQ0FBWSxDQUFDQyxPQUFELEVBQVVDLE1BQVYsS0FBcUI7QUFDbkR6QyxRQUFBQSxJQUFJLENBQUNxQyxFQUFMLENBQVEsTUFBUixFQUFnQixNQUFNO0FBQ3BCekMsVUFBQUEsS0FBSyxDQUFDLDBCQUFELEVBQTZCSSxJQUFJLENBQUNHLEdBQWxDLENBQUw7QUFDQSxpQkFBTzZCLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxVQUFuQjtBQUNBTSxVQUFBQSxPQUFPO0FBQ1IsU0FKRDtBQUtELE9BTm1CLENBQXBCO0FBUUF4QyxNQUFBQSxJQUFJLENBQUNzQyxJQUFMLENBQVUsU0FBVjtBQUNBLGFBQU9XLFdBQVA7QUFDRDtBQUNGLEdBZkQ7O0FBaUJBLFNBQU87QUFDTDdDLElBQUFBLEtBREs7QUFFTDRDLElBQUFBLElBRks7QUFHTC9DLElBQUFBO0FBSEssR0FBUDtBQUtEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNoaWxkIGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5pbXBvcnQgb3MgZnJvbSAnb3MnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IGNyZWF0ZURlYnVnIGZyb20gJ2RlYnVnJ1xuaW1wb3J0IGdldFBvcnQgZnJvbSAnZ2V0LXBvcnQnXG5pbXBvcnQgZGVsYXkgZnJvbSAnLi9kZWxheSdcbmltcG9ydCB7IFRPUl9XQUlUX1RJTUVPVVQgfSBmcm9tICcuL2NvbnN0YW50cydcblxuY29uc3QgZGVidWcgPSBjcmVhdGVEZWJ1ZygnbG5ycGM6dG9yJylcbmNvbnN0IGRlYnVnVG9yID0gY3JlYXRlRGVidWcoJ2xucnBjOnRvcnByb2MnKVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0b3IoeyBjd2QgfSA9IHt9KSB7XG4gIGxldCBwcm9jID0gbnVsbFxuXG4gIGNvbnN0IGlzU3RhcnRlZCA9ICgpID0+IEJvb2xlYW4ocHJvYyAmJiBwcm9jLnBpZClcblxuICAvKipcbiAgICogc3RhcnQgLSBTdGFydCBUb3IgdHVubmVsIHNlcnZpY2UuXG4gICAqIEBwYXJhbSAge29iamVjdH0gIHNldHRpbmdzIFNldHRpbmdzXG4gICAqIEBwYXJhbSAge3N0cmluZ30gIHNldHRpbmdzLmRhdGFkaXIgRGF0YSBkaXJcbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZX0gUHJvbWlzZSB0aGF0IHJlc29sdmVzIG9uY2UgdGhlIHNlcnZpY2UgaXMgcmVhZHkgdG8gdXNlXG4gICAqL1xuICBjb25zdCBzdGFydCA9IGFzeW5jICgpID0+IHtcbiAgICBpZiAoaXNTdGFydGVkKCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVG9yIGlzIGFscmVhZHkgYWxyZWFkeSBydW5uaW5nJylcbiAgICB9XG5cbiAgICBjb25zdCBkYXRhZGlyID0gY3dkIHx8IGZzLm1rZHRlbXBTeW5jKHBhdGguam9pbihvcy50bXBkaXIoKSwgJ2xuZC1ncnBjLScpKVxuICAgIGNvbnN0IHRvcnJjcGF0aCA9IHBhdGguam9pbihkYXRhZGlyLCAndG9ycmMnKVxuICAgIGNvbnN0IGRhdGFwYXRoID0gcGF0aC5qb2luKGRhdGFkaXIsICdkYXRhJylcbiAgICBjb25zdCBob3N0ID0gJzEyNy4wLjAuMSdcbiAgICBjb25zdCBwb3J0ID0gYXdhaXQgZ2V0UG9ydCh7IGhvc3QsIHBvcnQ6IGdldFBvcnQubWFrZVJhbmdlKDkwNjUsIDk5OTkpIH0pXG4gICAgY29uc3QgaHR0cFR1bm5lbFBvcnQgPSBgJHtob3N0fToke3BvcnR9YFxuXG4gICAgY29uc3Qgc2V0dGluZ3MgPSB7XG4gICAgICBEYXRhRGlyZWN0b3J5OiBkYXRhcGF0aCxcbiAgICAgIEhUVFBUdW5uZWxQb3J0OiBodHRwVHVubmVsUG9ydCxcbiAgICAgIFNvY2tzUG9ydDogMCxcbiAgICB9XG5cbiAgICBkZWJ1ZygnU3RhcnRpbmcgdG9yIHdpdGggc2V0dGluZ3M6ICVvJywgc2V0dGluZ3MpXG5cbiAgICBjb25zdCB0b3JyYyA9IE9iamVjdC5lbnRyaWVzKHNldHRpbmdzKS5yZWR1Y2UoKGFjYywgW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICByZXR1cm4gKGFjYyArPSBgJHtrZXl9ICR7dmFsdWV9XFxuYClcbiAgICB9LCAnJylcbiAgICBmcy53cml0ZUZpbGVTeW5jKHRvcnJjcGF0aCwgdG9ycmMpXG4gICAgZGVidWcoJ0dlbmVyYXRlZCB0b3JyYyBhdCAlczpcXG4lcycsIHRvcnJjcGF0aCwgdG9ycmMpXG5cbiAgICBwcm9jZXNzLmVudi5ncnBjX3Byb3h5ID0gYGh0dHA6Ly8ke2h0dHBUdW5uZWxQb3J0fWBcbiAgICBkZWJ1ZygnU2V0dGluZyBncnBjX3Byb3h5IGFzOiAlcycsIHByb2Nlc3MuZW52LmdycGNfcHJveHkpXG5cbiAgICBwcm9jID0gY2hpbGQuc3Bhd24oJ3RvcicsIFsnLWYnLCB0b3JyY3BhdGhdLCB7IGN3ZDogZGF0YWRpciB9KVxuICAgIGRlYnVnKCdTdGFydGVkIHRvciBwcm9jZXNzIHdpdGggcGlkOiAlcycsIHByb2MucGlkKVxuXG4gICAgcHJvY2Vzcy5vbignZXhpdCcsICgpID0+IHtcbiAgICAgIHByb2Mua2lsbCgpXG4gICAgfSlcbiAgICBwcm9jZXNzLm9uKCd1bmNhdWdodEV4Y2VwdGlvbicsICgpID0+IHtcbiAgICAgIHByb2Mua2lsbCgpXG4gICAgfSlcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBwcm9jLnN0ZG91dC5vbignZGF0YScsIGFzeW5jIChkYXRhKSA9PiB7XG4gICAgICAgIGRlYnVnVG9yKGRhdGEudG9TdHJpbmcoKS50cmltKCkpXG4gICAgICAgIGlmIChkYXRhLnRvU3RyaW5nKCkuaW5kZXhPZignQm9vdHN0cmFwcGVkIDEwMCUnKSAhPT0gLTEpIHtcbiAgICAgICAgICBhd2FpdCBkZWxheShUT1JfV0FJVF9USU1FT1VUKVxuICAgICAgICAgIHJlc29sdmUodHJ1ZSlcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YS50b1N0cmluZygpLmluZGV4T2YoJ1tlcnJvcl0nKSAhPT0gLTEpIHtcbiAgICAgICAgICByZWplY3QoZGF0YS50b1N0cmluZygpKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogU3RvcCBUb3Igc2VydmljZS5cbiAgICovXG4gIGNvbnN0IHN0b3AgPSBhc3luYyAoKSA9PiB7XG4gICAgaWYgKGlzU3RhcnRlZCgpKSB7XG4gICAgICBkZWJ1ZygnU3RvcHBpbmcgdG9yIHdpdGggcGlkOiAlbycsIHByb2MucGlkKVxuXG4gICAgICBjb25zdCB3YWl0Rm9yRXhpdCA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgcHJvYy5vbignZXhpdCcsICgpID0+IHtcbiAgICAgICAgICBkZWJ1ZygnU3RvcHBlZCB0b3Igd2l0aCBwaWQ6ICVvJywgcHJvYy5waWQpXG4gICAgICAgICAgZGVsZXRlIHByb2Nlc3MuZW52LmdycGNfcHJveHlcbiAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIHByb2Mua2lsbCgnU0lHS0lMTCcpXG4gICAgICByZXR1cm4gd2FpdEZvckV4aXRcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHN0YXJ0LFxuICAgIHN0b3AsXG4gICAgaXNTdGFydGVkLFxuICB9XG59XG4iXX0=