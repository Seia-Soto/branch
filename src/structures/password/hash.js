import * as argon2 from 'argon2'

const hash = async text => {
  'use strict'

  try {
    const hash = await argon2.hash(text)

    return hash
  } catch (error) {
    return hash(text)
  }
}

export default hash
