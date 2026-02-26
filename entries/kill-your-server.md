title: Kill Your Server And Get Back To Bed
description: Patterns for Serverless Applications
tags:
- pouchdb
- software
- code
- old
created_at: 2018-10-27T03:06:38.787Z

# Kill Your Server And Get Back To Bed: Patterns for Serverless Applications

(Title inspired by [Nobody Beats The Drum - "Quit Your Job"](https://www.youtube.com/watch?v=qWWrOKqget4))

There's a lot of talk about "serverless" tech and most of it is bunk, so I want to kill the hype and talk to you about patterns. Rather than eliminate the work of maintaining and administrating a server, tech like Amazon's [serverless platform](https://serverless.com/) just locks you into using their servers. By comparison, content served over peer-to-peer networks like [Dat](https://datproject.org/) and [IPFS](https://ipfs.io/) rely on shared neutral infrastructure like [Bittorrent DHT trackers](https://www.npmjs.com/package/bittorrent-dht) such that an individual can serve web applications through them without needing to themselves maintain or administrate a server.

When I say *serverless* I mean that your application works entirely on the client. To the server, it's just some files. This keeps you out of being locked into particular server technologies (like Django or Ruby on Rails) or vendors (like AWS), and allows you to syndicate the application through P2P networks. Additionally, centering functionality on the client means a loss of network connectivity won't break the app, a feature sometimes called [Offline First](https://neighbourhood.ie/offline-first/).

However, for web applications, there are some downsides:

- All your app logic has to be done in JavaScript, or something that compiles to JS like TypeScript. If a user has JS disabled, the app can't function at all.
- All user data lives in the user's browser. Browser storage is notoriously ephemeral, making it important that a user be able to import and export their data to infrastructure they can trust. If your app doesn't store anything, this isn't a problem.
- Without a central server to coordinate authentication and authorization, complex social applications become significantly more complicated. If your app doesn't require auth, this isn't a problem.

As an example, let's consider a blogging application where users can write entries, publish them to a public page, and follow other blogs. I'll cover how to store data, how to create import / export relationships with neutral infrastructure, and how to implement social features using [Beaker](https://beakerbrowser.com/)'s [DatArchive](https://beakerbrowser.com/docs/apis/dat) API.

## Storing data in the client

I use [PouchDB](https://pouchdb.com/) to store data in the client. It acts as a wrapper around whatever storage mechanism the browser supports and mirrors the API used by CouchDB. Saving an entry works like this:

```javascript

const db = new PouchDB('blog')
const entry = { _id: `entry:${uuid()}`, ... }
const { id: entryId } = await db.put(entry)
```

Then, to retrieve it:

```javascript

const entry = await db.get(entryId)
```

PouchDB comes with a "primary index" which sorts documents by their `_id`, allowing you to perform queries against that sorted list. As a result, I've prefaced the entry's ID with `entry:` so that it can be found quickly without a custom index. To retrieve all entries, we select all documents whose IDs start with `entry:`:

```javascript

const { rows } = await db.allDocs({
  include_docs: true,
  startkey: 'entry:',
  endkey: 'entry:\uffff'
})
const entries = rows.map(({ doc }) => { return doc })
```

In this case, we use `startkey` and `endkey` to select only documents whose IDs start with `entry:`. The unicode character `\uffff` is used in the endkey as it will sort after any UUID.

To paginate this data, use the `limit` option to set a maximum number of results. Then, to retrieve the next page, set the startkey to the highest ID found in your initial query. For example:

```javascript

// get the first page
const { rows: firstPage } = await db.allDocs({
  limit: 20,
  include_docs: true,
  startkey: 'entry:',
  endkey: 'entry:\uffff'
})
const entries = firstPage.map(({ doc }) => { return doc })
// get the second page
const highestId = entries.map(({ _id }) => { return _id }).reduce((a, b) => { return a > b ? a : b })
const { rows: nextPage } = await db.allDocs({
  limit: 20,
  include_docs: true,
  startkey: highestId,
  endkey: 'entry:\uffff'
})
const nextEntries = nextPage.map(({ doc }) => { return doc })
```

Rinse and repeat to paginate through the whole set.

## Securing and preserving user data

If the user wipes their browser cache, they'll lose all their entries. To give it a secure home, they'll need to offload it somewhere that will keep it safe. Traditionally this means the application server, which dumps every entry into a database that administrators can peruse freely. Instead, a serverless app using PouchDB can rely on generic infrastructure like [CouchDB](http://couchdb.apache.org/) for imports and exports.

PouchDB and CouchDB share a [robust replication protocol](http://docs.couchdb.org/en/stable/replication/index.html) that allows them to sync data back and forth. In a simple scenario, you could run a CouchDB installation on your local machine and then have a serverless app replicate your data to it. Your data still only lives on hardware you control, but now it can be restored if the browser's storage gets wiped. Here is an example that replicates once to a local CouchDB, creating a snapshot backup:

```javascript

await db.replicate.to('http://localhost:5984')
```

Here is how to restore browser storage from that backup:

```javascript

await db.replicate.from('http://localhost:5984')
```

This is fine if you have a CouchDB installation, but if you're relying on someone else's then you'll want to encrypt your backup so that database administrators can't read your entries. For this, I use [ComDB](https://github.com/garbados/comdb), a PouchDB plugin that transparently encrypts and decrypts any replications. This way, your data remains unencrypted in the browser so that you can query it normally, but it's obfuscated when replicated elsewhere, and unobfuscated when you replicate it back. To use ComDB for this, you'll need to set a password when you set up the database:

```javascript

const PouchDB = require('pouchdb')
PouchDB.plugin(require('comdb'))

const db = new PouchDB('blog')
db.setPassword('extremely secure value')
```

If your user forgets their password, there's not much you can do. Without a privileged server to coordinate a "Forgot Password" workflow, the user is left to protect their password themselves.

## Publishing from the client

Beaker's [DatArchive](https://beakerbrowser.com/docs/apis/dat) web API allows a program to create and manipulate [Dat](https://datproject.org/) archives, which can be shared over neutral P2P infrastructure with other users. This archive works just like a filesystem directory, so you can write files to it and then publish it to the network. Anyone with the address of your page can then visit it as long as you're broadcasting it. For more uptime, you can use a dedicated peer service like [hashbase](https://hashbase.io/) to make sure someone is always peering the archive.

To create a public page for your blog, the application will template user data and create a static site by writing HTML files to an archive. For this example, I'll use [handlebars](http://handlebarsjs.com/):

```javascript

// create the archive
const archive = await DatArchive.create({
  title: 'My blog!',
  description: 'A blog by me!'
})
// get the template from the app's DOM
const source   = document.getElementById("public-entries-template").innerHTML
const template = Handlebars.compile(source)
// template each entry into what will be the index.html
const indexHtml = template(entries)
// write the file to the archive
await archive.writeFile('/index.html', indexHtml, 'utf-8')
```

Now anyone can visit that archive's URL (accessible as the archive's [url](https://beakerbrowser.com/docs/apis/dat#properties) property) to see a public version of your blog. Although this blogging application relies heavily on JavaScript, the public version can just be static HTML and CSS. You can even use this templating approach to publish an RSS feed for your blog!

Because of how Dat handles archive ownership, only you can update your blog's public version. Beaker automatically stores the credentials -- a cryptographic keypair -- required to assert yourself as its owner. If you lose that keypair somehow, you'll need to regenerate the archive at a new address if you want to modify it.

## Following other blogs

Just as you can template your entries and publish them as HTML, you can also serialize your entries into JSON and share that. If you gave this entries archive URL to another user, they could then download and interpret the JSON into its constituent entries.

Here's how to serialize and publish your entries:

```javascript

// get all your entries
const { rows } = await db.allDocs({
  include_docs: true,
  startkey: 'entry:',
  endkey: 'entry:\uffff'
})
const entries = rows.map(({ doc }) => { return doc })
// create the archive itself
const archive = await DatArchive.create({
  title: 'My blog entries!',
  description: 'The entries in my blog as a JSON array!'
})
archive.writeFile('/entries.json', JSON.stringify(entries), 'utf-8')
```

Given the URL to this archive, here is how another user could download those entries:

```javascript

const archive = await DatArchive.load(archiveUrl)
const rawEntries = await archive.readFile('/entries.json', 'utf-8')
const entries = JSON.parse(rawEntries).map((entry) => {
  entry._id = `remote:${archiveUrl}:${entry._id}`
  return entry
})
await db.bulkDocs(entries, { new_edits: false })
```

In this example, the receiving user modifies each entry's ID to reflect its source, allowing them to distinguish between their own entries and entries downloaded from others without creating a special query index. The `{ new_edits: false }` option tells PouchDB to treat the documents as if they've been replicated over from another database. In this way, it works like replicating with a Dat Archive instead of a CouchDB installation.

Although I don't have example code for this, it's possible to implement asymmetric crypto over this sharing process (such as with [node-rsa](https://github.com/rzcoder/node-rsa)) so that even if the URL of your entries archive falls into the wrong hands, only authorized users can discern the contents.

## Outro

This approach to web applications has only become possible as the JavaScript and P2P ecosystems have matured. These practices continue to evolve, and the tooling that facilitates them improves all the time. Applications like [Fritter](https://github.com/beakerbrowser/fritter#fritter) implement many of these practices, including [complex identity systems](https://github.com/beakerbrowser/dat-identities-spec) that do not rely on central authorities. Some of the more basic elements, like storing data using PouchDB, can be found in my [chaiseblog](https://github.com/garbados/chaiseblog) diary app.

If you'd like help implementing an architecture like this in your application, please [reach out](https://toot.cat/@garbados). I'm happy to provide guidance and answer questions.
