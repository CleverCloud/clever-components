---
kind: '📌 Architecture Decision Records'
---
# ADR 0026: Enabling type checking

<!-- TODO: change the date -->
🗓️ 2023-03-.. · ✍️ Florian Sanders

## Pure JavaScript, no build steps required

The Clever Components project is a pure JavaScript project.

From the start, the project was designed with the following in mind:

- components should be able to run within the browser as is without any build step,
- the build step is only here to optimize the code of the components.


## JSDoc to document component APIs

Documentation for developers has also always been at the core for the project: if we want developers to be able to use our components in any context (with or without a JavaScript framework) we need to expose documented APIs for every component we produce.

We mostly rely on `JSDoc` to document how to use our components.

Until now, we primarily documented public APIs of our components.
Recently, we have started documented even private methods and properties to improve the developer experience make the components easier to maintain.

The `JSDoc` comments of public APIs of our components (the class and its properties mainly) is processed by the `@custom-elements-manifest/analyzer`. 
Component docs are part of the Custom Element Manifest and its content is displayed and formatted by Storybook.

## A tiny bit of TypeScript with hand-authored lib files

<!-- TODO: find an example of stuff you cannot do with JSDoc only -->
`JSDoc` is a great start but when it comes to documenting objects and more complex data structures, you may need some help.

And who better than TypeScript to help you document complex types in JavaScript?

We hand-author `d.ts` files for most of our components.
These files usually contain types corresponding to properties and data other than JavaScript primitives

