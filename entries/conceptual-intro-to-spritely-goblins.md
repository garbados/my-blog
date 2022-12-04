title: A Conceptual Introduction to Spritely Goblins
description: A transformative paradigm for distributed systems programming.
tags:
- p2p
- spritely
- goblins
- tor
- i2p
- distributed-systems
created_at: 2022-12-04T21:30:19.288Z

# A Conceptual Introduction to Spritely Goblins

I have recently been fascinated by [Goblins](https://spritely.institute/goblins/), of [Spritely](https://spritely.institute/) fame. It is, at present, a library in [Guile](https://gitlab.com/spritely/guile-goblins) and [Rackets](https://gitlab.com/spritely/goblins) which provides a model of programming for peer-to-peer applications that makes permissions a kind of first-class object. In this essay I try to explain what that means, but I'll admit I've had some trouble with it so far. It's just... alien. It seems like a different order of sorcery than the likes to which I have grown stubbornly accustom. What it makes easy should be a decade of work. The principle of least authority -- an asymptote! -- made as practical as a parameter.

Goblins articulates a security paradigm of *object capabilities* which I find to be an apt name. In this paradigm, you construct objects that have capabilities, which are functions. If someone in the network can access a function in an object on your machine, it is only because you gave them permission. *If a function runs, it is because it is authorized to do so.*

That is the model Goblins hands down, not one of peers or users or identities, but of capabilities. You write object capabilities as stateless functions, and can call upon those capabilities that you can access. Applications can gather such capability-functions to create complex communal systems built upon consent. *If a function runs, it is because it is authorized to do so.*

This is not some cryptocoin ledger. There is no append-only constraint or proof-of-work friction to contend with. The magic at work here is subtle rather than costly; its promises are thus paradigmatic rather than austere. Peers can connect via any transport, whether Tor or I2P or some other. Once connected, peers can get to work expanding on the capabilities they afford one another. First you might receive an invite code to a chatroom, then users in the chatroom might grant you the capability to send them messages. One cannot guess the link of a capability -- that is a promise for the application to break.

In the proof-of-concept app [goblin-chat](https://gitlab.com/spritely/goblin-chat), a user's first capability comes from a string, described in the [goblins source](https://gitlab.com/spritely/goblins/-/blob/master/goblins/ocapn/structs-urls.rkt#L101-108) as a *sturdyref*:

```
ocapn:s.onion.wy46gxdweyqn5m7ntzwlxinhdia2jjanlsh37gxklwhfec7yxqr4k3qd:8080/78PukR-2EKkr2bmvVfG0RcNCsiNQEvWJgz1MDKAeQb8
```

(A *sturdyref* confers access to a single reference -- in this case, a shared chatroom object, so that the link acts as an invite code into the chatroom.)

You may recognize the `onion` portion of the URL quoted above. It signifies that the connection between peers occurs via an anonymous [onion service](https://en.wikipedia.org/wiki/Onion_service), so that peer connections benefit from all the guarantees of Tor. Secure distributed programming, with no snooping? It sounds unreal, as though from some future that tests even the imagination -- trust me, [I know the feeling.](https://garbados.github.io/my-blog/software_from_another_world.html)

Unfortunately this string's format doesn't come from any specification, not yet anyway. Spritely's whitepaper outlines an [*Object Capability Network*](https://spritely.institute/static/papers/spritely-core.html#ocapn) (aka "OCapN") in only a few brief paragraphs, which primarily reference the layers of technologies that compose it: [CapTP](https://spritelyproject.org/news/what-is-captp.html), "Netlayers", and URI schemes. These components work together to produce something that looks like a URL, but which encodes everything a peer needs to bootstrap a connection to a network *and* the permissions that peer requires to access the capability a link reflects. That's a tall order for a URL, but Spritely and [others](https://github.com/ocapn/ocapn#whats-the-plan) are hard at work hammering out a specification and, eventually, a standard.

Because these "OCapN URLs" reflect a capability rather than a specific network protocol or datastructure, we can build up peer meshes across different underlying protocols. You might connect to some peers over Tor, others over I2P, and still others over bespoke sneakernets, though a Goblins application will be largely ignorant of such details as it need only implement the capabilities themselves. The specification to map capabilities to URLs remains forthcoming; the important thing to remember is that they're *just links*. You can spread a capability far and wide by sharing it publicly, or limit its distribution to a trusted few. You can even implement capabilitites to be [revoked at will](https://spritely.institute/static/papers/spritely-core.html#revocation-accountability), so that a URL can go dead at your discretion.

What capability a link represents is up to an application, and capabilities do not necessarily have links at all. The URL quoted above, goblin-chat treats as an invite code to a private chat room. If you have an invite, you can get in. Peers may confer further capabilities after you initially connect, such as the ability to send or be sent messages. Thanks to the design of Goblins, these abilities appear in your application as functions: to send a message to a peer, they might supply a `send-message` function which you can call directly. If you have the function, you have the right. *If a function runs, it is because it is authorized to do so.*

Are you beginning to see the possibilities? Not merely the shape of the applications one might write with Goblins, but the consequences of its paradigm: the transformed relations that emerge between programs, or the blurred distinctions of locality these abstractions confer? A function might be on your machine, or on another; it might make no network calls or a recursive mess of them, but it never does anything without having obtained the appropriate permissions -- permissions that are as easy to grant as URLs are to share, or as parameters are to pass.

If you're still reading, I suspect you're thinking one of two things: "This doesn't make any sense," which I get a lot, or, "What's the catch?" The catch is the former. Goblins synthesizes an enormous body of research, and it is only the beginning of an expansive vision for a new distributed web. The whitepaper, [The Heart of Spritely: Distributed Objects and Capability Security](https://spritely.institute/static/papers/spritely-core.html), floors me with its rammifications. After reading it, I am left with a burning thought: *this can change everything,* so much so that I struggle to articulate the path a mind must walk from this world to that.

In the end, once the standards are formalized and the tooling fully implemented, the details of this arcana will be utterly beneath a user's notice. To them, the invite code works like an invite code; the chatroom works like a chatroom. Under the hood, a profound sophistication belies and befits the advanced requirements of distributed digital social systems. No longer will we have to ham-fist our modes of relation into artifacts like blockchains or instances, gluing brittle access schemes atop them. By virtue of decades of compounded effort and expertise, we will at last be able to code decentralized programs with nuanced permissions from the outset.

The scale of the work is outlined in depth already, and the Spritely Institute has made tremendous progress in recent years. You can hack on Goblins today, but many of its powers are rooted in bespoke implementations that mean to mature into standards, or exist only as specified in the whitepaper -- such as [*portable encrypted storage*](https://spritely.institute/static/papers/spritely-core.html#portable-encrypted-storage), for which I'll supply a proposal in a subsequent essay. For now, I invite you to catch up on the work as it stands.

Incredible things are coming to fruition in these late hours, my friends. Our future is strange and full of wonders. Stay tuned; stay sharp.
