title: Peer-to-Peer Datastructures and the CAP Theorem
description: What are the limits of peer-to-peer datatypes?
tags:
- p2p
- databases
- dat
- ipfs
- ssb
- blockchain
created_at: 2017-11-23T19:32:21.064Z

# Peer-to-Peer Datastructures and the CAP Theorem


Are you familiar with the [CAP theorem](https://en.wikipedia.org/wiki/CAP_theorem)? It says a distributed store of data may satisfy at most two of the three following guarantees:

- Consistency: Every request for data receives the most recent version of that data (or an error). (not to be confused with consistency in [ACID](https://en.wikipedia.org/wiki/Database_transaction))
- Availability: Every request receives a (non-error) response – without guarantee that it contains the most recent version.
- Partition tolerance: The system continues to operate even when members disagree about data, or cannot reliably reach each other.

These properties normally come up in the context of distributed databases like [CouchDB](https://couchdb.apache.org/) or SQL clusters, but it's not hard to argue that peer-to-peer systems like [BitTorrent](https://en.wikipedia.org/wiki/BitTorrent) and [Dat](https://datproject.org/) are also distributed stores of data. Is it possible to describe a protocol like [IPFS](https://ipfs.io/) as consistent, available, or partition tolerant?

I want to try.

## IPFS

I would describe IPFS as consistent, available, and partition tolerant. No, I am not joking.

Content in IPFS is immutable. It is hash-addressed, so modifying the content would modify the hash. If a peer requests the contents of a particular hash and a peer responds with contents with do not reflect the hash, the response is ignored. The data is self-proving.

As a result, the only version of a piece of data is its latest version. Any changes would have to be shared under a different hash, because the content would hash differently. This makes data in IPFS highly consistent: while any peer in the network has the data, any request for that data will receive the latest version.

If peers become cut off and no member of a partition of the network has the data, the data becomes unavailable, but the system does not fail. Once the partition heals *or* data matching that hash is uploaded independently, it will become available again. This makes IPFS both available (because every request gets a response) and partition tolerant (because partitions can operate independently and heal from arbitrary segmentation).

## *What?*

If IPFS satisfies the consistency, availability, *and* partition tolerance, then what use is the CAP theorem to us as a description of the limits of distributed data stores?

I don't know. But, some peer-to-peer systems do not satisfy all three guarantees.

## Dat

I would describe Dat as satisfying availability, but neither consistency nor partition tolerance, and still it is a vitally important technology.

Content in Dat, aka an "archive", is addressed by a hash of the public key of the keypair used to write it. This makes archives mutable and builds into them a notion of ownership, as only those who control the keypair can modify the archive, but anyone can share it. That makes it available: while any peer in the network is sharing the archive of a particular pubkey, requests for that archive will receive a version of it.

But because of the archive's mutability, peers are constantly exchanging revisions and may not themselves always have the latest version. Requests for data from a peer who is still catching up may return a stale version. As a result, even outside of a partition, the network is not highly consistent.

What happens when you lose the keypair to an archive, or destroy it? Until someone brute-forces your privkey, the archive is effectively immutable. To share the content, you would have to do so under a new keypair.

What happens when someone acquires your keypair? An attacker with the keypair for an archive can modify it in ways that the network cannot distinguish as illegitimate, and I haven't found a description of how the network would deal with these conflicts. What happens when two conflicting append-only logs share the same address? Until I find out, it's hard to argue the system is partition tolerant.

And still, Dat archives are like mutable torrents. That makes broad classes of peer-to-peer software possible which use Dat archives for storage and distribution. Baking a notion of ownership into the data is a powerful pattern that comes up again and again, but it creates the possibility for irresolveable claims to authority over content, and the reality that peers can only ever play catch-up to the peer(s) with the keypair.

## SSB

TODO

## Blockchains

TODO
