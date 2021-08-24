title: A Veteran's Guide to PouchDB
description: An introduction to writing software with PouchDB.
tags:
- pouchdb
- software-architecture
- tutorial
created_at: 2021-03-14T20:51:06.023Z

# A Veteran's Guide to PouchDB

I have written a great deal of software, and most of what I have to show for it is bitterness and trauma. I never want anyone to feel as lost and helpless and burnt out as I have; I would rather programmers feel the quiet dignity and insistent ethos of civil servants, because our works are so akin to public infrastructure. The discipline is [in a bad way](https://garbados.github.io/my-blog/regarding-software.html) but it is still important to understand how to use the right tools for the right application. We owe that much to users, and to each other as craftspeople.

This guide is intended for people with moderate experience with JavaScript, as well as people who have worked with databases much at all, though I hope anyone intending to write software might find its architectural considerations useful.

Any application that needs to store and query data should rely on robust standards for doing so, and as a result I use [PouchDB](https://pouchdb.com/) in most of my projects. PouchDB is a database that contains several adapters that allow it to store data in many possible backends, including [CouchDB](https://couchdb.apache.org/), LevelDB, IndexedDB, and LocalStorage; among the available options, PouchDB tries to choose the most appropriate one for its environment. PouchDB's semantics mirror CouchDB's, and it even supports CouchDB's replication protocol. This makes it trivial to instrument strong backups by replicating with a CouchDB cluster. As well, because PouchDB can run in browsers, you can replicate data down from server applications to user devices, creating a seamless experience in disconnected or low-connectivity circumstances. Applying this [offline first](http://offlinefirst.org/) pattern is crucial for supporting users in remote and tenuous situations, and PouchDB makes it easy to do so.

PouchDB also has a thriving plugin ecosystem, allowing you to easily extend your database with new [query interfaces](https://github.com/pouchdb-community/pouchdb-quick-search), [encryption](https://github.com/garbados/comdb), and even [p2p storage adapters](https://github.com/RangerMauve/pouchdb-adapter-hyperbee). It is also very easy to write your own application-specific plugins, in order to contextualize your database interface to your requirements.

In this guide I'll discuss example apps modeling a blog and a social network, but the real strength of these patterns lies in the disaster response team of the future who deploys mapping drones that autonomously construct a geo-indexed map of the area in realtime. The drones replicate telemetry with homebase so responders can account for damage to roads and other infrastructure in their deployment of resources, but they replicate with each other too so that they know how to plot their movements over unexplored terrain. Simple replication makes these advanced usage scenarios significantly easier to build.

In this essay I will demonstrate some basic usage of PouchDB, and then discuss advanced patterns like using and writing plugins, subclassing PouchDB, and modeling your data for efficient queries. So, let's begin!

## Installation and Basic Usage

PouchDB is a JavaScript library that you can install using [npm](https://www.npmjs.com/):

```bash
$ npm i -S pouchdb
```

Once installed, you can `require()` PouchDB in your project:

```javascript
const PouchDB = require('pouchdb')
const db = new PouchDB('test')
db.post({ hello: 'world' }).then((result) => {
  console.log(result)
  // {
  // "ok":true,
  // "id":"37b879902bdd9735382333d59a0018dd",
  // "rev":"1-15f65339921e497348be384867bb940f"
  // }
  const { id } = result
  return db.get(id)
}).then((doc) => {
  console.log(doc)
  // { _id: '...', _rev: '1-...', hello: 'world' }
})
```

If you run this code in a server environment, PouchDB will create a folder called `test` where it stores the files for a [LevelDB](https://github.com/google/leveldb) instance. You can also pass in the URL to a CouchDB database, and PouchDB will use its CouchDB adapter to use it as its data store. If you run this code in the browser, PouchDB will select an adapter that is best supported by that browser.

I like to use the environment variable `COUCH_URL` to store the URL of my CouchDB installation, so that I can use it to optionally hook my PouchDB instance up to it or to create a local database instead if `COUCH_URL` is not set:

```javascript
const COUCH_URL = process.env.COUCH_URL
const DB_NAME = 'test'
const DB_PATH = COUCH_URL
  ? `${COUCH_URL}/${DB_NAME}`
  : DB_NAME
const db = new PouchDB(DB_PATH)
```

This is useful when you already have a database in CouchDB with lots of data, and you want to explore that data with the fallback of marshaling it yourself.

Now let's consider an example application: a multi-user blog where documents in the database represent each user's individual posts. Let's see these documents using the [.allDocs()](https://pouchdb.com/api.html#batch_fetch) method:

```javascript
db.allDocs({ include_docs: true, limit: 1 })
  .then((result) => {
    console.log(result)
    // {
    //   total_rows: 10010,
    //   offset: 0
    //   rows: [{
    //     id: '...',
    //     key: '...',
    //     value: { rev: '...' },
    //     doc: {
    //       _id: 'entry:garbados:1234:5678',
    //       _rev: '...',
    //       created_at: 1234,
    //       content: '...',
    //       type: 'entry',
    //       user_id: 'user:garbados',
    //     }
    //   }]
    // }
  })
```

The `.allDocs()` method sorts documents by their `_id` field, meaning that if you carefully construct an `_id` you can make this index instantly useful. In the above example, the document's `_id` field is namespaced to the document's type, its associated user, its creation date, as well as a random suffix to distinguish posts submitted simultaneously. Here is the code that I used to construct this dummy data:

```javascript
// construct users
const users = []
for (let i = 0; i < 10; i++) {
  const type = 'user'
  const name = randomChars(10)
  const createdAt = Date.now()
  const id = `${type}:${name}`
  users.push({
    _id: id,
    createdAt,
    name
  })
}
// construct entries
const docs = []
for (let i = 0; i < 10000; i++) {
  const type = 'entry'
  const content = randomChars(10) // random entry text
  const user = pickRandom(users)
  const createdAt = Date.now()
  const suffix = Math.floor(createdAt * Math.random()) // random suffix
  const id = `${type}:${user.name}:${createdAt}:${suffix}`
  docs.push({
    _id: id,
    created_at: createdAt,
    content,
    type,
    user_id: user._id
  })
}
// insert the documents
db.bulkDocs([...users, ...docs])
```

Because of how these IDs are constructed, you can use the `startkey` and `endkey` options to retrieve specific subsets of your data, such as all documents of a specific type, or all entries chronologically:

```javascript
// get all users
db.allDocs({
  startkey: 'user',
  endkey: 'user:\ufff0',
  include_docs: true
}).then((result) => {
  // all users
  console.log(result)
})
```

Because PouchDB sorts IDs lexicographically, we can use high-value unicode characters to define specific key ranges to return. I use the character `\ufff0` because it is the highest valid unicode character. Here we use it to return all entries by a specific user:

```javascript
db.allDocs({
  startkey: 'entry:garbados',
  endkey: 'entry:garbados:\ufff0',
  include_docs: true
}).then((result) => {
  // all entries by garbados
  // oldest to latest
  console.log(result)
})
```

Because the part of an entry's ID that follows the username is its creation date, the results from above are automatically sorted chronologically. By default, results are sorted in ascending order, but you can use the `descending` option to reverse this behavior:

```javascript
db.allDocs({
  startkey: 'entry:garbados',
  endkey: 'entry:garbados:\ufff0',
  include_docs: true,
  descending: true
}).then((result) => {
  // all entries by garbados
  // latest to oldest
  console.log(result)
})
```

Of course, you won't always be able to support all the queries an application needs through constraining document IDs, so let's talk about PouchDB's query interfaces.

## Querying with PouchDB

PouchDB mirrors the query semantics of CouchDB, and so exposes a map/reduce indexing system called 'views'. The plugin [pouchdb-find](https://github.com/pouchdb/pouchdb/tree/master/packages/node_modules/pouchdb-find) adds support for the [Mango](https://docs.couchdb.org/en/stable/api/database/find.html) indexing and query system. Each have different abilities, so applications may find use for both. Let's begin with views.

Views are a part of [design documents](https://docs.couchdb.org/en/stable/ddocs/views/intro.html), which PouchDB and CouchDB use to define indexes. Here is an example design document for our blog application:

```javascript
db.put({
  _id: '_design/queries',
  views: {
    entriesByDate: {
      map: function (doc) {
        if (doc.type !== 'entry') { return }
        const date = new Date(doc.created_at)
        emit([
          date.getFullYear(),
          date.getMonth() + 1, // js 0-indexes months
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
          date.getSeconds()
        ])
      }.toString(),
      reduce: '_count'
    }
  }
})
```

Once the design document is in the database, we can use that `entriesByDate` view to query entries by when they were posted:

```javascript
// get all posts by year-month
db.query('queries/entriesByDate', {
  group: true,
  group_level: 2
}).then((result) => {
  console.log(result.rows)
  // [ { key: [ 2021, 3 ], value: 10000 } ]
})
```

Because the view specifies a 'reduce' step, PouchDB will group results based on whether their keys match. So, the `value` property of the result means that 10000 documents had a key starting with `[2021, 3]` AKA March 2021.

We can also skip the reduce step to retrieve entries from a specific date range:

```javascript
// get all posts from March 11 2021
db.query('queries/entriesByDate', {
  reduce: false,
  include_docs: true,
  startkey: [2021, 3, 11],
  endkey: [2021, 3, 11, '\ufff0']
}).then((result) => {
  console.log(result)
  // { rows: [{ id: '...', doc: { ... }, ... }, ...] }
})
```

JavaScript views like this are best when you need a reduce step, or you need to transform the document in some way in order to emit the desired key. In the above example, we convert the `created_at` property from milliseconds since the UNIX epoch to a date and time array, and we use a reduce step to count entries according to the levels of this parsed date.

The alternative to JavaScript views is called Mango, and it does not allow you to transform documents or to use a reduce step. However, you do not need to write a map function to instrument a Mango query. Instead, you create an index, and then you query it using [selectors](https://docs.couchdb.org/en/stable/api/database/find.html#selector-syntax). Selectors can be very sophisticated, allowing for complex queries that would be difficult to instrument in a JavaScript view.

To use Mango with PouchDB, you will need the [pouchdb-find](https://github.com/pouchdb/pouchdb/tree/master/packages/node_modules/pouchdb-find) plugin. Then you can attach it to PouchDB like this:

```javascript
const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'))
```

Now you can use the `.createIndex()` method to create Mango indices, and `.find()` to perform Mango queries. We'll talk more about PouchDB plugins later.

You can apply Mango selectors both at indexing time and query time. Applying a selector at indexing time allows you to use complex operators like `$regex` efficiently, because they are calculated before query time. For example, consider an index that maintains a list of all entries that contain the consecutive characters "abc". Here is how to write that index:

```javascript
db.createIndex({
  index: {
    partial_filter_selector: {
      type: 'entry',
      content: { $regex: 'abc' }
    },
    fields: ['user_id']
  },
  ddoc: 'mango',
  name: 'abc'
})
```

This creates a design document called `_design/mango` with a view called `abc`. We can invoke this index like this:

```javascript
db.find({
  selector: { user_id: 'garbados' },
  use_index: ['_design/mango', 'abc']
}).then((result) => {
  console.log(result)
  // {
  //   docs: [
  //     {
  //       _id: 'entry:garbados:1234:5678',
  //       _rev: '1-...',
  //       created_at: 1615494046689,
  //       content: 'eabcoxjlyh',
  //       type: 'entry',
  //       user_id: 'user:garbados'
  //     }
  //   ],
  //   bookmark: '...'
  // }
})
```

Mango queries by default return whole documents, as though you were using `include_docs: true`. You can constrain the fields that the query returns using the `fields` option:

```javascript
db.find({
  selector: { user_id: 'garbados' },
  fields: ['_id', 'user_id', 'created_at']
  use_index: ['_design/mango', 'abc']
}).then((result) => {
  console.log(result)
  // {
  //   docs: [
  //     {
  //       _id: 'entry:garbados:1234:5678',
  //       created_at: 1615494046689,
  //       user_id: 'user:garbados'
  //     }
  //   ],
  //   bookmark: '...'
  // }
})
```

Mango indices are best for when you want to instrument complex queries without writing a JavaScript view. By using objects rather than functions, Mango indices and queries are easier to construct, constrain, and maintain than JavaScript views. Moreover, when using CouchDB, Mango queries return faster because they do not need to invoke a JavaScript interpreter.

## Plugins

As you saw with `pouchdb-find`, you can extend the capabilities of PouchDB using [plugins](https://pouchdb.com/api.html#plugins). Plugins mutate PouchDB by adding or overriding methods, and you can use as many as you like. You can even write your own very simply.

A plugin I include in almost all my projects applies the `forcePut` method, which forcibly updates a document. PouchDB uses a revision system to support CouchDB replication, and as a result document updates must have a correct `_rev` value in order to update a document. But in practice, especially when working with design documents, it pays to be able to update a document without knowing anything about its prior revision.

Here is the plugin:

```javascript
PouchDB.plugin({
  forcePut: async function (doc) {
    try {
      // separate old doc from _rev
      const { _rev, ...oldDoc } = await this.get(doc._id)
      // cheap deep comparison of old and new
      const json1 = JSON.stringify(doc)
      const json2 = JSON.stringify(oldDoc)
      // only do update if they differ
      if (json1 !== json2) {
        return this.put({ _rev, ...doc })
      } else {
        return Promise.resolve()
      }
    } catch (err) {
      if (err.status === 404) {
        // no prior version exists
        return this.put(doc)
      } else {
        throw err
      }
    }
  }
})
```

Now you can use the `.forcePut()` method on PouchDB instances:

```javascript
const DDOC = {
  _id: '_design/queries',
  views: { ... }
}
db.forcePut(DDOC)
```

This is useful during database setup, so that you can ensure all your design documents are up to date.

Another plugin I commonly use adds the `.forceRemove` method, which deletes a document without requiring anything more than its ID:

```javascript
PouchDB.plugin({
  forceRemove: async function (docOrDocId, ...opts) {
    // .remove() supports accepting a doc or doc ID, so this does too
    const id = typeof docOrDocId === 'string' ? docOrDocId : docOrDocId._id
    // get the rev of a document if it already exists
    const rev = await this.get(id).catch((err) => {
      if (err.status === 404) {
        return {}
      } else {
        throw err
      }
    }).then((doc) => {
      return doc._rev
    })
    // do nothing if the doc doesn't already exist / has already been deleted
    if (rev) {
      return this.remove({ _id: id, _rev: rev }, ...opts)
    }
  }
})
```

The real power of plugins lies in being able to compose different features together, giving your database superpowers independent of the underlying storage mechanism. For example, consider this snippet that applies a series of plugins:

```javascript
const PouchDB = require('pouchdb')
PouchDB.plugin(require('comdb'))
PouchDB.plugin(require('pouchdb-adapter-memory'))
PouchDB.plugin(require('pouchdb-find'))
PouchDB.plugin(require('pouchdb-quick-search'))
```

These plugins add a variety of new abilities to your PouchDB instance, including the `.createIndex()` and `.find()` methods, but also wraps existing methods like `.bulkDocs()` to provide transparent document encryption. In particular, let's talk about what `pouchdb-quick-search` makes possible. It allows you to make queries looking for specific tokens in a field, such as words in entry contents. For example, the Mango view from above can be made more flexible and efficient using `.search()`:

```javascript
db.search({
  query: 'abc',
  fields: ['content'],
  include_docs: true
}).then((result) => {
  console.log(result)
  // { rows: [...] }
})
```

This returns all documents that contain the token 'abc', matching 'abc def' but not 'abcdef'. Unlike with the Mango index, where we had to apply a token selector at indexing time to properly filter results, now we can efficiently query for a specific token without instrumenting an index per token. The plugin takes care of indexing for us.

Unfortunately, plugins like `pouchdb-quick-search` do not function with some adapters, namely CouchDB. The CouchDB adapter can only utilize features that CouchDB already supports, while this plugin uses a search engine that CouchDB does not. As a result, to use this plugin while working with a CouchDB database, you must replicate data from CouchDB to the local database, like this:

```javascript
const db = new PouchDB('test')
const remote = new PouchDB(`${COUCH_URL}/test`)
// begin replication, and then continue replicating
// to stay up to date with CouchDB
const replication = db.replicate.from(remote, {
  live: true,
  retry: true
})
Promise.resolve().then(async () => {
  // wait 3s to let the local catch up to the remote
  await new Promise((resolve) => {
    setTimeout(resolve, 3000)
  })
  // now search!
  const result = await db.search({
    query: 'abc',
    fields: ['content']
  })
  console.log(result)
  // { rows: [...] }
})
```

[ComDB](https://github.com/garbados/comdb), another one of the plugins included above, overrides document updates and replication to encrypt documents. Let's see how that works:

```javascript
const PASSWORD = 'goodpassword'
const db = new PouchDB('test')
const db2 = new PouchDB('test-2')
const REMOTE_URL = `${COUCH_URL}/test-crypto`
// set a password. databases that use the same password and crypto options
// can decrypt each other's docs.
db.setPassword(PASSWORD, { name: REMOTE_URL })
db2.setPassword(PASSWORD)

// backup encrypted data to couchdb
db.replicate.to(REMOTE_URL).then(async () => {
  const result1 = await db.allDocs()
  // now let's destroy the unencrypted copy
  await db.destroy({ unencrypted_only: true })
  // so we can try restoring from the encrypted backup
  await PouchDB.replicate(REMOTE_URL, db2)
  // ensure everything was replicated ok
  const result2 = await db2.allDocs()
  console.log(result1.total_rows === result2.total_rows)
  // true
})
```

Now that we have all these pieces in play, let me illustrate for you a usage scenario. Imagine a P2P social network called Chitter. Using ComDB and replication, user content remains encrypted on the client's disk as well as on Chitter servers. The only place unencrypted documents live is in RAM, so only encrypted data persists between restarts. User content flows up to Chitter servers,
and back out to user devices, but only users that have a document's associated decryption key can read it. A clever server would enforce document permissions itself; we'll talk about how to do that later. First, how do you do E2E encryption with ComDB? With [pouchdb-adapter-memory](https://www.npmjs.com/package/pouchdb-adapter-memory), which can make a PouchDB instance store its documents in memory rather than on disk:

```javascript
const REMOTE_URL = `${process.env.COUCH_URL}/test-remote-encrypted`
// setup db: in-memory unencrypted, encrypted on disk
const db = new PouchDB('test-unencrypted', { adapter: 'memory' })
db.setPassword(PASSWORD, { name: 'test-local-encrypted' })
// continuously sync encrypted local with encrypted remote
const replication = PouchDB.sync(db, REMOTE_URL, { live: true, retry: true })
// write a document to memory
db.post({ hello: 'world' }).then(async () => {
  // now it's on the encrypted local and the encrypted remote
  // but because it's unencrypted in local memory, you can query it normally
  const result = await db.search({
    query: 'world',
    fields: ['hello']
  })
  console.log(result)
  // { rows: [{ _id: '...', score: 1 }], "total_rows": 1}
})
```

We'll continue to develop Chitter as this guide progresses. For now it's sufficient to have demonstrated the power of composing plugins to instrument nontrivial features like E2E encryption and offline functionality.

## Subclassing for Context

Plugins modify PouchDB itself, causing their changes to affect all instances of PouchDB. In application development, your context of your data will shape the access patterns that you use and develop. Deciding how to organize these access patterns can have a huge impact on maintenance effort and onboarding time. I strongly recommend organizing access methods for your data around a subclass of PouchDB, and for different contexts, using multiple subclasses. Let's see this in the context of Chitter, which adds methods for working with different document types:

```javascript
class ChitterDB extends PouchDB {
  // override fetch to add authentication headers when the user is set
  static fetch (url, opts) {
    if (this.userId) {
      opts.headers.set('X-Chitter-User-Id', this.userId)
      opts.headers.set('X-Chitter-Client-Key', this.clientKey)
    }
    return super.fetch(url, opts)
  }

  // setup required indices. run at app start
  async setup () {
    return Promise.all([
      // index followings
      this.createIndex({
        index: {
          partial_filter_selector: { type: 'follow' },
          fields: ['type', 'following']
        }
      }),
      // index followers
      this.createIndex({
        index: {
          partial_filter_selector: { type: 'follow' },
          fields: ['type', 'follower']
        }
      })
      // js views
      this.forcePut({
        _id: '_design/queries',
        views: {
          // group all known tags and scope by date elements
          tags: {
            map: function (doc) {
              if (doc.type !== 'status') { return }
              for (let tag of doc.tags) {
                const date = new Date(doc.created_at)
                emit([
                  tag,
                  date.getFullYear(),
                  date.getMonth() + 1, // js 0-indexes months
                  date.getDate(),
                  date.getHours(),
                  date.getMinutes(),
                  date.getSeconds()
                ])
              }
            }.toString(),
            reduce: '_count'
          },
          // group tags by user ID
          tagsByUser: {
            map: function (doc) {
              if (doc.type !== 'status') { return }
              for (let tag of doc.tags) {
                const date = new Date(doc.created_at)
                emit([
                  doc.userId,
                  tag,
                  date.getFullYear(),
                  date.getMonth() + 1, // js 0-indexes months
                  date.getDate(),
                  date.getHours(),
                  date.getMinutes(),
                  date.getSeconds()
                ])
              }
            }.toString(),
            reduce: '_count'
          },
        }
      })      
    ])
  }

  // set the current user. call this when the user logs in
  setUser (userId, clientKey) {
    this.userId = userId
    this.clientKey = clientKey
  }

  // modify new statuses to set common fields
  async addStatus (content, doc = {}) {
    doc.type = 'status'
    doc.createdAt = Date.now()
    doc.updatedAt = []
    doc.userId = self.userId || 'anonymous' // annotate anonymous access
    if (!doc.access) { doc.access = 'public' } // set default access rights
    const suffix = Math.floor(doc.createdAt * Math.random()) // cheap random int
    // create ID to support uniqueness and useful sorting
    doc._id = `${doc.type}:${doc.userId}:${doc.createdAt}:${suffix}`
    doc.content = content
    return this.put(doc)
  }

  // mark when a status was edited
  async editStatus (content, docId) {
    const doc = await this.get(docId)
    doc.updatedAt.push(Date.now())
    doc.content = content
    return this.put(doc)
  }

  // list statuses for a specific user, sorted chronologically
  async listStatuses (userId, opts = {}) {
    return this.allDocs({
      startkey: `status:${userId}`,
      endkey: `status:${userId}:\ufff0`,
      ...opts
    })
  }

  // search statuses by their content
  async searchStatuses (query) {
    const opts = { query, fields: ['content'], include_docs: true }
    return db.search(opts)
  }

  // set elements of a user profile, including display name, etc
  async setProfile (opts) {
    const type = 'profile'
    const id = `${type}:${this.userId}`
    const doc = await this.get(id).catch((error) => {
      if (err.status === 404) {
        return { type, userId: this.userId, _id: id }
      } else {
        throw error
      }
    })
    const {
      name,
      displayName,
      description,
      avatarUrl,
      coverUrl
    } = opts
    if (name) doc.name = name
    if (displayName) doc.displayName = displayName
    if (description) doc.description = description
    if (avatarUrl) doc.avatarUrl = avatarUrl
    if (coverUrl) doc.coverUrl = coverUrl
    return this.put(doc)
  }

  async addProfileLink (key, value, url) {
    // ex: "Pronouns: [she/her](https://http://pronoun.is/she/her)"
    const suffix = Math.floor(Date.now() * Math.random())
    const doc = { key, value, url }
    doc.createdAt = Date.now()
    doc.type = 'profile-link'
    const suffix = Math.floor(doc.createdAt * Math.random()) // cheap random int
    doc.userId = this.userId
    doc.profileId = `profile:${this.userId}`
    doc._id = `${doc.type}:${doc.userId}:${doc.suffix}`
    return this.put(doc)
  }

  async followUser (userId) {
    const type = 'follow'
    const id = `${type}:${this.userId}:${userId}`
    const doc = {
      _id: id,
      type,
      createdAt: Date.now(),
      following: userId,
      follower: this.userId
    }
    return this.put(doc)
  }

  async unfollowUser (userId) {
    return this.forceRemove(`follow:${this.userId}:${userId}`)
  }

  async listFollowing () {
    return db.find({
      selector: { follower: this.userId }
    })
  }

  async listFollowers () {
    return db.find({
      selector: { following: this.userId }
    })
  }

  // set specific config values, like user UI preferences
  async setConfig (key, value) {
    const type = 'config'
    const id = `${type}:${key}`
    const doc = await this.get(id).catch((err) => {
      if (err.status === 404) {
        // create origin doc if no prior exists
        return { _id: id, type, value }
      } else {
        throw err
      }
    })
    if (doc.value !== value) {
      doc.value = value
      return this.put(doc)
    }
  }

  // retrieve a config value, dropping the rest of the document
  async getConfig (key) {
    const doc = await this.get(`config:${key}`)
    return doc.value
  }
}
```

In the above example, we extend PouchDB with methods like `.addStatus()` that are specific to the semantics of our application. By doing this, we can rely on existing methods like `.get()` and `.remove()`, while providing more tightly scoped methods that account for the usage context, such as `.getConfig()`, `.listFollowing()`, and `.followUser()`. Let's see what it's like to work with a status in this architecture:

```javascript
const chitter = new ChitterDB('test')
chitter.addStatus('hello world').then(async ({ id }) => {
  // grab the ID from the underlying call to `.put()` and use `.get()` to retrieve the doc.
  const status = await chitter.get(id)
  console.log(status)
  // { _id: 'status:anonymous:1234:5678', createdAt: 1234, content: 'hello world', ... }
  // now edit the document, using only its id
  await chitter.editStatus('hello galaxy', id)
  const status2 = await chitter.get(id)
  console.log(status2.content)
  // hello galaxy
  // now we can remove it too
  await chitter.remove(status2)
})
```

We can use PouchDB methods alongside our custom methods, to facilitate semantics like writing a status with only a string, or to standardize common queries.

If you need a second database, for example if you wanted to keep config settings and statuses in separate databases, you can create another subclass to encompass that additional scope:

```javascript
class ChitterConfig extends PouchDB {
  // set specific config values, like user UI preferences
  async setConfig (key, value) {
    ...
  }

  // retrieve a config value, dropping the rest of the document
  async getConfig (key) {
    ...
  }
}
```

By scoping methods in this way, it becomes easy to add new scopes without creating a monolithic interface. Furthermore, by maintaining multiple databases you can set different replication settings for them. For example, say you wanted to replicate statuses but not config values:

```javascript
// local config: application settings, security keys
// not for replicating
const config = new ChitterConfig('config')
// statuses, to be replicated in order to be shared
const statuses = new ChitterStatuses('statuses')
const replication = statuses.replicate.to(REMOTE_URL, { live: true, retry: true })
```

Next, let's talk about how to model your application's data in order to facilitate efficient queries. This is crucial for making your application snappy as well as maintainable.

## Data Modeling AKA How To Decompose

It is often tempting to imagine you will maintain only a few types of documents, and contain everything your application needs within them. For example, you might have a status document, which contains a user's account info as well as a list of tags and media URLs. Or you might have a forum thread, and each reply is contained within its parent status document. The trouble with this architecture is that documents which belong to many sources, such as a forum thread that many users will write to, are prone to generating conflicts and the experience of data loss.

In CouchDB and PouchDB the atomic unit is the document. That is, the canonical source of truth for a datapoint is the document that contains it. Whenever you update a document, you must provide a revision value, to prove to the database which version you want to update. If you try to update a version before the latest one, the database might generate a "conflict" that will not appear to users or be indexed by any view. Essentially, to the user, their write appears to have succeeded even as it effectively vanished. These conflicts can clutter a database, reducing performance and creating considerable resource requirements. So, it is crucial to architect against them.

As a rule, each document should only have one writer. Perhaps this means a user account, but what if the user has multiple devices? That can cause conflicts too. So you should scope documents to the most basic agent that writes data. In this case, the device itself. You can then aggregate data using replication, for example to sync data across a user's devices.

To continue with Chitter as an example, let's look at the various types a social media network might need. Each of these would be represented as a document type, and each instance of each type would be a single document:

- Statuses: Posts by user devices. Links to the posting user. Other devices may issue updates that must be aggregated into a status using views.
- Status Media: A link to a media attachment. Includes metadata info as well as a link to the associated status. (Note: Although PouchDB and CouchDB support handling attachments, I *highly* recommend using a blob-specific store for storing files, such as S3-likes. These systems are simply not built for blob storage.)
- Follows: Relations between users. Links to all associated users.
- Profiles: A user's self-defined metadata. Links to the user.
- Profile links: Links to external websites to be listed on the user's profile. Links to the user's profile.
- Moderation Actions: Blocks, mutes, and other moderation actions should be stored individually, with an ID like `moderation:${actingUser}:${deviceId}:${targetUser}:${action}` in order to scope actions to devices. You can then use views to aggregate the moderation rules pertaining to specific users. (In addition, moderation actions can easily be shared in this model.)
- Configuration: Config settings are stored individually, local to each user, and are not intended to be replicated.

(You may notice this architecture differs from the above example `Chitter` class. The architecture will continue to evolve a bit as we learn more about using PouchDB. Consider these snippets as demonstrations more than production code.)

As an example of using this architecture, let's aggregate a status with multiple edits as well as associated media files:

```javascript
class ChitterStatuses extends PouchDB {
  // setup indices. run at startup
  async setup () {
    return Promise.all([
      this.forcePut({
        _id: '_design/queries',
        views: {
          'status-edits': {
            map: function (doc) {
              if (doc.type !== 'status') { return }
              // doc._id of original: status:${userId}:${deviceId}:${createdAt}:${suffix}
              // of edit: ${originalId}:edit:${deviceId2}:${updatedAt}:${suffix2}
              emit([doc.original_id || doc._id, doc.updatedAt || doc.createdAt])
            }.toString()
          },
          'status-media': {
            map: function (doc) {
              if (doc.type !== 'media') { return }
              emit(doc.status_id)  
            }.toString()
          }
        }
      })
    ])
  }

  async getStatus (id) {
    const { rows: edits } = await this.query('queries/status-edits', {
      startkey: [id],
      endkey: [id, '\ufff0'],
      descending: true
    })
    const ids = edits.map(({ id }) => { return id })
    const latest = await this.get(edits[0].id)
    const { rows } = await this.query('queries/status-media', {
      keys: ids,
      include_docs: true
    })
    const media = rows.map(row => row.doc)
    return { ...latest, media }
  }

  async getStatusEdits (id) {
    const { rows } = await this.query('queries/status-edits', {
      startkey: [id],
      endkey: [id, '\ufff0'],
      descending: true,
      including_docs: true
    })
    return rows.map(row => row.doc)
  }
}
```

This method makes three requests to get the latest version of the status, as well as any associated media. By deleting media documents, they can be removed from being associated with a given status. This ensures conflicts will not appear even as a user writes and updates statuses from multiple devices. You can then use `.getStatusEdits()` to show users the edit history of a given status.

In complex replication scenarios, it can take an indeterminate period for data to spread through the network. As a result, your queries may return stale data as updates move from device to server to device, or by other transmission method such as shared P2P datastructures. It is important to consider this latency in the design of your application, such as by refreshing objects in the UI regularly. This ensures a seamless experience in the face of diminished connectivity as well as frequent incoming updates.

## Conclusion

This is only the tip of the iceberg on the capabilities of using PouchDB and its plugin ecosystem, as well as using CouchDB for user authentication. In future tutorials I'll discuss other advanced patterns and develop even stranger applications in more detail. Who knows, maybe you'll see a full Chitter demo!

PouchDB and CouchDB have become somewhat obscure and even venerable, but their core strengths remain profoundly relevant to modern software, especially to the principles of free and open software. PouchDB makes it easy to produce software where a user's data truly belongs to them, only passes over the network in protected forms, and does not rely on central servers. And because it works on servers and in browsers, you can use it throughout your stack.

Thanks for reading. I'll see you next time :)
