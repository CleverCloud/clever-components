---
kind: '📌 Architecture Decision Records'
---

# ADR-0030: Setting up visual tests

🗓️ 2025-07-17 · ✍️ Florian Sanders (with AI)

## Context

The primary goal is to automatically detect visual changes introduced in a Pull Request (PR). This serves several purposes:

* **For Contributors:** Eliminates the need to manually list all impacted components for reviewers,
* **For Reviewers:** Avoids the manual, time-consuming process of checking every Storybook story,
* **For Everyone:** Increases confidence by ensuring no unintended visual changes are introduced.

### Key Considerations

* **Changes vs. Regressions:** Not all visual changes are regressions. Some are intentional (new components, design updates), while others are unintended side effects on dependent components,
* **Performance:** Running automated tests on every single story can be very slow,
* **Guiding Principles:**
    * **Reduce Friction:** Tests must be stable and should not block a PR by default. It should be possible to disable them when necessary,
    * **Facilitate Review:** The review process must be simple, with an easy way to compare before/after states and identify what changed,
    * **Maximize Coverage:** The solution should cover as many stories as possible,
    * **Minimize Code Impact:** Avoid adding test-specific code to the components and stories themselves,
    * **Limit Dependencies:** Avoid vendor lock-in where possible and limit the use of third-party GitHub Actions for security and maintenance reasons.

### Basic Workflow

The fundamental process for visual testing involves three steps:
1. Capture the expected state (the **expectation**, also known as **baseline**).
2. Capture the current state of the PR (the **actual**).
3. Perform a pixel-by-pixel comparison (using a library like `pixelmatch`).

## Alternatives Considered

Several tools were evaluated for implementing visual regression testing.

| Tool              | Advantages                                                                                    | Disadvantages                                                                     | Use Case                                                    |
| ----------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **Storybook**     | Native integration, visual review UI, rich addon ecosystem, easy adoption (already in use).  | Dependency on Storybook, less control over browsers, variable performance.       | Ideal if Storybook is already used extensively.            |
| **Playwright**    | Native multi-browser support, high performance, mature ecosystem, fine-grained control.       | Steeper learning curve, more complex setup, potentially overkill for simple cases. | Projects needing robust cross-browser testing.             |
| **WebDriver.IO**  | Very flexible, extensive browser support, active community, mature CI/CD integration.         | Complex configuration, lower performance than Playwright, heavier maintenance.   | Teams with existing WebDriver expertise.                   |
| **Web Test Runner** | Lightweight and fast, good for isolated components, modern (ES modules), fewer dependencies. | More limited ecosystem, fewer advanced features, sometimes sparse documentation.  | Projects prioritizing simplicity and performance.           |
| **Vitest**        | Integration with Vite ecosystem, fast watch mode, familiar API (Jest-like).                  | Limited visual testing support, requires third-party solutions, less mature.     | Best for unit tests, with visual testing as an add-on.     |

## Decision

After evaluating the options and considering our guiding principles, the following strategy was chosen:

1. **Test Execution Environment:** All visual tests will be executed **exclusively in the CI environment**. Local environments (even across Linux distributions) produce subtle rendering differences, particularly with fonts, making local baselines unreliable.

2. **Expectation/baseline strategy:** The baseline for comparison will be the **base commit of the PR**.
    * **Advantages:** This gives developers control over their baseline (it updates logically on a rebase), avoids network flakiness from fetching a production baseline, and is much more lightweight.
    * **Rejected Alternative (Production Baseline):** Using the production deployment as the baseline was rejected. It's slow, and the baseline can change unexpectedly if a new deployment occurs during a test run, leading to unstable tests.

3. **Screenshot Storage:** Screenshots (both baseline and actual) will be stored on **Clever Cloud Cellar (Object Storage)**, not in the Git repository.
    * **Reasoning:** Storing images in the repository is heavy, pollutes PRs with binary files, and creates complex commit/push workflows from the CI.

4. **Tooling:** **Web Test Runner** with Playwright was chosen as the primary tool. This provides a good balance of performance, modern features, and control without the full complexity of a standalone Playwright setup.

## Consequences

Implementing this strategy required addressing several sources of test instability and optimizing the CI pipeline.

### Test Stabilization

Tests initially failed randomly even in a consistent CI environment. The following fixes were implemented:

* **Random Strings:** `Math.random()` was mocked to produce a deterministic seed, ensuring components relying on random values render identically every time. We had to make sure the mocking happens before the story file is imported so that story fixtures also run with that deterministic seed.
* **Dates:** The `Date` object was mocked to return a fixed timestamp. This was necessary as Playwright's built-in time-mocking helpers were not compatible with Web Test Runner. We had to make sure the mocking happens before the story file is imported so that story fixtures also run with fixed timestamps.
* **Animations:** CSS animations caused inconsistent captures.
  * We created a helper to retrieve all elements (cross Shadow Root) from a story.
    * For `LitElement`s we wait for `updateComplete` so we can get their children.
    * For `virtualizer`s we wait 1ms so we can get their children. This is not great but the only alternative is to wait for `VirtualizerElement.layoutComplete` and this promise is always pending until a scroll happens so this is really not convenient.
  * For each element within this list, we mutate its `adoptedStylesheets` (only once by component) to disable animations. This allows us to disable all animations quickly.
  * For each element within this list, we retrieve all its animations using `getAnimations()` and we cancel them. This allows us to disable animations from third party libs like `Chart.js`.
  * The CSS and JS solutions mentionned above cover different cases so we need both.
* **Async Image Loading:** Remote images loading at unpredictable times caused test failures.
  * For each element within the list mentioned above, we search for `HTMLImgElement`s and we add listeners to wait for `load` or `error` on each image.
  * We also set a global timeout.
  * We wait for all images to load / fail / reach timeout before screenshotting.

### CI Optimization

* **Docker Image:** A pre-built Playwright Docker image is used in CI to avoid reinstalling browsers and dependencies on every run,
* **Baseline/Expectation Caching:** The expectation capture step is skipped if the base commit hash has not changed from a previous run,
* **Parallelization (Sharding):** Tests are sharded into batches to run in parallel, significantly reducing the total execution time,
* **Opt in only:** Tests are only run if the PR has a `run-visual-tests` label because they rely on 5 runners for up to 10 minutes. Since the number of active runners is limited to 20 for the whole Clever Cloud org, we decided it was better to only run these tests when needed.

### Reporting

A custom reporting pipeline was created:
1. JSON reports from parallel jobs are uploaded to GitHub artifacts.
2. Once all screenshots (expectation and then actual + diff screenshots are done), we retrieve all JSON reports to merge them into a single JSON report with results and metadata (PR number, branch name, dates, commit ids),
2. An HTML report is generated from the merged JSON data.
3. The report is uploaded to `Cellar`.
4. A comment is automatically posted on the GitHub PR with a link to the report and a summary of the results,
5. Screenshots, reports and comments are automatically cleaned up when the PR is closed, merged or the `run-visual-tests` label is removed.
