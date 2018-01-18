title: Distributed datastructures
description: Turning chaos into uptime.
tags:
- dat
- ipfs
- ssb
- sql
- distributed databases
created_at: 2018-01-15T21:07:52.236Z

# Distributed datastructures and databases

[Dat][dat] provides mutable [torrents][torrents] called *archives*. With torrents, nobody can alter their contents once the torrent is published. Dat, using math and [merkle trees][merkle-trees], ties a keypair to a torrent-like datastructure called an archive. An author can use the private key to update the archive, for example to distribute changes in a dataset or updates to an application, while a hash of the pubkey is used to generate the address where peers can find the archive. In this way, you can issue mutable torrents. The author can broadcast updates to the archive, and peers can distribute and verify those updates.

Think about that. Imagine a classical primary / replica setup for a distributed SQL cluster, where only the primary can commit writes but everyone can serve reads. Rather than having to control each node in the cluster, untrusted peers can act as replicas and prove the integrity of the data that they exchange. Peers can come and go, infrastructure can fail and restart, the underlying data can change and change again, and still the peer swarm survives. These are network conditions that most clusters would consider hellish, but to peer-to-peer datastructure like Dat archives, it's the assumed norm.

Distributed databases have come a long way in their time. With the advent of the [CAP theorem][cap-theorem] and globally distributed computing we have bumped into practical and theoretical limits on how these approaches to fault tolerance and data integrity scale to our ad-hoc global environment. P2P technologies cover much of the same ground as distributed databases. We as developers should be mindful of the similarities, and how we can map them into our applications.

Projects like [WebDB][webdb] and [OrbitDB][orbitdb] confront these similarities by using P2P datastructures as the basis for storing records. In the case of OrbitDB, [ipfs-log][ipfs-log] is used to create an append-only log and distribute it as [IPFS blocks][ipfs], much the way other distributed databases use append-only operation logs. WebDB maps an archive's filesystem to a database, allowing records to be added and deleted by modifying individual files, though the Dat archive itself uses an append-only log to track updates. We are approaching the day when these P2P databases will back some serious operations. The parts exist today.

These peerful approaches to cooperative data manipulation and exchange resemble distributed databases with good reason: because they are useful as distributed databases. Imagine a drop-in P2P SQL replacement, where clients peer the records they are permitted to store. Imagine the effect on availability, bandwidth, and server costs. Now a growing userbase can improve application uptime, rather than threaten it. The swarm turns chaos into uptime.

These are radical changes and more are coming. This is an exciting time for databases.

[cap-theorem]: https://en.wikipedia.org/wiki/CAP_theorem
[dat]: https://datproject.org/
[ipfs-log]: https://github.com/orbitdb/ipfs-log
[ipfs]: https://ipfs.io
[merkle-trees]: https://en.wikipedia.org/wiki/Merkle_tree
[orbitdb]: https://github.com/orbitdb/orbit-db
[torrents]: https://en.wikipedia.org/wiki/BitTorrent
[webdb]: https://github.com/beakerbrowser/webdb
