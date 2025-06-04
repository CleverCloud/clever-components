---
kind: '📌 Architecture Decision Records'
---

# ADR 0026: Introducing Prettier as a formatter

🗓️ 2024-06-13 · ✍️ Mathieu Degand

This ADR explains why we decided to introduce Prettier while migrating our linting tools (ESLint/Stylelint) to their latest version.

## Context

One year ago we made the decision to add Stylelint to our components library. You can find the how and why in the [ADR](📌-architecture-decision-records-adr-0023-adding-stylelint--docs).
At that time Stylelint was in version `14`ish and is now in version `16` as of this writing.
During a meeting while discussing versions of the tools we use, we decided to take a look at the updates and the feasibility to update them to the latest version.
And here came the problem: linters don't (want to) format anymore.

That's the case for Stylelint, that decided to deprecate format rules in version `15`, while removing them all in the latest version (16).
But that's also the case for ESLint that made the same decision.
In fact most if not all of the linters tend to switch to not format the code now.

Thus said we took the decision to handle the subject on our side and find a formatter before updating both ESLint and Stylelint.
Another reason was that while we had some basic formatting conventions, it wasn't relying on any tool except our IDEs which could lead to inconsistencies in our codebase.

## Formatters study

Before choosing a formatter we had to test some in order to find the one that would suit us best.
You'll find below the ones that we tried and some explanations....

### Biome

Biome is a toolchain written in Rust that can both format and lint but also more. See [Biome's website](https://biomejs.dev/) for more information.

#### Pros

- Biome is multipurpose, it has a formatter, a linter and more.

#### Cons

- It is opiniated, which means you can't really override things to match your need.
- It only has some default agnostic formatting options.
- While being multipurpose is a pro, it's also a con. If you want to use only one feature, you'll still need to get the whole package and deactivate the features you don't need.

While we could have chosen to go for Biome as a formatter, and maybe go even further and choose it as a linter too, there are a few reasons why we decided not to go for this solution.

- As a linter, there's not a lot of options and it can't check our CSS, so that's a clear no go.
  - Note: Biome can't check our CSS because it only check for whole CSS files and is unable to check CSS in JS files.
- If we wanted to only go for the formatter, we still had to get everything and deactivate features we didn't need/want. (formatter, analyzer..)
- Biome has the same philosophy as Prettier for the formatting but Prettier is more known and used for now.

### dprint

From [dprint's website](https://dprint.dev/):

> A pluggable and configurable code formatting platform written in Rust.

#### Pros

- Lot of options.
- You can develop plugins.
- If you want to develop plugins, there's a rust SDK.

#### Cons

- Even though it's possible to write plugins in another language, resources about this are sparse. It means you better be proficient with Rust.

### Prettier

[Prettier](https://prettier.io) is an opiniated code formatter.

#### Pros

- Can format both JS, CSS, template literals in one take.

#### Cons

- There are not a lot of options which is justified by the `opiniated formatter` logic.

Prettier is the option we chose to use, you can find more information about the why within the dedicated section below.

### js-beautify

#### Pros

- Has integrations with IDEs

#### Cons

- Unsure about the future of the maintenance ([See github README](https://github.com/beautifier/js-beautify?tab=readme-ov-file#contributors-needed))
- Can over-format

### Others

- While we knew all these tools existed we wanted to know what Lit users were using
  - Knowing that we asked the Lit discord's what they were using
    - Someone told us that they were using the new `Stylistic` package for ESLint that keeps formatting rules
    - They were also using a Prettier plugin for CSS
    - While it seemed a good idea at first, you'll find why it wasn't adapted to our case below.

## Solution

### Why did we choose Prettier?

We decided to go for Prettier for various reasons:

- It is widely used and maintained.
- Has integration with IDEs.
- It enforces code style. Other than our internal conventions we didn't have a proper formatter enforcing.

Note: As we haven't updated ESLint yet, see details on the dedicated section below, we've added the Prettier ESLint plugin so that ESLint formatting rules doesn't conflict with Prettier.

### Why didn't we use ESLint Stylistic?

At some point we considered going for the `stylistic` package for ESLint to keep our usage.
While it would have been great, this wouldn't solve the lack of formatter for Stylelint.

Considering this, we tried to use the `stylelint-prettier` plugin to format only our CSS.
However, we couldn't do that because:
`postcss-lit` uses babel and if you use that parser `stylelint-prettier` will just skip your file.
So we tried to force Prettier to use the `css` parser instead for Stylelint but that resulted in some errors.

Knowing that we couldn't use this plugin and thus not having a formatter for our Stylelint/CSS part we decided not to use Stylistic.
Moreover, if we wanted to use both ESLint with Stylistic and prettier for the CSS it would have caused some conflicts.

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

### Why didn't we update ESLint (for now)?

With the update of Stylelint and the introduction of Prettier, we also considered to update ESLint to version 9. However, after some testing, we have decided to hold it off for now.

But why?

- Currently we're using some plugins that as of the time of this ADR writing have not been updated yet.
- ESLint has changed its configuration file format which needs to be migrated.
- The new version is quite recent for now.

Considering all of this, we decided to pause the migration to the version 9 for now until plugins are updated or that we have to consider another way.

### What's next?

- We need to check Prettier plugins system to see if we could adapt some rules to our liking.
- We need to keep an eye out on ESLint to migrate it to the latest version, which means:
  - Migrating to the new flat config.
  - Updating the plugins nor find an alternative if the plugins aren't maintained anymore.
  - Getting rid of the Prettier plugin and remove all the deprecated formatting rules.

## Resources

- [Stylelint blog post on deprecating formatting rules](https://stylelint.io/migration-guide/to-15#deprecated-stylistic-rules)
- [ESLint blog on deprecating formatting rules](https://eslint.org/blog/2023/10/deprecating-formatting-rules/)
