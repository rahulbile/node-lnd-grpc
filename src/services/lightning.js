import { status } from 'grpc'
import { getClosestProtoVersion, getLatestProtoVersion } from '../utils'
import Service from '../service'

/**
 * Lightning service controller.
 * @extends Service
 */
class Lightning extends Service {
  constructor(options) {
    super('Lightning', options)
    this.useMacaroon = true
  }

  /**
   * Reconnect using closest rpc.proto file match.
   */
  async onBeforeConnect() {
    this.debug(`Connecting to ${this.serviceName} gRPC service`)

    // Establish a connection, as normal.
    await this.establishConnection()

    // Try to make a call to ensure that the connection is usable.
    // We call to getInfo in order to determine the api version.
    try {
      const info = await this.waitForCall('getInfo', {})
      this.debug('Connected to Lightning gRPC: %O', info)

      // Determine most relevant proto version based on the api info.
      const [closestProtoVersion, latestProtoVersion] = await Promise.all([
        getClosestProtoVersion(info.version),
        getLatestProtoVersion(),
      ])

      // Reconnect using best matching rpc proto if needed.
      if (closestProtoVersion !== latestProtoVersion) {
        this.debug('Found better match. Reconnecting using rpc.proto version: %s', closestProtoVersion)
        this.service.close()
        await this.establishConnection({ version: closestProtoVersion })
      }
    } catch (error) {
      if (error.details === 'permission denied') {
        this.debug('Unable to determine lnd version: permission denied')
      } else {
        throw error
      }
    }
  }
}

export default Lightning
