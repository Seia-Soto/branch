import debug from './_debug'

const deploy = async knex => {
  const tables = {
    users: table => {
      table.dropColumn('identifier')

      return table
    }
  }

  for (const table in tables) {
    await knex.schema.table(table, tables[table])
  }
}
const rollback = async () => {
  debug('unreachable code!')
}

export {
  deploy,
  rollback
}
