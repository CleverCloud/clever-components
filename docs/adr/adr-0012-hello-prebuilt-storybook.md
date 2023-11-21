---
kind: '📌 Architecture Decision Records'
---

# ADR 0012: Hello prebuilt Storybook

🗓️ 2020-12-22 · ✍️ Hubert Sablonnière

## The context

We started the Clever Components library with Storybook v5.
8 months later, we did a big migration to adopt CSF for our stories.
This format is really nice!

A few months ago, Storybook released a [new major version: 6](https://medium.com/storybookjs/storybook-6-0-1e14a2071000).
It contains lots a small improvements and some bigger changes like the [args](https://medium.com/storybookjs/introducing-storybook-args-2dadcdb777cc) and [controls](https://medium.com/storybookjs/storybook-controls-ce82af93e430).

We would like to migrate to this new version and maybe use these new features.

## The problem

Storybook is working hard on improving the performance (especially on 6.1).
However, our experience of using it to build a Web Components library is not satisfying performance wise.

* `npm run storybook:dev` takes **30s** to start (on my laptop: 20GB RAM / Core i7-6600U @ 2.60GHz)
* `npm run storybook:build` also takes around **2m20s** to build.
* The time between a code update in a component and the time we see the result in Storybook is around **8s**.
* The output static site is weights **11.2MB**.

Why so slow?

### Storybook and Webpack

Storybook is a big project with many modules and components.
It's built with React and TypeScript.
In most cases, this kind of stack requires a setup with bundler and a dev server.
They chose to rely on Webpack for this.

When you work on your code and stories, you start Storybook in dev mode.
This will start Webpack's dev server with a _not-so-simple_ configuration that is shared between Storybook's code AND yours.

* 👍 The benefit is that everything is already there if you need to work with TypeScript, JSX... or if you want to use `import` with images or JSON.
* 👎 The drawback is that if you need settings different from the default ones, you need to step into [Webpack](https://storybook.js.org/docs/react/configure/webpack#extending-storybooks-webpack-config) or [Babel](https://storybook.js.org/docs/react/configure/babel) customization.

Configuring those tools is not always an easy task, so adapting an existing config you know nothing about is not that trivial.
You often end up fighting against it.

This default Webpack/Babel setup, dedicated for Storybook's React/TypeScript sources is far from our own context.
Indeed, we made several decisions on this project to stay close to standards and stay away from custom bundler/tools things:

* We don't need old-browser transpilation or polyfills as we only target modern browsers and we don't use early stage unstable JS features
  * Changing the compile target was yet another customization
* We don't need TypeScript transpilation
* We don't need JSX transpilation
* We mostly use ES modules
  * but Webpack 4 output is still custom
* We don't need the non-standard Webpack loader feature to import non JS files like images
* We use standard `new URL('./path/to/asset.svg', import.meta.url)` to refer to assets with relative paths
  * The `import.meta.url` feature is not supported through Webpack 4. It is an ES2020 standard AND has been present in all major browsers for several years. It was quiet difficult to make it work.

In the end, our code and stories must share a Webpack/Babel setup that is really different from what we need.
We made choices so we could have a simple setup and good dev/build perfs but we must inherit from the not-so-good performances of Storybook's stack.

## The solution

### Background

A year ago, the wonderful people at [Open Web Components](https://open-wc.org/) worked on a [prebuilt version of Storybook](https://www.npmjs.com/package/@open-wc/storybook-prebuilt).
More details in [this article](https://dev.to/open-wc/storybook-for-web-components-on-steroids-4h29).

The idea was that all the heavy lifting of compiling/bundling Storybook along with a set of addons was done once.
Then you could run this prebuilt Storybook with your set of components and stories and your own simple and light config without relying on Webpack/Babel if you didn't need to.

The result was really impressive _but_ we were a bit shy to welcome this young project into our code base.
We were worried we could miss new features from Storybook.
We were also worried about having less customization powers so we decided to wait.

### Hello Modern Web

Since then, the whole Open Web Components project evolved a lot and a sibling project called [Modern Web](https://modern-web.dev/) appeared.
Both projects feature mature guides and tools for modern web development in general and some specific stuffs for Web components users.
We share a lot of common principles with the people working on those projects.

Looking at their latest tools, we identified a very interesting combination that would allow us to drop this heavy Webpack/Babel setup and improve our dev/build perfs:

* [Web Dev Server (WDS)](https://modern-web.dev/docs/dev-server/overview/)
* [Storybook plugin for WDS](https://modern-web.dev/docs/dev-server/plugins/storybook/)
* [HMR plugin for WDS](https://modern-web.dev/docs/dev-server/plugins/hmr/) with [Open WC's implementation](https://open-wc.org/docs/development/hot-module-replacement/#installation) for Web components

With this wonderful cocktail:

* `npm run storybook:dev` takes **0s** to start
* `npm run storybook:build` takes around around **1m** to build.
* The time between a code update in a component and the time we see the result in Storybook is near **0s**
* The output static site weights **4.2MB**.

🔥 Having a really fast feedback loop in dev mode like that is a bliss!

## The implementation

For this migration, we didn't have to modify our source code much.
However, we had to adapt our stories, our configuration and our custom hacks...

### Storybook configuration

* No more `.babelrc` in Storybook conf
* No more [copy-webpack-plugin](https://github.com/webpack-contrib/copy-webpack-plugin) for our SVG assets
  * They're handled by an awesome Rollup plugin: [rollup-plugin-import-meta-assets](https://modern-web.dev/docs/building/rollup-plugin-import-meta-assets/)
* Goodbye notes Storybook addon
  * We started using this addon before the docs addon was a thing
  * When we added the docs addon, we decided to keep both (as notes contained a few more details than docs)
  * The main difference is methods and event types
  * This addon is not part of Storybook prebuilt (because it's kinda legacy)
  * We'll wait for support of the new upcoming Web Component Manifest to improve the docs
* Goodbye a11y addon
  * This addon introduced a few perf limitations on load and interactions
  * We were not using it that much
  * We should investigate a tool like [eslint-plugin-lit-a11y](https://open-wc.org/docs/linting/eslint-plugin-lit-a11y/overview/) instead
* We needed two CSS in the preview, instead of using `import` statements with CSS files, we can now use `<link>`
* The new Storybook story name sort system is nice but does not help us
* We're now loading stories with simple globs inside `.storybook/main.js`
  * We were still loading some stories with `require.context()` (because reasons)
* Goodbye HMR custom hack in `.storybook/preview.js`

### Story adjustments

* Reference images with `new URL()` instead of non standard `import`
* Use JS files instead of JSON
* Update our custom `makeStory` so it can return up-to-date CSF

### Custom hacks

#### Plain markdown

We tried using MDJS.
It's better than MDX but having to repeat the title of a markdown document inside a code fence that exports an object feels weird.
It was already weird to do that with JSX+MDX to be honest.
We also wanted more power of customization over the markdown output (GitHub CSS, syntax highlight...).

We created a custom WDS plugin for dev and a custom Rollup plugin for build.
This plugin can load plain markdown files with custom frontmatter to handle story kind and title.
This plugin ouputs a JS file as CSF with a custom docs page as a React component (generated from the markdown content) as required by Storybook.

This allowed us to load plain markdown like the main README and ditch the legacy usage of `storiesOf` we had. 

#### i18n

We had a global knob for our i18n system.
It allowed us to switch the language.

Moving away from the knob addon to the controls addon for this was not trivial.
Especially for the keyboard shortcut support.

As a bonus, we also added custom HMR support for our translation files.
