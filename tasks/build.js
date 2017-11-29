#!/usr/bin/env node
'use strict'

const async = require('async')
const fp = require('flatpages')
const fs = require('fs')
const hbs = require('handlebars')
const path = require('path')

var config = require('../config.json')

const FORMAT = 'utf8'

const pathJoin = path.join.bind(path, __dirname, '..')
const templatePathJoin = pathJoin.bind(path, 'templates')

async.waterfall([
  function (done) {
    fp(pathJoin('entries'))
      .catch((err) => {
        done(err)
      })
      .then((entries) => {
        done(null, entries)
      })
  },
  function (entries, done) {
    const entriesList = Object.keys(entries).map((fileName) => {
      const name = fileName.substring(0, fileName.search(/\..+$/))
      const entry = entries[fileName]
      return {
        name: name,
        title: entry.meta.title,
        description: entry.meta.description,
        created_at: entry.meta.created_at,
        html: entry.html
      }
    }).sort((a, b) => {
      return (a.created_at < b.created_at) ? 1 : -1
    })
    async.parallel([
      fs.readFile.bind(fs, templatePathJoin('layout.hbs'), FORMAT),
      fs.readFile.bind(fs, templatePathJoin('index.hbs'), FORMAT),
      fs.readFile.bind(fs, templatePathJoin('entry.hbs'), FORMAT)
    ], (err, results) => {
      if (err) {
        done(err)
      } else {
        hbs.registerPartial('layout', results[0])
        const indexTemplate = hbs.compile(results[1])
        const entryTemplate = hbs.compile(results[2])
        const index = indexTemplate({ config, entries: entriesList })
        const entries = entriesList.map((entry) => {
          return {
            name: entry.name,
            html: entryTemplate({ config, entry })
          }
        })
        async.parallel([
          fs.writeFile.bind(fs, pathJoin('index.html'), index, FORMAT),
          async.map.bind(async, entries, (entry, done) => {
            fs.writeFile(pathJoin(`${entry.name}.html`), entry.html, done)
          })
        ], done)
      }
    })
  }
], (err, result) => {
  if (err) {
    console.trace(err)
  }
})
