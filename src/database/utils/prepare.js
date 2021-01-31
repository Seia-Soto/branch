import * as fs from 'fs'
import * as path from 'path'
import * as semver from 'semver'

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

  current = current[0].value

  debug('following version of `_branch` is installed:', current)

  const migrations = fs.readdirSync(path.join(__dirname, '../specifications'))
  let versions = []

  for (let i = 0, l = migrations.length; i < l; i++) {
    const filename = migrations[i]
    const version = filename.replace('.schema.js', '')

    if (semver.valid(version)) {
      versions.push(version)
    }
  }

  versions = versions.sort(semver.compare)

  const lastIndex = versions.length - 1

  if (lastIndex < 0) {
    return debug('canceling task because no schema migration files are available')
  }

  let currentIndex = versions.indexOf(current)

  if (currentIndex < 0) {
    debug('fixed current version index to last because database schema was not updated')

    currentIndex = lastIndex
  }
  if (currentIndex >= lastIndex) {
    return debug('no migration is required')
  }

  debug('updating sequencely to:', versions[lastIndex])

  for (currentIndex += 1; currentIndex < lastIndex + 1; currentIndex++) {
    const update = versions[currentIndex]

    debug('migrating database version to:', update)

    const migration = await import(path.join(__dirname, '../specifications', update + '.schema.js'))
      .catch(error => {
        if (error) {
          debug('failed to import schema script file dynamically:', error)
          debug('exiting to prevent future data corruption')

          process.exit(1)
        }
      })
    await migration.deploy(knex)

    const updateVersion = async () => {
      const trx = await knex.transaction()

      trx('_branch')
        .update({
          value: update
        })
        .where({
          key: 'revision'
        })
        .then(trx.commit)
        .catch(async error => {
          await trx.rollback()

          debug('rolled back changes and retrying in 5 second:', error)

          setTimeout(() => updateVersion(knex), 5 * 1000)
        })
    }

    await updateVersion()
  }
}
