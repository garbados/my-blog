const fp = require('./flatpages')
const fs = require('fs')
const path = require('path')
const RSS = require('rss')
const { author, description, homepage, name } = require('../package.json')

const MD = /\.(md|markdown)$/

const entriesPath = path.join(__dirname, '..', 'entries')

module.exports = async () => {
  const entries = await fp(entriesPath)
  const items = Object.entries(entries).map(([fileName, { meta }]) => {
    const {
      created_at: date,
      description,
      title
    } = meta
    const url = [homepage, fileName.replace(MD, '.html')].join('/')
    return { author, date, description, title, url }
  }).sort((a, b) => {
    return a.date > b.date ? -1 : 1
  })
  const feed = new RSS({
    title: name,
    description,
    site_url: homepage,
    feed_url: [homepage, 'rss.xml'].join('/'),
    pubDate: items[0].date
  })
  items.forEach((item) => { feed.item(item) })
  const xml = feed.xml()
  const rssPath = path.join(__dirname, '..', 'public', 'rss.xml')
  fs.writeFileSync(rssPath, xml, 'utf-8')
}
