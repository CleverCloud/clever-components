---
kind: '🛠 pricing/<cc-pricing-product-cellar>'
title: '💡 Smart'
---
# 💡 Smart `<cc-pricing-product-cellar>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="https://www.clever-cloud.com/doc/clever-components/?path=/docs/%F0%9F%9B%A0-pricing-cc-pricing-product-cellar--default-story"><code>&lt;cc-pricing-product-cellar></code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-pricing-product-cellar</code>
  <tr><td><strong>Requires auth</strong> <td>No
</table>

## ⚙️ Params

<table>
  <tr><th>Name                       <th>Type                  <th>Details                                                                                                                <th>Default
  <tr><td><code>zoneId</code>        <td><code>String</code>   <td>Name from <a href="https://api.clever-cloud.com/v4/products/zones"><code>/v4/products/zones</code></a>                 <td><code>par</code>
  <tr><td><code>currencyCode</code>  <td><code>String</code>   <td>ISO 4217 currency code                                                                                                 <td><code>EUR</code>
</table>

## ⚠️ Warnings!

* Right now, change rates are fetched from a hard coded list of currencies.

## 🌐 API endpoints

<table>
  <tr><th>Method <th>URL                                           <th>Cache?
  <tr><td>GET    <td><code>/v4/billing/price-system?zone_id</code> <td>1 day
</table>

## ⬇️️ Examples

### Simple

Simple example based on default zone and currency.

```html
<cc-smart-container>
  <cc-pricing-product-cellar></cc-pricing-product-cellar>
</cc-smart-container>
```

<cc-smart-container>
  <cc-pricing-product-cellar></cc-pricing-product-cellar>
</cc-smart-container>

### Zone and currency

Simple example with custom zone and custom currency.

NOTE: Prices are the same on all zones right now.

```html
<cc-smart-container context='{ "zoneId": "rbx", "currencyCode": "USD" }'>
  <cc-pricing-product-cellar></cc-pricing-product-cellar>
</cc-smart-container>
```

<cc-smart-container context='{ "zoneId": "rbx", "currencyCode": "USD" }'>
  <cc-pricing-product-cellar></cc-pricing-product-cellar>
</cc-smart-container>

