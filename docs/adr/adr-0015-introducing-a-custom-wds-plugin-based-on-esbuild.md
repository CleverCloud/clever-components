---
kind: '📌 Architecture Decision Records'
---

# ADR 0015: Introducing a custom WDS plugin based on esbuild

🗓️ 2021-05-21 · ✍️ Hubert Sablonnière

## The context

In this project, we use a [prebuilt version of Storybook](https://modern-web.dev/guides/dev-server/storybook/) (see ADR #0012).
This version does not rely on the default Webpack setup of standard Storybook.
This allowed us to improve the performance (start, HMR, full reload, build...), and we were very happy with this.

This prebuilt version is based on [Web Dev Server](https://modern-web.dev/docs/dev-server/overview/).
We really like this dev server by Modern Web.
It's simple.
It's not really opinionated, it embraces standards by default like ES modules.
It does not come with a zillion features we don't need.
However, when it's necessary, you can add plugins or [create your own](https://modern-web.dev/docs/dev-server/writing-plugins/overview/).

We recently introduced several dependencies as ES modules in our components:

* The new smart components are using [RxJS](https://rxjs.dev/)
* The maps are now using an ESM version of [Leaflet](https://leafletjs.com/)
* The charts are now using an ESM version of [chart.js](chartjs.org/)

_edit (2024-02-15)_: actually, we do not use RxJS library anymore.

## The problem

Because of those changes, the number of files loaded by the prebuilt Storybook in dev mode increased a lot.
By a lot, I mean more than 620 files total (HTML, CSS, JS modules, images...) to display a story.
This is because by default, Web Dev Server doesn't bundle anything.
It will rely on your browser's ability to load ES modules as the `import` statements are discovered in the code.

Most of the time this behaviour is fast enough, but our context combines:

* Storybook that loads all components and story files just to display a story
* Several dependencies that have big ES modules trees (hello RxJS)

This has an impact on how long it takes to load the Storybook locally in dev mode:

* Full load without cache: 38 seconds
* Load with cache: 12 seconds

## The solution

Storybook is working on new stuff that may/should improve the performance.
We're not sure what these improvements will bring and how much faster it will be (maybe something based on [vite](https://vitejs.dev)).
We're also not sure when such improvements will land.

While we wait for an official faster Storybook release, we decided to create a custom WDS plugin to improve the situation.

We decided to use [esbuild](https://esbuild.github.io/) to bundle some of our dependencies on the fly.
As expected, we were able to reduce the number of HTTP requests from more than 620 to a bit less than 320.
This reduced the time it takes to load the local Storybook:

* Full load without cache: 24 seconds
* Load with cache: 7 seconds

If you're curious, you can see the source of this custom plugin in `wds/esbuild-bundle-plugin.js`.
We use it in our `web-dev-server.config.js` like this:

```js
export default {
  // ...
  plugins: [
    // ...
    esbuildBundlePlugin({
      pathsToBundle: [
        '/src/lib/leaflet-esm.js',
        '/node_modules/rxjs/dist/esm5/index.js',
        '/node_modules/rxjs/dist/esm5/operators/index.js',
        '/node_modules/chart.js/dist/chart.esm.js',
      ],
    }),
  ]
}
```

## What's next?

* We'll see what kind of improvements Storybook will bring in the future.
* If some people are interested in such a Web Dev Server plugin, we could consider contributing it to the Modern Web project.
