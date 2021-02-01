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
const rollback = async knex => {
  await knex.schema.dropTable('tokens')
}

export {
  deploy,
  rollback
}
