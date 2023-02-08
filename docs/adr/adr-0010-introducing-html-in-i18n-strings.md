---
kind: '📌 Architecture Decision Records'
---

# ADR 0010: Introducing HTML in translation strings

🗓️ 2020-01-19 · ✍️ Hubert Sablonnière

We want to use some whitelisted HTML tags in translation strings.
The main reason would be to add a `<strong>`, `<em>`, `<code>` or an anchor `<a>` directly in a translated sentence.

This is actually really hard to do properly and this ADR tries to explain our thinking and the chosen solution.

## Current i18n system

### Theory

Right now, our i18n system has two modes:

1. Static text with `i18n('key')` => `string`
2. Text with params with `i18n('key', { params })` => `string`

**_🧐 OBSERVATIONS:_**

* Those params can be string, date objects, numbers...
* The result is always a string and may contain HTML tags.
* Those HTML tags may come from the static part or from the params.
  * Static parts of the translation always comes from the developer.
  * Params always come from the user/API.
* This means, we CANNOT trust the result of `i18n()`.
* It's up to the templating library using the `i18n()` function to "sanitize" the output.
* That's exactly what **lit-html** does for us in our components, we always consider the output of `i18n()` to be a string that needs to be treated as unsafe HTML.
* This i18n system is completely agnostic to **lit-html** and we really like this isolation/decoupling.

### Example

Let's take an example:

```js
// translation.[lang].js
{
  'my-component.one': `Hello <strong>World!</strong>`,
  'my-component.two': ({ name }) => `Hello ${name}`,
}

// my-component.js
render() {
  return html`
    <div>
      ${i18n('my-component.one')}
      <br>
      ${i18n('my-component.two', { name: '<strong>World!</strong>' })}
    </div>
  `;
}
```

In both cases, the `i18n()` function would return an unsafe string with a `<strong>` tag.
But once handled by **lit-html**, this template would produce the following:

```html
<div>
  Hello &lt;strong&gt;World!&lt;/strong&gt;
  <br>
  Hello &lt;strong&gt;World!&lt;/strong&gt;
</div>
```

Both unsafe HTML strings have been escaped by **lit-html**.

## What we want?

### Example

With the same example, we'd like to produce this:

```html
<div>
  Hello <strong>World!</strong>
  <br>
  Hello &lt;strong&gt;World!&lt;/strong&gt;
</div>
```

**_🧐 OBSERVATIONS:_**

* The `<strong>` tag was treated as HTML when it came from the static part of the translation.
* The `<strong>` tag was escaped when it came from a param.

### Requirements

Here's what we wish for:

* Use whitelisted HTML tags (`<strong>` `<em>` `<code>` and `<a>`) in the static parts of our translation string.
* Use whitelisted attributes (`a[href]` and `*[title]`).
* Every other tag should be rendered as pure safe text and other attributes should be removed.
* Everything that goes into the translation string through a param should be escaped as safe text.
* The solution should be as isolated and decoupled from how we create our components as possible.
* The solution should be as small as possible.

### Notes and questions?

* Should we only apply this sanitization at build-time?
  * It seems like we only need a build-time check that devs don't add crazy HTML tags in translation strings.
  * It seems hard to do/implement.
  * It does not seem super safe regarding XSS and security.
* We heard about [DOMPurify](https://github.com/cure53/DOMPurify), does it fit our requirements?
  * It has what we need regarding filtering an HTML string or DOM structure.
  * It does a lot of things we don't need.
  * It's [6.2k](https://bundlephobia.com/result?p=dompurify@2.0.7).
* **lit-html** `html` template tag function has a system for "static parts can be trusted and params should be escaped".
  * It accepts more that regular HTML (custom syntax).
  * It's not a good target if we want to have an i18n system decoupled from our components.

## Not so good solutions

Here's a description of some "not so good" solutions we had and how they would work.

### The "trust translation strings" solution

With this solution, we would assume that the new i18n system can be 100% trusted.
It means:

* It must take care of it's own sanitization.
* It must whitelist/filter tags and attributes on the static parts.
* It must escape 100% of params.
* This could be done with a template tag function called `sanitize` inside translation files like this:

```js
{
  'my-component.one': sanitize`Hello <strong>World</strong>`,
    'my-component.two': ({ name }) => sanitize`Hello <strong>${name}</strong>`,
}
```

**_🧐 OBSERVATIONS:_**

Assuming we use **DOMPurify** to whitelist/filter stuffs and we find a way to simply escape things from params, we still have a few problems:

* If our i18n system still returns HTML strings, even if we know they are sanitized, we'll need our templating system to trust those HTML strings.
  * This means the result of any `i18n()` call would have to be used with **lit-html** `unsafe()` directive in our components.
* If we forget the `sanitize` tag on any of the translation strings, we exposed some XSS and security risks.
  * It would require some hard work (babel+AST stuffs) to automate a check on this in the `check-i18n` task. 

This solution is not super satisfying regarding security since the templating system now has to trust everything that comes from the i18n system and we briefly mentioned that it could be possible to make mistakes (if we don't invest in some build-time check tooling).

### The "return lit-html templates" solution

If you're familiar with **lit-html**, you would know that it treats all strings as unsafe but it trusts itself which means it trusts its own `TemplateResults`.
Let's say we find a way for our `i18n()` function to return `TemplateResults`.

1. `i18n('key')` => `TemplateResults`
2. `i18n('key', { params })` => `TemplateResults`

**_🧐 OBSERVATIONS:_**

* If `i18n()` returns **lit-html** `TemplateResults` instead of just strings, we completely break the isolation/decoupling we want to enforce.
* If we return **lit-html** `TemplateResults`, the i18n could rely on it for the _"HTML is OK in static parts and escaped in params"_
  * We already mentioned that **lit-html** accepts way more than HTML in the static parts.
* It would not help us to whitelist/filter stuffs correctly without allowing all the other HTML tags/attributes.
  * Only **DOMPurify** would do this properly and we don't see have it would fit in a system where we want to return a `TemplateResults`.
* We would achieve the goal of not having to use **lit-html** `unsafe()` directive in our components.
  * In a way, **lit-html** would accept its own `TemplateResults` as trustworthy.

This solution is a no-go because we don't want our i18n system to be decoupled from our templating system as much as possible.

## The "return DOM" solution

If you're familiar with **lit-html**, you would know it does not trust strings, it trusts its own `TemplateResults` but it also trusts `DocumentFragment`.

Interesting...

Could we achieve our requirements of whitelisting/filtering/escaping and have our `i18n()` function return a sanitized `DocumentFragment`?
Of course, we could still return unsafe strings and only return a sanitized `DocumentFragment` when needed:

1. `i18n('key')` => `string|DocumentFragment`
2. `i18n('key', { params })` => `string|DocumentFragment`

We think this can be achieved with the a template tag function (as mentioned in another solution):

```js
{
  'my-component.one': sanitize`Hello <strong>World</strong>`,
  'my-component.two': ({ name }) => sanitize`Hello <strong>${name}</strong>`,
}
```

**_🧐 OBSERVATIONS:_**

* `DocumentFragment` is part of the DOM.
  * It's not **lit-html** specific so we achieve isolation/decoupling between i18n/templating.
  * We think this idea could be used with other templating solutions (with a few tweeks).
* This way, everything is unsafe by default and it's up to the developer to use the `sanitize` to return a `DocumentFragment` that can be trusted.
  * Probable mistake: developer uses HTML in translation string and forgets to use `sanitize` => `i18n()` returns an unsafe string and templating system escapes it. We're fine.
* The template tag function (like **lit-html** does) would help us to identify the static parts and params.

We still need to find a way to:

* Strictly escape the content of the params.
* Sanitize/filter the whole content after the params have been escaped.

### Escaping content of params

As we already explained, we don't want to use **lit-html** for this because:

* It allows more than regular HTML syntax.
* It would be tricky to combine with the whitelisting mechanism.
* It would break our isolation/decoupling requirements.

To our knowledge, there is no clear official way to escape strings in the DOM API.
We looked at [escape-html](https://github.com/component/escape-html), it's really small but it's yet another 3rd party dependency and it's based on regexes (OMG).

We decided to imitate [what **lit-html** does](https://github.com/Polymer/lit-html/blob/master/src/lib/parts.ts#L381-L385) by using the DOM behaviour of a `TextNode`.

```js
// Setup span > #textNode
const span = document.createElement('span');
const textNode = document.createTextNode('');
span.appendChild(textNode);
// Sets unsafe HTML as text
textNode.data = 'Some <h1>dirty</h1> HTML';
// Ask for the innerHTML of the parent
console.log(span.innerHTML);
// => "Some &lt;h1&gt;dirty&lt;/h1&gt; HTML"
```

A `TextNode` does not behave the same when its parent is a `<style>` (and other tags).

### Whitelisting/filtering the whole content after the params have been escaped

We managed to do it really easily with **DOMPurify** but:

* We don't need most of what it does (lots of settings and full list of what is safe and not).
* It's 6.2k and we think it can be 10 times smaller.

We tried to achieve the whitelisting/filtering ourselves with a [`TreeWalker`](https://developer.mozilla.org/en-US/docs/Web/API/Document/createTreeWalker).

* It's not an easy API to use. #opinion
* It's not well known by web devs.
* It seems more useful in situations where you want to check things more than situation where you want to manipulate the DOM.

In the end, we used something simpler:
 
* A `<template>` element to safely parse the whole HTML string (after params have been escaped).
* A `querySelectorAll('*')` on the template content to list and iterate over all the elements.
  * Micro-benchmarks ([here](https://www.measurethat.net/Benchmarks/Show/5947/0/treewalker-vs-queryselectorall) and [there](https://gist.github.com/sindresorhus/1989724)) don't seem to agree but it does not seem to be bad performance-wise compared to a `TreeWalker`.

In this end, it was really easy to implement our sanitization requirements/rules with this.
You can look at the source if you want at `lib/lib/i18n-sanitize.js`.

**_🧐 RECAP:_**

* If `i18n()` returns a `string`, it CANNOT be trusted.
* If `i18n()` returns a `DocumentFragment`, it can be trusted.
* This implementation is really small: less than 700 bytes.
* This implementation is unit tested, we added [cypress.io](https://www.cypress.io/) to the project to create a test suite.
* We added a `console.warn()` to warn when you don't follow the rules.
* We don't see how we would easily run this sanitization as part of our `i18n-check` task but:
  * As we exaplined, if a dev uses HTML in the translation string and forgets the `sanitize` template tag function, `i18n()` will return a string and it will be escaped by the templating system just like before.
  * This means we only "open the security door" when we use our `sanitize` function and return a `DocumentFragment`.
  * This security door has unit tests and a small implementation.
* With this, our i18n system only works in DOM-enabled environments (browers but not in node).
 * We don't think it's a problem but it should not prevent our `check-i18n` task to work like it did before.
