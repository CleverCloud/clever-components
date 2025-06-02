---
kind: '🛠 pricing/<cc-pricing-product-consumption>'
title: '💡 Smart'
---

# 💡 Smart `<cc-pricing-product-consumption>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="https://www.clever-cloud.com/developers/doc/clever-components/?path=/docs/%F0%9F%9B%A0-pricing-cc-pricing-product-consumption--default-story"><code>&lt;cc-pricing-product-consumption></code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-pricing-product-consumption</code>
  <tr><td><strong>Requires auth</strong> <td>No
</table>

## ⚙️ Params

| Name        | Type        | Required | Details                                                                                          | Default                                         |
|-------------|-------------|----------|--------------------------------------------------------------------------------------------------|-------------------------------------------------|
| `apiConfig` | `ApiConfig` | Yes      | Object with API configuration (target host)                                                      | `{ API_HOST: "https://api.clever-cloud.com" }`  |
| `currency`  | `string`    | No       | Currency code matching the ISO 4217 format                                                       | `EUR`                                           |
| `productId` | `string`    | Yes      | `cellar`, `fsbucket`, `heptapod`, or `pulsar`                                                    |                                                 |
| `zoneId`    | `string`    | No       | Name from [`/v4/products/zones`](https://api.clever-cloud.com/v4/products/zones)                 | `par`                                           |

## 🌐 API endpoints

| Method | Type                                             | Cache? |
|--------|--------------------------------------------------|--------|
| `GET`  | `/v4/billing/price-system?zone_id&currency`      | 1 day  |

## ⬇️️ Examples

### Simple Cellar

Simple example for Cellar based on default zone and default currency.

```html
<cc-smart-container context='{
  "apiConfig": {
    API_HOST: ""
  },
  "productId":, "cellar",
}'>
  <cc-pricing-product-consumption></cc-pricing-product-consumption>
</cc-smart-container>
```

### Simple FS Bucket

Simple example for FS Bucket based on default zone and default currency.

```html
<cc-smart-container context='{
  "apiConfig": {
    API_HOST: ""
  },
  "productId": "fsbucket",
}'>
  <cc-pricing-product-consumption></cc-pricing-product-consumption>
</cc-smart-container>
```

### Simple Pulsar

Simple example for Pulsar based on default zone and default currency.

```html
<cc-smart-container context='{
  "apiConfig": {
    API_HOST: ""
  },
  "productId": "pulsar",
}'>
  <cc-pricing-product-consumption></cc-pricing-product-consumption>
</cc-smart-container>
```

### Simple Heptapod

Simple example for Heptapod based on default zone and default currency.

```html
<cc-smart-container context='{
  "apiConfig": {
    API_HOST: ""
  },
  "productId": "heptapod",
}'>
  <cc-pricing-product-consumption></cc-pricing-product-consumption>
</cc-smart-container>
```

### Zone

Simple example for Cellar with custom zone.

NOTE: Prices are the same on all zones right now.

```html
<cc-smart-container context='{
  "apiConfig": {
    API_HOST: ""
  },
  "productId": "cellar",
  "zoneId": "rbx"
}'>
  <cc-pricing-product-consumption></cc-pricing-product-consumption>
</cc-smart-container>
```

### Currency

Simple example for Cellar with custom currency.

```html
<cc-smart-container context='{
  "apiConfig": {
    API_HOST: ""
  },
  "currency": "USD",
  "productId": "cellar",
}'>
  <cc-pricing-product-consumption></cc-pricing-product-consumption>
</cc-smart-container>
```
