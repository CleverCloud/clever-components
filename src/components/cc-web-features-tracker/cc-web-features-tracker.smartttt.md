---
kind: '🕸️ Web Features/<cc-web-features-tracker>'
title: '💡 Smarttt'
---

# 💡 Smart `<cc-web-features-tracker>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="https://www.clever-cloud.com/doc/clever-components/?path=/docs/🕸️-web-features-cc-web-features-tracker--default-story"><code>&lt;cc-web-features-tracker&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-web-features-tracker</code>
  <tr><td><strong>Requires auth</strong> <td>No
</table>

## ⚙️ Params

| Name                | Type             | Details                                                 | Default |
|---------------------|------------------|---------------------------------------------------------|---------|
| `trackedWebFeatures`| `WebFeatures`    | List of web features to track                           |         |

```ts
interface WebFeatures {
  baselineFeatures: FeatureJson[];
  bcdFeatures: FeatureJson[];
}

interface FeatureJson {
  featureId: string;
  isProgressiveEnhancement: boolean;
}
```

## 🌐 API endpoints

| Method   | Type                                                     | Cache?  |
|----------|:---------------------------------------------------------|---------|
| `GET`    | `https://unpkg.com/@mdn/browser-compat-data/data.json`   | Default |
| `GET`    | `https://api.webstatus.dev/v1/features/{featureId}`      | Default |

```html
<cc-smart-container context='{
    "trackedWebFeatures": {
      "baselineFeatures": [
        {
          "featureId": "feature-id",
          "isProgressiveEnhancement": true
        }
      ],
      "bcdFeatures": [
        {
          "featureId": "api.feature",
          "isProgressiveEnhancement": true
        }
      ]
    }
}'>
    <cc-web-features-tracker></cc-web-features-tracker>
</cc-smart-container>
```

## Web Features Tracking Documentation

This document explains how to use the `web-features.json` file to track web feature compatibility in your project.

### Introduction

The `web-features.json` file is used to configure which web features are tracked by the `<cc-web-features-tracker>` component. This component helps you monitor browser compatibility for web features that you would like to use in your project.

### How to add a feature

#### 1. Choose the right source

When adding a new feature to track, follow these steps:

1. Go to the [Web Features Explorer IDs page](https://web-platform-dx.github.io/web-features-explorer/ids/)
2. Search for your feature

- If you find your feature in the **"id" column**:
  - It means that your feature is referenced by the baseline project,
  - It means you should add your feature to the `baselineFeatures` array within the json file.

- If you don't find your feature in the "id" column OR your feature is a sub-feature (like private methods in classes):
  - Look in the **"bcd keys" column**,
  - It means you should add your feature to the `bcdFeatures` array within the json file.

#### 2. Configure Feature Properties

For each feature, you need to specify:

| Property                   | Type                     | Description                                                |
|----------------------------|--------------------------|------------------------------------------------------------|
| `featureId`                | `string`                 | ID of the feature from Web Features Explorer or BCD        |
| `category`                 | `"JS" | "HTML" | "CSS"`  | The category related to your feature                       |
| `comment`                  | `string`                 | Brief description of the feature (optional)                |
| `isProgressiveEnhancement` | `boolean`                | Whether the feature can be used as progressive enhancement |
| `canBeUsedWithPolyfill`    | `boolean`                | Whether the feature can be used with a polyfill            |

### Progressive Enhancement

When `isProgressiveEnhancement` is set to `true`:

- The feature can be used even if it's only "newly supported" (and not yet "widely supported")
- A warning icon will be displayed, indicating that the feature should only be used in a way that doesn't break core functionality
- Users without browser support for the feature should still get a working experience

**Example use case**: Using CSS `:is()` selector for styling, where browsers that don't support it will fall back to the default styling.

When `isProgressiveEnhancement` is `false`:

- The feature can only be used if it's "widely supported" (unless a polyfill is available)
- The component will mark it as "Cannot be used" if not widely supported

### Using Features with Polyfills

When `canBeUsedWithPolyfill` is set to `true`:

- The feature can be used even if it's not "widely supported"
- A tools icon will be displayed, indicating that a polyfill is required
- You must ensure the appropriate polyfill is included in your project

**Example use case**: Using form-associated custom elements with a polyfill in browsers that don't support them natively.

When `canBeUsedWithPolyfill` is `false`:

- No polyfill is available or using a polyfill is not recommended
- The feature can only be used if it's widely supported (or as progressive enhancement if applicable)

### Feature Availability Decision Logic

The component uses this logic to determine if a feature "can be used":

1. If a feature is "widely supported", it can always be used
2. If a feature has `canBeUsedWithPolyfill: true`, it can always be used (with a polyfill)
3. If a feature has `isProgressiveEnhancement: true` and is "newly supported", it can be used
4. Otherwise, the feature cannot be used in your project

### Complete Example

```json
{
  "baselineFeatures": [
    {
      "featureId": "dialog",
      "category": "HTML",
      "comment": "Represents a modal or non-modal dialog box.",
      "isProgressiveEnhancement": false,
      "canBeUsedWithPolyfill": false
    }
  ],
  "bcdFeatures": [
    {
      "featureId": "javascript.classes.private_class_methods",
      "category": "JS",
      "comment": "Encapsulation using # prefix for class methods.",
      "isProgressiveEnhancement": true,
      "canBeUsedWithPolyfill": false
    }
  ]
}
```

By following these guidelines, you can effectively track and manage web feature compatibility in your project.
