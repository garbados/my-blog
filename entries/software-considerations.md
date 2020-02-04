title: Considerations Regarding Distributed Software
description: Together we are strong. Knowing this, how can we write good software?
tags:
- software
- ethics
- p2p
created_at: 2020-01-27T16:44:42.174Z

# Considerations Regarding Distributed Software

Together we are strong. Knowing this, how can we make good software?

Software is post-scarcity tooling. Beneath the paywalls there has always been a new order of labor-saving device, one that can be infinitely copied and infinitely shared. Rich promises live in its possibility; promises the rich have betrayed, possibilities they have squandered.

We can fulfill those promises for each other because together we are strong.

This is an ominous time. Napster is long dead. Aaron Swartz, too. [Software is bad](https://garbados.github.io/my-blog/regarding-software.html), but it doesn't have to be. From BitTorrent to Mastodon, distributed systems leverage the power of many to astonishing effect. Among archivists, pirates reign.

There are many ways to build distributed applications. A monolithic stack can employ distributed components -- clustered databases, high-availability caches and proxies -- but the most powerful architectures weave together untrusted elements, stitching distant neighbors into resilient networks. I do not have to know you. I do not have to trust you. Still we are stronger together.

Application developers learn the hard way over and over that cleverness is fool's gold, that every problem is old and all shine is marketing. They bet too much labor on too little proving and so their vigorous advances disintegrate. But we try again, and again, and again.

Here are some considerations:

## Federation and Blockchains

A blockchain is a distributed ledger with the special power that anyone can write to it, and only in known manners. Through a mysticism those manners can be monetized, but it remains no more or less than a ledger. A ledger looks like a log, and most databases look like a log at heart, so starry-eyed evangelists find many ways to center ledgers in their applications. Their eagerness betrays them; their cleverness spins out of control. No mysticism can bind the breaks.

Chained social media has no recourse for post deletion; chained package managers, for name-squatting or malware. Everything on a public chain lives forever, and every peer has full access to all of it. The chain effectively centralizes data in a system, not within a single authority but within a single datastructure. Whatever you give it, you give up to it.

This borderless place-of-places we share is not destined for centralization, or even survival. Can you feel its foundations shake? Hold close to your loved ones, analog and digital, for the jealous bastions that corral us grow brittle. There shall be no one true chain, no one true platform; only the connections left by those places where we found each other.

Federation is the server mesh that emerges from shared syndication protocols. Servers in the mesh choose what to syndicate, what to block, and how to moderate. Their diversity of forms and behaviors fortifies the mesh against attack and decay alike. Only through this power to define and defend themselves can communities exist. As protocols and applications evolve they outlive each other, as people outlive their tools. Applications must dream bigger than a single insistent component like a chain, for it shall wither before the lifetimes of users. Remain humble enough not to insist upon your own conception of data.

Chains have their uses, as the ledger has an ancient history, but do not become overzealous. Though "smart contracts" invite developers to enshrine code as law and law as code, beware the trappings of legalism: governance is too demanding, too dynamic a problem to reduce to unaccountable diktat. The contours of the future defy all oracles.

## Open and Organized

Should you publish source? What if corpers steal it? Of course you should publish source. Property is theft.

Your work will be stolen. All that saves labor under capitalism shall be used against labor, and so our tools disenfranchise each other. The very dream of libre 'ware drives down wages. Innocuous tools become the basis of vile and heinous atrocities, leaving developers with only [drastic options](https://onezero.medium.com/coders-should-be-activists-5104bd18e349). The neutrality of software foundations like Apache has made it cozy with merchants of death. Beware the neutrality that cannot be distinguished from complicity.

To protect open source, organize labor. In our workplaces, we need unions to assert boundaries about acceptable tasks and acceptable usage. In our projects, we need [cross-license collaboratives](https://xlcollaborative.com/) that can control the issuance of commercial licenses to known parties, so no one has to see their works become weapons of war. Still your works will be stolen and misused, and still the profiteer will draw gold from blood. Do not be intimidated. Do not abandon the way.

The fate of a tool is to be used. Should the carpenter abdicate their craft because some fascists sleep in beds? The carpenter can choose who to deal with, as developers can elect into issuing commercial licenses, but fascists will still sleep in beds. Best then to keep them from sleeping at all.

## Fighting the Browser

The web wears a terrible crown and we will mourn its passing. Righteous litanies recount the sins our cleverness has accumulated, and still through it we find each other. Should you build a browser? Maintain a Chromium fork? Develop infrastructure on hidden subnets or obscure protocols? I don't know.

The earth shifts beneath us. Can you taste the ash in the air, or the plastic in the water? The police are outside. The police are inside. The misery in your money and the meager choices it affords arrive from one spirit, our foe whose name is the kyriarchy, and it mutters of a wretched future. We will face it together. Together we are strong.

Do not build a browser. It is too much work. Instead write server applications with server-agnostic clients, and connect them with HTTP and mature P2P protocols that use established neutral infrastructure, like torrents. Your works must be usable with browsers as much as without them to be meaningfully accessible.

Someday the web will be gone.

## Auth

I wish auth tooling were better, but for now there are two auth models to consider:

- Self-hosted, including any application where one device corresponds to one user.
- Group-hosted, where one application supports many users.

Self-hosting makes a decent demo but in the production case an application must support many users, even when many users are one person or one user is many persons, for some of us are not sysadmins but inevitably some of us must be. For that we require authn (authentication) and authz (authorization) logic.

Here is a common and durable authn model:

- Users sign up with an email and password.
- Users confirm their account with a link or token sent to their email. Tell them to check their spam.
- Use [bcrypt](https://en.wikipedia.org/wiki/Bcrypt) to encrypt and check passwords, and NEVER store plaintext passwords.
- When users forget their password, send an email with a unique link to a password reset page which expires after one use or one day, whichever comes first.
- 2FA is bonus points.

There are no easy authz models but it is unwise to confuse a *user* with an *identity*, or an *identity* with a *capability*. So, here is an authz model I have yet to regret:

- Users can create *identities* which have an associated keypair, token, or other credential.
- Identities have *capabilities* which permit them to perform particular actions.
- Identities may grant capabilities to other identities or lists of identities. For example, content may be encrypted so only members of a certain set of identities may access or decrypt it. These sets may be explicitly enumerated or an application may support dynamic lists, such as followers.
- Identities can create and delegate to identities, such as to grant permissions to secondary applications acting on a user's behalf.
- Identities may be traced to their parent identities, or they may not, depending on the needs of the context.
- Through the creation of identities and the delegation of capabilities, an identity may come to represent many users, and a user may have many identities.

Of course this model is labor-intensive. It takes time and tedium to enumerate the capabilities of identities in a system, time we can rarely afford. Still, applications inevitably arrive at these requirements in the course of their maturation. Someday perhaps we will have good tools that make applying conceptions like this effortless. Until then we at least have each other, and the wisdom and anguish of all who came before.

## Do Not Make Software

A tractor or car infested with software cannot be repaired as easily as a mechanical one, generally because the manufacturer's proprietary software can only be handled by company technicians, while the parts to a physical mechanism can be machined without the same impediments. While capitalism reigns we shall see no open source cars.

Software faces a unique form of rot. Gears wear out, but software will go on until something defies its assumptions, and then it will require very particular technicians to fix. This is why banks continued to pull the same handful of engineers [out of retirement](https://www.reuters.com/article/us-usa-banks-cobol/banks-scramble-to-fix-old-systems-as-it-cowboys-ride-into-sunset-idUSKBN17C0D8) over and over to fix their systems, because no one else could. Now that those people are dying, they turn to blockchain hype and a new generation of golden parachutees, and they will leash them to wages again and again all over again.

Master the operation and maintenance of running systems. There is no need for yet another open source hermit but a drastic need for more sysadmins who can act as the technical hubs of their communities. Wire together what exists and support what is already used before imagining your lonesome hands can evoke better from the void. It always takes more work than you think. Still the time will come that something novel, something vital, will require the expertise your scars bely. March together into that murk, as together we are strong.

## Conclusion

There is a humane future that software helped build, and we must build it for each other piece by laborious piece. As craftspeople it falls to us to reflect and manifest the intentions and interests of our communities, so [stay accountable to them](https://www.youtube.com/watch?v=hYvYtD2jLIA) and do not give in to the simplicity of dictatorship. Do not delude yourself believing there can exist a benevolent authoritarian.

Software is a young tradition in a time of great transition. There is too much to do and not enough labor to do it, even as there is more than enough in this world for everyone to have everything they need, so save your energy. Ration your effort. Life can be long if you let it go on. Stand by who stands by you. Stand by each other. Look to your elders but do not worship them. We are all human. We are all frail.

Stay alive out there.
