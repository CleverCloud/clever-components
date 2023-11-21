---
kind: '📌 Architecture Decision Records'
---

# ADR 0009: How we use the new Storybook CSF and docs page?

🗓️ 2020-01-14 · ✍️ Hubert Sablonnière

## Context

Our Web Components project was started in march 2019.
We setup storybook from day one (v5.0.x) with `@storybook/html` and our usage was like this :

* We chose the `@storybook/html` setup because the `@storybook/polymer` one was not really suited for our LitElement usage and since WC are just HTML and DOM, `@storybook/html` felt ok.
* We created stories for our components with `storiesOf()`.
  * We had a few pure HTML stories and lots of raw DOM stories (with a few helpers). This way, the stories we created were completely agnostic to our WC helper lib: LitElement.
  * We often grouped several use cases into one story so we could see different permutations/examples in one page at the same time.
  * It gave us the opportunity to add a title and some info in the HTML content of the story to separate and document the use cases.
* We transformed some welcome docs (README, CHANGELOG, guides...) from markdown to HTML and add them as stories so we could display them in the final site.
* We used [web-component-analyzer](https://github.com/runem/web-component-analyzer) to build markdown docs for our components and we integrated it with the addon notes.
  * The latest 1.0.x version of WCA really covers all our needs (attrs, props, events, slots, CSS custom props, method) and we could easily describe our props and events types with TypeScript snippets.

Other details:

* We created a few sets of stories with different widths to easily test how our components react to responsive situations.
  * This meant we sometimes had "foobar story 350px", "foobar story 450px", "foobar story 600px"... and so on.
* We did not use the addon knobs a lot since we tend to cover the different variants with stories. We also found knobs usage with HTML/DOM stories to be a bit cumbersome since it often means full reload of the story.

## Goals

The main goals to upgrade to latest 5.3.x of Storybook was to investigate and try those:

* Migrate from `@storybook/html` to `@storybook/web-components`.
* Migrate from `storiesOf()` to CSF.
* Migrate from addon notes to addon docs (with docs page and MDX files).

## What we did...

We went from `5.1.11` to `5.2.8` and then `5.3.x`. 

### From `@storybook/html` to `@storybook/web-components`

We moved from `@storybook/html` to `@storybook/web-components`.
This allowed us to return lit-html in our stories.
In the end, we don't really use this but anyway.

NOTE: To remove errors from already defined custom elements, the HMR setup is still manual.

### Stories authoring format

We used to declare our stories with raw DOM (and sometimes HTML).
The raw DOM allowed us to reuse some logic and write fewer code (mostly example data).
We tried to move to lit-html based stories but:

* It was more verbose than what we did with our initial helper `createComponent()`.
* It did not allow us to easily reuse bits of templates since you have to juggle between real JS and lit-html templated strings.

We decided to create a new helper `makeStory()` to write as less code as possible for a story.
It pushed us to:

* Concentrate on writing a given story around one component and focusing on the I/O we want to try.
* Reuse code and example data easily.

Here's an example where we show of `<cc-tile-instances>` 3 times with different data for the `instances` property and some custom CSS:

```js
const conf = {
  component: 'cc-tile-instances',
  css: `cc-tile-instances {
    display: inline-grid;
    margin-bottom: 1rem;
    margin-right: 1rem;    
    width: 275px;
  }`,
};

export const defaultStory = makeStory(conf, {
  items: [
    { instances: { running: [{ flavorName: 'nano', count: 1 }], deploying: [] } },
    { instances: { running: [], deploying: [{ flavorName: 'nano', count: 1 }] } },
    { instances: { running: [{ flavorName: 'nano', count: 1 }], deploying: [{ flavorName: 'nano', count: 1 }] } },
  ],
});
```

### Moving to CSF

The new CSF is really nice!
Here are some facts abouts our migration and usage.

#### Story reuse

👍 Since all stories are now ES exports, we improved the `<cc-overview>` story by including real examples of each child components instead of their skeleton state, using their own stories.

#### Story names

👎 The way story names are computed from exported function names was not to our taste and the way you can override the name with  was also not to our taste.

👍 Our `makeStory()` helper allows us to specify a name in a cleaner way.

👍 Our `enhanceStoriesNames()` helper allows us to just use the function name and rely on conventions to transform/decorate the name. 

#### Organization in navigation tree

👎 We had to modify a few stories (`<env-var-editor-*>`) because we used `storiesOf()` twice in the same file with different subpath in the left navigation tree. This is not possible with CSF. We tried to use two files but then we decided to keep one and rework the stories hierarchy.

### Moving to addon docs

We did a lot of reading about how addon docs works.
There is the docs pages generated from CSF files and those that are generated from MDX files.
You can mix boths in [different ways](https://github.com/storybookjs/storybook/blob/next/addons/docs/docs/recipes.md).

#### MDX files

👎 Because we don't have a react background in our small team, using JSX inside markdown to show off HTML that we have to put inside lit-html tagged templates felt very weird (to say the least).
It's also not that trivial to debug when something's wrong in an MDX file and you don't know how JSX works.

The examples and use cases seems to be suited for authors using lit-html for their stories.
As we explained, our `makeStory()` helper allows us to write less code to describe a component in a given situation.

MDX files seems to be suited for prose heavy documentation pages with sometimes a few blocks between the paragraphs (live stories, props docs...).
In our case, we mostly need the live stories and some docs around.

👍 We had a few text only documentation pages (with markdown) and some boilerplate code to integrate them as stories.
We took the opportunity to rename the files to `.stories.mdx` and add a title with `<Meta />` so they can be listed as stories properly inside the docs tab.

NOTE: We don't really like those files to be MDX. We're rather have pure markdown files and let the webpack loader load the title from the parsed markdown and not the `<Meta title="">`.

#### Docs page from CSF

👍 The docs page generated from CSF files is really close to the spirit of what we want to display for a component:

* Name
* Description + text docs (extracted from JSDoc).
* Interface docs a.k.a. props table (extracted from JSDoc).
* Stories (with live demo, show code and the ability to annotate some stories with additional docs).

Now that we have a single page with all stories in the docs tab, we decided to:

* Split most of our stories that were showcasing several different situations in one into multiple small stories.
* Remove our multiple widths stories (and use the addon viewport).
* Reuse some stories inside others (see `<cc-overview>`).

## Our wishlist

😍 We're very very grateful for the many new features the Storybook community gave us.
This tool and the new addon docs are truly awesome!!!
Using it in our components library excited us to the point of wishing even more.
We list them here and will work on some propositions through issues and maybe code in the next weeks/months.

NOTE: We we're able to patch some stuffs for the time being, but we'd love a stable/official solution.

* In docs page, the "show code" example expect JSX and is always in dark mode.
  * We dirty patched `@storybook/components/dist/blocks/Preview.js` in order to force HTML but we were not able to set a light theme.
  * Some syntax coloration are still weird (content of HTML tags are not readable).
* The "show code" example shows two much. It's often the whole story code + setup and stuffs. It seems like there is a location mechanism to only display what's necessary but we were not able to make it work.
  * We were able to generate a simple "HTML" story to provide our own "show code" content through: `storyFn.story.parameters.mdxSource` with our `makeStory()` helper.
  * This is just the beginning, we can imagine having a tabbed interface with data/CSS/HTML where "HTML" could be several tabs, one for usage with each frameworks.
* We wanted an official way to add some markdown description/documentation for a given story.
  * We were able to provide our own story description through: `storyFn.story.parameters.docs.storyDescription` with our `makeStory()` helper.
* The props table still feels like it's created for react (ex: pros and attrs aren't merged).
  * We would love to have something like [api-viewer-element](https://github.com/web-padawan/api-viewer-element) instead.
  * We tried to patch it into docs page but it wasn't easy and was very hacky.
* The props table lacks methods and types.
  * That's why we're still using notes addon.
  * It's not included in `custom-element.json` yet so I guess it makes sense.
* Sometimes, we don't want to display a first story before the props table.
* How could we change knobs in docs page?
* How could we use the addon viewport switch in the docs page?

Regarging the props table, we think it would make sense to add a few things before or after:

* List of i18n keys used by the component (with maybe the different translations if it's only text).
* List dependencies with links and size (whole deps vs after tree shaking?).
  * External npm deps
  * Internal JS files
  * Reused styles
  * Images
* Display sizes (normal, min, gzipped...).
* A small install/setup snippet.
* A link to source (component and story).

## Future?

If we find a way to improve what we don't like much and to implement what we wish for, we would be able to ditch notes addon and to publish our storybook with `--docs`.
