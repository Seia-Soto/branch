import knex from 'knex'

import { config } from '../defaults'

export default knex(config.database.client)
