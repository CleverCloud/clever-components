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

Documentation for developers has also always been at the core of the project: if we want developers to be able to use our components in any context (with or without a JavaScript framework) we need to document APIs for every component we produce.

We mostly rely on `JSDoc` to document how to use our components.

Until now, we primarily documented public APIs of our components.
Recently, we have started documenting private methods and properties to improve the experience of contributors.
This makes the components easier to maintain.

The `JSDoc` comments of public APIs of our components (the class and its properties mainly) are processed by the `@custom-elements-manifest/analyzer`.
Component docs are part of the Custom Element Manifest.
The Custom Element Manifest content is formatted and displayed by Storybook.

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
 * @typedef {import('../my-type-file.types.js').ComponentStateLoaded} ComponentStateLoaded
 */
```

The `d.ts` technique has several advantages:

- The TypeScript syntax is a lot closer to JavaScript than `JSDoc` so it's very easy to understand what you're manipulating with an `interface` or a `type`.
- It is way easier to compose types and rely on [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html) or [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html#handbook-content) in a `d.ts` file than in `JSDoc` comments.

We hand-author `d.ts` files for most of our components.
These files usually contain types corresponding to properties and data other than JavaScript primitives and simple arrays.

## The road to a fully type checked codebase

### Why Type Checking a JS codebase?

Even if we already had `JSDoc` comments and `d.ts` files, our codebase was not actually being type checked in our Editors or in CI.

At the beginning of the project, public docs were enough, especially for UI components because their APIs were very HTML friendly.
We mostly handled primitive types, simple arrays and objects and the team was only made of 1 member so basic conventions and linting were enough to avoid most mistakes.
The project grew with some fairly complicated components (`cc-env-var-*`, `cc-pricing-*`) and with it the team also grew from 1 member to 2, then 5, finally reaching 7 developers as of this writing.

As the team grew, we had more resources to work on Type Checking and also more incentives to do so.

Type Checking offers several advantages for growing teams:

- Avoiding mistakes when coding:
  - common mistakes related to basic JavaScript like forgetting that something may be `null` / `undefined`,
  - component and lib API mistakes where you think some lib expects `{ logo: string; }` but it actually expects `{ data: { logo: string; } }` for instance,
- Catching mistakes in our docs:
  - some of our docs referred to Types that did not match what was actually used by the code. This happened because there was nothing checked the relationship of the code and the `JSDoc` we produced.
- Easing refactoring:
  -

- with pure JS + public docs, if you are not the one who produced the code or if you don't remember, you have to read the docs to understand the API, and then you have to remember it while coding.
- as the codebase grows, the number of things you have to keep in mind grows and the chances you make a mistake increase accordingly,
- with type checking :
  - in many cases types + good naming can replace words and long comments,
  - you get autocomplete as you code,
  - you get errors if you make mistakes,
  - you get guidance (although TypeScript errors are often cryptic when you're not used to it) on how to correct your mistakes.

Basically, you don't have to keep the whole codebase in mind.

But this is only one part of what Type Checking brings. You also get:
- easier to navigate the codebase in your editor (find references, go to function). These features already exist without Type Checking but they are usually less reliable and powerful without it,
- easier to refactor your codebase. Types allow you to link your codebase so that the compiler is able to see how parts of your code interact together and which parts depend on which. This means the refactoring (renaming, moving, etc.) is a lot more powerful.
  - we have good examples in our codebase: stories consume components so if you rename a component prop, you need to rename it as well in the story file. This was cumbersome, easy to get wrong or even forget. With Type Checking you get errors if you forget but more importantly, renaming the prop should also rename all it's references, including in stories.
  - the same can be said for our translations where you had to remember the translation key and remember arguments and their parameters. With type checking, you get autocomplete for translation keys as well as errors if you provide the wrong arguments.


### How to Type Check an already existing JS codebase?

- rework our `tsconfig.json` to enable Type Checking in our editors (`"allowJs": true`, `"checkJs": true`),
  - decide how strict we wanted to be by enabling / disabling specific options,
- add a `tsconfig.ci.json` to enable Type Checking in CI context,
  - only files that fully pass type checking, including their dependencies, can be added to the list of files checked in CI,
  - when we started, only one file could be added to this file.

The strategy was to progressively work on Type Checking when reworking components and add them to the CI type checking one by one.


TODO:

- states ~DONE (exemples à améliorer)
- lit plugin?
- What it enables within IDE => TODO SECTION REFACTORING => en vrai p-e qu'on s'en fout ?
- What about CI? => Pas grand chose à dire => si, on peut dire qu'on a une stratégie de l'activer partout côté IDE, pour corriger au fur et à mesure l'existant et on active au fur et à mesure côté CI
- TS with JSDoc vs pure typescript possibilities => Section limits of JSDocs
- les problèmes des hand authored d.ts => Section limits of `d.ts`
- le pourquoi on est pas libres de notre version de TypeScript ?
- stuff we follow with:
  https://tc39.es/proposal-type-annotations/

- Peut-être split en :
  - TypeChecking
    - Pure JS, DONE
    - JSDoc, DONE
    - Type Checking JS files TODO => checkjs
      - why type checking => type safety is nice but mostly catches silly mistakes, the more our APIs grow, the more errors it catches
    - Hand authored `d.ts` files
    - limits of JSDoc
    - Why having a pure JS base code is cool (easy dev debug, low config overhead)
    - Type Checking progressively
      - enabling in IDEs
      - adding to CI progressively
      - TODO: exposing types
        - stop minifying?
        - produce `d.ts` files?
