// eslint-disable-next-line
require = require('esm')(module)

const { default: knex } = require('../src/database/knex')
const { deploy } = require('../src/database/specifications/_seed')

module.exports = (async () => {
  knex.debug(true)

  await deploy(knex)

  process.exit()
})()
