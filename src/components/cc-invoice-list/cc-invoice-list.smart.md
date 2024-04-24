---
kind: '🛠 Invoices/<cc-invoice-list>'
title: '💡 Smart'
---

# 💡 Smart `<cc-invoice-list>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="https://www.clever-cloud.com/doc/clever-components/?path=/story/🛠-invoices-cc-invoice-list--default-story"><code>&lt;cc-invoice-list&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-invoice-list</code>
  <tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

<table>
  <tr><th>Name                       <th>Type                   <th>Details                                                     <th>Default
  <tr><td><code>apiConfig</code>     <td><code>ApiConfig</code> <td>Some details about this param                               <td>
  <tr><td><code>ownerId</code>       <td><code>String</code>    <td>UUID prefixed with <code>user_</code> or <code>orga_</code> <td>
</table>

```js
interface ApiConfig {
  API_HOST: String,
  API_OAUTH_TOKEN: String,
  API_OAUTH_TOKEN_SECRET: String,
  OAUTH_CONSUMER_KEY: String,
  OAUTH_CONSUMER_SECRET: String,
}
```

## 🌐 API endpoints

<table>
  <tr><th>Method <th>URL                                                  <th>Cache?
  <tr><td>GET    <td><code>/v4/billing/organisations/{id}/invoices</code> <td>Default
</table>

## ⬇️️ Examples

```html
<cc-smart-container
  context='{
  "apiConfig": {
    API_HOST: "",
    API_OAUTH_TOKEN: "",
    API_OAUTH_TOKEN_SECRET: "",
    OAUTH_CONSUMER_KEY: "",
    OAUTH_CONSUMER_SECRET: "",
  },
  "ownerId": ""
}'
>
  <cc-invoice-list></cc-invoice-list>
</cc-smart-container>
```
