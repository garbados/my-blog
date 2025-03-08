title: Ethos and Ergonomics
description: Toward a new web.
tags:
- software
created_at: 2024-11-30T00:00:00.000Z

# From Ethos to Ergonomics

How should it feel to use the web? Right now, it feels bad. Let's imagine changing that.

...

Before you can really think of something, you need a rationale for that thought. A gun will never occur to you without the drive of war and violence. Thus, tools reflect our ethos back: we made them because of our beliefs, so that they become those beliefs incarnate. What beliefs does the present situation reflect? DNS is namespaced rent. A handful of websites for a handful of billionaires, and they all hate interop except when it's a turf grab. So, yeah, the web kinda sucks right now. It seems like every service, no matter how necessary, holds you in contempt, and in your frustration you return the favor.

So how should we be doing things? There's the rub: before you can answer *how*, you must conclude *why*. You must be thoughtful in your faith, in your reason, in order to reveal the tactics of your cause. I call this presupposing philosophy an *ethos*, an axiomatic ethic that provides direction; the *why* of *how*.

To me, the web is a post-industrial, post-computerization civic utility, like a postal service. What we want out of it is the facilitation of the digitalizable aspects of the services we commonly need and want: search, social, banking, shopping, bills, etc. Significant subsets of public needs in these realms can be made accessible anywhere at any time through the web. Though, I think you already know that. I think you know it's a utility. I think you don't capitalize the web like you don't capitalize the tap or the grid. Like any public utility, it should belong to the public for its benefit. I believe its architecture should privilege voluntary social organization, as well as autonomous data ownership and network moderation, in order to be accountable to an internationalist usage. Not everyone will get along; that's what it means to believe in some things and not others.

This is my ethos:

- *Users should own their compute work.* For virtually any common digitizable thing, commodity hardware is more than sufficient for efficient code. Do not ask me to create an account for an app whose code should never need the web anyway. Do not ask me to login to my diary. Where a user asks someone else to do compute work for them, like to do something "in secret" like a die roll, they should have an understood trust relationship with the other party, like a player to a game server.
- *Users should own their data.* Where possible, a user's data should live on the user's device, so that they have implicit control over it. Where a user trusts someone else to store that data, they should have an understood trust relationship with the party doing that work. Why store your backups with rentiers that vanish over people you know and trust?
- *Users should create voluntary networks.* Global indices are a myth whose compromised nature creates avenues for hostile actors to exploit the illusory authority of systems like DNS. An attacker should never enter your network unless you let them in. They shouldn't exist in your part of the web, and their data should never touch your machine. That attackers, of the phisher or propagandist variety, can exploit the global aspects of centralized social software is an architectural flaw their maintainers cannot escape. (Why would Meta want to?) What will it look like, or feel like, to use software with a different perspective on the network?

At the end of all of this manifesto crap, a user will want to use a computer to search for something, post whatever, buy whatever, or do bureaucratic stuff. That user should not hate the experience. If data ownership matters, then we must answer *who stores what?* If users must be able to apply the complexities of trust -- so-to-say "moderation" -- all the way down to peers exchanging sockets, then there has to be a way of encoding, discovering, and proving that trust's artifacts. How will we design those systems? We will know how to design them because of what we believe. This is what I believe.

This essay tries to expand my ethos into an *ergonomics*, the feeling of using the thing, of using the web. It does so by describing common, popular services as architected for public ownership. Public, in this case, is a nebulous, anarchic term: I mean whoever the network effects, should be able to affect the network, and to effect it as well. Fedi might be called *public* in this sense, in that it is owned, operated, built and maintained by users. (A few billion dollars could really shape up that ship, but they say it's only the last capitalist that sells their own noose.) In particular, I illustrate a search engine, a clustered database, and a social network, as these are all primitives necessary for networked app development: how to find things, where to store them, and the who's-who of it all.

Let's get to it!

## Part One: Search

Consider Google, a name once so ubiquitous as to become a verb. Today it primarily wants to show me ads and machine-hallucinations. The underlying practices that made Google so useful are still around -- PageRank is simply an algorithm -- but Google hasn't practiced them in a while. In order to confront the social problems of wealth and malfeasance, the organization of Google compromised the value proposition in wise and unwise ways. Regarding malfeasance, while one's spiders and indexers are fully automated, they can be gamed invisibly, so one must manually moderate query results to manage this attack vector. Regarding wealth, they sold adspace. Easy fix for mercenaries. The two produced a heady mix that today proves nigh useless.

It should not be like this. Google has proven difficult to replace because the costs of running a search engine are, at scale, enormous. You spider the whole fucking web and then you have to index it a bazillion ways, replicate it around the world a few times, and then parse human questions into safe database queries.

<blockquote class="bluesky-embed" data-bluesky-uri="at://did:plc:snhe2oxrn74k3m24ffw2mfie/app.bsky.feed.post/3lbruqxjnjn2n" data-bluesky-cid="bafyreih32x25weqdoayfx3ppfydat6mi7l6szzvvxh4bsznuodooxgrulm"><p lang="">does doing the time warp dance really cause time travel</p>&mdash; Riker Googling (<a href="https://bsky.app/profile/did:plc:snhe2oxrn74k3m24ffw2mfie?ref_src=embed">@rikergoogling.bsky.social</a>) <a href="https://bsky.app/profile/did:plc:snhe2oxrn74k3m24ffw2mfie/post/3lbruqxjnjn2n?ref_src=embed">November 25, 2024 at 7:49 AM</a></blockquote><script async src="https://embed.bsky.app/static/embed.js" charset="utf-8"></script>

To replace Google, one would need their own index of the web, their own worldwide data network, and a query language. We have lots of query languages and some can even be taught to humans, but the other two involve expensive choices. You can't self-host either of those things in a way that matters. So, it's done by the only players under capitalism with capital, and they do it for profit.

We need to break down these two problems so they can be scaled horizontally: the web index and the data network. If we get clever, we can spread those capabilities across peers. We can even do it over DNS, while that lasts. So, how?

The web index is big because the web is big. So, what if the web were small? What if instead of exploring it with a fleet of spiders, a user app ran its own over some locally-relevant subset of the web? If a user's spider only indexed the links from its social feed (fedi, bsky, etc.), and only traveled one or two hops beyond that, then that starts to look like work a phone could do. By indexing relative to a user's social sphere, we get inherently contextualized results. To get outside of that sphere, they could access public instances with more spiders, more reach, and a bigger index. A cooperative might make it their business to throw resources at a fleet of spiders, following journalists or civil bureaus or academia or all of the above and more in order to build a giant web index. Then, they expose a query interface as a website, and anyone can search the web from their perspective. Hypothetically, this could be a matter of stringing together commodity hardware with commodity software, and then curating the index as it evolves. That's within our power.

This begs the question of how this hypothetical social network works. This is a hot question as of the time of this writing, with the chaotic piratica of fedi suspicious of crypto-cozy corporatists who promise only an exit door, while The Website Formerly Known As Twitter shrinks to the weight class of truth dot social. Nobody cares about Meta except people you hate. So what is it supposed to look like? *What is the civic utility this medium serves?* A wordsome bitch regrets to say: we'll return to this question in Part III. For now, imagine there's a website with profiles that post content, where content might be a link or have links in it, and where the website indexes these posts for perusal somehow. Once we have our data network, we can describe how that would work within this ethos.

So, let's talk about that data network.

## Part Two: Data

A *peer-to-peer database* has been a holy grail for people like me for my entire professional life. There are many things that call themselves a P2P DB but there are always complex drawbacks festooned in the design that developers are usually reticent to be frank about. Things like, the inability to delete data. The reason I'm so excited about [Goblins](./conceptual-intro-to-spritely-goblins) is that it provides relatively high-level APIs for swapping concise capabilities between peers, so it's trivial to implement a cap like "Hey buddy, will you keep this for me?" and "Do you remember that thing I gave you?" and "Hey, forget about that thing I gave you," whereas that trio comprises a labyrinthine nightmare of architectural consequences in append-only systems like Hypercore and blockchains. These fundamentals are so essential to scaling a network horizontally that you have to get them right.

When a system call itself a *database*, the meaning can be unclear. Databases do lots of different things: some support SQL, some are for text or image search, some store data in-memory while others persist writes to disk in various ways. There are two database-type functions we need for the data network for our search engine and social network. First, we need to be able to read, write, and forget data from an address space -- to be able to store and remember things by some identifier. Second, we need a way to index what we store, but let's start with reads and writes.

Imagine a horizontal network of *data nodes*, or peers that share some basic data-related capabilities, like fetching and storing data. Some nodes will actually be storing things, but these capabilities can be curried together so that one node may represent connections to many. I'll begin with JavaScript pseudocode describing this most basic case: a node that stores data for users.

```js
class DataNode {
    constructor (db) {
        // let's pretend we have a handy dandy db
        // that knows how to persist and fetch data locally.
        // it can write "data" which is whatever
        // and it can write "receipts" which we'll get to later
        this.db = db
    }

    // as all the node's methods are called by peers,
    // all the node's methods take a peer parameter,
    // but this example won't apply auth on reads
    async read (_peer, key) {
        // fetch the data from the db by key. like redis!
        return this.db.getData(key)
    }

    // for writes, we want auth, so we need cryptography.
    // for a delete, we'll give the user a receipt
    // so when they say "forget that" we can check it
    async write (peer, value) {
        // to get the key from a value, we hash it
        // to preserve a one-way relationship:
        // we can know what the key is if we have the value,
        // but we can't know the value if we just have the key
        const key = await hash(value)
        // to produce a receipt, we'll make an encrypted value
        // that combines our peer's public key with that key
        const receipt = await encrypt([peer.publicKey, key])
        await Promise.all([
            // we save the receipt so we can check it later
            this.db.writeReceipt(key, receipt),
            // and we save the data to disk or whatever!
            this.db.writeData(key, value)
        ])
        // return the key so the peer knows how to get the data back
        // and the receipt so they can delete it!
        return [key, receipt]
    }

    // to delete something...
    async forget (peer, receipt) {
        // first we decrypt the receipt back into its values
        const [publicKey, key] = await decrypt(receipt)
        // receipts should only be valid for whoever received them
        // so if the peer and the receipt don't match, reject it!
        // in this example, let's pretend keys are verified
        // during a handshake before any methods are called
        if (peer.publicKey !== publicKey) throw new Error("Unauthorized")
        // you might think, ah, now we can delete from the database
        // but what if someone else wrote the same data here?
        // they would have a valid receipt too!
        // so instead, we "release" the receipt for this peer
        return this._release(key, publicKey)
    }

    // any given data might have many receipts on it,
    // so we have to decide how to handle it.
    // this may vary by trust model!
    // so here is a kind of generic approach
    async _release (key, publicKey) {
        // first, we forget the receipt
        await this.db.forgetReceipt(key, publicKey)
        // maybe some people are VIPs and they can zap data at will
        if (ADMIN_KEYS.contains(publicKey)) {
            await this.db.forgetData(key)
        }
        // maybe some people "own" some data,
        // like a person "owns" their posts,
        // so their receipts are always good for their data
        else if (doesPeerOwn(db, publicKey, key)) {
            await this.db.forgetData(key)
        }
        // maybe you only forget data once every receipt is released
        // (that's how tahoe-lafs works)
        else if (await this.db.hasNoReceipts(key)) {
            await this.db.forgetData(key)
        }
    }
}
```

*Note for the crypt-keepers at home: I abstracted `encrypt` and `decrypt` because setting the standard parameters for these functions is a matter of setting standards, which is an institutional task. By the time it gets in the hands of app-devs, these values should be baked into the tooling. Why? So that receipts work across the network.*

Even rudimentary data operations create a complex context in the data network. Nodes in the network have to make choices about how and why they store data, choices that will affect how they are implemented. Some of these choices, like cryptographic values, can be specified at the standards level, but, "Hey buddy, will you store this for me?" remains a question with a social component. Individual nodes will have to make these choices, and users will be wise to bear them in mind.

In the end, united by standards, the data network consists of many nodes that use keypair-cryptography to allow arbitrary peers to do reads, writes, and deletes. Nodes can even gossip receipts without ever learning what data it refers to. Plus, these deletes actually remove data from the system. Noncompliant peers might not obey, but nothing will save you from screenshots anyway.

So what about peer-to-peer database indices, the kind that facilitate query languages? Let me begin with: I have spent many years examining this problem and, yikes.

Typical databases use a B-tree to organize the data they store, because it offers fast lookups and sorted keys. Our data network so far stores things as an amorphous mass of people asking "Hey, do you have this thing?" and its key-space can't be listed at all. Even if we could sort all the keys that a node is storing, the keys are just hashes from the values themselves. Normally we want to sort on a field that matters to us, like sorting posts by date or tag, but our data nodes don't know whether the data they store is structured at all. So, we need another node: the index node.

An index node is a system that uses many data nodes to structure and index data, so that you can query it. A simple index node just caches your reads so you can list them. A more complex one might know how to destructure data to index the important parts, so that, for example, you could save JSON data and query it with jq syntax. Wouldn't that be neat? Index nodes are one step closer to the terrestrial world of application development, but not quite. We're not out of Tartarus yet.

How does an index node combine many data nodes? Perhaps pseudocode will elucidate the complexities, and some solutions:

```js
class IndexNode {
    constructor (db, dataNodes = []) {
        // we can add and remove data nodes at will
        // so we start with an empty list
        this.dataNodes = dataNodes
        // this time, our db is a little more advanced.
        // it's still local to the device, but
        // it can associate arbitrary keys and values
        // and then fetch keys in sorted order
        this.db = db
    }

    // because an index node uses many data nodes,
    // we can syndicate reads to our nodes
    // to route around damage through redundancy
    async read (peer, key) {
        const proxiedReads = this.dataNodes.map((dataNode) => {
            return dataNode.read(peer, key)
        })
        // return the first read to resolve
        return Promise.any(proxiedReads)
    }

    // we can do the same for writes, but what will we do with receipts?
    async write (peer, id, value) {
        // writes don't always succeed, and data nodes may come and go
        // so we have to remember who gave us what receipt
        const proxiedWrites = this.dataNodes.map(async (dataNode) => {
            const [key, receipt] = await dataNode.write(peer, value)
            return [dataNode.id, key, receipt]
        })
        // writes don't always succeed, so we filter down to those that did
        const responsesMaybe = await Promise.allSettled(proxiedWrites)
        const responses = responsesMaybe.filter(({ status }) => {
            return status == "fulfilled?"
        }).map(({ value }) => value)
        // writes to data nodes reply with [key, receipt]
        // but the key is deterministic, so all nodes return the same key (or can be shown to be byzantine)
        const key = responses[0][1] // because the key is the same for all responses[n][1]
        const receipts = responses.map(([dataNodeId, _key, receipt]) => [dataNodeId, receipt])
        // since data nodes keep track of their own receipts, the index node only tracks a meta-receipt
        const metaReceipt = await encrypt([peer.publicKey, key])
        await Promise.all([
            // remember our new db can store at arbitrary addresses!
            // but which peers get to assign what IDs?
            // this is one of many ways index nodes can vary.
            // in this example, imagine the index node runs in userland
            // so only the user of that host can assign IDs.
            // in another architecture, data IDs might be prefixed with a peer ID,
            // or perhaps the method itself checks a peer's keys for permission.
            // for now let's keep it simple.
            // plus: because it's the data nodes that store values,
            // the index node only has to store the key where it can be found!
            this.db.putData(id, key),
            // we can also assign receipts by arbitrary ID.
            // so let's namespace by the data's key and the peer's pubkey
            this.db.putReceipt(key, peer.publicKey, receipts)
        ])
        return [key, metaReceipt]
    }

    // since we can write by ID,
    // we should be able to fetch by it too!
    async fetchOne (peer, id) {
        const key = await this.db.getData(id)
        return this.read(key)
    }

    // as for deleting data...
    async forget (peer, id, metaReceipt) {
        const [publicKey, key] = await decrypt(metaReceipt)
        // looking similar so far...
        if (peer.publicKey !== publicKey) throw new Error("Unauthorized")
        const receipts = await this.db.getReceipt(key, publicKey)
        // now we syndicate to our data nodes
        return Promise.all(receipts.map(([dataNodeName, receipt]) => {
            // because we stored the name of our data node,
            // we can fetch it now even if we've added or removed nodes
            const dataNode = this.dataNodes.filter((d) => {
                return d.id === dataNodeName
            })[0]
            // maybe we've forgotten about that data node
            if (dataNode) {
                // if we haven't, we redeem the receipt
                return dataNode.forget(peer, receipt)
            }
        }))
    }

    // because our db can sort data by id, we can do some rudimentary queries
    // for example, we can make a generator that resolves keys
    // whose IDs sort between two given IDs.
    async *fetch (peer, { startId, endId }) {
        for await (const [id, key] of this.db.fetch({ startId, endId })) {
            // now we use our syndicated read to fetch the value we didn't bother to cache.
            // a smarter index node would probably cache data values.
            // because keys map deterministically to values, we know they won't mutate underneath us,
            // but they may have been deleted!
            const value = await this.read(peer, key)
            yield [id, key, value]
        }
    }
}

```

Index nodes add advanced or specialized database capabilities over the underlying data network. Unrelated index nodes may share data nodes, being effectively part of the same data network, without ever needing to coordinate. Each of them represents a perspective over the network, built on user data.

I said we weren't in app dev land yet, so let's take another step closer. What would it look like to contextualize an index node to act as the database of a simple blog network?

```js
// in this example, our blog node just wraps and contextualizes a basic index node
class BlogNode {
    constructor (indexNode) {
        this.indexNode = indexNode
    }

    // because IDs can be anything, we want to namespace them
    // so they are meaningfully unique.
    // here, a peer can provide a slug
    // and we prefix it with their public key.
    // that way the so-to-say URL of the post can be determined:
    // it lives at who-wrote-it dot what-they-called-it,
    // prefixed by the object type
    // so that one can query a sorted index to ask:
    // "show me all the posts"
    // or "show me all the posts by this peer"
    postId (peer, slug) {
        return `blog-post/${peer.publicKey}/${slug}`
    }

    // peers can make posts with titles, text, and tags
    async createPost (peer, { title, text, tags }) {
        // to keep it simple, we just slugify the title for our ID
        const id = postId(peer, slugify(title)) // slugify url-encodes a text title
        // the node keeps track of its own timestamps
        const createdAt = Date.now()
        // now we send the post down to the index node
        // and return the receipt to the user
        return this.indexNode.write(peer, id, { title, text, tags, createdAt })
    }

    // editing a post just means combining old with new.
    // since it's a write, we still return a receipt
    async editPost (peer, slug, newPost) {
        const id = postId(peer, slug)
        const oldPost = await this.indexNode.fetchOne(this.peer, id)
        const updatedAt = Date.now()
        return this.indexNode.write(peer, id, { ...oldPost, ...newPost, updatedAt })
    }

    // forgetting (deleting) a post is just a matter of
    // syndicating to the underlying index node
    async forgetPost (peer, slug, receipt) {
        return this.indexNode.forget(peer, postId(peer, slug), receipt)
    }

    // now we use the index node's `fetch` method
    // to list posts by a specific peer
    // since our index node sorts ID-key pairs by ID.
    async fetchPostsOfPeer (peer, publicKey) {
        // although a peer asks us for a peer's posts,
        // they are asking about another peer by pubkey
        const startId = postId({ publicKey }, "")
        // lexicographic sorting means we can use a high unicode value as a realistic boundary
        const endId = postid({ publicKey }, "\uffff")
        return this.indexNode.fetch(peer, { startId, endId })
    }

    // likewise, we can use a more expansive startID and endID
    // to fetch *all* posts
    async fetchAllPosts (peer) {
        const startId = "post/"
        const endId = "post/\uffff"
        return this.indexNode.fetch(peer, { startId, endId })
    }
}
```

There! A rudimentary blog network, built on one index node. Now you can scream into the void in a whole new way. Many peers can use this node to coordinate, effecting the blog network collectively. They can even use different index nodes! If their underlying data nodes overlap, they will effectively be part of the same blog network, even if their indices differ. *The index reflects a perspective.*

If the index node's database were more advanced, we could index post tags to search on them. If that database were specialized for it, we could even search text effectively. This illuminates the index node's essential role: to build on top of data node primitives to combine them with more powerful database features.

This separation between data and index nodes distinguishes responsibilities: data nodes store data but don't need to care what it is, while index nodes do the work of contextualizing data for use in applications. A disinterested sysadmin might host a data node on a VPS for their buddies, while an index node might run on a user's device within an app. A data node may even shard data and then syndicate the pieces to other data nodes, using a strategy like [ERIS](https://eris.codeberg.page/); those underlying data nodes do not need to understand ERIS, just that shards are data to store.

So, imagine an index node that processes a web index and exposes methods that deliver our Not-Google (aka [Nergal](https://en.wikipedia.org/wiki/Nergal)) as a service. The web index is distributed among data nodes, so the index node only needs to retain enough information to answer queries. This index node would be the one to implement PageRank, with spiders feeding it writes that it syndicates to data nodes. It all builds up to `nergal.query("does doing the time warp dance really cause time travel")`. This method applies the query over the index as a perspective: you can share this perspective with others by making the service available to them. Once we stop trying to look at the web as one place, we stop needing to fit it into one box. Everyone sees it differently. Everyone carries different parts. That's how we all can make it work.

Now you can visit a website, search for something, and get something relevant. If your spider uses your social media feed as a source of links to crawl, then adding pages to your web index would be as easy as following new accounts. Want to make the MDN docs searchable? Follow the MDN account! Bada-bing, bada-boom. Want to yeet someone from your search results? Block 'em!

So let's talk about what social media built on data and index nodes would look like.

## Part Three: Social

What is social media for? What are we really trying to do with it?

I believe there is some civic utility that profiteers have chanced upon: a digital post office, library, and infinite cafe all in one. They do not understand this utility, so they undercut users that come to rely on it for community and career by optimizing around jealous metrics. Ads clicked. Time on site. Maximized interactions. As Bo Burnham puts it, they are trying to colonize your attention itself. Should one spend all day at the post office, or want to? Meta has seemed to think so for some time. Can the library really be held unaccountable when it recommends fascist propaganda because their metrics say it will keep your attention? Google thinks so. Even BlueSky takes investment because capitalism insists all things must profit, but it only binds them to the investor, and we all know how that turns out. Nobody understands the powers we are really dealing with, so we don't build things that can house them, and we strip-mine our attempts.

After too many years of this profane confusion, we have at least normalized a basic data model. We know what primitives this utility requires: users, content, lists, groups, and moderation. Let's build some of these primitives with our data network.

Peers in the above examples have cryptographic key-pairs, so in that sense client devices can already exert a form of identity in our network. But, a person and an identity are not the same thing: a person may have many identities (ex: public, personal, professional), or an identity may be effected by many people (ex: Hatsune Miku). So, we need a way of relating the two. Let's call it a *profile*. Profiles avow identities, indicating cryptographically who can act on its behalf, but mostly providing human metadata like a name and description. In this way, a peer can point to a profile, which will point back to their unique key-pair, proving congruity. So, a *user* consists of an *identity* acting on behalf of a *profile*, in which process one, many, or zero humans may be involved.

Users can post content, which can be virtually anything. Protocols like ActivityPub demonstrate, via the vocabulary of ActivityStreams, that we have learned how to encapsulate a vast possibility space for digital social relations, and to represent them more or less as JSON. Pick your protocol, pick your encoding, but the proof is already there. We can structure content, from Facebook to TikTok, and that's all our index nodes need to do their magic.

Let's try it out.

```js
// we start with a specialized index node
// that combines powers from other index nodes
class SocialNode {
    // we start with a key-value database
    // and a specialized database for full-text search
    // plus a set of data nodes to use as our data network
    constructor(peer, kvDb, chronoDb, searchDb, dataNodes) {
        // even a node can have an identity
        this.peer = peer
        // store data nodes so we can expand and shrink the set
        // so that changes are shared by our index nodes
        this.dataNodes = dataNodes
        // we start with a basic index node
        // so we can construct data IDs to configure ordering
        this.indexNode = new IndexNode(kvDb, this.dataNodes)
        // we use a lightly modified index node
        // that indexes content's `createdAt` property,
        // and allows non-unique keys (ex: content posted at the same time)
        this.chronoNode = new ChronoIndex(chronoDb, this.dataNodes)
        // we also use a more specialized node for searching content with human-ish queries.
        // it exposes a `.query` method, and uses text content as its ID pattern
        this.searchNode = new SearchNode(searchDb, this.dataNodes)
    }

    // for data IDs, we namespace for uniqueness and ordering
    profileID(handle) {
        return `profile/${handle}`
    }

    // content is namespaced by handle and timestamp
    // to list content by profile chronologically
    // with a uuid suffix to prevent collisions
    contentID(handle, createdAt, suffix = uuid()) {
        return `content/${handle}/${createdAt}/${suffix}`
    }

    /*
    Our two main concepts are profiles and content.
    Let's start with methods for working with profiles.
    */

    async getProfile(peer, handle) {
        // imagine that handles are {name}@{uuid}
        // like garbados@1234-adcd-...
        // so that humans get their prefix and machines get their identifier
        const profile = await this.indexNode.fetchOne(this.peer, profileID(handle))
        // if the profile lists that peer's key as one of its own, then ok!
        if (profile.identities.includes(peer.publicKey)) return profile
        else throw new Error("Unauthorized!")
    }

    async createProfile(peer, baseHandle, options = {}) {
        const handle = `${baseHandle}@${uuid()}`
        const profile = {
            handle, // when a peer creates a profile, we can assign a uuid
            displayName: baseHandle, // so they get to keep their base handle
            identities: [],
            blocked: [],
            following: [],
            ...options }
        // return the receipt the user can use to delete their profile from the data network
        const receipt = this.indexNode.write(this.peer, profileID(handle), profile)
        // a profile's first avowed identity is the one that created it
        await this.authorizeIdentity(peer, handle)
    }

    // convenience method for updating a profile
    async updateProfile(handle, newProfile) {
        return this.indexNode.write(this.peer, profileID(handle), newProfile)
    }

    // method for modifying human properties like name and description
    // plus a `links` object where URLs map to text descriptions
    async setProfileMeta(peer, handle, { displayName, description, links }) {
        const profile = await this.getProfile(peer, handle)
        if (displayName) profile.displayName = displayName
        if (description) profile.description = description
        if (links) profile.links = links
        return this.updateProfile(handle, profile)
    }

    // users should be able to link new identities to their profile
    async authorizeIdentity(peer, handle, publicKey) {
        const profile = await this.getProfile(peer, handle)
        const signature = await sign(peer.publicKey, handle) // cryptographically sign
        profile.identities.push([signature, publicKey])
        return this.updateProfile(handle, profile)
    }

    // users should be able to revoke an identity,
    // like removing a bot's keys when you decommission it
    // or locking out a lost device
    async revokeIdentity(peer, handle, publicKey) {
        const profile = await this.getProfile(peer, handle)
        profile.identities = profile.identities.filter((identityKey) => identityKey !== publicKey)
        return this.updateProfile(handle, profile)
    }

    async followProfile(peer, handle, theirHandle) {

    }

    // block users by handle rather than pubkey,
    // so all their linked identities get blocked too.
    // note: actual blocks need context. this doesn't provide any
    async blockProfile(peer, handle, blockedHandle) {
        const profile = await this.getProfile(peer, handle)
        profile.blocked.push(blockedHandle)
        return this.updateProfile(handle, profile)
    }

    // unblocking seems useful, right?
    async unblockProfile(peer, handle, unblockedHandle) {
        const profile = await this.getProfile(peer, handle)
        profile.blocked = profile.blocked.filter((blockedHandle) => blockedHandle !== unblockedHandle)
        return this.updateProfile(handle, profile)
    }

    /*
    Now that we have some basic concepts about adding a social context
    over underlying cryptographic primitives,
    we can write methods for working with the content users post.
    */

    // posting content means writing to all the relevant nodes
    // and keeping the receipts
    async postContent(peer, handle, { text, ...rest }) {
        const profile = await this.getProfile(peer, handle)
        const createdAt = Date.now()
        const id = contentID(handle, createdAt)
        const content = { id, text, createdAt, author: handle, ...rest }
        // because we use two underlying nodes, they both create receipts, so...
        const receipts = await Promise.all([
            this.indexNode.write(this.peer, id, content),
            this.chronoNode.write(this.peer, createdAt, id),
            this.searchNode.write(this.peer, text, id)
        ])
        // ... we link the post to its own receipts
        return this.indexNode.write(this.peer, `receipt/${id}`, receipts)
    }

    // forgetting content means marshalling all the relevant receipts
    async forgetContent(peer, handle, id, receipt) {
        const [indexReceipt, chronoReceipt, searchReceipt] = await this.indexNode.fetchOne(this.peer, `receipt/${id}`)
        return Promise.all([
            // we delete both the meta-receipt from our index node...
            this.indexNode.forget(this.peer, `receipt/${id}`, receipt),
            // ... and the content itself
            this.indexNode.forget(this.peer, id, indexReceipt),
            // because our chrono and search nodes have special powers,
            // let's pretend they have a reverse-index of both ID=>value and value=>ID
            // so they can forget things by ID
            this.chronoNode.forget(this.peer, id, chronoReceipt),
            this.searchNode.forget(this.peer, id, searchReceipt)
        ])
    }

    /*
    That's it for content methods! The rest of the work is done by our sub-nodes.
    So now we can write methods for listing and searching content
    */

    // convenience method for determining if a user can view some given content
    async canView(profile, content) {
        // fetch the author's profile to get their blocklist
        const author = await this.indexNode.fetchOne(this.peer, profileID(content.author))
        // hide a post if the author blocked the querying peer...
        const theyBlockedYou = author.blocked.includes(profile.handle)
        // ... or if the querying peer blocked them
        const youBlockedThem = profile.blocked.includes(content.author)
        return !theyBlockedYou && !youBlockedThem
    }

    // the "feed" is a chronological list of content.
    // it filters content to respect blocks in both directions
    async *feed(peer, handle, options = {}) {
        options.limit ||= 50 // limit result size for resource-efficient pagination
        options.startTime ||= Date.now() // return posts from now and before
        // one might also specify `options.endTime` to establish a search window
        const profile = await this.getProfile(peer, handle)
        // we query the chrono node as ourselves...
        for await (const id of this.chronoNode.fetch(this.peer, options)) {
            const content = await this.indexNode.fetchOne(this.peer, id)
            const isBlocked = await canView(profile, content)
            if (!isBlocked) yield content
        }
    }

    // a profile feed is a chronological list of content from a specific profile.
    // we can use our basic index node because it sorts IDs and we namespaced ours
    async *profileFeed(peer, handle, theirHandle, options = {}) {
        options.limit ||= 50
        options.startId ||= `content/${handle}` // allow specifying a start ID for pagination
        const profile = await this.getProfile(peer, handle)
        const endId = `content/${handle}/\uffff`
        for await (const [_id, _key, content] of this.indexNode.fetch(this.peer, { ...options, endId })) {
            const isBlocked = await canView(profile, content)
            if (!isBlocked) yield content
        }
    }

    // how about creating a lookup of all your follows' recent posts?
    async *followFeeds(peer, handle, options = {}) {
        options.limit ||= 50
        const profile = await this.getProfile(peer, handle)
        return profile.followers.reduce((feedsByHandle, theirHandle) => {
            // because `.profileFeed` is a generator, we don't need to await it;
            // it can be awaited when the client actually consumes each feed
            const feed = this.profileFeed(peer, handle, theirHandle, options)
            feedsByHandle[theirHandle] = feed
            return feedsByHandle
        }, {})
    }

    // using the search node is much the same.
    // we use some characteristic method (fetch, search, etc) as ourselves
    // and then apply moderation based on who asked us
    async *search(peer, query, options = {}) {
        options.limit ||= 50
        for await (const id of this.searchNode.query(this.peer, query, options)) {
            const content = await this.indexNode.fetchOne(this.peer, id)
            const isBlocked = await canView(profile, content)
            if (!isBlocked) yield content
        }
    }
}
```

Now that we have a social network, we can return to our spider that crawls it.

```js
class SocialCrawler {
    constructor(peer, handle, webIndex, socialNode) {
        // a crawler acts on behalf of a specific social profile
        this.peer = peer
        this.handle = handle
        // our web index is a special index node
        // that exposes an `.index` method that crawls a link
        // and indexes it for queries
        this.webIndex = webIndex
        this.socialNode = socialNode
    }

    async contentToLinks(content) {
        // parsing content for links is complicated, so this is a stub.
        // there are many content formats, such as html and markdown,
        // we let's pretend this function can handle whatever
    }

    // we can crawl our feed easily enough
    async crawl(options = {}) {
        for await (const content of this.socialNode.feed(this.peer, this.handle, options)) {
            const links = await this.contentToLinks(content)
            for (const link of links) {
                await this.webIndex.index(link)
            }
        }
    }

    // and we can do the same thing to use profiles
    async crawlProfile(handle, options = {}) {
        for await (const content of this.socialNode.profileFeed(this.peer, this.handle, options)) {
            const links = await this.contentToLinks(content)
            for (const link of links) {
                await this.webIndex.index(link)
            }
        }
    }
}
```

Have you been able to keep up? We now have a social network that fuels user-specific search engines, replacing Facebook and Google in one fell swoop. But, this is all work someone has to do, and robust nodes will be much more complicated than these examples. Who develops that tech? Who maintains it? *Who stewards the ecosystem, and how do they afford doing it?*

## Part Four: Institutions

Programmers cozy up to capitalists because everything costs money. Labor, servers, disk, and umpteen forms of rent. The only way to sustain the costs of ongoing development is to play nice with the inheritors of a [savage basis of wealth](./we-won), either by being conspicuously critique-free in their midst, or by actively fawning. Cryptocurrencies and the pirate legacy of P2P tech have no serious overlap of values, and yet the big funders in both spaces are the same profiteering fronts. How does an ethos that prizes scarcity fit with one that abolishes it? You have made allies of your enemies; their betrayal will catch you asleep, again and again and again.

The barrier to FOSS ascendance has never been tech and tooling. Linux, despite all its faults, is now an inextricable piece of computation around the world. FOSS already won, but only by being servile. Its principal effect seems to be dampening wages and fomenting overwork by expecting one to volunteer. It is no accident that ApacheCon is full of rentiers and merchants of death, nor that they stubbornly insist on a disrespectful name: FOSS is, by design, not a threat to the powers that be. Open source as a methodology is the only reasonable paradigm for public and civic software development, but capitalism leaps at the chance to exploit it. This creates unique challenges for organizing software institutions in ways that *do* threaten capital. How do you pay rent with work that will someday end rent?

Tech workers have [structural advantages](./leverage-and-destroy) that give them leverage to insist on the value of their work, and to serve obvious value propositions for users. Given the above architecture, sysadmins could establish patronage income to cover costs for running nodes, while one might form a business running nodes as a service. One of Mastodon's key failings as an organization has been never seizing on its own hosting expertise. [masto.host](https://masto.host/) should be the org's core revenue stream, next to paid support. Only by encompassing the whole work can the ethos marshal the resources to achieve it.

It's impossible for capital to grok that immensity, that touch of ageless things, so they can't conceive of the institutional breadth necessary to house it. Even decentralization boosters often argue that such breadth is an anti-pattern, as all concentrations of power undermine an ethos of distributing power. I ask: how will you secure your footing when you are too unmoored to touch the ground? What force can you bring to bear when your muscles are made of air? The wise cannot plan against what has no form, but bodiless specters can never do harm. They call me a radical, but here I'm the moderate: use what you have, let your values light the path. What reinforcements do you expect to get this done? The future is never sending troops except the people we become.

## Addendum: Caveats

The architecture I outlined above centers *perspectives*, so that users can never see the whole system but only what their infrastructure knows about. Index nodes don't even know the complete contents of their underlying data nodes; they only index what they're given to store. The closest one can get to a global perspective, is a very big index node. Some people consider this a downside, and I think they're wrong. It isn't that I merely prize a design that lacks a global perspective, but that such a perspective has always been a myth. DNS foments rentierism because of its design. A user-centered petnames system, like most mobile contacts apps use, associates human-readable information with machine addresses (like phone numbers) in a way that reasonably reconciles the differences between the two. Bundled apps across platforms have converged around this data model because it is the only practical way to contextualize unique machine addresses with human-readable information. The "readability" of URLs is an illusion, and all your *cleverness dot social* only reifies the ability of rentiers to charge you for a domain name, and for scammers to use its fictitious authority for predation. So, give it up. Let people name stuff what they want, and namespace it to prevent collisions. The only way a scammer should be able to enter your network, is if you choose to let them in.

The example node implementations in this essay are rudimentary. A production system would utilize caching and more sophisticated receipt management. Most glaringly, these examples do not indicate how peers actually connect to each other. This is an enormous problem in the web development world, as the ability of browser clients to network is severely limited by the browser environment. Replication of data over HTTP, such as PouchDB performs, remains one of the most reliable ways to transport data into and out of browser environments. Using WebRTC returns us to the institutional problem: who runs signal servers? That isn't to say we must find another design besides WebRTC, or even that HTTP replication is superior. Rather, I argue that the only way we can use the designs we have effectively is to produce suitable institutions as to steward their ecosystems. Otherwise, your shop runs out of money, the project dies, and your efforts become reduced to nostalgia.

Because peer discovery and connection is elided in these examples, it hides the hardest part of the whole thing. The [Spritely Goblins](https://gitlab.com/spritely/guile-goblins) project represents a transformative paradigm over the complexities of networked programming -- really, all programs these days, p2p is just a particular case -- because it abstracts them into an API where [accessing polymorphic objects over the wire is like passing a parameter](./conceptual-intro-to-spritely-goblins), which flat trivializes the backend complexity of these systems. Everything melts away but the most important questions: who does what work to effect and affect social spaces? It all comes back to institutions.
