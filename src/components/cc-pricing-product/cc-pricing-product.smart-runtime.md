---
kind: '🛠 pricing/<cc-pricing-product>'
title: '💡 Smart (runtime)'
---
# 💡 Smart `<cc-pricing-product>` for runtimes

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="🛠-pricing-cc-pricing-product--default-story"><code>&lt;cc-pricing-product&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-pricing-product[mode="runtime"]</code>
  <tr><td><strong>Requires auth</strong> <td>No
</table>

## ⚙️ Params

| Name        | Type        | Required | Details                                                                                          | Default                                        |
|-------------|-------------|----------|--------------------------------------------------------------------------------------------------|------------------------------------------------|
| `apiConfig` | `ApiConfig` | Yes      | Object with API configuration (target host)                                                      | `{ API_HOST: "https://api.clever-cloud.com" }` |
| `currency`  | `string`    | No       | Currency code matching the ISO 4217 format                                                       | `EUR`                                          |
| `productId` | `string`    | Yes      | Variant slug from [`/v2/products/instances`](https://api.clever-cloud.com/v2/products/instances) |                                                |
| `zoneId`    | `string`    | No       | Name from [`/v4/products/zones`](https://api.clever-cloud.com/v4/products/zones)                 | `par`                                          |

## 🌐 API endpoints

| Method | Type                                             | Cache? |
|--------|--------------------------------------------------|--------|
| `GET`  | `/v2/products/instances`                         | 1 day  |
| `GET`  | `/v4/billing/price-system?zone_id&currency`      | 1 day  |

## ⬇️️ Examples

### Simple

Simple example based on default zone and default currency.

```html
<cc-smart-container context='{
  "apiConfig": {
    API_HOST: ""
  },
  "productId": "node",
}'>
  <cc-pricing-product mode="runtime"></cc-pricing-product>
</cc-smart-container>
```

### Special case for Jenkins runner

```html
<cc-smart-container context='{
  "apiConfig": {
    API_HOST: ""
  },
  "productId": "jenkins-runner",
}'>
  <cc-pricing-product mode="runtime" action="none" temporalities='[{"type":"minute","digits":5}]'></cc-pricing-product>
</cc-smart-container>
```

### Special case for Heptapod runner

```html
<cc-smart-container context='{
  "apiConfig": {
    API_HOST: ""
  },
  "productId": "heptapod-runner",
}'>
  <cc-pricing-product mode="runtime" action="none" temporalities='[{"type":"minute","digits":5}]'></cc-pricing-product>
</cc-smart-container>
```

### Zone

Simple example with custom zone.

NOTE: Prices are the same on all zones right now.

```html
<cc-smart-container context='{
  "apiConfig": {
    API_HOST: ""
  },
  "productId": "node",
  "zoneId": "rbx",
}'>
  <cc-pricing-product mode="runtime"></cc-pricing-product>
</cc-smart-container>
```

### Currency

Simple example with custom currency.

```html
<cc-smart-container context='{
  "apiConfig": {
    API_HOST: ""
  },
  "currency": "USD",
  "productId": "node",
}'>
  <cc-pricing-product mode="runtime"></cc-pricing-product>
</cc-smart-container>
```
