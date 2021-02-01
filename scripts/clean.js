// eslint-disable-next-line
require = require('esm')(module)

const { default: knex } = require('../src/database/knex')
const { deploy } = require('../src/database/specifications/_seed')

module.exports = (async () => {
  try {
    knex.debug(true)

    await deploy(knex)

    knex.destroy()
    process.exit(0)
  } catch (error) {
    console.error('ERROR:', error)

    knex.destroy()
    process.exit(1)
  }
})()
