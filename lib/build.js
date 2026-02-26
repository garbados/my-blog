const fp = require('./flatpages')
const fs = require('fs/promises')
const hbs = require('./hbs')
const path = require('path')

const config = require('../config.json')

const FORMAT = 'utf8'
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const pathJoin = path.join.bind(path, __dirname, '..')
const templatePathJoin = pathJoin.bind(path, 'resources', 'hbs')

function marshalEntry (fileName, entry) {
  const {
    body,
    meta: {
      title,
      description,
      created_at: createdAtMs
    }
  } = entry
  const createdAtDate = new Date(createdAtMs)
  const createdAt = `${MONTHS[createdAtDate.getMonth()]} ${createdAtDate.getDate()}, ${createdAtDate.getUTCFullYear()}`
  const name = fileName.substring(0, fileName.search(/\..+$/))
  return { description, name, title, createdAt, createdAtDate, body }
}

async function gatherEntries () {
  const pages = await fp(pathJoin('entries'))
  const entries = []
  for (const [fileName, rawEntry] of Object.entries(pages)) {
    entries.push(marshalEntry(fileName, rawEntry))
  }
  return entries.sort((a, b) => {
    return a.createdAtDate < b.createdAtDate ? 1 : -1
  })
}

async function gatherTemplates () {
  // gather source files
  const sources = {}
  for await (const name of [
    'layout', 'summary', 'index', // 'entry', 'tag'
  ]) {
    const template = await fs.readFile(templatePathJoin('entry.hbs'), FORMAT)
    sources[name] = template
  }

  // register partials
  for (const partial of ['layout', 'summary']) {
    hbs.registerPartial(partial, sources[partial])
  }

  // compile templates
  const templates = [
    'index', // 'entry', 'tag'
  ].reduce((acc, template) => {
    acc[template] = hbs.compile(sources[template])
    return acc
  }, {})

  return templates
}

async function spitHtml (templates, entries) {
  // spit index
  const indexHtml = templates.index({ config, entries })
  await fs.writeFile(pathJoin('public', 'index.html'), indexHtml, FORMAT)

  // spit entries
  for await (const entry of entries) {
    const html = templates.entry({ config, entry })
    await fs.writeFile(pathJoin('public', `${entry.name}.html`), html, FORMAT)
  }
}

module.exports = async () => {
  const [entries, templates] = await Promise.all([
    gatherEntries(),
    gatherTemplates()
  ])
  spitHtml(templates, entries)
}
