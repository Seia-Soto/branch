import { knex } from '../../database'

const expire = async identifier => {
  const trx = await knex.transaction()

  await trx('tokens')
    .where({
      issuer: identifier
    })
    .del()
    .then(trx.commit)
    .catch(trx.error)
}

export default expire
