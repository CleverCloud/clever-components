---
kind: '🏡 Getting Started'
title: 'Design tokens'
---

# Our design tokens

## What is a design token?

> The single source of truth to name and store a design decision, distributed so teams can use it across design tools and coding languages.

*Source: [Design Tokens Community Group - Glossary](https://www.designtokens.org/glossary/)*

## How are they implemented

Basically, it is a list of key/value pairs which are hardcoded inside our components.

They centralize our design decisions and allow us (among other things) to tackle the following related problematics:

- Accessibility
- Consistency & Maintainability
- Theming & Customisation

More on that in our [ADR "Finding accessible colors and creating Design Tokens"](https://www.clever-cloud.com/developers/doc/clever-components/?path=/docs/📌-architecture-decision-records-adr-0017-finding-accessible-colors-and-creating-design-tokens--docs).

## All design tokens list

As our design tokens only exist (for now) as CSS values, keys will be listed as their CSS custom property names.

### Color decisions

#### Text

| Key                                 | Default value        | Matching choice |
|:------------------------------------|:---------------------|:----------------|
| `--cc-color-text-danger`            | `--color-red-100`    | `#be242d`       |
| `--cc-color-text-default`           | `--color-grey-90`    | `#262626`       |
| `--cc-color-text-inverted`          | `--color-white`      | `#ffffff`       |
| `--cc-color-text-primary`           | `--color-blue-60`    | `#3569aa`       |
| `--cc-color-text-primary-highlight` | `--color-blue-70`    | `#0061bd`       |
| `--cc-color-text-primary-strong`    | `--color-blue-80`    | `#002c9d`       |
| `--cc-color-text-primary-strongest` | `--color-blue-100`   | `#012a51`       |
| `--cc-color-text-strongest`         | `--color-grey-100`   | `#0d0d0d`       |
| `--cc-color-text-success`           | `--color-green-100`  | `#098846`       |
| `--cc-color-text-warning`           | `--color-orange-100` | `#c15807`       |
| `--cc-color-text-weak`              | `--color-grey-80`    | `#404040`       |

#### Background

| Key                               | Default value          | Matching choice |
|:----------------------------------|:-----------------------|:----------------|
| `--cc-color-bg-danger`            | `--color-red-100`      | `#be242d`       |
| `--cc-color-bg-danger-hovered`    | `--color-red-30`       | `#fbc8c2`       |
| `--cc-color-bg-danger-weak`       | `--color-red-30`       | `#fbc8c2`       |
| `--cc-color-bg-danger-weaker`     | `--color-red-10`       | `#ffe4e1`       |
| `--cc-color-bg-default`           | `--color-white`        | `#ffffff`       |
| `--cc-color-bg-neutral`           | `--color-grey-10`      | `#f5f5f5`       |
| `--cc-color-bg-neutral-alt`       | `--color-grey-15`      | `#e7e7e7`       |
| `--cc-color-bg-neutral-active`    | `--color-grey-20`      | `#d9d9d9`       |
| `--cc-color-bg-neutral-disabled`  | `--color-grey-15`      | `#e7e7e7`       |
| `--cc-color-bg-neutral-hovered`   | `--color-grey-15`      | `#e7e7e7`       |
| `--cc-color-bg-neutral-readonly`  | `--color-grey-10`      | `#f5f5f5`       |
| `--cc-color-bg-primary`           | `--color-blue-60`      | `#3569aa`       |
| `--cc-color-bg-primary-hovered`   | `--color-blue-20`      | `#ccd4dc`       |
| `--cc-color-bg-primary-weak`      | `--color-blue-30`      | `#cedcff`       |
| `--cc-color-bg-primary-weaker`    | `--color-blue-10`      | `#e6eff8`       |
| `--cc-color-bg-primary-highlight` | `--color-blue-70`      | `#0061bd`       |
| `--cc-color-bg-soft`              | `--color-purple-light` | `#e0e0ff`       |
| `--cc-color-bg-strong`            | `--color-blue-100`     | `#012a51`       |
| `--cc-color-bg-success`           | `--color-green-100`    | `#098846`       |
| `--cc-color-bg-success-hovered`   | `--color-green-20`     | `#c3dab7`       |
| `--cc-color-bg-success-weak`      | `--color-green-30`     | `#baf0be`       |
| `--cc-color-bg-success-weaker`    | `--color-green-10`     | `#e3ffd6`       |
| `--cc-color-bg-warning`           | `--color-orange-100`   | `#c15807`       |
| `--cc-color-bg-warning-hovered`   | `--color-orange-20`    | `#d9d4ad`       |
| `--cc-color-bg-warning-weak`      | `--color-orange-30`    | `#fcf3b5`       |
| `--cc-color-bg-warning-weaker`    | `--color-orange-10`    | `#fff9cb`       |

#### Border

| Key                                  | Default value         | Matching choice |
|:-------------------------------------|:----------------------|:----------------|
| `--cc-color-border-danger`           | `--color-red-100`     | `#be242d`       |
| `--cc-color-border-danger-weak`      | `--color-red-20`      | `#facbc9`       |
| `--cc-color-border-neutral`          | `--color-grey-30`     | `#bfbfbf`       |
| `--cc-color-border-neutral-disabled` | `--color-grey-15`     | `#e7e7e7`       |
| `--cc-color-border-neutral-focused`  | `--color-grey-70`     | `#595959`       |
| `--cc-color-border-neutral-hovered`  | `--color-grey-70`     | `#595959`       |
| `--cc-color-border-neutral-strong`   | `--color-grey-50`     | `#8c8c8c`       |
| `--cc-color-border-neutral-weak`     | `--color-grey-15`     | `#e7e7e7`       |
| `--cc-color-border-primary-weak`     | `--color-blue-20`     | `#ccd4dc`       |
| `--cc-color-border-success-weak`     | `--color-green-20`    | `#c3dab7`       |
| `--cc-color-border-warning-weak`     | `--color-orange-20`   | `#d9d4ad`       |

### Margin decisions

| Key                                   | Default value  |
|:--------------------------------------|:---------------|
| `--cc-margin-top-btn-horizontal-form` | `1.6em`        |

### Focus outline decisions

| Key                         | Default value                    | Matching choice     |
|:----------------------------|:---------------------------------|:--------------------|
| `--cc-focus-outline`        | `var(--color-blue-60) solid 2px` | `#3569aa solid 2px` |
| `--cc-focus-outline-error`  | `var(--color-red-100) solid 2px` | `#c15807 solid 2px` |
| `--cc-focus-outline-offset` | `2px`                            |                     |

### Border radius decisions

| Key                          | Default value  |
|:-----------------------------|:---------------|
| `--cc-border-radius-default` | `0.25em`       |
| `--cc-border-radius-small`   | `0.15em`       |

### Form decisions

| Key                         | Default value |
|:----------------------------|:--------------|
| `--cc-form-controls-gap`    | `2em`         |
| `--cc-form-controls-indent` | `34px`        |
| `--cc-form-label-gap`       | `0.35em`      |

### Miscellaneous

| Key                          | Default value |
|:-----------------------------|:--------------|
| `--cc-opacity-when-disabled` | `0.65em`      |
