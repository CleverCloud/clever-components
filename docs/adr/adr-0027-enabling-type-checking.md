---
kind: '📌 Architecture Decision Records'
---
# ADR 0027: Enabling Type Checking

<!-- TODO: change the date -->
🗓️ 2023-03-.. · ✍️ Florian Sanders

## Pure JavaScript, no build steps required

The Clever Components project is a pure JavaScript project.

From the start, the project was designed with the following in mind:

- Components should be able to run within the browser as is, without any build step,
- The build step is only here to optimize the code of the components.

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

Even for a very simple case like this, the type structure is not obvious.
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

## Why Type Checking in the first place?

Even if we already had `JSDoc` comments and `d.ts` files, our codebase was not actually being type checked in our editors or in CI.

At the beginning of the project, public docs were enough, especially for UI components because their APIs were very HTML friendly.
We mostly handled primitive types, simple arrays and objects and the team was only made of 1 member so basic conventions and linting were enough to avoid most mistakes.
The project grew with some fairly complicated components (`cc-env-var-*`, `cc-pricing-*`) and with it the team also grew from 1 member to 2, then 5, finally reaching 7 developers as of this writing.

As the team grew, we gained more resources to work on Type Checking and also more incentives to do so.

With pure JS and public docs, if you are not the one who produced the code or if you don't remember, you have to read the docs to understand the API, and then you have to remember it while coding.
As the codebase grows, the number of things you have to keep in mind grows and the chances you make a mistake increase accordingly.

With Type Checking:
- You can replace long comments with good naming and good types,
- You get autocomplete as you code,
- You get errors if you make mistakes,
- You get guidance on how to correct your mistakes (although TypeScript errors are often cryptic when you're not used to it),
- You get improved code navigation with more reliable reference finding and function jumping,
- You get more robust refactoring capabilities since the compiler understands code relationships. For instance, renaming a component property also updates the relevant parts within story files.

## Why JSDoc and not TypeScript?

First off, using JSDoc doesn't mean we don't use TypeScript.
We only use the parts of TypeScript we need.

The TypeScript project is composed of many things:
- A bundler (to some extent),
- A transpiler,
- A syntax,
- A type checker.

We prefer having as little adherence to our dependencies as possible and relying on all the features of TypeScript would mean tying our codebase to this tool.

We already have a bundler.
We want our code to run as is within browsers so we don't want any transpiling.

This is why we only use TypeScript where we think it shines: as a Type Checker and as a syntax when JSDoc is not enough.

For us, this has huge benefits:
- The code we write today is almost guaranteed to work in the future without any build step,
- Breaking changes in TypeScript only impact our comments and docs, they can never break our codebase,
- The config for our project feels simpler to manage and maintain.

Just like bundlers, linters, or even automated tests, TypeScript is a developer tool.
It improves the Developer Experience and the code quality but it has very little to do with what we ship to browsers and users.
It doesn't produce any actual code used at runtime.

When coding, the code in our editors is exactly the same as the code run within our browser, debugging is a breeze.

## Things we don't quite like with the JSDoc syntax

JSDoc's main flaw is that it's fairly verbose.
Although this is a compromise we're willing to accept, there are a few cases where we'd love to see the syntax improve:
- Importing and using generics with JSDoc is tedious and inconvenient, as pointed out in the following issues:
  - [JSDoc doesn't support generics correctly - issue #56102 - TypeScript repository](https://github.com/microsoft/TypeScript/issues/27387)
  - [Allow to explicitly pass type parameters via JSDoc - issue #27387 - TypeScript repository](https://github.com/microsoft/TypeScript/issues/27387)
- Importing types with `@typedef` is way too verbose since you can only import one type for each `@typedef`. This has been fixed with the addition of the new `@import` and we're very eager to migrate to it as soon as we can.

## Managing the TypeScript version

We are not completely free to choose the version of TypeScript we want to use because we rely on `CEM Analyzer` to generate our docs.
The `CEM Analyzer` project bundles its own version of TypeScript.
Since we want to make sure the types and syntax we use are compatible with the tool we use to generate our docs, we have to use the same TypeScript version as the one bundled by `CEM Analyzer`.

We also rely on `lit-analyzer` and `ts-lit-plugin` to both lint our code and enhance the developer experience when it comes to Lit Web Components.
These tools are able to catch missing imports, unclosed HTML tags, etc. but they are not really maintained and they tend to break with the latest versions of TypeScript.

## On our way to a fully Type Checked codebase

The strategy was to progressively work on Type Checking when reworking components and add them to the CI type checking one by one.

To do so, here is what we did:
- Reworked our `tsconfig.json` to enable Type Checking in our editors (`"allowJs": true`, `"checkJs": true`),
  - Decided how strict we wanted to be by enabling/disabling specific options,
- Added a `tsconfig.ci.json` to enable Type Checking in CI context,
  - Only files that fully pass type checking, including their dependencies, can be added to the list of files checked in CI,
  - When we started, only one file could be added to this file.

## Where are we at?

As of this writing, we have managed to fully Type Check most of our components (UI and smart) as well as their related libs.

| Category               | Checked | Total  | Percentage |
|------------------------|---------|--------|------------|
| Components             | 101     | 105    | 96.19%     |
| Components (smart)     | 17      | 18     | 94.44%     |
| Components (test)      | 0       | 98     | 0.00%      |
| Components (stories)   | 0       | 99     | 0.00%      |
| Controllers            | 2       | 2      | 100.00%    |
| Controllers (stories)  | 0       | 2      | 0.00%      |
| Libs                   | 53      | 53     | 100.00%    |
| Tasks                  | 1       | 13     | 7.69%      |

## What is left to do?

- Find a way to upgrade the TypeScript version when we want (lit labs analyzer)
  - This should be possible if we move from `custom-elements-manifest/analyzer` & `lit-analyzer` to `@lit-labs/analyzer` but this is not trivial as explained in [Investigate @lit-labs/analyzer usage - issue #1156 - Clever Components repository].
- Migrate to the new `@import` syntax
  - This is only possible once we've migrated to TypeScript > `5.5`.
- Rely on types provided by the Clever Cloud APIs for async calls
  - Currently the Clever Cloud APIs do not really expose types and a proper API documentation. Once they do, our `clever-client.js` project should be able to expose these types so we can rely on them in the components' project.
- Expose the types in the npm package. This is not trivial and it impacts our bundling process. We have at least two options:
  - Stop minifying the sources we ship and add the `d.ts` files to the package,
  - Generate `d.ts` from our `.js` files like libraries do and add `d.ts` files to the package.

## The wishlist

- Better JSDoc syntax to handle generics:
  - [JSDoc doesn't support generics correctly - issue #56102 - TypeScript repository](https://github.com/microsoft/TypeScript/issues/27387)
  - [Allow to explicitly pass type parameters via JSDoc - issue #27387 - TypeScript repository](https://github.com/microsoft/TypeScript/issues/27387)
- [TC39 - Type Annotations](https://tc39.es/proposal-type-annotations/)
