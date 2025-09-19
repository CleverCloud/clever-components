---
kind: '👋 Contributing'
title: 'Writing stories'
---

# Writing stories

We're trying to enforce a few names/titles for our stories.
This is a great way for developers not to forget cases like error, empty, skeleton/loading...
This is also a great way for users to recognize patterns in our components.

## General rules and reminders

* Try to show off your components in all the different possible situations (data-wise) with a set of fake data that resemble what could happen in production.
* If you handle user inputs, think about cases where the text is very long.
* Think about what happens if it fails (error in general).
* Think about what happens while we're waiting for the data (loading, updating...).
* Think about what happens if there are no data.
* Try to show off a time-simulation like "loading" then "data is loaded".

## Generic names

We want to keep consistency between our stories so we're proposing special names and prefixes:

* If you only have one story, name it `defaultStory`.
* If you have one main story, and a few other cases, name it `defaultStory`.
* ⌛ If you're showing off a component in it's "no data yet" state with a skeleton screen UI pattern, name it `skeleton`.
* ⌛ If you're showing off a component in it's "no data yet" state with a loading indicator, name it `loading`.
* 🕳 If you're showing off a component in it's "data loaded but empty data", start your story name with `empty`.
* 👍 If you're showing off a component with data loaded in different contexts, start your story name with `dataLoaded`.
* 📈 If you're showing off a component with data in a time-simulation like "loading" then "data is loaded", start your story name with `simulation`.
* 🔥 If you're showing off a component with an error, start your story name with `error`.

<cc-notice intent="info" message="If you need to specify some details about your story, use `with` and it will trigger parens in the displayed title."></cc-notice>

Examples:

* `errorWithLoadingIndicator` => 🔥 Error (loading indicator)
* `dataLoadedWithDisabled` => 👍 Data loaded (disabled)
* `simulationWithFoobarAttribute` => 📈 Simulation (foobar attribute)

Example:

```js
export const skeleton = () => { /* story code */ };
export const error = () => { /* story code */ };
export const empty = () => { /* story code */ };
export const dataLoaded = () => { /* story code */ };
export const simulations = () => { /* story code */ };
```

You'll end up with those stories (sorted in alpha order):

* 👍 Data loaded
* 🕳 Empty (no data)
* 🔥 Error
* 📈 Simulations
* ⌛ Skeleton (no data yet)

This is done automatically thanks to the `enhanceStoriesName` function within the `.storybook/manager.js` file.

## Using `makeStory`

Writing stories with plain HTML (with or without Lit) can become very verbose.
That's why we created a helper function called `makeStory`.
It provides several features to improve the whole writing/maintaining stories experience:

* Define multiple instances of the same component for one story
* Override the story name
* Specify a description for the story
* Specify some custom CSS for the story
* Provide raw DOM instead of component name and props if necessary
* Generate a simulation to show how a component behaves when going from one state to another
* Override the argument types

### Signature and types

Here are the type definitions for the `makeStory` helper function:

```ts
function makeStory (...options: Array<MakeStoryOptions>) { /* ... */ }

interface MakeStoryOptions {
  // Set the name of the component
  component?: string,
  // Control automated tests related to the story
  // you can disable accessibility tests or ignore some accessibility rules
  tests?: {
    accessibility: {
      enable: boolean;
      ignoredRules: Array<string>
    }
  },
  // Define the properties to set for each instance of the component
  items?: object[] | (): Array<object>,
  // Override the automatic name of the story
  name?: string,
  // Set a documentation/description for a story
  docs?: string,
  // Set some custom CSS for a story
  css?: string,
  // Use this instead of `items` if you want to define raw DOM directly
  dom?: (HTMLElement): HTMLElement,
  // See Present state changes with simulations
  simulations?: Array<(Array<HTMLElement>): void>,
  // See Override argument types
  argTypes?: object,
  // null => Displays components in a single column with a vertical gap (of 1em)
  // "flex-wrap" => Displays components next to each other and wrap them on multiple lines when necessary
  displayMode?: null | "flex-wrap",
}
```

### Basic usage

The `makeStory()` function will help you to present one or many instances of a given component.
It takes an object with at least the `component` and `items` properties:

* Use the `component` property to define the name of the component to present (ex: `cc-example-component`).
* Use the `items` property to define the number of instances of the component you want to present and which properties to assign to them.

Here's an example where we want to present one instance of the `<cc-example-component>` component with `one` set to `ONE` and `two` set to `false`.

```js
export const firstStory = makeStory({
  component: 'cc-example-component',
  items: [{ one: 'ONE', two: false }],
});
```

Here's an example where we want to present 2 instances of the `<cc-example-component>` with different values for the `two` property.

```js
export const secondStory = makeStory({
  component: 'cc-example-component',
  items: [
    { one: 'ONE', two: false },
    { one: 'ONE', two: true },
  ],
});
```

If you need those two stories in the same file, you can move common properties to an object and call `makeStory` with multiple arguments:

```js
// Common config
const conf = {
  component: 'cc-example-component',
}

export const firstStory = makeStory(conf, {
  items: [{ one: 'ONE', two: false }],
});

export const secondStory = makeStory(conf, {
  items: [
    { one: 'ONE', two: false },
    { one: 'ONE', two: true },
  ],
});
```

The `makeStory` function takes as many arguments as you need, they're merged with the last one winning.
This means this example:

```js
const confOne = { component: 'cc-example-component' };
const confTwo = { css: `cc-example-component { margin-botton }`, docs: 'the docs' };
const confThree = { docs: 'the real docs' };

export const storyWithManyArgs = makeStory(confOne, confTwo, confThree, {
  items: [{ one: 'ONE', two: false }],
});
```

is equivalent to this example:

```js
export const storyWithOneArg = makeStory({
  component: 'cc-example-component',
  css: `cc-example-component { margin-botton }`,
  docs: 'the real docs',
  items: [{ one: 'ONE', two: false }],
});
```

<cc-notice intent="info" message="You can also provide a function to `items` as long as it returns the same kind of array of objects."></cc-notice>

This is very handy when you deal with dates and want to make sure the properties are generated when the story is rendered.

```js
export const storyWithItemsAsFunction = makeStory({
  component: 'cc-example-component',
  items: () => [{ isoDate: new Date().toISOString() }],
});
```

### Override story name

Most of the time, you won't need to specify a custom story name because Storybook will use the `enhanceStoryName()` helper function.
If you really need to override the story's name, you can do it with the `name` property.

```js
export const storyWithName = makeStory({
  component: 'cc-example-component',
  name: 'Custom story name',
  items: [{ one: 'ONE', two: false }],
});
```

### Set a description

We should use this more often in this project, but you can specify a documentation/description for each story with the `docs` property.
It accepts markdown, and it will be displayed in the docs page above the story.

```js
export const storyWithDocs = makeStory({
  component: 'cc-example-component',
  docs: `This is an **awesome** description with:

* some markdown
* list items
  `,
  items: [{ one: 'ONE', two: false }],
});
```

### Set some custom CSS styles

Sometimes you will need to use custom CSS styles for your stories.
Here's an example where we want to present 2 instances of our component, separated by a `1em` margin.

```js
export const storyWithCss = makeStory({
  component: 'cc-example-component',
  css: `
    cc-example-component {
      margin-botton: 1em;
    }
  `,
  items: [
    { one: 'ONE', two: false },
    { one: 'ONE', two: true },
  ],
});
```

### Use raw DOM

In some situations, you will prefer raw DOM over the component instantiation.
You can do this with the `dom` function.
Here's an example where we define some raw HTML inside the container of the story.

```js
export const storyWithCss = makeStory({
  dom: (container) => {
    // Add anything you need in the container element
    container.innerHTML = `<h1>Hello</h1>`;
  },
});
```

### Present state changes with simulations

With stories, you can present a component in any given state.
Sometimes, it's useful to present how a component behaves when it changes from one state to another.
You can do this with the `simulations` property.
Here's an example where we start with 2 instances of our component.
After 2 seconds, the first one sees its `two` property evolve to true and the second one gets an error.

```js
export const storyWithSimulations = makeStory(conf, {
  items: [
    { one: 'ONE', two: false },
    { one: 'ONE', two: false },
  ],
  simulations: [
    storyWait(2000, ([component, componentError]) => {
      component.one = 'ONE OK';
      component.two = true;
      componentError.one = 'ONE ERROR';
      componentError.error = true;
    }),
  ],
});
```

* The `simulations` array can take as many async functions as you need, they will all be executed.
* The `storyWait()` function can help you to wait before applying a state change to your components.
  * The first argument is the delay in milliseconds.
  * The second argument is the callback, it will be called with the instances of the component in the same order they were defined in the `items` property.

### Override argument types

If you want, you can override the argument types of the story to improve the controls with the `argTypes` property.
See https://storybook.js.org/docs/web-components/api/argtypes for more details.

Here's an example where we provide a 2-choice radio input for the `one` property:

```js
export const storyWithSimulations = makeStory(conf, {
  argTypes: {
    variant: {
      options: ['aaaaaa', 'bbbbbb'],
      control: { type: 'radio' },
    },
  },
  items: [{ one: 'ONE', two: false }],
});
```

### Change the default display

By default:

* components are displayed in a single column with a vertical gap (of 1em),
* the container's width is limited (70em).

You can trigger an "inline" mode where components are displayed next to each other and wrap them on multiple lines when necessary with this:

```js
export const storyWithInlineMode = makeStory(conf, {
  displayMode: 'flex-wrap',
  items: [
    { one: 'ONE', two: false },
    { one: 'ONE', two: false },
  ],
});
```

In some situations, it's better to override the default limited width of the story container.
You can target the container with `:host` like this:

```js
export const storyWithFullWidthContainer = makeStory(conf, {
  // language=CSS
  css: `
    :host {
      max-width: 100% !important;
    }
  `,
  items: [
    { one: 'ONE', two: false },
    { one: 'ONE', two: false },
  ],
});
```

## Manage visual tests

Most component story files are tested automatically to check for visual changes through Web Test Runner.

These visual tests are managed directly within the story files themselves through configuration options.

The tests are run in CI when you add the `run-visual-tests` label to a PR.

<cc-notice intent="warning" message="By default, visual tests are disabled in stories containing simulations"></cc-notice>

### How to disable visual tests for a specific story?

To disable accessibility tests in a story file, you need to add a `tests` property to the story configuration.
You can disable tests either for all stories in a component or for individual stories.

### Disable for all stories in a component

```javascript
// cc-example-component.stories.js

const conf = {
  component: 'cc-example-component',
  tests: {
    visual: {
      enable: false,
    }
  }
};

export const myStory = makeStory(conf, {
  items: [...]
});
```

### Disable for a specific story

```javascript
// cc-example-component.stories.js
const conf = {
  component: 'cc-example-component',
};

export const myStory = makeStory(conf, {
  tests: {
    visual: {
      enable: false,
    }
  },
  items: [...]
});
```

## Manage accessibility tests

Most component story files are tested automatically to check for accessibility issues through Web Test Runner.
You only need to create test files if you want to test aspects of a component other than its stories.

These accessibility tests are managed directly within the story files themselves through configuration options.

<cc-notice intent="warning" message="By default, accessibility tests are disabled in stories containing simulations"></cc-notice>

### How to disable accessibility tests for a specific story?

To disable accessibility tests in a story file, you need to add a `tests` property to the story configuration.
You can disable tests either for all stories in a component or for individual stories.

#### Disable for all stories in a component

```javascript
// cc-example-component.stories.js

const conf = {
  component: 'cc-example-component',
  tests: {
    accessibility: {
      enable: false,
    }
  }
};

export const myStory = makeStory(conf, {
  items: [...]
});
```

#### Disable for a specific story

```javascript
// cc-example-component.stories.js
const conf = {
  component: 'cc-example-component',
};

export const myStory = makeStory(conf, {
  tests: {
    accessibility: {
      enable: false,
    }
  },
  items: [...]
});
```

This is particularly useful for components that are purely for layout purposes or don't implement any semantics or interactions.

### How to ignore specific accessibility rules

To ignore specific accessibility rules in a story file, you can use the `ignoredRules` property in the accessibility test configuration.
You can ignore rules either for all stories in a component or for individual stories.

#### Ignore rules for all stories in a component

```javascript
// cc-example-component.stories.js
const conf = {
  component: 'cc-example-component',
  tests: {
    accessibility: {
      enable: true,  // keep tests enabled
      ignoredRules: ['color-contrast']  // specify rules to ignore
    }
  }
};

export const myStory = makeStory(conf, {
  items: [...]
});
```

#### Ignore rules for a specific story

```javascript
// cc-example-component.stories.js
const conf = {
  component: 'cc-example-component',
};

export const myStory = makeStory(conf, {
  tests: {
    accessibility: {
      enable: true,  // keep tests enabled
      ignoredRules: ['color-contrast']  // specify rules to ignore
    }
  },
  items: [...]
});
```

This is useful when you need to run accessibility tests but want to exclude specific rules for valid exceptions or while working on fixes.
