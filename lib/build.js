const fp = require('./flatpages')
const fs = require('fs')
const hbs = require('handlebars')
const path = require('path')
const marked = require('marked')

const config = require('../config.json')

const FORMAT = 'utf8'

const pathJoin = path.join.bind(path, __dirname, '..')
const templatePathJoin = pathJoin.bind(path, 'resources', 'hbs')

const renderer = new marked.Renderer();
renderer.link = function ({ href, text }) {
  return `<a target="_blank" href="${href}">${text}` + '</a>';
}
marked.use({
  breaks: true,
  renderer
})

hbs.registerHelper('markdown', (context) => {
  return new hbs.SafeString(marked.parse(context))
})

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

module.exports = async () => {
  const entries = await fp(pathJoin('entries'))
  const entriesList = Object.entries(entries).map(([ fileName, entry ]) => {
    let {
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
  }).sort((a, b) => {
    return a.createdAtDate < b.createdAtDate ? 1 : -1
  })
  const sources = {
    entry: fs.readFileSync(templatePathJoin('entry.hbs'), FORMAT),
    index: fs.readFileSync(templatePathJoin('index.hbs'), FORMAT),
    layout: fs.readFileSync(templatePathJoin('layout.hbs'), FORMAT)
  }
  hbs.registerPartial('layout', sources.layout)
  const templates = {
    index: hbs.compile(sources.index),
    entry: hbs.compile(sources.entry)
  }
  const html = {
    index: templates.index({ config, entries: entriesList }),
    entries: entriesList.map((entry) => {
      return {
        name: entry.name,
        html: templates.entry({ config, entry })
      }
    })
  }
  fs.writeFileSync(pathJoin('public', 'index.html'), html.index, FORMAT)
  for (let entry of html.entries) {
    fs.writeFileSync(pathJoin('public', `${entry.name}.html`), entry.html, FORMAT)
  }
}
