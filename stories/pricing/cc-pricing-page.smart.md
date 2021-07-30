---
kind: '🛠 pricing/<cc-pricing-page>'
title: '💡 Smart'
---
# 💡 Smart `<cc-pricing-page>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="https://www.clever-cloud.com/doc/clever-components/?path=/docs/%F0%9F%9B%A0-pricing-cc-pricing-page--default-story"><code>&lt;cc-pricing-page></code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-pricing-page</code>
  <tr><td><strong>Requires auth</strong> <td>No
</table>

## ⚙️ Params

<table>
  <tr><th>Name                       <th>Type                  <th>Details                                                                                                                <th>Default
  <tr><td><code>currencyCode</code>  <td><code>String</code>   <td>ISO 4217 currency code                                                                                                 <td><code>EUR</code>
  <tr><td><code>zoneId</code>        <td><code>String</code>   <td>Name from <a href="https://api.clever-cloud.com/v4/products/zones"><code>/v4/products/zones</code></a>                 <td><code>par</code>
</table>

## ⚠️ Warnings!

* Right now, change rates are fetched from a hard coded list of currencies.

## 🌐 API endpoints

<table>
  <tr><th>Method <th>URL                                           <th>Cache?
  <tr><td>GET    <td><code>/v4/products/zones</code> <td>1 day
</table>

## ⬇️️ Examples

### Simple

Simple example based on default zone and currency.

```html
<cc-smart-container>
  <cc-pricing-page>
    <h1>Addons</h1>
    <cc-smart-container context='{ "productId": "postgresql-addon" }'>
      <cc-pricing-product mode="addon"></cc-pricing-product>
    </cc-smart-container>
    <h1>Runtimes</h1>
    <cc-smart-container context='{ "productId": "node" }'>
      <cc-pricing-product mode="runtime"></cc-pricing-product>
    </cc-smart-container>
  </cc-pricing-page>
</cc-smart-container>
```

<cc-smart-container>
  <cc-pricing-page>
    <h1>Addons</h1>
    <cc-smart-container context='{ "productId": "postgresql-addon" }'>
      <cc-pricing-product mode="addon"></cc-pricing-product>
    </cc-smart-container>
    <h1>Runtimes</h1>
    <cc-smart-container context='{ "productId": "node" }'>
      <cc-pricing-product mode="runtime"></cc-pricing-product>
    </cc-smart-container>
  </cc-pricing-page>
</cc-smart-container>

### Zone and currency

Simple example with custom zone and custom currency.

NOTE: Prices are the same on all zones right now.

```html
<cc-smart-container context='{ "zoneId": "rbx", "currencyCode": "USD" }'>
  <cc-pricing-page>
    <h1>Addons</h1>
    <cc-smart-container context='{ "productId": "postgresql-addon" }'>
      <cc-pricing-product mode="addon"></cc-pricing-product>
    </cc-smart-container>
    <h1>Runtimes</h1>
    <cc-smart-container context='{ "productId": "node" }'>
      <cc-pricing-product mode="runtime"></cc-pricing-product>
    </cc-smart-container>
  </cc-pricing-page>
</cc-smart-container>
```

<cc-smart-container context='{ "zoneId": "rbx", "currencyCode": "USD" }'>
  <cc-pricing-page>
    <h1>Addons</h1>
    <cc-smart-container context='{ "productId": "postgresql-addon" }'>
      <cc-pricing-product mode="addon"></cc-pricing-product>
    </cc-smart-container>
    <h1>Runtimes</h1>
    <cc-smart-container context='{ "productId": "node" }'>
      <cc-pricing-product mode="runtime"></cc-pricing-product>
    </cc-smart-container>
  </cc-pricing-page>
</cc-smart-container>
