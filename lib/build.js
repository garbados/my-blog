const fp = require('./flatpages')
const fs = require('fs/promises')
const hbs = require('./hbs')
const path = require('path')
const config = require('./config')

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
      created_at: createdAtMs,
      tags
    }
  } = entry
  const createdAtDate = new Date(createdAtMs)
  const createdAt = `${MONTHS[createdAtDate.getMonth()]} ${createdAtDate.getDate()}, ${createdAtDate.getUTCFullYear()}`
  const name = fileName.substring(0, fileName.search(/\..+$/))
  const code = tags.includes('code')
  return { code, description, name, title, tags, createdAt, createdAtDate, body }
}

async function gatherEntries () {
  const pages = await fp(pathJoin('entries'))
  const entries = []
  for (const [fileName, rawEntry] of Object.entries(pages)) {
    entries.push(marshalEntry(fileName, rawEntry))
  }
  return entries
    .filter(entry => !entry.tags.includes('old'))
    .sort((a, b) => a.createdAtDate < b.createdAtDate ? 1 : -1)
}

function marshalTags (entries) {
  return entries.reduce((acc, entry) => {
    return entry.tags.reduce((acc, tag) => {
      if (acc[tag]) {
        acc[tag].push(entry)
      } else {
        acc[tag] = [entry]
      }
      return acc
    }, acc)
  }, {})
}

async function gatherTemplates () {
  // gather source files
  const sources = {}
  for await (const name of ['layout', 'summary', 'homepage', 'index', 'entry']) {
    const template = await fs.readFile(templatePathJoin(`${name}.hbs`), FORMAT)
    sources[name] = template
  }

  // register partials
  for (const partial of ['layout', 'summary']) {
    hbs.registerPartial(partial, sources[partial])
  }

  // compile templates
  const templates = ['homepage', 'index', 'entry'].reduce((acc, template) => {
    acc[template] = hbs.compile(sources[template])
    return acc
  }, {})

  return templates
}

async function spitHtml (templates, entries, tags) {
  // marshal taglist
  const taglist = Object.entries(tags)
    .map(([tag, entries]) => [tag, entries.length])
    .filter(([_tag, n]) => n > 1)
    .sort((a, b) => a[1] < b[1] ? 1 : -1)
    .map(([tag, n]) => { return { tag, n } })

  // spit homepage
  const notHomeTags = ['introduction', 'featured']
  const introduction = tags.introduction[0]
  const recentByTag = taglist.reduce((acc, { tag }) => {
      if (notHomeTags.includes(tag)) return acc
      const entries = tags[tag]
      let chosen = null
      const alreadySelected = Object.values(acc)
      for (const entry of entries) {
        if (!alreadySelected.includes(entry)) {
          chosen = entry
          break
        }
      }
      if (chosen) acc[tag] = chosen
      return acc
    }, {})
  const recents = Object.entries(recentByTag)
    .map(([tag, entry]) => { return { tag, entry }})
  const featuredRecently = Object.values(recentByTag).map(({ title }) => title)
  const featured = tags.featured
    .filter((entry) => !featuredRecently.includes(entry.title))
  const indexHtml = templates.homepage({ config, taglist, introduction, recents, featured })
  await fs.writeFile(pathJoin('public', 'index.html'), indexHtml, FORMAT)
  // spit chronology
  const html = templates.index({ config, entries, taglist })
  await fs.writeFile(pathJoin('public', 'chronology.html'), html, FORMAT)
  // spit entries
  for await (const entry of entries) {
    const html = templates.entry({ config, entry, taglist })
    await fs.writeFile(pathJoin('public', `${entry.name}.html`), html, FORMAT)
  }
  // spit tags
  await fs.mkdir(pathJoin('public', 'tag'), { recursive: true })
  for await (const tag of Object.keys(tags)) {
    const entries = tags[tag]
    const subconfig = { ...config, subtitle: `Entries tagged '${tag}'` }
    const html = templates.index({ config: subconfig, entries, taglist })
    await fs.writeFile(pathJoin('public', 'tag', `${tag}.html`), html, FORMAT)
  }
}

module.exports = async () => {
  const [entries, templates] = await Promise.all([
    gatherEntries(),
    gatherTemplates()
  ])
  const tags = marshalTags(entries)
  spitHtml(templates, entries, tags)
}
