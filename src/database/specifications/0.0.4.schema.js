import debug from './_debug'

const deploy = async knex => {
  const tables = {
    tokens: table => {
      table.increments()

      table.string('issuer')
      table.text('token')

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
  if (await knex.schema.hasTable('posts')) {
    await knex.schema.dropTable('posts')
  }
}

export {
  deploy,
  rollback
}
