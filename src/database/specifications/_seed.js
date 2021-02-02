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
      table.increments() // NOTE: chain;

      table.string('username', 16).unique()
      table.text('password')
      table.string('email', 320).unique()
      table.string('verification', 256)
      table.string('avatar', 256)
      table.integer('permission', 9)

      return table
    },
    tokens: table => {
      table.increments()

      table.integer('issuer') // NOTE: chain;
      table.text('token')

      return table
    },
    posts: table => {
      table.increments()

      table.string('type', 256)
      table.integer('author') // NOTE: chain;
      table.string('title', 512)
      table.text('content', 'longtext')
      table.datetime('createdAt').defaultTo(knex.fn.now())
      table.datetime('updatedAt').defaultTo(knex.fn.now())

      return table
    }
  }

  for (const table in tables) {
    debug('setting up table cleanly:', table)

    await knex.schema.dropTableIfExists(table)
    await knex.schema.createTable(table, tables[table])
  }

  const trx = await knex.transaction()

  await trx('_branch')
    .insert({
      key: 'revision',
      value: '0.0.5'
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
