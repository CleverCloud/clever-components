---
kind: '🛠 pricing/<cc-pricing-product-consumption>'
title: '💡 Smart'
---

# 💡 Smart `<cc-pricing-product-consumption>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="https://www.clever-cloud.com/doc/clever-components/?path=/docs/%F0%9F%9B%A0-pricing-cc-pricing-product-consumption--default-story"><code>&lt;cc-pricing-product-consumption></code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-pricing-product-consumption</code>
  <tr><td><strong>Requires auth</strong> <td>No
</table>

## ⚙️ Params

| Name        | Type        | Details                                                                          | Default |
|-------------|-------------|----------------------------------------------------------------------------------|---------|
| `productId` | `string`    | `cellar`, `fsbucket`, `heptapod`, or `pulsar`                                    |         |
| `zoneId`    | `string`    | Name from [`/v4/products/zones`](https://api.clever-cloud.com/v4/products/zones) | `par`   |

## 🌐 API endpoints

| Method | Type                               | Cache? |
|--------|:-----------------------------------|--------|
| `GET`  | `/v4/billing/price-system?zone_id` | 1 day  |

## ⬇️️ Examples

### Simple Cellar

Simple example for Cellar based on default zone.

```html
<cc-smart-container context='{
    "productId": "cellar" }'>
  <cc-pricing-product-consumption></cc-pricing-product-consumption>
</cc-smart-container>
```

### Simple FS Bucket

Simple example for FS Bucket based on default zone.

```html
<cc-smart-container context='{
    "productId": "fsbucket",
}'>
  <cc-pricing-product-consumption></cc-pricing-product-consumption>
</cc-smart-container>
```

### Simple Pulsar

Simple example for FS Bucket based on default zone.

```html
<cc-smart-container context='{
    "productId": "pulsar",
}'>
  <cc-pricing-product-consumption></cc-pricing-product-consumption>
</cc-smart-container>
```

### Simple Heptapod

Simple example for Heptapod based on default zone.

```html
<cc-smart-container context='{
    "productId": "heptapod",
}'>
  <cc-pricing-product-consumption></cc-pricing-product-consumption>
</cc-smart-container>
```

### Zone and currency

Simple example for Cellar with custom zone.

NOTE: Prices are the same on all zones right now.

```html
<cc-smart-container context='{
    "productId": "cellar",
    "zoneId": "rbx",
}'>
  <cc-pricing-product-consumption></cc-pricing-product-consumption>
</cc-smart-container>
```

