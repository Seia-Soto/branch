import branch from '../src/index.esm'

export default async () => {
  const server = await branch()

  return server
}
