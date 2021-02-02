import debug from './_debug'

const deploy = async knex => {
  const tables = {
    users: table => {
      table.increments()

      table.string('identifier', 256).unique()
      table.string('username', 16).unique()
      table.text('password')
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
}
const rollback = async knex => {
  const tables = {
    users: table => {
      table.string('identifier', 256).unique()

      return table
    }
  }

  for (const table in tables) {
    await knex.schema.table(table, tables[table])
  }
}

export {
  deploy,
  rollback
}
