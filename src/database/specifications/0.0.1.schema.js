import debug from './_debug'

const deploy = async knex => {
  const tables = {
    _branch: table => {
      table.increments('id')

      table.text('key')
      table.text('value')

      return table
    }
  }

  for (const table in tables) {
    debug('setting up table cleanly:', table)

    const schema = tables[table]

    await knex.schema.dropTableIfExists(table)
    await knex.schema.createTable(table, schema)
  }

  const trx = await knex.transaction()

  await trx('_branch')
    .insert({
      value: '0.0.1'
    })
    .where({
      key: 'revision'
    })
    .then(trx.commit)
    .catch(trx.rollback)
}
const rollback = async knex => {
  await knex.schema.dropTableIfExists('users')
}

export {
  deploy,
  rollback
}
