import { user } from './mocks'
import serverSetup from './_server.setup'
import serverTeardown from './_server.teardown'

describe('api:/user', () => {
  const endpoint = {
    method: 'POST',
    url: '/user',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Seia-Soto/branch <test>'
    }
  }

  it('should fail to create user without params', async () => {
    expect.assertions(1)

    const server = await serverSetup()
    const response = await server.inject(endpoint)

    expect(response.statusCode).toBe(400)

    await serverTeardown(server)
  })

  it('should create user', async () => {
    expect.assertions(1)

    const server = await serverSetup()
    const response = await server.inject({
      ...endpoint,
      body: JSON.stringify(user)
    })

    expect(response.statusCode).toBe(200)

    await serverTeardown(server)
  })
})
