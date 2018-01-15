title: Regarding Browsers
description: Thinking about the mess.
tags:
- browsers
- javascript
- thaenkin
created_at: 2018-01-14T22:12:52.223Z

# Regarding Browsers

I once made a [website][zine] that attempted to warn the user before loading resources or executing JavaScript. If the user had JS disabled, the page could never proceed beyond the warning. If the user had enabled JS, then all the site's resources would have been fully loaded by the time the user clicked "I consent." The warning, in both cases, was meaningless.

I included the warning because I had gotten paranoid about what JS could do, and how we had come to allow it everywhere. Folks would tell me that the sandbox of browsers would protect users, but that had always been a lie, and we were always foolish to believe it:

If you permit an arbitrary program to make network requests (ex: [Ajax][ajax]), it can use your browser to mine \*coin. If you permit it [service workers][service-workers], it can continue mining even after you've closed the tab. With P2P software like [IPFS][ipfs], it can establish a service worker that uses your browser to peer content you may not know about.

This is a wretched state of affairs. Entering a URL does not represent consent to install software. Imagine an app store where even examining an app meant you had already installed it. Would you want to use that app store? I wouldn't. So how in heck have we arrived at that pattern for browsing the internet?

The profitability of surveillance has coalesced into a present where sites shame us for blocking the execution of JavaScript, or for executing it selectively to avoid ads and malware. They believe that a refusal to be surveilled threatens their livelihoods.

Meanwhile, the ads they demand we witness have become the medium of international conflicts as governments use re-targeting to place highly controlled messages in front of very specific audiences. It's old-school psyops using surveillance capitalism as an attack vector. Amid all that, you really want me to allow you to execute arbitrary, unvetted, untrusted code on my machine?

What a scam.

But, it's not JavaScript's fault. I have my beef with Eich but I daresay things would be just as bad as they are now if Java had become the language of the web: behind every URL would lurk arbitrarily large applications with opaque rights to exploit your machinery, powered by advertising and malware. We can blame JS for being entrenched demoware but the ethics of the browser are distinct.

The corporations behind major browsers have outsized influence on web standards for better and worse. They look at the usage data for their browsers and optimize it for rendering the sites people visit. That is, Facebook, and little else. This little software oligarchy encompasses most of the time that people spent on computers. All of them are deeply involved in the business of surveillance.

Tell me that's a right state of affairs. Try it.

-----

Still, the paradigm of the browser as a shield between the user and untrusted content is a good one. Every consumer operating system has a browser, and most users spend most of their time there. I write JavaScript because apps on the web are uniquely accessible. Browsers are a mess but the space they have created now matters. I want to imagine a better browser:

* **Multi-protocol**: Today's browsers handle HTTP, and that's all. [Beaker][beaker] adds support for the P2P [Dat][dat] protocol as `dat://`. [IPFS][ipfs] has browser extensions now that add support for the IPFS protocol at `ipfs://`. Imagine a browser that supported all of the above, and `gopher://` besides. Tell me it's too difficult.
* **Virtualized**: JavaScript operates on a parody of a virtual machine. We dance around the lack of a filesystem and the absence of proper network interfaces. What if we gave up the lie and just executed remote code in strictly permissioned VMs? If a program needs filesystem access, it needs permission, and it still won't be the host filesystem. Need the network? Get permission. Want to daemonize? Permission.
- **Multi-language**: The browser has become an application environment and applications not written in JavaScript are just as suited for it as JS is. Write websites in Python or C, or load ones that exist today from a URL and execute them in the VM.

At least, that's what I'd really like to see. If we're going to treat the browser as an operating system and the web as a file system, let's be serious about it!

[ajax]: https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX
[beaker]: https://beakerbrowser.com/
[ipfs]: https://ipfs.io
[service-workers]: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
[zine]: https://garbados.github.io/zine/#/
[dat]: https://datproject.org/
