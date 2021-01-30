import debug from './_debug'

const deploy = async () => {
  debug('unreachable code!')
}
const rollback = async knex => {
  await knex.schema.dropTableIfExists('users')
}

export {
  deploy,
  rollback
}
