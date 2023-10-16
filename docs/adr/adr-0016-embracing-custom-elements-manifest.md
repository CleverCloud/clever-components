---
kind: '📌 Architecture Decision Records'
---

# ADR 0016: Embracing Custom Elements Manifest

🗓️ 2021-06-29 · ✍️ Hubert Sablonnière

## The context

We've been using [Web Component Analyzer (WCA)](https://github.com/runem/web-component-analyzer) for a while now.
This awesome tool by [Rune Mehlsen](https://github.com/runem) helped us a lot to document our Web Components.
With one command, WCA can scan and parse all our components' source code (with their JSDoc comments) and generate some documentation.

This documentation features the description of the component extracted from the JSDoc, but also the list of the different inputs/outputs that compose the API of a Web Component:

* Attributes
* Properties
* Methods
* Events
* Slots
* CSS custom properties
* CSS parts

At first, we were using WCA's Markdown output.
This output contained the title, the description and then a series of tables featuring the different parts of a Web Component API mentioned above.
Using Storybook's [notes addon](https://storybook.js.org/addons/@storybook/addon-notes), we were able to display this Markdown document directly in our Storybook.

Some time later, we switched to WCA's JSON output (see ADR #0009).
This output contained the same kind of details the Markdown output had, but in a machine-readable format.
This format is specific to WCA, but the Web Component version of Storybook's [docs addon](https://storybook.js.org/addons/@storybook/addon-docs/) is compatible with it.
Thanks to this integration, we decided to replace Storybook's notes addon with Storybook's docs addon.
We also decided to stop using WCA's Markdown output and only generate the single JSON file containing the documentation for all our components.

## The problem

### Customization

We wanted to customize the documentation of our components with some additionnal information:

* Link to GitHub source file
* CSS default display of the custom element
* List of images used by the component
* Describe the types of our APIs

WCA's behaviour and JSON output were not really meant to be customized.
This why we started to put those custom information manually in the description part of the JSDoc.
This is cumbersome and error prone.

### Performance

Another (small) limitation is performance.
It takes 8 seconds for WCA to generate the documentation for all our components.
Because of this, we decided not to run this task in watch mode.
During dev, when we updated the source and/or JSDoc of a component, we had to manually run WCA to see the up-to-date docs in Storybook. 

## The solution

### The new CEM standard format

Following WCA's JSON custom format, a group of wonderful people started some discussions to create a standard format called [Custom Elements Manifest (CEM)](https://github.com/webcomponents/custom-elements-manifest).
In june 2021, the first version of this format was released.

Some details are still under discussion but this first version is a strong fondation.
As you can see in the [schema](https://github.com/webcomponents/custom-elements-manifest/blob/master/schema.d.ts), it already handles most of the cases we need to describe and document a library of Web Components.

You can find more information about it in [Pascal Schilp's blog post](https://dev.to/open-wc/introducing-custom-elements-manifest-gkk).

### The new analyzer

Along with this new format, the brillant folks behind [Open Web Components](https://open-wc.org/) released a new tool: [Custom Elements Manifest analyzer (CEM analyzer)](https://github.com/open-wc/custom-elements-manifest/tree/master/packages/analyzer).
This new analyzer serves the same purpose as WCA.
It scans and parses your Web Component's source code and produces a `custom-elements.json` following the new standard CEM format.
On top of vanilla Web Components written with JavaScript, this new analyzer also handles TypeScript and the following libraries: [Lit](https://lit.dev/), [Fast](https://github.com/microsoft/fast), [Stencil](https://stenciljs.com/), [Catalyst](https://github.github.io/catalyst/).

CEM analyzer features a powerful plugin system:

* OPINIONATED: It is very easy to write a plugin if you're familiar with ASTs or other plugin systems like ESLint or Rollup.
* It has [very good documentation](https://github.com/open-wc/custom-elements-manifest/blob/master/packages/analyzer/docs/plugins.md).
* It has a [plugin template](https://github.com/open-wc/cem-plugin-template) to get started easily. 
* It has an [online playground](https://custom-elements-manifest.netlify.app) to easily try and share a plugin idea.

👍 This should allow us to customize the documentation of our components with some additionnal information.

CEM analyzer is faster than WCA:

* WCA takes around 8 seconds to generate the JSON.
* CEM analyzer takes around 2 seconds to generate the JSON.

👍 This should allow us to run this in watch mode on each modification.

### Generating the manifest

We tried to run CEM analyzer on our component's library, and the first try was very promising.
Thanks to the plugin system, we were able to adjust a few details and to customize the documentation with some additionnal information.
Here's a list of the plugins we wrote so far:

* `sort-items`: sorts all items alphabetically by their name (attributes, properties...)
  * This really helps when doing some diffs to see what changed between versions.
* `remove-private-members`: removes private members (attributes, properties and methods) identified with a `_` name prefix
  * We use the `_` private prefix convention a lot for our properties and methods. We don't want to document those publicly.
* `identify-readonly-members`: identifies properties with a getter but no setter as readonly
  * Our two map marker components expose some properties for the `≤cc-map>` component, with this plugin we can identify this implicit pattern.
* `support-cssdisplay-jsdoc`: adds support for a @cssdisplay JSDoc custom tag.
  * We used to add this manually in the description, now we have a proper tag to document this aspect.
* `add-github-source-in-description`: adds a link to source file on GitHub in the description
  * We used to add this manually in the description, this is now automagic!
* `list-images`: adds a list of images used by the component to the description
  * This is a nice bonus as a user of the component to see this.

Those plugins were really fun to create.
You can see the source in the `cem` folder.

With this new analyzer and those custom plugins, we can now generate a `custom-elements.json` that follows the new CEM format.
It will be released along the components on npm with the next version.

### Integrating the manifest with Storybook

Our Storybook setup is not yet compatible with this new CEM format.
While we wait for support, we wrote a simple transformer.
It takes the `custom-elements.json` generated by CEM analyzer and produces a JSON using WCA's custom format that our Storybook understands.
This allowed us to remove WCA from the project and only rely on CEM analyzer.

The speed bump from 8 seconds to 2 seconds was also a good reason to enable the manifest generation in watch mode.
Now during dev, the docs in Storybook is always up-to-date.

## What's next?

Right now, we're documenting the types of our properties and events in the description.
This includes a lot of duplication and manual steps.
We would really like to create a common `d.ts` file with our interfaces that CEM analyzer could understand and use.

We'll be following the evolution of this format.
We're very interested in a few discussions:

* [Add readonly flag to properties](https://github.com/webcomponents/custom-elements-manifest/issues/34)
* [Add a field for "elementVersion"?](https://github.com/webcomponents/custom-elements-manifest/issues/47)
* [Add support for custom data](https://github.com/webcomponents/custom-elements-manifest/issues/38)
* [Add support for typed Custom CSS Properties](https://github.com/webcomponents/custom-elements-manifest/issues/68)
* [Allowed children for slots](https://github.com/webcomponents/custom-elements-manifest/issues/46)
* [Add recommended JSDoc tags](https://github.com/webcomponents/custom-elements-manifest/issues/42)

We'll also be watching the support for this format in standard Storybook and in the prebuilt version we're currently using.

FYI, we have an experiment in branch to automatically extract the default CSS display but it's still WIP.
