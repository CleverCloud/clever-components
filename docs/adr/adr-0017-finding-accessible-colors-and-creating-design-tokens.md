---
kind: '📌 Architecture Decision Records'
---

# ADR 0017: Finding accessible colors and creating Design Tokens

🗓️ 2021-04-07 · ✍️ Florian Sanders

## The context

We started the Clever Components project as a library of components with no design centralisation and only few shared styles.

This was a deliberate decision.
Trying to blindly follow the [DRY (Don't Repeat Yourself)](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) principle too early often leads to premature optimisation.
Instead, we went for something similar to [WET (Write Everything Twice)](https://dev.to/wuz/stop-trying-to-be-so-dry-instead-write-everything-twice-wet-5g33).
We decided to duplicate style variables such as colors or spacings in all our components, while trying to always use the same values everywhere.
The idea was to wait until we had more components before trying to figure out the right way to manage shared style variables.
This allowed us to build a solid base of essential components quickly.
Clearly, this project has been ready for this kind of refactoring for more than a year.

Regarding the initial decisions for the colors, the idea was to have a set of components that don't look and feel too different from the UI of the console.
That's why we reused the same colors.
We wanted to wait before we had most of the console implemented with these new components and then switch to new and improved colors.
This was too optimistic, important improvements on contrast ratios could have been addressed sooner.

As more components are being developed and more people contribute, the need for centralised design decisions and ways to enforce design consistency become essential.

## The problem

### Accessibility

The first issue we wanted to tackle was about the **contrast ratios of some of our most used colours**.

Our blue, green and red colors were all below the 3:1 contrast ratio required for big text and way below the 4.5:1 required for regular text.

These colors are **used in all the components**, especially inside buttons which are found everywhere.

### Consistency & Maintainability

As we listed all the colors used accross our components, we found out that there were more than 10 shades of our main colors being used with **no consistency and no specific reason**.

We also found out that **different color code systems were being used with no reason**.
Sometimes the same color could be used with hex code inside a component and hsl in another.

This made even more difficult to change all the colors at once.

### Theming & Customisation

Since components did not share variables for colors, it was **impossible to modify / adjust them all at once**.

The possibility to **modify all the colors at once** is the first essential step towards **theme customisation** that would allow for a dark mode for instance.

## The Solution

### Find new accessible colors

First, we needed to find accessible colors to replace our blue, green, orange and red colors.

#### Criteria

Colors we selected needed to:
* reach at least 4.5:1 of contrast ratio when associated with white,
* match other colors used in the legacy parts of the console,
* draw attention without standing out too much.

NOTE: We selected colors that reached **at least 4.5:1 of contrast ratio when associated with white**.
This is because we wanted colors that **could be used both with big and regular texts**.
Having colors that can only be used with big texts (3:1 of contrast ratio) would have only made things more complicated.

That is why we went for darker colors and avoided adding too much saturation so that new colors would not stand out too much from legacy colors still existing in the Console (menu background for instance).

#### Tools

To find these colors, we relied on the [Color Review](https://color.review/check/FEDC2A-5A3B5D) tool that we found thanks to [Stéphanie Walter's blog that lists many other great tools](https://stephaniewalter.design/blog/color-accessibility-tools-resources-to-design-inclusive-products/).

#### Number of colors
We chose to only keep 2 shades of our main colors (blue, green, orange and red):
* the main color (to be used as a text color or a plain background that would make it stand out from the rest),
* a very light shade of the color (to be used for background only, to make a text stand out but not too much).

As for the grey color, we needed at least 10 shades since it is used in many different cases (2 shades for text, 2 shades for background, and shades for the differents states of the background like disabled, active, hovered, etc.).

We know we may need to **add more shades or colors later on but we want to only select and add them when needed**.

### Create Design Tokens

The Design Token concept comes from the Salesforce team and has been defined by them as follows:
> Design tokens are the visual design atoms of the design system — specifically, they are named entities that store visual design attributes. We use them in place of hard-coded values (such as hex values for color or pixel values for spacing) in order to maintain a scalable and consistent visual system for UI development.

Source: [salesforce - Design Tokens](https://www.lightningdesignsystem.com/design-tokens/).

Our work on Design Tokens is based on two articles:
* [Design Tokens - What are they & how will they help you? by Lukas Oppermann](https://lukasoppermann.medium.com/design-tokens-what-are-they-how-will-they-help-you-b73f80f602ab)
* [Naming Tokens in Design System by Nathan Curtis](https://medium.com/eightshapes-llc/naming-tokens-in-design-systems-9e86c7444676)

These articles helped us grasp the concept of Design Tokens and find an architecture / strategy that would fit our needs.

NOTE: Color Design Tokens are only the first step, see "What's next" section.

#### No abstraction level

Most of the examples we came accross insisted on building Design Tokens that were **Technology Agnostic and relied on tools to transform tokens into variables** that could be consumed with each specific technology (Web, Native mobile platforms, etc.).

This made sense for very big projects distributed accross several different platforms but our project is a little bit different:
* Our team is only made of developers and we don't use any specific design tool,
* Our components are only for the Web and as close as possible to the standards.

For these reasons, we chose to **only rely on CSS variables and avoid using additional tools** like [Style Dictionary](https://amzn.github.io/style-dictionary/#/) that would only have added more complexity with no actual benefits.
If necessary, this is something we could easily reconsider later on.

#### Variable naming & architecture

When creating our variables, we tried to think as much as possible about Developer Experience, theming and customisation.

The [Design Tokens - What are they & how will they help you?](https://lukasoppermann.medium.com/design-tokens-what-are-they-how-will-they-help-you-b73f80f602ab) article helped us a lot to build a system that could scale and allow for customisation later on.
In this article, the author distinguishes two kind of tokens:
* "choices" - our colors.
For instance:
```css
:root {
  --color-black: #262626;
}
```
* "decisions" - implementations of our colors.
For instance:
```css
:root {
  --color-text-default: var(--color-black);
}
```

Choices should **never be used directly inside components**.
They are to be used as values for **"Decisions" variables** which in turn are to be used inside components.

Creating and using "Decisions" variables has several advantages:
* If named correctly, **"Decisions" can guide developers and avoid mistakes**.
For instance, with `--color-text-default`, the developer knows that this color is to be used for text and not background, and that it represents the default color for text.
* These token names are not related to their value.
**Their name is still valid even if you change their value**, especially when planning for a dark mode.
For instance, it does not matter whether `--color-text-default` is black or white, this variable value can be overridden without any problem.
Whereas overriding `--color-black` value with a white color value would make the things very confusing for developers.
* We can **enforce some kind of basic accessibility rules for color usage**.
For instance, since most of the lightest shades of our colors are not contrasted enough to be used with our default (white) or neutral (light grey) backgrounds, there is no "Decisions" variable referring to this color for text, only as a background.

## What's next ?
### Accessibility
* Texts and icons used in the `cc-tile-instances` component are still legacy and not contrasted enough.
This will be handled during the scalability rework (see [issue #407](https://github.com/CleverCloud/clever-components/issues/407)).
* Focus styles and colors.
* Icon colors (status of the apps / addons used in the menu and dashboards).

### Theming & customisation
* Allow for customisation and theming.
This means we allow external override of our "Decisions" variables.
To do so, we may need to switch from defining CSS inside JavaScript template strings with Lit to using CSS files.
* Enforce the use of default background and default text colors inside the components.
At the moment these are not used (with some exceptions) because we provide no way to customise their values.
Considering this, it is simpler to let developers define the default text and background of our components by simply not setting them inside components.
They inherit these from their parents.
This will be changed when we allow these values to be customised.

### Design tokens
Colors were only the first set of Design Tokens.
Others are listed in the [issue #398](https://github.com/CleverCloud/clever-components/issues/398).

These design tokens will need to be documented once they are customisable.

We will also document the accessible combinations of our colors.
