---
kind: '📌 Docs'
---
# How to test your components?

We use `Web Test Runner` to run tests on some essential parts of our libs and most of our components.

You can run all tests by using the `npm run test` command.
This command runs `*.test.js` files from the `test` folder as well as from the `src/components` folder.

**Note:**
Some components don't have any test files because they are purely made for layout purposes and do not implement any semantics or interactions (`cc-flex-gap` for instance).

## How to create tests for your component?

If you create a new component, you probably need to test it, at least to avoid accessibility issues that could be caught automatically.

To do so, use the `cc-example-component.test.js` template. 
This file already contains the essential code to run accessibility tests on all your component stories.

You may also add your own tests in this file.

## How to run tests on a single test file?

You may find that testing everything is too slow and too verbose for your taste, and you may want to focus on a single test file.

To do so, you have two solutions:

* use the `npm run test:watch` command and press `F` to enter the `focus` mode. The test runner lists files by number and asks for the number of the file you want to focus on.
* use the `npx wtr 'path/to/your/test-file'` with the `--watch` option if you want it to run everytime you update the file or its dependencies.

## How to debug with Web Test Runner?

Remember that Web Test Runner runs your tests in one or several real browsers.

If you want to see the browser while it runs your tests to do some debugging:

1. use the `watch` option,
2. press `D`.

The test runner lists files by number and asks for the number of the file you want to run the test on in debug mode.

## Resources

* [Web Test Runner Documentation - Modern Web](https://modern-web.dev/docs/test-runner/overview/),
* [Testing Packages & helpers - Open WC](https://open-wc.org/docs/testing/testing-package/).
