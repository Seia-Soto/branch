import * as argon2 from 'argon2'

const verify = async (hash, text) => {
  const result = await argon2.verify(hash, text)

  return result
}

export default verify
