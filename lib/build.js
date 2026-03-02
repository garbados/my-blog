const fp = require('./flatpages')
const fs = require('fs/promises')
const hbs = require('./hbs')
const path = require('path')
const config = require('./config')

const FORMAT = 'utf8'
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const FIRST_AMONG_EQUALS = ['poetry', 'essay', 'fiction', 'software', 'spooky', 'horror', 'sci-fi']
const NOT_HOME_TAGS = ['featured', 'introduction']
const TEMPLATES = ['homepage', 'index', 'entry']
const PARTIALS = ['layout', 'summary']

const pathJoin = path.join.bind(path, __dirname, '..')
const templatePathJoin = pathJoin.bind(path, 'resources', 'hbs')
const readHbs = (name) => fs.readFile(templatePathJoin(`${name}.hbs`), { encoding: FORMAT })
function writeHtml () {
  const args = Array.prototype.slice.call(arguments)
  const pathParts = args.slice(0, -2)
  const [ name, html ] = args.slice(-2)
  return fs.writeFile(pathJoin('public', ...pathParts, `${name}.html`), html, FORMAT)
}


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
  for await (const name of [...TEMPLATES, ...PARTIALS]) {
    const template = await readHbs(name)
    sources[name] = template
  }

  // register partials
  for (const partial of PARTIALS) {
    hbs.registerPartial(partial, sources[partial])
  }

  // compile templates
  const templates = TEMPLATES.reduce((acc, template) => {
    acc[template] = hbs.compile(sources[template])
    return acc
  }, {})

  return templates
}

async function spitHtml (templates, entries, tags) {
  // marshal taglist
  const taglist = FIRST_AMONG_EQUALS
    .map((tag) => [tag, tags[tag].length])
    .filter(([_tag, n]) => n > 1)
    .sort((a, b) => a[1] < b[1] ? 1 : -1)
    .map(([tag, n]) => { return { tag, n } })

  // spit homepage
  const introduction = tags.introduction[0]
  const recentByTag = FIRST_AMONG_EQUALS.reduce((acc, tag) => {
      if (NOT_HOME_TAGS.includes(tag)) return acc
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
  const recents = FIRST_AMONG_EQUALS
    .map((tag) => { return { tag, entry: recentByTag[tag] }})
  const featuredRecently = Object.values(recentByTag).map(({ title }) => title)
  const featured = tags.featured
    .filter((entry) => !featuredRecently.includes(entry.title))
  await writeHtml('index', templates.homepage({ config, taglist, introduction, recents, featured }))

  // spit chronology
  await writeHtml('chronology', templates.index({ config, entries, taglist }))

  // spit entries
  await Promise.all(entries.map((entry) => writeHtml(entry.name, templates.entry({ config, entry, taglist }))))

  // spit tags
  await fs.mkdir(pathJoin('public', 'tag'), { recursive: true })
  await Promise.all(Object.keys(tags).map((tag) => {
    return writeHtml('tag', tag, templates.index({
      config: { ...config, subtitle: `Entries tagged '${tag}'` },
      entries: tags[tag],
      taglist
    }))
  }))
}

module.exports = async () => {
  const [entries, templates] = await Promise.all([
    gatherEntries(),
    gatherTemplates()
  ])
  const tags = marshalTags(entries)
  spitHtml(templates, entries, tags)
}
