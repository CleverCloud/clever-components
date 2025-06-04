---
title: 'Readme'
---
# Collection of Web Components by Clever Cloud

## What is this?

This project contains a collection of Web Components made by Clever Cloud.

Some of those components are low-level like `<cc-button>`, `<cc-input-text>` or `<cc-loader>`,
the other components are more high-level and specific to Clever Cloud's domain model.

We use them on different Web UIs we have (public and internal).

## Why is it public?

1. We want to share our knowledge and experience with Web Components along with the tooling we used to build them. We hope it will help others for their own components.
1. We use those components ourselves but we also want our clients and partners to use them in their own custom Web UIs based on our products.
1. We think it's a great way for our clients to give feedbacks (and even contributions) on small parts of our Web UIs.

## Can I see those components?

All our components are showcased with "stories" using [Storybook](https://github.com/storybookjs/storybook).
You can see all our components (and their stories) on [this preview](https://www.clever-cloud.com/developers/clever-components/).

Storybook is a great tool to present your components in many different situations.
This way, you can check how they behave with different inputs (properties, attributes...) and make sure they produce the right outputs (emit events...).

We also use [web-component-analyzer](https://github.com/runem/web-component-analyzer) to generate a documentation spec sheet for each component.
You can find it in the *Docs* story of a component ([example](https://www.clever-cloud.com/developers/clever-components/?path=/docs/🧬-atoms-cc-button--docs)).

## Can I use them in my project?

Sure, they're [available on npm](https://www.npmjs.com/package/@clevercloud/components).
Contact us if you want more details.

## License

This project is licensed under the [Apache-2.0](https://spdx.org/licenses/Apache-2.0.html).

We're using modified versions of two projects related to [Leaflet](https://leafletjs.com/):

* https://github.com/Leaflet/Leaflet.heat
* https://github.com/mourner/simpleheat

Both projects are licensed with [BSD-2-Clause](https://spdx.org/licenses/BSD-2-Clause.html).
They aren't updated anymore, and we wanted them to be exposed as modern ES modules.
This is the main reason we decided to copy them in our own repo.
The respective copyrights are at the top of each file:

* src/lib/leaflet-heat.js
* src/lib/simpleheat.js

Icons are powered by [Remix Icon](https://remixicon.com/).
