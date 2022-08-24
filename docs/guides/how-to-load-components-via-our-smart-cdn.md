---
kind: '📌 Docs'
---
# How to load components via our smart CDN?

You don't need npm or a bundler to use our components in your site or web app.
You can load them from our CDN.

First, you need a `<link>` tag to load the styles for the default theme:

```html
<link rel="stylesheet" href="https://components.clever-cloud.com/styles.css?version=9.0.0">
```

INFO: This URL supports one query param: `version`.

WARNING: This `<link>` tag is only required starting from version `9.0.0`.

Then you need a `<script>` tag to load the components and init the i18n system if necessary:

```html
<script type="module" src="https://components.clever-cloud.com/load.js?version=9.0.0&lang=fr&components=cc-toggle,cc-tile-requests"></link>
```

INFO: This URL supports three query params: `version`, `lang` and `components`.

We provide a UI where you can select the version, language and list of components and get the right URLs to use:

https://components.clever-cloud.com/

You can refer to the sections below to learn more about the different query params.

## Version

* You can specify the version you need with the `version` query param
* All versions starting from `5.3.1` can be loaded
* You can retrieve the list of published tags here: https://github.com/CleverCloud/clever-components/tags
* You can use any semver specifier
  * Ex: with `5.3`, you'll get all future bug fixes from `5.3.x` 
  * Ex: with `5`, you'll get all future bug fixes and minor updates from `5.x.x`
* If you don't set the `version` query param, you'll get the latest version but beware of breaking changes when we ship a major release 

## Lang and i18n

* You can specify the language you need with the `lang` query param
* Right now, we only support English with `en` and French with `fr`
* If you don't set the `lang` query param, you'll get the english version by default
* The i18n system and the appropriate translations will only be downloaded and configured if you ask for a component that rely on them

## Components

* You can specify the components you need with the `components` query param
* It's a comma separated list where you list the tag names of the components you need (without angle brackets)
* If you don't set the `components` query param, it will "work" but you'll get a warning in the devtools console
* If you ask for a component that does not exist, you'll get a warning in the devtools console

### WARNING

We have a special demo/dev mode where you don't need to specify the components you need, and they're automatically downloaded when used.
This is only here for demo and dev purposes.
It may be removed in the future.
Please do not rely on this in production, it does not provide good performances.

To use it, you can specify a version and a lang if you want and instead of specifying a list of components, you add this special query param:

```
https://components.clever-cloud.com/load.js?version=9.0.0&lang=fr&magic-mode=dont-use-this-in-prod
```
