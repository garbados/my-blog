#!/usr/bin/env node

const yargs = require('yargs')

const {
  buildSite,
  newEntry,
  rssFeed
} = require('.')

yargs
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
  .wrap(yargs.terminalWidth())
  .parse()
