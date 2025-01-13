title: "Making a Calendar: Witch Clock"
description: An adventure in timekeeping and JavaScript.
tags:
- time
- software
- magic
created_at: 2025-01-13T00:00:00.000Z

# Making a Calendar: Witch Clock

I was at my boyfriend's place for NYE this year. The Gregorian New Year celebration, to be specific. There was drinking and karaoke and we kissed at midnight. I had a good time. But, seeing everyone count down as the big ball dropped, I couldn't stop thinking about how arbitrary December 31st is. It isn't the recent Solstice, nor any lunar phase's start or end. It's just, a day, picked by Christians in 1582.

I had celebrated the Winter Solstice about a week before, and in my heart, that had been the beginning of my new year. I performed a major ritual, and we had a feast as a family. After that solstice, days start getting longer. As a seasonally affected Portlander, I am keenly aware of how little sunlight we get in December and January. The Winter Solstice is my favorite because it means that, although the cold will linger for months yet, the night already recedes.

Back in 2016 or so, this interest in daylight motivated me to make `witch-clock`, a rudimentary tool for estimating solar and lunar events, like sunrises, solstices, and lunar phases. I used it to build an [i3](https://i3wm.org/) desktop widget that replaced my Gregorian taskbar clock with a clock that expressed dates relative to recent and upcoming events. "Six days til the vernal equinox," "Five days since the New Moon." The project fell off after I stopped using i3, and then life happened for a while. After this years' NYE party, I felt motivated to revisit it.

## What is a clock

To me, there are two major types of clocks: stopwatches, and calendars. (Honorable mention: logical clocks. Not relevant.)

Stopwatches track a procession of time itself, rather than celestial events. UTC averages a network of atomic clocks to get an estimated "now" and UTC's industrial stakeholders appreciate it for this aspect. Stopwatch timestamps help machines determine *how long has it been* in a physical sense. It is critical that a stopwatch experience no ambiguity. Nobody wants their stopwatch to mysteriously tick backwards or forwards, or else you'll have moments that don't exist or that exist twice. What a headache! And yet, in order to make UTC line up with solar revolutions, maintainers add leap seconds so that *the number of seconds in an Earth year* and *the length of a second itself* match up. But, the length of a second in UTC comes from observing radioactive decay -- in those aforementioned atomic clocks -- which has no relation to the movement of the Earth or the Sun. Thus, reconciling them requires leap seconds.

UTC's stakeholders really want it to be a stopwatch (Finance takes precision! As do missiles.) so we might see the end of leap seconds in our lifetimes. Practically speaking, nobody would notice the difference. Even the Gregorian's crude estimation of 365.24 days in a year, drifts by one day only every thirty-two hundred years. Leap seconds are introduced to UTC whenever it and "astronomical time" differ by a whopping 0.9 seconds. This sensitivity reflects the power of our instruments, but it invites the chaos of treating a stopwatch like a calendar.

A calendar tracks the heavens of Earth, because we are humans living on Earth. We measure the seasons and cycles that transform our world every year, and those cycles are rooted in physical phenomena that, while largely regular, are ultimately subject to the cosmos' unpredictable influences. To a stopwatch, that's a huge problem. How will I know how many seconds are in a year if the temporal duration of a year fluctuates? A calendar doesn't mind the fluctuation, so there's no need for leap seconds. The heavens happen as they happen. Some seasons are just unusually long or short. We don't have to fit them to our machines. Machines don't need calendars.

Humans use calendars.

## Designing a year

A calendar is for *observations*. What one chooses to observe is a kind cultural-spiritual choice. There are many celestial events to observe, and which a calendar does are definitive. While I chose to concern myself with the sun and moon, humans have invented ones that are able to encapsulate much longer cycles than the solar year.

The sun and moon, Sol and Luna, are the most physically influential bodies in our sky. Sol gives Terra's twirl its day and night, and Luna pulls the very seas. I wanted to know when the days grow long. I wanted to know when the moon is full. I wanted to know when the horizon turns gold.

When I call myself a witch, it is a nebulous term. I consider myself a *hedge witch*, a kind of mystic unassociated with a tradition. I fell into the inexplicable, the ineffable, the eldritch -- and had to make sense of it alone. I named my calendar after some ghosts that I have [written about](https://beestungmag.com/issue05/two-short-stories-by-diana-thayer/), and I modeled its months on the major arcana of your typical tarot deck. (I realize tarot mysticism has a ridiculous origin, but its memetic hold endures. Belief creates significance.)

Although a calendar does not need leap seconds, celestial periods still vary widely. There are a little more than 12 lunar months in a year, so, my calendar has a *leap month* which only happens some years. The annual lunar cycle begins on the first day of the first new moon after the Winter Solstice, creating variable space for a 13th month to make up the difference. That month? *The Corpse's Moon*.

Observation often warrants celebration, so I made holidays for each month, season, and complete lunar cycle. I tried to use my writing to give each a little spirit. The [website](https://clock.bovid.space) explains cycles and months, so I'll let you read about it there.

The truth is, I mainly want to talk about *building the damn thing.*

## Constructing the clock

I'm a full-stack dev, and I pride myself on being able to flip a website into existence in a few hours. I host my stuff on GitHub because GitHub Pages is free michaelsoft uptime for static apps, so I write static apps and live in the folds of the unaccountability machine.

Lately, I've been using Clojure for my apps, because it transpiles to JS and is a sweet mercy to use. But, that `witch-clock` library I wrote years ago was in vanilla JS, so I decided to stick to that for this. This experience has only made me appreciate Clojure more.

In particular, I have made several apps using [Reagent](https://reagent-project.github.io/), a kind of Clojure wrapper around React that provides a data-driven functional paradigm, in which HTML is just lists of lists, and elements are just functions that return lists. This experience is simpler and more enjoyable than any `useEffect()` boilerplate. We'll return to the importance of Reagent in a moment.

The Witch Clock has two components: the library, and the website.

The library exports two functions, one which *estimates* celestial events using mathematical formulas that model the Earth and Moon and Sun, and one which *determines* events by querying an observatory. The website uses the latter, which accesses the Astronomical Applications API of the US Naval Observatory Applications Department. The estimations are notably less accurate. Because JS Date objects handle timezones so confusingly, I used [Luxon](https://moment.github.io/luxon/#/) to localize the observatory's datetimes.

The library has a test suite that includes a property test, which endeavors to prove that estimates are coherent for any given datetime in a thousand-year range. Creating a comprehensive test suite ensured accountability to the calendar's stated design. It showed me the complexities of creating a location-sensitive clock, particularly how complicated *sunrise* and *sunset* become at extreme latitudes. I've spoken [in public](https://www.youtube.com/watch?v=KeTBvSnnnaE&t=482s) about property testing before; I think it's very cool.

Regarding the website, I didn't want to use React. Reagent makes React bearable through an improved ergonomics, but using React directly is a whirlwind of coordinating dependencies to compile preposterous bloated nightmares. I knew [WebComponents](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) had become widely available in browsers, so I thought I'd see how it did as an alternative.

Based on my experience, let me say: **If you are using React today, stop. Learn WebComponents and use html-alchemist instead of JSX.** Rid yourself of dependency hell.

There are two major parts to using React, in my experience: creating custom HTML entities with complex or interactive behavior, and templating HTML. The latter is typically addressed with JSX, but I am astonished that anyone puts up with writing out end tags in code.

It takes you how many dependencies to do this?

```js
const myElement = <h1>React is {5 + 5} times better with JSX</h1>
```

Let me show you:

```js
const elementHTML = alchemize(['h1', `React is ${2 + 'much'} bloat.`])
```

`alchemize` comes from [html-alchemist](https://www.npmjs.com/package/html-alchemist) aka Alchemist, a very small library that creates valid HTML from list expressions, much like Reagent does. However, Alchemist produces *strings*, rather than fully-fledged `HTMLElement` objects. This keeps things simple, and retains the possibility of using Alchemist outside of a browser environment. I invite you to [check the readme](https://github.com/garbados/html-alchemist#alchemist-html-alchemist) for how it works and how to use it.

To turn HTML strings into proper elements, we turn to WebComponents. I'll walk you through an example:

```js

import { alchemize } from 'html-alchemist'

// custom elements are just classes that extend basic elements
class MyElement extends HTMLElement {
  constructor () {
    // i haven't actually found a use for the constructor.
    // you're better off just using `connectedCallback` as your init point.
    // if you do use it, don't forget to call `super`!
    super()
    mySynchronousMutations(this)
  }

  // this method runs whenever this element is created and attached to the DOM.
  async connectedCallback () {
    // you can insert alchemist expressions directly into the node's inner HTML
    // and the browser will turn it into an element automatically!
    this.innerHTML = alchemize(['h1', 'Loading...'])
    // this method is the natural place to do initialization tasks
    await mySetupFunction(this)
    this.innerHTML = alchemize(['h1', 'Ready!'])
  }

  // this method runs when this element is removed from the DOM
  async disconnectedCallback () {
    // so it's a good place to do any teardown work
    await myTeardownFunction(this)
  }

  // to track attributes of the elements, you have to identify them by name
  static observedAttributes = ['color', 'size']

  // observed attributes that change will trigger this method
  attributeChangedCallback(name, oldValue, newValue) {
    this.innerHTML = alchemize(['h1', `${name} changed from ${oldValue} to ${newValue}`])
    // note that these are attributes on the html entity, and not `this[attribute]`
    console.log(this[name]) // undefined
    console.log(this.getAttribute(name)) // {newValue}
  }

  // you will probably not need to worry about this callback
  adoptedCallback() {
    // https://stackoverflow.com/questions/50995139/when-does-webcomponent-adoptedcallback-fire/51002629#51002629
  }
}

// we have to register our special element so it can be understood.
// custom elements must have a dash (-) in their name
// to distinguish them from reserved tag names
customElements.define('my-element', MyElement)
```

That's it! Those five methods are all you need to worry about, and practically speaking, you'll usually only need `connectedCallback()`. Once you've defined a custom element, register its definition with `customElements.define()` and you're good to go.

This JS is useless without some starting HTML. Here's all you need:

```html

<html>
    <head>
        ...
        <!-- include our js -->
        <script type="module" src="./myapp.js"></script>
    </head>
    <body>
        <!-- here's the custom element -->
        <my-element></my-element>
    </body>
</html>
```

Now, once the DOM has finished loading, your element will automatically connect.

Now, how do we do interactivity? A button, for example? Let me show you:

```js

class MyButton extends HTMLElement {
  async connectedCallback () {
    // in this example, i keep element state inside `connectedCallback`
    // because it's simple and it works.
    let i = 0
    // define a function to re-render the component when state changes
    const refresh = () => {
      this.innerHTML = alchemize([
        ['p', `You have clicked ${i} times.`],
        ['input#my-id', { type: 'button', value: 'inc' }]
      ])
      // now, because we have inserted HTML into the DOM,
      // the browser synchronously parses it into a node we can retrieve
      const myInput = document.getElementById('my-id')
      // then we just attach a click listener
      myInput.addEventListener('click', () => {
        // increment our counter...
        i += 1
        // ... and re-render our html!
        refresh()
      })
    }
    // then render it for the first time
    refresh()
  }
}
```

How about a login element?

```js

// parameterize alchemy expressions to use as templates!
function renderMyLogin (error) {
  return alchemize([
    ['p', 'Login!'],
    error ? ['p', ['strong', error.message]] : '',
    ['input#username', { type: 'text', value: '', placeholder: 'Username' }],
    ['input#password', { type: 'password', value: '', placeholder: 'Password' }],
    ['input#login-submit', { type: 'button', value: 'Login!' }]
  ])
}

class MyLogin extends HTMLElement {
  async connectedCallback () {
    const refresh = (e) => {
      this.innerHTML = renderMyLogin(e)
      const submitbutton = document.getElementById('login-submit')
      submitbutton.addEventListener('click', async () => {
        try {
          const { value: username } = document.getElementById('username')
          const { value: password } = document.getElementById('password')
          if (password.length === 0) {
            refresh({ message: 'Password cannot be empty!' })
          } else {
            await login(username, password)
          }
        } catch (e) {
          refresh(e)
        }
      })
    }
    refresh()
  }
}
```

By now, you've seen this `refresh()` pattern a few times. We call it once to render the component the first time, and then it calls itself when any important state changes. I began to use this pattern because, like much else about this setup, it was simple and easy. It allows me to keep state close to where it is utilized, and to recreate event listeners when necessary.

I'm sure that if you know anything about the shadow DOM, unlike me, this approach will seem reprehensible. From one professional to another, I invite you to tear me a new one on [fedi](https://friend.camp/@garbados). For now, I'll just say this is *menacingly simple.* I mean, just [check the source](https://github.com/garbados/witch-clock/blob/main/src/web.js)! There's not that much of it.

Note that `.innerHTML` will build a node from whatever you give it, which means it's a vector for [code injection](https://en.wikipedia.org/wiki/Code_injection) if you alchemize user input. Alchemist supplies a convenience function to escape HTML called `sanctify`, which uses the browser's own text-parsing to escapes anything that looks like HTML. For more complex sanitization cases, such as allowing limited HTML markup, check out [@jitbit/htmlsanitizer](https://github.com/jitbit/HtmlSanitizer).

```js

import { alchemize, sanctify, listento, snag } from 'html-alchemist'

// `listento` and `snag` are convenience methods
// listento(elemId, eventName, callback) === document.getElementById(elemId).addEventListener(eventName, callback)
// snag(elemId) === document.getElementById(elemId)

class CustomPost extends HTMLElement {
  connectedCallback () {
    let editing = true
    let text = ''
    const refresh = () => {
      if (editing) {
        this.innerHTML = alchemize([
          'form',
          ['textarea#post-input', { rows: 5 }, text],
          ['input#post-save', { type: 'button', value: 'Save' }]
        ])
        listento('post-save', 'click', () => {
          const { value: post } = snag('post-input')
          text = post
          editing = false
          refresh()
        })
      } else {
        // our `sanctify` function does all the heavy lifting
        // so you can use it even inside of alchemical expressions
        this.innerHTML = alchemize(['div', sanctify('p', text)])
        // because innerHTML is a string, we can add more HTML to it
        this.innerHTML += alchemize([
          'form',
          ['input#post-edit', { type: 'button', value: 'Edit' }]
        ])
        // handler for returning to edit mode
        listento('post-edit', 'click', () => {
          editing = true
          refresh()
        })
      }
    }
    // initialize the edit/show cycle
    refresh()
  }
}
```

With these recipes in hand, I made the interface for the Witch Clock in about 300 lines, not including text blobs. It was astonishingly easy, once I understood how WebComponents handled dynamic behavior. Because Alchemist is so small in itself, and because WebComponents is a browser feature rather than a dependency, Witch Clock's minified compressed JS payload weighs in at 31 KB, including dependencies. *We have the tools to make modern userland applications in the browser that are the size of game carts from the 1980s,* and to make them as easily accessible as any website.

## Outro

I had a lot of fun making the Witch Clock. I plan to celebrate each of its holidays this year, just for fun. I'm very happy with the tools and patterns that spun out of its development. Expect these to show up in future projects! I am very happy to have finally rid my stack of React.

A pattern that's important to using Alchemist, but which didn't come up while making Witch Clock,
was using a `uuid()` function instead of typing out IDs, expecting them to be unique.
Here is one way to manage elements with unique IDs:

```js

const uniqueID = uuid()
this.innerHTML = alchemize([
  [`input#${uniqueID}`, { type: 'text' }]
])
listento(uniqueID, 'change', () => { ... })
```

I encapsulated some of these patterns in [example apps](https://garbados.github.io/html-alchemist/) for Alchemist. Check it out!

I think programming can be fun, but I also think that having that experience requires having tooling and abstractions that make the program easy to think about, modify, and maintain. When I hear about programmers using LLMs to write their code, I can't help but think they're just asking sand to hallucinate their boilerplate. Why write boilerplate? You're starting from a position of normalizing tedium, rather than expressiveness or creativity. Tedium isn't fun. Meditative, maybe, but I'm thirty or forty years old and I do not need carpal tunnel. I do not think the way out of tedium is to launder it through very expensive illusions. I do not think that really makes programming accessible; it only coddles your inability to comprehend the result.

Software holds a powerful place in our society. A website can change a lot, surprisingly quickly. It can't change everything, but if it made a difference to you, then it made a difference. Ideally, it should be easy to make useful things on the web. Just as I wouldn't expect everyone to understand how to repair a car, I don't expect everyone to know how to make a website. Wix will attest to the multitudes who nevertheless need one. As software becomes the sole path for navigating institutional machinery, it becomes only more important that such programs belong to the people they affect. The ability to audit source is not a nicety that comes with free hosting on GitHub, but a civic necessity, just as the rules of any other civic process should be publicly available. I expect, in an [organized world](https://blog.bovid.space/software_from_another_world), that my skills would in part serve the public need for them, and be accountable to the public directly. Under current conditions, it works out much more covetously than that.

But a girl can dream, and a witch can hex.
