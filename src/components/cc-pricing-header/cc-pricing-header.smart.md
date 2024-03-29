---
kind: '🛠 pricing/<cc-pricing-header>'
title: '💡 Smart'
---

# 💡 Smart `<cc-pricing-header>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="https://www.clever-cloud.com/doc/clever-components/?path=/docs/%F0%9F%9B%A0-pricing-cc-pricing-header--default-story"><code>&lt;cc-pricing-header></code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-pricing-header</code>
  <tr><td><strong>Requires auth</strong> <td>No
</table>

## ⚙️ Params

| Name        | Type        | Details                                                                          | Default |
|-------------|-------------|----------------------------------------------------------------------------------|---------|
| `zoneId`    | `string`    | Name from [`/v4/products/zones`](https://api.clever-cloud.com/v4/products/zones) | `par`   |

## 🌐 API endpoints

| Method | Type                 | Cache? |
|--------|:---------------------|--------|
| `GET`  | `/v4/products/zones` | 1 day  |

## ⬇️️ Examples

```html
<cc-smart-container context='{
    "zoneId": "mtl",
}'>
  <cc-pricing-header></cc-pricing-header>
</cc-smart-container>
```

