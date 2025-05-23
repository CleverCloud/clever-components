
To add web features to the table above, you need to modify the `src/components/cc-web-features-tracker/web-features.json` file.

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

| Property                   | Type                      | Description                                                |
|----------------------------|---------------------------|------------------------------------------------------------|
| `featureId`                | `string`                  | ID of the feature from Web Features Explorer or BCD        |
| `category`                 | `"HTML" \| "CSS" \| "JS"` | Must be `"HTML"`, `"CSS"` or `"JS"`                        |
| `comment`                  | `string`                  | Brief description of the feature (optional)                |
| `isProgressiveEnhancement` | `boolean`                 | Whether the feature can be used as progressive enhancement |
| `canBeUsedWithPolyfill`    | `boolean`                 | Whether the feature can be used with a polyfill            |
