---
kind: '👋 Contributing'
title: 'Browser support'
---

# Browser support

## Browser compatibility approach

When contributing to our components, it's important to understand our browser support strategy. We follow the **Baseline widely available** approach for browser compatibility, which is explained in detail in our [Browser Support Getting Started guide](https://www.clever-cloud.com/doc/clever-components/?path=/docs/%F0%9F%8F%A1-getting-started-browser-support--docs).

The key points to remember:

- We support browsers that implement features that have been widely available for at least 30 months,
- We do not transpile or transform our code to support older browsers,
- We may use "newly available" features as progressive enhancements,
- In rare cases, we may use critical features that require polyfills (see below).

## Tracked web features

When developing components, you need to be mindful of which web platform features you can use. We maintain a tracker of interesting web features to check if they are compatible with our browser support strategy:

<cc-web-features-tracker></cc-web-features-tracker>

<details>
  <summary style="margin-bottom:1em"><h3 style="display: inline;">How to add features to the list of tracked web features?</h3></summary>

The table above is a smart web component that accepts a list of features as a source to fetch data about these features through different APIs.

If you want to add features to this list, you need to edit the `src/components/cc-web-features/web-features.json` file that is consumed by the component.

#### 1. Choose the right source

When adding a new feature to track, follow these steps:

1. Go to the [Web Features Explorer IDs page](https://web-platform-dx.github.io/web-features-explorer/ids/),
2. Search for your feature.

- If you find your feature in the **"id" column**:
  - It means that your feature is referenced by the baseline project,
  - It means you should add your feature to the `baselineFeatures` array within the json file.

- If you don't find your feature in the "id" column OR your feature is a sub-feature (like private methods in classes):
  - Look in the **"bcd keys" column**,
  - It means you should add your feature to the `bcdFeatures` array within the json file.

#### 2. Configure Feature Properties

For each feature, you need to specify:

| Property                   | Type                      | Description                                                |
|----------------------------|---------------------------|------------------------------------------------------------|
| `featureId`                | `string`                  | ID of the feature from Web Features Explorer or BCD        |
| `category`                 | `"JS" \| "HTML" \| "CSS"` | The category related to your feature                       |
| `comment`                  | `string`                  | Brief description of the feature (optional)                |
| `isProgressiveEnhancement` | `boolean`                 | Whether the feature can be used as progressive enhancement |
| `canBeUsedWithPolyfill`    | `boolean`                 | Whether the feature can be used with a polyfill            |

If you need more information about progressive enhancement and polyfills, refer to the [Browser Support - Getting started documentation](https://www.clever-cloud.com/doc/clever-components/?path=/docs/%F0%9F%8F%A1-getting-started-browser-support--docs)

</details>

## Polyfills

We minimize our use of polyfills to maintain performance and simplicity. However, in some cases, polyfills are necessary to support critical functionality.

The conditions for adding a new polyfill to the project are:

1. The feature must be essential for component functionality,
2. The feature must be implemented in at least one major browser based on a ratified specification,
3. The polyfill must be well-maintained and have minimal performance impact.

If you need to add a polyfill to support a new component or feature, please update the [Browser Support Getting Started guide](https://www.clever-cloud.com/doc/clever-components/?path=/docs/%F0%9F%8F%A1-getting-started-browser-support--docs).
