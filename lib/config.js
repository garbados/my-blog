const base = require('../config.json')
const pkg = require('../package.json')

module.exports = {
  ...pkg,
  ...base,
  subtitle: pkg.description,
  url: process.env.DEV ? '/' : base.url
}
