#!/usr/bin/env node
'use strict'

const fp = require('flatpages')
const fs = require('fs')
const hbs = require('handlebars')
const path = require('path')

var config = require('../config.json')

const FORMAT = 'utf8'

const pathJoin = path.join.bind(path, __dirname, '..')
const templatePathJoin = pathJoin.bind(path, 'src', 'hbs')

module.exports = async () => {
  const entries = await fp(pathJoin('entries'))
  const entriesList = Object.entries(entries).map(([ fileName, entry ]) => {
    const {
      html,
      meta: {
        title,
        description,
        created_at: createdAt
      }
    } = entry
    const name = fileName.substring(0, fileName.search(/\..+$/))
    return { description, name, title, createdAt, html }
  }).sort((a, b) => {
    return a.createdAt < b.createdAt ? 1 : -1
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
  fs.writeFileSync(pathJoin('index.html'), html.index, FORMAT)
  for (let entry of html.entries) {
    fs.writeFileSync(pathJoin(`${entry.name}.html`), entry.html, FORMAT)
  }
}
