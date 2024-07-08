---
kind: '📌 Architecture Decision Records'
---
# ADR 0026: Enabling type checking

<!-- TODO: change the date -->
🗓️ 2023-03-.. · ✍️ Florian Sanders

## Pure JavaScript, no build steps required

The Clever Components project is a pure JavaScript project.

From the start, the project was designed with the following in mind:

- components should be able to run within the browser as is, without any build step,
- the build step is only here to optimize the code of the components.


## JSDoc to document component APIs

Documentation for developers has also always been at the core of the project: if we want developers to be able to use our components in any context (with or without a JavaScript framework) we need to expose documented APIs for every component we produce.

We mostly rely on `JSDoc` to document how to use our components.

Until now, we primarily documented public APIs of our components.
Recently, we have started documenting private methods and properties to improve the developer experience. This makes the components easier to maintain.

The `JSDoc` comments of public APIs of our components (the class and its properties mainly) are processed by the `@custom-elements-manifest/analyzer`. 
Component docs are part of the Custom Element Manifest and its content is displayed and formatted by Storybook.

## A tiny bit of TypeScript with hand-authored lib files

<!-- TODO: find an example of stuff you cannot do with JSDoc only -->
<!-- TODO: Non en fait il faut comparer comment on définit une interface via JSDoc vs dans un d.ts -->

`JSDoc` is a great start but when it comes to documenting objects and more complex data structures, you may need some help.

And what better than TypeScript to help you document complex types in JavaScript?

For instance, take the following `JSDoc`: 
```js
/**
 * @typedef ComponentStateLoaded
 * @prop {'loaded'} type
 * @prop {string[]} list
 */
```

Even for a very simple case like this, this syntax is fairly verbose and the type structure is not obvious.
Within a `d.ts` file, you could go for an interface instead:
```ts
interface ComponentStateLoaded {
  type: 'loaded';
  list: string[];
}
```

Then, within the `.js` file, you only have to import it:
```js
/**
 * @typedef {import('../my-type-file.d.ts').ComponentStateLoaded} ComponentStateLoaded
 */
```

The `d.ts` technique has several advantages:

- the TypeScript syntax is a lot closer to JavaScript than `JSDoc` so it's very easy to understand what you're manipulating with an `interface`.
- TypeScript `interface` can be merged => bof osef

We hand-author `d.ts` files for most of our components.
These files usually contain types corresponding to properties and data other than JavaScript primitives.

TODO:

- states
- rules we have decided to disable
- lit plugin?
- What it enables within IDE
- What about CI?
- TS with JSDoc vs pure typescript possibilities
- les problèmes des hand authored d.ts
- stuff we follow with:
  https://tc39.es/proposal-type-annotations/

