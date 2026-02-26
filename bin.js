#!/usr/bin/env node

const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')

const {
  buildSite,
  newEntry,
  rssFeed
} = require('./lib')

yargs(hideBin(process.argv))
  .command({
    command: 'build',
    description: '',
    handler: async () => {
      await buildSite()
    }
  })
  .command({
    command: 'rss',
    description: '',
    handler: async () => {
      await rssFeed()
    }
  })
  .command({
    command: 'new-entry [name]',
    description: '',
    builder: (yargs) => {
      yargs.positional('name', {
        describe: 'The filename for the new entry. Used as the URL slug.',
        type: 'string',
        default: new Date().toISOString()
      })
      yargs.option('title', {
        describe: 'The title of the entry.'
      })
    },
    handler: async ({ name, title }) => {
      await newEntry({ name, title })
    }
  })
  .alias('help', 'h')
  .parse()
