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

<table>
  <tr><th>Name                       <th>Type                  <th>Details                                                                                                                <th>Default
  <tr><td><code>currency</code>      <td><code>Currency</code> <td>Currency info                                                                                                          <td><code>{ code: 'EUR', changeRate: 1 }</code>
  <tr><td><code>productId</code>     <td><code>String</code>   <td><code>cellar</code>, <code>fsbucket</code>, <code>heptapod</code> or <code>pulsar</code>                                                      <td>
  <tr><td><code>zoneId</code>        <td><code>String</code>   <td>Name from <a href="https://api.clever-cloud.com/v4/products/zones"><code>/v4/products/zones</code></a>                 <td><code>par</code>
</table>

```ts
interface Currency {
  code: string,       // ISO 4217 currency code
  changeRate: number, // based on euros
}
```

## 🌐 API endpoints

<table>
  <tr><th>Method <th>URL                                           <th>Cache?
  <tr><td>GET    <td><code>/v4/billing/price-system?zone_id</code> <td>1 day
</table>

## ⬇️️ Examples

### Simple Cellar

Simple example for Cellar based on default zone and currency.

```html
<cc-smart-container context='{ "productId": "cellar" }'>
  <cc-pricing-product-consumption></cc-pricing-product-consumption>
</cc-smart-container>
```

<cc-smart-container context='{ "productId": "cellar" }'>
  <cc-pricing-product-consumption></cc-pricing-product-consumption>
</cc-smart-container>

### Simple FS Bucket

Simple example for FS Bucket based on default zone and currency.

```html
<cc-smart-container context='{ "productId": "fsbucket" }'>
  <cc-pricing-product-consumption></cc-pricing-product-consumption>
</cc-smart-container>
```

<cc-smart-container context='{ "productId": "fsbucket" }'>
  <cc-pricing-product-consumption></cc-pricing-product-consumption>
</cc-smart-container>

### Simple Pulsar

Simple example for FS Bucket based on default zone and currency.

```html
<cc-smart-container context='{ "productId": "pulsar" }'>
  <cc-pricing-product-consumption></cc-pricing-product-consumption>
</cc-smart-container>
```

<cc-smart-container context='{ "productId": "pulsar" }'>
  <cc-pricing-product-consumption></cc-pricing-product-consumption>
</cc-smart-container>

### Simple Heptapod

Simple example for Heptapod based on default zone and currency.

```html
<cc-smart-container context='{ "productId": "heptapod" }'>
  <cc-pricing-product-consumption></cc-pricing-product-consumption>
</cc-smart-container>
```

<cc-smart-container context='{ "productId": "heptapod" }'>
  <cc-pricing-product-consumption></cc-pricing-product-consumption>
</cc-smart-container>

### Zone and currency

Simple example for Cellar with custom zone and custom currency.

NOTE: Prices are the same on all zones right now.

```html
<cc-smart-container context='{ "productId": "cellar", "zoneId": "rbx", "currency": { "code": "USD", "changeRate": 1.1802 } }'>
  <cc-pricing-product-consumption></cc-pricing-product-consumption>
</cc-smart-container>
```

<cc-smart-container context='{ "productId": "cellar", "zoneId": "rbx", "currency": { "code": "USD", "changeRate": 1.1802 } }'>
  <cc-pricing-product-consumption></cc-pricing-product-consumption>
</cc-smart-container>

