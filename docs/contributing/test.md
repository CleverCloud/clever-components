---
kind: '👋 Contributing'
title: 'Test'
---

# How to test your components?

We use `Web Test Runner` to run tests on some essential parts of our libs and most of our components.

You can run all tests by using the `npm run test` command.
This command runs `*.test.js` files from the `test` folder as well as from the `src/components` folder.

## How to manage visual tests

Most component story files are tested automatically to check for visual changes through Web Test Runner.

These visual tests are managed directly within the story files themselves through configuration options.

The tests are run in CI when you add the `run-visual-tests` label to a PR.
In such cases:
1. The CI checks out the base commit of your PR to create or update the `expectation` screenshots. These screenshots are the reference that will be used to determine if something has changed.
    - Note that the `expectation` is lazily updated: `expectation` screenshots are only updated if you push to the PR and the base commit has changed.
2. The CI checks out the latest commit of your PR to compare the `expectation` to the `actual` screenshots. If a change has been detected, it saves the `actual` screenshot as well as a `diff` screenshot.
3. If there are changes, the CI produces a JSON and an HTML report. The link to the HTML report is provided through an automatic comment in the PR. This comment is also automatically updated with the list of impacted components everytime something is pushed to the PR.

**Note:**
These tests need to be run on a stable environment so they are designed to be run in CI and not locally. They are also run only "on demand" and are not part of the release process.

Refer to the [Contributing - Writing Stories](👋-contributing-writing-stories--docs) docs to learn how to disable visual tests.

## How to manage accessibility tests

Most component story files are tested automatically to check for accessibility issues through Web Test Runner.
You only need to create test files if you want to test aspects of a component other than its stories.

These accessibility tests are managed directly within the story files themselves through configuration options.

Refer to the [Contributing - Writing Stories](👋-contributing-writing-stories--docs) docs to learn how to disable a11y tests or rules.

## How to run tests on a single test file?

You may find that testing everything is too slow and too verbose for your taste, and you may want to focus on a single test file.

To do so, you have two solutions:

* use the `npm run test path/to/your/test-file` with the `--watch` option if you want it to run everytime you update the file or its dependencies.
* use the `npm run test:watch` command and press `F` to enter the `focus` mode. The test runner lists files by number and asks for the number of the file you want to focus on.

## How to run tests on a specific groups?

We have configured several test groups to help organize and run specific sets of tests:

* `unit` - Runs all unit tests from `test/**/*.test.*`
* Individual component groups - Each component has its own group named with the following pattern:
  * `${'a11y'|'test'}:${componentName}`

To run tests for a specific group, use:

```bash
npm run test:group <group-name>
```

For example:
* Run all unit tests: `npm run test:group unit`
* Run test file for a specific component: `npm run test:group test:cc-input-date`
* Run tests for a specific component story: `npm run test:group a11y:cc-input-date`

You can use the same logic with the `npm run test:watch:group` command for development.

## How to debug with Web Test Runner?

Remember that Web Test Runner runs your tests in one or several real browsers.

If you want to see the browser while it runs your tests to do some debugging:

1. use the `watch` option,
2. press `D`.

The test runner lists files by number and asks for the number of the file you want to run the test on in debug mode.

## Resources

* [Web Test Runner Documentation - Modern Web](https://modern-web.dev/docs/test-runner/overview/),
* [Testing Packages & helpers - Open WC](https://open-wc.org/docs/testing/testing-package/).
