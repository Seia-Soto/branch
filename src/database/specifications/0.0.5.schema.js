import debug from './_debug'

const deploy = async knex => {
  const tables = {
    posts: table => {
      table.increments()

      table.string('type', 256)
      table.integer('authorId')
      table.string('title', 512)
      table.text('content', 'longtext')
      table.datetime('createdAt').defaultTo(knex.fn.now(6))
      table.datetime('updatedAt').defaultTo(knex.fn.now(6))

      return table
    }
  }

  for (const table in tables) {
    debug('setting up table cleanly:', table)

    await knex.schema.dropTableIfExists(table)
    await knex.schema.createTable(table, tables[table])
  }
}
const rollback = async () => {
  debug('unreachable code!')
}

export {
  deploy,
  rollback
}
