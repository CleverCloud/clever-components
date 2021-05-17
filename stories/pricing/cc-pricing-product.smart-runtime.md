---
kind: '🛠 pricing/<cc-pricing-product>'
title: '💡 Smart (runtime)'
---
# 💡 Smart `<cc-pricing-product>` for runtimes

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="https://www.clever-cloud.com/doc/clever-components/?path=/docs/%F0%9F%9B%A0-pricing-cc-pricing-product--default-story"><code>&lt;cc-pricing-product&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-pricing-product[mode="runtime"]</code>
  <tr><td><strong>Requires auth</strong> <td>No
</table>

## ⚙️ Params

<table>
  <tr><th>Name                      <th>Type                <th>Details                                                                                                                <th>Default
  <tr><td><code>productId</code>    <td><code>String</code> <td>Variant slug from <a href="https://api.clever-cloud.com/v2/products/instances"><code>/v2/products/instances</code></a> <td>
  <tr><td><code>zoneId</code>       <td><code>String</code> <td>Name from <a href="https://api.clever-cloud.com/v4/products/zones"><code>/v4/products/zones</code></a>                 <td><code>par</code>
  <tr><td><code>currencyCode</code> <td><code>String</code> <td>ISO 4217 currency code                                                                                                 <td><code>EUR</code>
</table>

## ⚠️ Warnings!

* Right now, change rates are fetched from a hard coded list of currencies.

## 🌐 API endpoints

<table>
  <tr><th>Method <th>URL                                           <th>Cache?
  <tr><td>GET    <td><code>/v2/products/instances</code>           <td>1 day
  <tr><td>GET    <td><code>/v4/billing/price-system?zone_id</code> <td>1 day
</table>

## ⬇️️ Examples

### Simple

Simple example based on default zone and currency.

```html
<cc-smart-container context='{ "productId": "node" }'>
  <cc-pricing-product mode="runtime"></cc-pricing-product>
</cc-smart-container>
```

<cc-smart-container context='{ "productId": "node" }'>
  <cc-pricing-product mode="runtime"></cc-pricing-product>
</cc-smart-container>

### Zone and currency

Simple example with custom zone and custom currency.

NOTE: Prices are the same on all zones right now.

```html
<cc-smart-container context='{ "productId": "node", "zoneId": "rbx", "currencyCode": "USD" }'>
  <cc-pricing-product mode="runtime"></cc-pricing-product>
</cc-smart-container>
```

<cc-smart-container context='{ "productId": "node", "zoneId": "rbx", "currencyCode": "USD" }'>
  <cc-pricing-product mode="runtime"></cc-pricing-product>
</cc-smart-container>

### Override name, icons, description

As described in the `<cc-pricing-product>` stories, you can set the name or icon via slots.
This will override the data that comes from the smart component:

```html
<cc-smart-container context='{ "productId": "jar" }'>
  <cc-pricing-product mode="runtime">
    <img slot="icon" src="https://static-assets.cellar.services.clever-cloud.com/logos/java-jar.svg" alt="">
    <img slot="icon" src="https://static-assets.cellar.services.clever-cloud.com/logos/scala.svg" alt="">
    <img slot="icon" src="https://static-assets.cellar.services.clever-cloud.com/logos/maven.svg" alt="">
    <img slot="icon" src="https://static-assets.cellar.services.clever-cloud.com/logos/gradle.svg" alt="">
    <div slot="name">JVM: Java, Scala...</div>
    <div>
      Bla bla about JVM based apps using Java, Scala etc...
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id.
    </div>
  </cc-pricing-product>
</cc-smart-container>
```

<cc-smart-container context='{ "productId": "jar" }'>
  <cc-pricing-product mode="runtime">
    <img slot="icon" src="https://static-assets.cellar.services.clever-cloud.com/logos/java-jar.svg" alt="">
    <img slot="icon" src="https://static-assets.cellar.services.clever-cloud.com/logos/scala.svg" alt="">
    <img slot="icon" src="https://static-assets.cellar.services.clever-cloud.com/logos/maven.svg" alt="">
    <img slot="icon" src="https://static-assets.cellar.services.clever-cloud.com/logos/gradle.svg" alt="">
    <div slot="name">JVM: Java, Scala...</div>
    <div>
      Bla bla about JVM based apps using Java, Scala etc...
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id.
    </div>
  </cc-pricing-product>
</cc-smart-container>
