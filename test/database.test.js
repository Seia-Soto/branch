import knex from '../src/database/knex'
import { deploy } from '../src/database/specifications/0.0.1.schema'
import { prepare } from '../src/database/utils'

describe('api:/user', () => {
  it('should deploy initial version', async () => {
    expect.assertions(0)

    await deploy(knex)
  })

  it('should upgrade database without exception', async () => {
    expect.assertions(0)

    await prepare()
  })
})
