---
kind: '🛠 Overview/<cc-tile-status-codes>'
title: '💡 Smart'
---
# 💡 Smart `<cc-tile-status-codes>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="https://www.clever-cloud.com/developers/doc/clever-components/?path=/docs/ ..."><code>&lt;cc-tile-status-codes&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-tile-status-codes</code>
  <tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

<table>
  <tr><th>Name                   <th>Type                   <th>Details                                                     <th>Default
  <tr><td><code>apiConfig</code> <td><code>ApiConfig</code> <td>Object with API configuration (target host, tokens...)      <td>
  <tr><td><code>ownerId</code>   <td><code>String</code>    <td>UUID prefixed with <code>user_</code> or <code>orga_</code> <td>
  <tr><td><code>appId</code>     <td><code>String</code>    <td>UUID prefixed with <code>app_</code> (optional)             <td>
</table>

```js
interface ApiConfig {
  API_HOST: String,
  WARP_10_HOST: String,
  API_OAUTH_TOKEN: String,
  API_OAUTH_TOKEN_SECRET: String,
  OAUTH_CONSUMER_KEY: String,
  OAUTH_CONSUMER_SECRET: String,
}
```

## 🌐 API endpoints

<table>
  <tr><th>Method <th>URL                                                 <th>Cache?
  <tr><td>GET    <td><code>/v2/w10tokens/accessLogs/read/{orgaId}</code> <td>1 day
</table>

## 🌐 Warp10 macros

<table>
  <tr><th>Method <th>Macro                                               <th>Cache?
  <tr><td>GET    <td><code>@clevercloud/accessLogs_status_code_v1</code> <td>30 seconds
</table>

## ⬇️️ Examples

### Whole organization

If you only specify a `ownerId` and no `appId`, the data represent the whole organization.

```html
<cc-smart-container context='{
  "apiConfig": {
    "API_HOST": "",
    "WARP_10_HOST": ""
    "API_OAUTH_TOKEN": "",
    "API_OAUTH_TOKEN_SECRET": "",
    "OAUTH_CONSUMER_KEY": "",
    "OAUTH_CONSUMER_SECRET": "",
  },
  "ownerId": ""
}'>
  <cc-tile-status-codes></cc-tile-status-codes>
</cc-smart-container>
```

### Application only

```html
<cc-smart-container context='{
  "apiConfig": {
    "API_HOST": "",
    "WARP_10_HOST": ""
    "API_OAUTH_TOKEN": "",
    "API_OAUTH_TOKEN_SECRET": "",
    "OAUTH_CONSUMER_KEY": "",
    "OAUTH_CONSUMER_SECRET": "",
  },
  "ownerId": "",
  "appId": ""
}'>
  <cc-tile-status-codes></cc-tile-status-codes>
</cc-smart-container>
```
