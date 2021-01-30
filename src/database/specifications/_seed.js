import { version } from '../../../package.json'
import { createLogger } from '../../utils'

const debug = createLogger('database:seed')

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

  trx('_branch').insert({
    key: 'revision',
    value: version
  })
    .then(trx.commit)
    .catch(async error => {
      debug('error while inserting default properties:', error)

      await trx.rollback()

      debug('rolled back changes and retrying in 5 second')

      setTimeout(() => deploy(knex), 5 * 1000)
    })
}
const rollback = async () => {
  debug('nothing to rollback in current division because this is initial revision!')
}

export {
  deploy,
  rollback
}
