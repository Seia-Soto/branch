import debug from './_debug'

const deploy = async knex => {
  await knex.schema.createTable('tokens', table => {
    table.increments()

    table.string('issuer')
    table.text('token')
    table.boolean('expired')

    return table
  })
}
const rollback = async () => {
  debug('unreachable code!')
}

export {
  deploy,
  rollback
}
