const hbs = require('handlebars')
const marked = require('./marked')

hbs.registerHelper('markdown', (context) => {
  return new hbs.SafeString(marked.parse(context))
})

module.exports = hbs
