kind: '📌 Architecture Decision Records'
---
# ADR 0026: Introducing Prettier as a formatter

🗓️ 2024-06-13 · ✍️ Florian Sanders


This ADR tries to explain why we decided to introduce Prettier while migrating our linting tools (ESLint/Stylelint) to their latest version.

## Context

One year ago we made the decision to add Stylelint to our components library. You can find the how and why on the [ADR]().
At that time Stylelint was in version `14`ish and is now in version `16` as today writing.
On a meeting while discussing versions of the tools we use, we decided to take a look at the updates and the faisability to update them to the latest version.
And here came the problem: linters don't (want to) format anymore.

That's the case for Stylelint, that decided to deprecate format rules in version `15`, while removing them all in the latest version (16).
But that's also the case for ESLint that made the same decision.
In fact most if not all of the linters tend to switch to not format the code now.

Thus said we took the decision to handle the subject on our side and find a formatter before updating both tools. (ESLint and Stylelint)
Another reason was that while we had some basic formatting convention, it wasn't relying on any tool except our IDEs which could led to inconsistency in our codebase.

## Formatters study

Before choosing a formatter we had to test some in order to find the one that would suit us the most.
You'll find below the ones that we tried and some explanations....

### Biome

Biome is a toolchain written in Rust that can both format and lint but also more. See [Biome's website](https://biomejs.dev/) for more information.

#### Pros

- Can both format and lint.

#### Cons

- It is opiniated, which means you can't really override things to your need.
- It only has some default agnostic formatting options.
- Does a lot of things behind formatting.

The fact that Biome formatting is pretty much equal to Prettier, and that you have to get everything even if you're using only the formatter, made us not consider it.

### dprint

From [dprint's website](https://dprint.dev/):

> A pluggable and configurable code formatting platform written in Rust.

#### Pros

- Lot of options.
- You can do plugins.
- If you want to develop plugins, there's a rust SDK.

#### Cons

- If you're not proficient in Rust, there's not a lot of resources to write plugins from another language, even though it's possible.

### Prettier

[Prettier](https://prettier.io) is an opiniated code formatter.

#### Pros

- Can format both JS, CSS, template literals in one take.

#### Cons

- There's not a lot of options.
  - It is justified by the `opiniated formatter` logic.

Prettier is the option we chose to use, you can find more information about the why on the dedicated section below.

### js-beautify

#### Pros

- Has integrations with IDEs
- Present on a lot of website

#### Cons

- Unsure about the future of the maintenance ([See github README](https://github.com/beautifier/js-beautify?tab=readme-ov-file#contributors-needed))
- Can over-format

### Others

- While we knew all these tools existed we wanted to know what Lit users were using
  - Knowing that we asked the Lit discord's what they were using
    - Someone told us that they were using the new `Stylistic` package for ESLint that keeps formatting rules
    - They were also using a Prettier plugin for CSS
    - While it seemed a good idea at first, you'll find why it wasn't adapted to our case below.

## Investigation after Lit Discord's question (TODO: remove this)

- I have asked the Lit Discord's to know if some users used specific tools to format their Lit components
  - It seems like they're using a `Stylistic` package that should maintains the deprecated rules
  - However, as the new ESLint version is quite new (04-05-2024) there are a lot of packages which are not working on version 9
    - I suggest that we don't migrate to version 9 until some of the plugins are updated or that we find another formatter
  - About Stylelint:
    - Version 15 deprecated its formatting rules, while removing them from version 16
    - Processors have been removed and changed to `customSyntax`
      - You can have multiple of them for different purposes
        - e.g: `postcss-lit` for `.js` component files
        - e.g: `postcss` for `.css` files
      - This introduction made the Stylelint `postcss-css-in-js` processor/plugin obsolete.
        - Luckily there's now a `customSyntax` for

## Solution

### Why did we chose Prettier?

We decided to go for Prettier for various reasons:

- It is widely used and maintained.
- Has integration with IDEs.
- It enforces code style. Beside our internal conventions we hadn't a proper formatter enforcing.

Note: As we didn't update ESLint yet, see details on the dedicated section below, we added the Prettier ESLint plugin so that ESLint formatting rules doesn't conflict with Prettier.

### Why didn't we use ESLint Stylistic?

At some point we considered going for the `stylistic` package for ESLint to keep our usages.
While it would have been great, this wouldn't solve the lack of formatter for Stylelint.

Considering this, we tried to use the `stylelint-prettier` plugin to format only our CSS.
However, we couldn't do that because:
`postcss-lit` uses babel and if you use that parser `stylelint-prettier` will just skip your file.
So we tried to force Prettier to use the `css` parser instead for Stylelint but that resulted in some errors.

Knowing that we couldn't use this plugin and thus not having a formatter for our Stylelint/CSS part we decided not to use Stylistic.
Moreover, if we wanted to use both ESLint with Stylystic and prettier for the CSS it would have caused some conflicts.

### Update of Stylelint

- Like ESLint, Stylelint version 15 got rid of its formatting rules.
- Now, that Prettier handles the formatting we considered updating Stylelint to its latest version.

For this we did:

- Update the Stylelint version.
- Got rid of the `postcss-css-in-js` custom syntax as it's now deprecated.
  - Decided to use the dedicated `postcss-lit` syntax instead.
- Removed our idiomatic CSS properties order.
  - We took this decision because the package was/will not be maintain(ed).
  - We chose to use the `stylelint-order` package instead and use an alphabetical order.
- Removed all the Stylelint formatting rules from our configuration file.

### Why we didn't update ESLint yet?

With the update of Stylelint and the introduction of Prettier, we also considered to update ESLint to version 9. However we decided after some tests to not do it yet.

But why?

- Currently we're using some plugins that as of the time of this ADR writing have not been updated yet.
- ESLint has changed its configuration file which needs to be migrated.
- The new version is quite recent for now.

Considering all of this, we decided to pause the migration to the version 9 for now until plugins are updated or that we have to consider another way.

## TODO

- Why did we chose Prettier?
- Why didn't we use ESLint Stylistic?
- Update of Stylelint
- Why didn't we update ESLint yet?
- What's next?

## Resources

- Stylelint blog on format
- ESLint blog on format
- Biome
- Prettier
- JSbeautify
- Dprint
