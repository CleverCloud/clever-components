---
kind: '🛠 Overview/<cc-tile-metrics>'
title: '💡 Smart'
---
# 💡 Smart `<cc-tile-metrics>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="https://www.clever-cloud.com/doc/clever-components/?path=/docs/ ..."><code>&lt;cc-tile-metrics&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-tile-metrics</code>
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

<h1>CPU BENCH</h1>
<cc-smart-container context='{
"ownerId": "orga_2eb942c9-ae24-40fe-9e4c-53c9982a02b1",
"appId": "app_ea67204f-6a09-433d-a1a9-c0a46592545c",
"grafanaBaseLink": "https://grafana.services.clever-cloud.com/",
"consoleBaseLink": "https://console.clever-cloud.com/"
}'>
<cc-tile-metrics></cc-tile-metrics>
</cc-smart-container>

<h1>Console</h1>
<cc-smart-container context='{
"ownerId": "orga_858600a8-74f4-4d75-a8a3-f5b868be093c",
"appId": "app_1246f211-d4a7-4787-ba62-56c163a8b4ef",
"grafanaBaseLink": "https://grafana.services.clever-cloud.com/",
"consoleBaseLink": "https://console.clever-cloud.com/"
}'>
<cc-tile-metrics></cc-tile-metrics>
</cc-smart-container>

<h1>StoryBook</h1>
<cc-smart-container context='{
"ownerId": "orga_858600a8-74f4-4d75-a8a3-f5b868be093c",
"appId": "app_91d78df5-c3dd-4c7f-b09a-8628e7e54860",
"grafanaBaseLink": "https://grafana.services.clever-cloud.com/",
"consoleBaseLink": "https://console.clever-cloud.com/"
}'>
<cc-tile-metrics></cc-tile-metrics>
</cc-smart-container>



