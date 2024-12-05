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
| `apiConfig` | `ApiConfig` |  Yes     | Object with API configuration (target host)                                      | `{ API_HOST: "https://api.clever-cloud.com" }` |
| `zoneId`    | `string`    |  No      | Name from [`/v4/products/zones`](https://api.clever-cloud.com/v4/products/zones) | `par`                                          |
| `currency`  | `string`    |  No      | Currency code for pricing                                                        | `EUR`                                          |

## 🌐 API endpoints

| Method | Type               | Cache? |
|--------|:-------------------|:-------|
| `GET`  | `/v4/price-system` | 1 day  |

## ⬇️️ Examples

```html
<cc-smart-container context='{
  "apiConfig": {
    API_HOST: ""
  },
  "zoneId": "mtl",
  "currency": "USD"
}'>
  <cc-pricing-estimation></cc-pricing-estimation>
</cc-smart-container>
```

## 📄 Notes

Pricing components rely on nested `cc-smart-container` components.

1. There is a global `<cc-smart-container>` wrapping all pricing components to provide shared context,
2. There are individual `<cc-smart-container>` wrapping each `<cc-pricing-product>` & `<cc-pricing-product-consumption>` component slotted within the `<cc-pricing-page>` to provide context specific to each product.

The typical HTML for a basic `cc-pricing-page` implementation looks like this:
```html
<cc-smart-container context='{
  "apiConfig": {
    API_HOST: ""
  },
  "zoneId": "mtl",
  "currency": "USD"
}'>
  <cc-pricing-page>
    <cc-pricing-header currencies="..." temporalities="..."></cc-pricing-header>
    <cc-smart-container context="{ productId: 'php'}">
      <cc-pricing-product mode="runtime" action="add"></cc-pricing-product>
    </cc-smart-container>

    <cc-smart-container context="{ productId: 'redis-addon'}">
      <cc-pricing-product mode="addon" action="add"></cc-pricing-product>
    </cc-smart-container>
    <cc-pricing-estimation currencies="..." temporalities="..."></cc-pricing-estimation>
  </cc-pricing-page>
</cc-smart-container>
```

`zoneId` and `currency` need to be shared between all pricing components because they drive the displayed prices.
When `zoneId` or `currency` changes, we need all pricing components that show prices to fetch the `priceSystem` (list of prices by product) corresponding to the selected zone and selected currency.
Components showing prices are:

- `cc-pricing-product`,
- `cc-pricing-product-consumption`,
- `cc-pricing-estimation`.

This is why when `zoneId` or `currency` is changed by selecting a different value in either `cc-pricing-header` or `cc-pricing-estimation` dropdowns, the global `cc-smart-container` context is updated.

Since all `cc-smart-container` inherit the context of their parent, every `cc-smart-container` wrapping a `cc-pricing-product` or `cc-pricing-product-consumption` retrieve the `zoneId` / `currency` and fetch the corresponding `priceSystem`.

Of course, the `priceSystem` API call is cached so that we don't actually trigger redundant calls.
