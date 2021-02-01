import { user } from './mocks'
import serverSetup from './_server.setup'

let server

beforeAll(async () => {
  server = await serverSetup()
})
afterAll(() => {
  server.close()
})

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

    const response = await server.inject(endpoint)

    expect(response.statusCode).toBe(400)
  })

  it('should create user', async () => {
    expect.assertions(1)

    const response = await server.inject({
      ...endpoint,
      body: JSON.stringify(user)
    })

    expect(response.statusCode).toBe(200)
  })
})
