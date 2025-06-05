---
kind: '🛠 Addon/<cc-addon-linked-apps>'
title: '💡 Smart'
---
# 💡 Smart `<cc-addon-linked-apps>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="🛠-addon-cc-addon-linked-apps--default-story"><code>&lt;cc-addon-linked-apps&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-addon-linked-apps</code>
  <tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

<table>
  <tr><th>Name                   <th>Type                   <th>Details                                                     <th>Default
  <tr><td><code>apiConfig</code> <td><code>ApiConfig</code> <td>Object with API configuration (target host, tokens...)      <td>
  <tr><td><code>ownerId</code>   <td><code>String</code>    <td>UUID prefixed with <code>user_</code> or <code>orga_</code> <td>
  <tr><td><code>addonId</code>   <td><code>String</code>    <td>UUID prefixed with <code>addon_</code>                      <td>
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

<!-- List API endpoints used by the component here with the details. -->

<table>
  <tr><th>Method <th>URL                                                               <th>Cache?
  <tr><td>GET    <td><code>/v2/organisations/{id}/addons/{addonId}/applications</code> <td>Default
  <tr><td>GET    <td><code>/v4/products/zones</code>                                   <td>1 day
</table>

## ⬇️️ Examples

```html
<cc-smart-container context='{
  "apiConfig": {
    API_HOST: "",
    API_OAUTH_TOKEN: "",
    API_OAUTH_TOKEN_SECRET: "",
    OAUTH_CONSUMER_KEY: "",
    OAUTH_CONSUMER_SECRET: "",
  },
  "ownerId": "",
  "addonId": "",
}'>
  <cc-addon-linked-apps></cc-addon-linked-apps>
</cc-smart-container>
```
