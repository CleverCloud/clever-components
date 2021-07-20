---
kind: 🏠 Home
---
# Contributing guide

Welcome to this contributing guide!

In this document, we'll cover the different steps to go through to contribute a new component to this project.

## Prerequisites

To work on this project, you need:

* Git ([intructions on git-scm.com](https://git-scm.com/downloads))
* Node.js and npm ([intructions on nodejs.org](https://nodejs.org/en/download/))
* Any code editor or IDE but we recommend [WebStorm](https://www.jetbrains.com/webstorm/) or [Visual Studio Code](https://code.visualstudio.com/).
* A terminal to run commands

volta

## Getting started

You need to clone the project with git with:

```
git clone git@github.com:CleverCloud/clever-components.git
```

Once you're in the directory, you can install the dependencies with:

```
npm install
```

With these dependencies, you will be able to run the different tasks required to work on this project.
They are all described in the [`tasks.reference.md`](https://www.clever-cloud.com/doc/clever-components/?path=/docs/%F0%9F%93%8C-docs-web-components-guidelines-at-clever-cloud--page).

The most important task is running Storybook in dev mode with:

```
npm run storybook:dev
```

* read project structure reference

They are all described in the [`project-structure.reference.md`](https://www.clever-cloud.com/doc/clever-components/?path=/docs/%F0%9F%93%8C-docs-web-components-guidelines-at-clever-cloud--page).

## Design the component

* what needs to be displayed
* what needs to be interacted and produced by the user
* draw a wireframe
* think about inputs
* think about outputs
* think about use cases => stories
* wording & translations
* where do the data come from? auth? cache? => smart definition

## Write the stories

use the example

* defaultStory
* skeleton
* empty
* error
* dataLoadedWithFoo
* waiting
* simulations

## Write component

use the example

guidelines & checklist
  JS
  HTML/lit
  CSS
  i18n
  a11y
  JSDoc

mobile
i18n
a11y

explain the preview

## Check, lint, test

* unit test if necessary
* test on Firefox, Chrome & Safari (see reference)
* explain lint

## Build
