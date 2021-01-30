import * as fs from 'fs'
import * as semver from 'semver'

import pkg from '../../../package.json'
import { createLogger } from '../../utils'
import * as seed from '../specifications/_seed'
import knex from '../knex'

const debug = createLogger('database:migrations')

export default async () => {
  const seedTables = async () => {
    debug('invalid installation has been found or `branch` is not installed')
    debug('deploying fresh latest version of `branch`')

    return await seed.deploy(knex)
  }

  if (!await knex.schema.hasTable('_branch')) {
    return await seedTables()
  }

  let current = await knex('_branch')
    .select('value')
    .where({ key: 'revision' })
    .limit(1)
  if (!current.length) {
    return await seedTables()
  }

  current = current[1].value

  debug('following version of `_branch` is installed:', current)

  const migrations = fs.readdirSync('../specifications')
  let versions = []

  for (let i = 0, l = migrations.length; i < l; i++) {
    const filename = migrations[i]
    const version = filename.replace('.schema.js')

    if (versions.push(version)) {
      return false
    }
  }

  versions = versions.sort(semver.compare)

  if (!versions.length) {
    return debug('canceling task because no schema migration files are available')
  }

  const lastIndex = versions.length - 1
  let currentIndex = versions.indexOf(pkg.version)

  if (currentIndex < 0) {
    currentIndex = lastIndex
  }
  if (currentIndex < lastIndex) {
    const update = versions[lastIndex]

    debug('new version of database schema found:', update)

    const migration = await import(update + '.schema.js')
      .catch(error => {
        if (error) {
          debug('failed to import schema script file dynamically')

          process.exit(1)
        }
      })
    return await migration.deploy()
  }

  debug('no migration deployment is required')
}
