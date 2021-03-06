# Seia-Soto/branch

The general multi-purpose content management system as this can be.

[![js-standard-style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](http://standardjs.com)

## Table of Contents

- [Concept](#concept)
- [Development](#Development)
  - [Environment](#environment)
  - [Scripts](#scripts)
  - [Database](#database)
  - [Routing](#routing)
- [LICENSE](#license)

----

# Concept

The purpose of this repository is making a scalable and reusable content management system.

## Hidden purpose

The *actual* general purpose of this repository is joining a study group to enhance my production management skills and wiring my existing stacks with new libraries and runtime.
Also, I am currently jumping to backend world again just like the beginning of my development life.

# Development

Some notes useful to development.

## Environment

This project runs on:

- Node.JS v14 LTS or higher
- Relational database* (Knex.JS)

## Scripts

This section describe the behavior of each scripts.

### `yarn silent`

Runs the app without any output except for unhandled rejection.

### `yarn start`

Runs the app with only printing *branch* related debug messages.

### `yarn debug`

Runs the app with printing all debugging messages.
The messages printed by setting `DEBUG=*` will print all things from [`debug`](https://npmjs.com/package/debug) library.

### `yarn clean`

Deploys the database with database seeding script.
It will remove all existing database before creating new one, which means that losing all previous data.

### `yarn lint`

Runs ESlint on current project for `.js` extensions.

### `yarn test`

Runs jest test on current project.
It is recommended that you to clean database before running it to reduce unexpected errors.

### `yarn test:verbose`

Runs jest test on current project with printing server side mesasges to help debug.

### `yarn pnpify:vsc`

Enable yarn's PnP support for VSCode ESlint.

## Structures

> **Important**
>
> This project isn't *MVC*.

The overview of current project:

- `src`
  - `database`
    - `specifications`: schemas
    - `utils`
  - `router`: router code
    - `user`
  - `schema`: expressions of attributes
    - `user`
  - `structures`: independent functions
    - `user`
    - `password`
  - `utils`: shared utils

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

## Routing

This section describes how routing is done in current project.

### Validations

To validate values coming from client is done with JSON schema version 7 and Fastify supports it natively.
Schema validation code need to be completed with routing code because still there is no need to split the folder of controllers and routers at this time.
Each API handlers are assigned with `handler` property of router and I don't want to split them because it makes project massive.
Also, router code and controller code is already distributed via folders and files.
You can see that routers always using `index.js` inside a folder to represent the specific tree of API.

- [Understanding JSON Schema](https://json-schema.org/understanding-json-schema/index.html)

Note that [additional values are removed](https://www.fastify.io/docs/latest/Validation-and-Serialization/#validator-compiler) by ajv package by default to speed up internally inside of Fastify.

### Resulting

In result schema, I need to keep things in line to make our application safer.
Because of the danger of XSS attacks, I need to give all things inside of property and I use `status` to indicate if the request successfully processed and use `result` to represent the data of request.
Also, giving no information to non authorized accessor is important, so don't address any kind of unhandled error which is called Internal Server Error in the result.

# LICENSE

This project is distributed under [MIT license](./LICENSE).

## Overrides

Additionally, following terms override some parts:

- You cannot redistribute or publish, run modified version of `branch` without publishing the source-code.
- You cannot redistribute or publish, run version of `branch` without specifying original publisher.
