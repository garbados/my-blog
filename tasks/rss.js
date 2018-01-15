#!/usr/bin/env node
'use strict'

const async = require('async')
const fp = require('flatpages')
const fs = require('fs')
const pkg = require('../package.json')
const RSS = require('rss')

const MD = /\.(md|markdown)$/
const HTML = /\.html$/

fp('entries').then(function (entries) {
  const items = Object.keys(entries)
    .map(function (key) {
      const { title, description, created_at } = entries[key].meta
      const url = key.replace(MD, '.html')
      return {
        title,
        description,
        date: created_at,
        author: pkg.author,
        url: [pkg.homepage, url].join('/')
      }
    })
    .sort(function (a, b) {
      if (a.date > b.date) {
        return -1
      } else if (a.date < b.date) {
        return 1
      } else {
        return 0
      }
    })

  const feed = new RSS({
    title: pkg.name,
    description: pkg.description,
    site_url: pkg.homepage,
    feed_url: [pkg.homepage, 'rss.xml'].join('/'),
    pubDate: items[0].date
  })

  items.forEach(function (item) {
    feed.item(item)
  })

  return feed.xml()
}).then(function (xml) {
  fs.writeFileSync('rss.xml', xml, 'utf-8')
}).catch(function (e) {
  console.error(e)
})
