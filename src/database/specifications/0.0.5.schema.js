import debug from './_debug'

const deploy = async knex => {
  const tables = {
    posts: table => {
      table.increments()

      table.string('type', 256)
      table.integer('author')
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
}
const rollback = async knex => {
  const tables = ['tags', 'tag_actions']

  for (let i = 0, l = tables.length; i < l; i++) {
    const tableName = tables[i]

    if (await knex.schema.hasTable(tableName)) {
      await knex.schema.dropTable(tableName)
    }
  }

  const changes = {
    users: table => {
      table.integer('permission', 9)

      return table
    }
  }

  for (const table in changes) {
    await knex.schema.table(table, tables[table])
  }
}

export {
  deploy,
  rollback
}
