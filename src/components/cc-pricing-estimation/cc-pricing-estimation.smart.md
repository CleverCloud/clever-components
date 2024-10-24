---
kind: '🛠 pricing/<cc-pricing-estimation>'
title: '💡 Smart'
---

# 💡 Smart `<cc-pricing-estimation>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="https://www.clever-cloud.com/doc/clever-components/?path=/docs/%F0%9F%9B%A0-pricing-cc-pricing-estimation--default-story"><code>&lt;cc-pricing-estimation></code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-pricing-estimation</code>
  <tr><td><strong>Requires auth</strong> <td>No
</table>

## ⚙️ Params

| Name        | Type        | Required | Details                                                                          | Default                                        |
|-------------|:-----------:|:--------:|----------------------------------------------------------------------------------|------------------------------------------------|
| `apiConfig` | `ApiConfig` |  No      | Object with API configuration (target host, tokens...)                           | `{ API_HOST: "https://api.clever-cloud.com" }` |
| `zoneId`    | `string`    |  No      | Name from [`/v4/products/zones`](https://api.clever-cloud.com/v4/products/zones) | `par`                                          |
| `currency`  | `string`    |  No      | Currency code for pricing                                                        | `EUR`                                          |

## 🌐 API endpoints

| Method | Type               | Cache? |
|--------|:-------------------|:-------|
| `GET`  | `/v4/price-system` | 1 day  |

## ⬇️️ Examples

```html
<cc-smart-container context='{
    "zoneId": "mtl",
    "currency": "USD"
}'>
  <cc-pricing-estimation></cc-pricing-estimation>
</cc-smart-container>
```

## 📄 Notes

This smart component is designed to work within a `cc-pricing-page` component with at least a `cc-pricing-product` or `cc-pricing-product-consumption` component.
When the `zoneId` or `currency` changes, the smart component fetches pricing data (price system) and formats it so it can be consumed by the `cc-pricing-estimation` component.

It handles both runtime prices which are fixed prices, and countable prices which depend on different consumption metrics.

Events listed below allow the smart component to trigger a new price system fetch in other pricing components.
The new fetch is triggered by changing the context of their common smart container when the zone or currency changes.

Events:
- `cc-pricing-estimation:change-zone`: Updates the `zoneId` in the context.
- `cc-pricing-estimation:change-currency`: Updates the `currency` in the context.
