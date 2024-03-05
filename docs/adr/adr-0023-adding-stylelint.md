---
kind: '📌 Architecture Decision Records'
---

# ADR 0023: Adding Stylelint

🗓️ 2023-02-13 · ✍️ Mathieu Degand

## The context

Since the beginning of this component library, we've never had a dedicated tool to format our CSS and enforce some rules. 
We only had a custom ESLint plugin to sort our CSS declarations but that was pretty much it as referenced in [ADR 11](https://www.clever-cloud.com/doc/clever-components/?path=/docs/📌-architecture-decision-records-adr-0011-sorting-css-declarations--docs). 

However, in 2020 we found out that Stylelint was able to handle CSS in template literals. 

Thus, we decided to give it a try in 2022 when reworking and adapting our tools for the component library.

## Considered solutions

The first thing we had to consider was the config that we would use.

The config would allow us to enforce some style rules and standardize our CSS code formatting.

For this purpose, we did some tests, relying on the base configs first (*Recommended* and *Standard*).
Then we checked the *Airbnb* one, and finally, we tried to create our own config.

### Config

#### Recommended

*Recommended* is a premade configuration available by default with Stylelint.
You may choose it or create your own config.
Its main purpose is to avoid common CSS code errors, but it won't do anything else.
That means that it won't enforce any convention, format, or specific rules.

While it could have served as a base for our configuration we have decided not to go with it as it doesn't provide any base code format and some base rules.

#### Standard

The *Standard* configuration is provided by Stylelint too but as it is not present by default you must install it and add it as a dependency.
It is based on *Recommended*, but it improves on it by enforcing some conventions and formatting.

While *Standard* does what *Recommended* lacks (rules and formatting), we have decided to not use it as default. 
Instead, we chose to have a custom configuration based on the *Standard*. 
It allows us to override some rules we thought didn't match with our code style.

#### Airbnb

After trying the one provided by Stylelint we decided to check some that were available on the web to see if there were any popular ones and we saw that the one from Airbnb was quite popular or used. 
However, after checking it out we found that it was not using the latest version of Stylelint.
Indeed, it would take too much effort to make it work with the new version. 
Also, downgrading Stylelint was not something we wanted to make, so we decided to not choose it.


#### Custom

Finally, we tried to create a custom config by ourselves which is the solution we have chosen and is detailed in the `Solution` section below.

### Orders

#### Alphabetical

As the name suggests, we first considered just ordering our properties alphabetically.
While it was a good idea, we wanted a more logical order that isn't too complex, so we didn't choose this solution.

#### Idiomatic

This orders the CSS properties with:
1. the ones related to positioning,
2. the display and box model rules,
3. the other rules, ordered alphabetically.

You can find more info in the [Idiomatic CSS repository documentation](https://github.com/necolas/idiomatic-css#declaration-order)

## Solution

After some discussion with the team, we decided to take the `Standard` configuration to have some base rules and code formats and tweak it to our needs.
For this purpose, we used a tool named Stylelint config generator composed of 42 options (rules). 
For each rule it lets you choose between several alternatives that would suit you best. 
After that, we added the idiomatic order configuration to our own to have it as our CSS properties order.

This resulted in this config file:

```json
{
  "extends": ["stylelint-config-standard", "stylelint-config-idiomatic-order"],
  "plugins": [],
  "customSyntax": "@stylelint/postcss-css-in-js",
  "rules": {
    "indentation": 2,
    "string-quotes": "single",
    "no-duplicate-selectors": true,
    "color-hex-case": "lower",
    "color-hex-length": "short",
    "selector-combinator-space-after": "always",
    "selector-attribute-quotes": "always",
    "selector-attribute-brackets-space-inside": "never",
    "declaration-block-trailing-semicolon": "always",
    "declaration-colon-space-before": "never",
    "declaration-colon-space-after": "always-single-line",
    "declaration-colon-newline-after": null,
    "value-no-vendor-prefix": true,
    "number-leading-zero": "always",
    "font-weight-notation": "named-where-possible",
    "font-family-name-quotes": "always-unless-keyword",
    "comment-whitespace-inside": "always",
    "comment-empty-line-before": null,
    "rule-empty-line-before": "always-multi-line",
    "selector-pseudo-element-colon-notation": "double",
    "selector-pseudo-class-parentheses-space-inside": "never",
    "media-feature-range-operator-space-before": "always",
    "media-feature-range-operator-space-after": "always",
    "media-feature-parentheses-space-inside": "never",
    "media-feature-name-no-vendor-prefix": true,
    "media-feature-colon-space-before": "never",
    "media-feature-colon-space-after": "never",
    "no-descending-specificity": null,
    "no-empty-first-line": null,
    "declaration-block-no-redundant-longhand-properties": null,
    "no-missing-end-of-source-newline": null,
    "no-eol-whitespace": null,
    "property-no-vendor-prefix": null,
    "selector-class-pattern": [
      "^([a-z][a-z0-9]*)((-{1,2}|_{1,2})[a-z0-9]+)*$",
      {
        "message": "Expected class selector to be either kebab-case, kebab--case or snake__case"
      }
    ],
    "selector-id-pattern": [
      "^([a-z][a-z0-9]*)((-{1,2}|_{1,2})[a-z0-9]+)*$",
      {
        "message": "Expected id selector to be either kebab-case, kebab--case or snake__case"
      }
    ]
  }
}
```

While we won't dive into the configuration deeper, you can find a description of each rule on [the Stylelint website](https://stylelint.io/user-guide/rules). 
What we have done here is adding or overriding existing rules on the `Standard` configuration to best match our needs.

To run and check our styles on our component we created three commands in our `package.json`:

* `stylelint` which runs Stylelint and checks for errors,
* `stylelint:fix` which runs Stylelint and checks for errors and auto-fixes the ones that are auto fixable,
* `stylelint:ci` which runs Stylelint and checks for errors and formats the output for our GitHub actions CI.

The benefits of Stylelint are that we now have a coherent style across our component library code base and use the same formatting everywhere.
It also allowed us to get rid of the custom ESLint sort plugin which is done by Stylelint directly from now on. 

## Problems encountered

While we are satisfied with our current configuration we encountered some problems in the process with some rules.

### The whitespace rule

First, we had some problems with the whitespace rule [`no-eol-whitespace-rule`](https://stylelint.io/user-guide/rules/no-eol-whitespace/).
The purpose of this rule is not to have whitespace after a line ending (e.g: semicolon or empty lines). 
The problem with this is that the processor we use targets only the CSS inside template literals which means the backtick wasn't included.

This leads the code going from this:

```javascript
static get styles ()
{
  return [
    skeletonStyles,
    // language=CSS
    css`
        :host {
          display: block;
        }
    `,
  ];
}
```
to this:
```javascript
static get styles ()
{
  return [
    skeletonStyles,
    // language=CSS
    css`
        :host {
          display: block;
        }
`,
  ];
}
```

As you can see, the closing CSS backtick of the template literal isn't formatted correctly.
This is due to the rule only taking into account what's inside the backticks.
Therefore, the rule considers that the spaces before the closing backtick shouldn't be there and remove the correct formatting.
This led us to deactivate this rule for now. 

### Selector name case

We encountered another problem on the case policy applied on our CSS selectors.
Indeed, the `Standard` configuration we use wants the selectors to be written as `kebab-case`.
However, in our components we also used `kebab--case` and `snake__case`.

To resolve this problem we decided to override the rules [`selector-class-pattern`](https://stylelint.io/user-guide/rules/selector-class-pattern/) 
and [`selector-id-pattern`](https://stylelint.io/user-guide/rules/selector-id-pattern/) to match our needs which led us to the following rule:

```json
{
   "selector-class-pattern": [
      "^([a-z][a-z0-9]*)((-{1,2}|_{1,2})[a-z0-9]+)*$",
      {
        "message": "Expected class selector to be either kebab-case, kebab--case or snake__case"
      }
    ],
    "selector-id-pattern": [
      "^([a-z][a-z0-9]*)((-{1,2}|_{1,2})[a-z0-9]+)*$",
      {
        "message": "Expected id selector to be either kebab-case, kebab--case or snake__case"
      }
    ]
}
```

To make it work, we modified the regular expression that is directly provided on the Stylelint website to match our needs.
We also provided a custom message to know precisely what's happening otherwise we would just have had a generic message.

### Duplicate selectors on atoms

In our components that wraps and customises a native HTML element we have multiple CSS selectors of the native element. (e.g: `<cc-button>` wraps and customises a native `<button>`) 
We always have a `reset` one where we reset the native styles of the element and another one to style it to our needs.

The problem is that this is not allowed by the [`no-duplicate-selectors`](https://stylelint.io/user-guide/rules/no-duplicate-selectors/) rule which is part of the custom config we use.

Because we like the way we `reset default` and then `apply our styles` but also like the rule, we decided to ignore the rule on these specific selectors.

### No-descending-specificity

[No-descending-specificity](https://stylelint.io/user-guide/rules/no-descending-specificity/) is a rule that forces the order of the selectors within their specificity.
This means that if a selector has a lower specificity it should not be after one that has a higher specificity.

While this is a great rule we have decided to not use it. 
Indeed, with a blank project, it might be much more convenient to use it but in our case, it was very tricky and a mess to deal with our components so we deactivated it. 

You can find more info on CSS specificity:
* on the MDN: [MDN CSS specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)
* on the CSS tricks: [CSS tricks specificity](https://css-tricks.com/specifics-on-css-specificity/)

## What's next?

While we are happy with our configuration right now, in the future we might want to find a way to handle the whitespace rule problem explained above. 
We might also consider adding, changing, and tweaking rules to our needs in the future.

## Resources

* Stylelint config generator: [https://maximgatilin.github.io/stylelint-config/](https://maximgatilin.github.io/stylelint-config/)
* Stylelint: [https://stylelint.io/](https://stylelint.io/)
* Stylelint rules: [https://stylelint.io/user-guide/rules](https://stylelint.io/user-guide/rules)
* Stylelint configs:
  * Standard: [Stylelint standard config](https://github.com/stylelint/stylelint-config-standard)
  * Recommended: [Stylelint recommended config](https://github.com/stylelint/stylelint-config-recommended)
