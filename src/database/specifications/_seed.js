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
      table.increments() // NOTE: user-chain;

      table.string('username', 16).unique()
      table.text('password')
      table.string('email', 320).unique()
      table.string('verification', 256)
      table.string('avatar', 256)

      return table
    },
    tokens: table => {
      table.increments()

      table.integer('issuer') // NOTE: user-chain;
      table.text('token')
      table.datetime('createdAt').defaultTo(knex.fn.now())

      return table
    },
    posts: table => {
      table.increments() // NOTE: post-chain;

      table.string('type', 256)
      table.integer('author') // NOTE: user-chain;
      table.string('title', 512)
      table.text('content', 'longtext')
      table.datetime('createdAt').defaultTo(knex.fn.now())
      table.datetime('updatedAt').defaultTo(knex.fn.now())

      return table
    },
    tags: table => {
      table.increments() // NOTE: tag-chain;

      table.string('type', 256)
      table.integer('author') // NOTE: user-chain;
      table.string('name', 64)
      table.string('format', 128)
      table.text('data', 'longtext')
      table.text('description', 'longtext')
      table.datetime('createdAt').defaultTo(knex.fn.now())
      table.datetime('updatedAt').defaultTo(knex.fn.now())

      return table
    },
    tag_actions: table => {
      table.increments()

      table.string('action', 32)
      table.integer('author') // NOTE: user-chain;
      table.integer('item') // NOTE: tag-chain;
      table.integer('target') // NOTE: post-chain;
      table.datetime('createdAt').defaultTo(knex.fn.now())

      return table
    }
  }

  for (const table in tables) {
    debug('setting up table cleanly:', table)

    await knex.schema.dropTableIfExists(table)
    await knex.schema.createTable(table, tables[table])
  }

  const trx = await knex.transaction()

  debug('inserting default post properties')

  const postProperties = ['public']

  for (let i = 0, l = postProperties.length; i < l; i++) {
    const property = postProperties[i]

    await trx('tags')
      .insert({
        type: 'post_property',
        author: -1,
        name: property,
        format: 'text',
        data: null,
        description: null
      })
  }

  await trx('_branch')
    .insert({
      key: 'revision',
      value: '0.0.7'
    })

  await trx.commit()
    .catch(async error => {
      await trx.rollback()

      debug('rolled back changes and retrying in 5 second:', error)

      setTimeout(() => deploy(knex), 5 * 1000)
    })
}

export {
  deploy
}
