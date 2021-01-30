// NOTE: patches;
require('v8-compile-cache')

// eslint-disable-next-line
require = require('esm')(module)

module.exports = require('./index.esm')
