# Seia-Soto/branch

The general multi-purpose content management system as this can be.

[![js-standard-style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](http://standardjs.com)

## Table of Contents

- [Concept](#concept)
- [Development](#Development)
- [Database](#database)
- [LICENSE](#license)

----

# Concept

The purpose of this repository is making a scalable and reusable content management system.

## Hidden purpose

The *actual* general purpose of this repository is joining a study group to enhance my production management skills and wiring my existing stacks with new libraries and runtime.
Also, I am currently jumping to backend world again just like the beginning of my development life.

# Development

Some notes useful to development.

## Database

This section describes about implemented database structure and the reason of my selections.

### Migrations

You can find that there are `schema` suffixed filenames (not extension) in `src/database/specifications` section.
These files are used to deploy and rollback to specific revision of database schema and exports two functions, `rollback` and `deploy`.
There is no need to match the package version and database schema version at all, but at least I am going to use match version as possible.
It can have some diffs in version data, but main reason of mismatching versions between package and database will be considering non-database related package source-code updates, not handling both things in different cycles.

```js
import debug from './_debug'

const deploy = async knex => {
  // NOTE: Your update code from previous version!
}
const rollback = async knex => {
  // NOTE: Code to rollback to this version from higher version.
}

export {
  deploy,
  rollback
}
```

Schema files are always dynamically imported via boot code of this project and handled automatically by version.
After doing stuffs, the application will safely update the version string saved in database `_branch[key='revision']`, so don't update the version string in database manually.
However, if `deploy` function fails, the version string won't be updated and you need to consider about setting new table cleanly.

#### Specials

Also, you've seen some files prefixed with `_` which have purpose to make developers can access easily to them.
Currently, I am taking only two files with special purpose:

- _debug.js
- _seed.js

As you can see `_debug.js` is for print messages in schema files.
However, `_seed.js` file is quite important because it will *seed* the database, again, means it will setup new fresh installations.
You may got some questions about this because `_seed.js` will get duplicated codes at most cases, however think about deploying first version and upgrading it by iterating schema files isn't that good in both time and performance when I consider long period that will make many releases.
Seed file will export only `deploy` function at all and will remove all existing things before setting up.

### Unique identifiers

The unique identifiers are used to reduce the difficulty of query.
Having only primary key can make more hard system to query up in general from my experience.
However, in recent research about relational database, primary key does and now I know that it's better to use primary key instead of third party UUID to create parties between rows.

# LICENSE

This project is distributed under [MIT license](./LICENSE).

## Overrides

Additionally, following terms override some parts:

- You cannot redistribute or publish, run modified version of `branch` without publishing the source-code.
- You cannot redistribute or publish, run version of `branch` without specifying original publisher.
