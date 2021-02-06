import debug from './_debug'

const deploy = async knex => {
  const trx = await knex.transaction()

  debug('inserting default post properties')

  const postProperties = ['public']

  for (let i = 0, l = postProperties.length; i < l; i++) {
    const property = postProperties[i]

    trx('tags')
      .insert({
        type: 'post_property',
        author: -1,
        name: property,
        format: 'text',
        data: null,
        description: null
      })
  }

  const changes = {
    tokens: table => {
      table.datetime('createdAt').defaultTo(knex.fn.now())

      return table
    }
  }

  for (const table in changes) {
    await knex.schema.table(table, changes[table])
  }
}
const rollback = async () => {
  debug('unreachable code!')
}

export {
  deploy,
  rollback
}
