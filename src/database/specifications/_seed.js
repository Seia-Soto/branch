import { createLogger } from '../../utils'

const debug = createLogger('database:seed')

const deploy = async knex => {
  const tables = {
    _branch: table => {
      table.increments('id')

      table.text('key')
      table.text('value')

      return table
    },
    users: table => {
      table.increments()

      table.string('username', 16).unique()
      table.text('password', 8192)
      table.string('email', 320).unique()
      table.string('verification', 256)
      table.string('avatar', 256)
      table.integer('permission', 9)

      return table
    }
  }

  for (const table in tables) {
    debug('setting up table cleanly:', table)

    await knex.schema.dropTableIfExists(table)
    await knex.schema.createTable(table, tables[table])
  }

  const trx = await knex.transaction()

  trx('_branch').insert({
    key: 'revision',
    value: '0.0.3'
  })
    .then(trx.commit)
    .catch(async error => {
      await trx.rollback()

      debug('rolled back changes and retrying in 5 second:', error)

      setTimeout(() => deploy(knex), 5 * 1000)
    })
}

export {
  deploy
}
