---
kind: '🛠 pricing/<cc-pricing-product>'
title: '💡 Smart (add-on)'
---
# 💡 Smart `<cc-pricing-product>` for add-ons

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="https://www.clever-cloud.com/doc/clever-components/?path=/docs/%F0%9F%9B%A0-pricing-cc-pricing-product--default-story"><code>&lt;cc-pricing-product&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-pricing-product[mode="addon"]</code>
  <tr><td><strong>Requires auth</strong> <td>No
</table>

## ⚙️ Params

| Name            | Type        | Details                                                                                          | Default |
|-----------------|-------------|--------------------------------------------------------------------------------------------------|---------|
| `productId`     | `string`    | id from [`/v2/products/addonproviders`](https://api.clever-cloud.com/v2/products/addonproviders) |         |
| `zoneId`        | `string`    | Name from [`/v4/products/zones`](https://api.clever-cloud.com/v4/products/zones)                 | `par`   |
| `addonFeatures` | `string[]`  | List of feature codes as describe in the component API.                                          |         |

* When `addonFeatures` is not specified, all product features are listed in the order of the API.
* Setting `addonFeatures` allows you to filter the features you want to display.
* Setting `addonFeatures` allows you to control the display order of the features.

## 🌐 API endpoints

| Method | Type                               | Cache? |
|--------|:-----------------------------------|--------|
| `GET`  | `/v2/products/addonproviders`      | 1 day  |
| `GET`  | `/v4/billing/price-system?zone_id` | 1 day  |

## ⬇️️ Examples

### Simple

Simple example based on default zone.

```html
<cc-smart-container context='{
    "productId": "postgresql-addon",
}'>
  <cc-pricing-product mode="addon"></cc-pricing-product>
</cc-smart-container>
```

### Zone

Simple example with custom zone.

NOTE: Prices are the same on all zones right now.

```html
<cc-smart-container context='{
    "productId": "postgresql-addon",
    "zoneId": "rbx",
}'>
  <cc-pricing-product mode="addon"></cc-pricing-product>
</cc-smart-container>
```

### With feature list

Setting `addonFeatures` is the only way to enforce a sort order on the feature list.
It's also a good way to filter features.

```html
<cc-smart-container context='{
    "productId": "postgresql-addon",
    "addonFeatures": ["cpu", "memory", "disk-size"],
}'>
  <cc-pricing-product mode="addon"></cc-pricing-product>
</cc-smart-container>
```

