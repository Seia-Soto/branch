import debug from './_debug'

const deploy = async knex => {
  const tables = {
    tags: table => {
      table.increments()

      table.string('type', 256)
      table.integer('author')
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
      table.integer('author')
      table.integer('item')
      table.integer('target')
      table.datetime('createdAt').defaultTo(knex.fn.now())

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
