---
kind: '🕸️ Web Features/<cc-web-features-tracker>'
title: '💡 Smart'
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

export interface FeatureJson {
  featureId: string;
  /** Set to true if this feature can be used as progressive enhancement. This makes it usable in the project as long as it is newly available */
  isProgressiveEnhancement: boolean;
  /** Set to true if this feature is not widely supported but its use is permitted if a polyfill is provided */
  canBeUsedWithPolyfill: boolean;
  category: 'JS' | 'CSS' | 'HTML';
  comment?: string;
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
