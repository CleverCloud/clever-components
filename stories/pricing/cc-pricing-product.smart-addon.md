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

<table>
  <tr><th>Name                       <th>Type                  <th>Details                                                                                                                <th>Default
  <tr><td><code>productId</code>     <td><code>String</code>   <td>id from <a href="https://api.clever-cloud.com/v2/products/addonproviders"><code>/v2/products/addonproviders</code></a> <td>
  <tr><td><code>zoneId</code>        <td><code>String</code>   <td>Name from <a href="https://api.clever-cloud.com/v4/products/zones"><code>/v4/products/zones</code></a>                 <td><code>par</code>
  <tr><td><code>currencyCode</code>  <td><code>String</code>   <td>ISO 4217 currency code                                                                                                 <td><code>EUR</code>
  <tr><td><code>addonFeatures</code> <td><code>String[]</code> <td>List of feature codes as describe in the component API.                                                                <td><code>undefined</code>
</table>

* When `addonFeatures` is not specified, all product features are listed in the order of the API.
* Setting `addonFeatures` allows you to filter the features you want to display.
* Setting `addonFeatures` allows you to control the display order of the features.

## ⚠️ Warnings!

* Right now, change rates are fetched from a hard coded list of currencies.

## 🌐 API endpoints

<table>
  <tr><th>Method <th>URL                                           <th>Cache?
  <tr><td>GET    <td><code>/v2/products/addonproviders</code>      <td>1 day
  <tr><td>GET    <td><code>/v4/billing/price-system?zone_id</code> <td>1 day
</table>

## ⬇️️ Examples

### Simple

Simple example based on default zone and currency.

```html
<cc-smart-container context='{ "productId": "postgresql-addon" }'>
  <cc-pricing-product mode="addon"></cc-pricing-product>
</cc-smart-container>
```

<cc-smart-container context='{ "productId": "postgresql-addon" }'>
  <cc-pricing-product mode="addon"></cc-pricing-product>
</cc-smart-container>

### Zone and currency

Simple example with custom zone and custom currency.

NOTE: Prices are the same on all zones right now.

```html
<cc-smart-container context='{ "productId": "postgresql-addon", "zoneId": "rbx", "currencyCode": "USD" }'>
  <cc-pricing-product mode="addon"></cc-pricing-product>
</cc-smart-container>
```

<cc-smart-container context='{ "productId": "postgresql-addon", "zoneId": "rbx", "currencyCode": "USD" }'>
  <cc-pricing-product mode="addon"></cc-pricing-product>
</cc-smart-container>

### With feature list

Setting `addonFeatures` is the only way to enforce a sort order on the feature list.
It's also a good way to filter features.

```html
<cc-smart-container context='{ "productId": "postgresql-addon", "addonFeatures": ["cpu", "memory", "disk-size"] }'>
  <cc-pricing-product mode="addon"></cc-pricing-product>
</cc-smart-container>
```

<cc-smart-container context='{ "productId": "postgresql-addon", "addonFeatures": ["cpu", "memory", "disk-size"] }'>
  <cc-pricing-product mode="addon"></cc-pricing-product>
</cc-smart-container>
