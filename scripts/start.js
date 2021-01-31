const branch = require('../src')
const { config } = require('../src/defaults')
const { createLogger } = require('../src/utils')

module.exports = (async () => {
  const server = await branch()
  const debug = createLogger()

  await server.listen(config.application.port)

  debug('application listening on:', server.server.address())
})()
