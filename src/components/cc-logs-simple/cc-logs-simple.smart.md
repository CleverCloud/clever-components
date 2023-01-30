---
kind: '🛠 Logs/<cc-logs-simple>'
title: '💡 Smart'
---

# 💡 Smart `<cc-logs-simple>`

<cc-smart-container context='{"ownerId": "user_f704a8cf-28d5-449d-b269-1db6a2e932c7", "sourceType": "app", "sourceId": "app_3af80970-d8bf-47ab-af5c-e56fb6c481f4"}'>
  <cc-logs-simple></cc-logs-simple>
</cc-smart-container>

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="https://www.clever-cloud.com/doc/clever-components/?path=/story/%F0%9F%9B%A0-logs-cc-logs--default-story"><code>&lt;cc-logs&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-logs</code>
  <tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

<table>
  <tr><th>Name                   <th>Type                   <th>Details                                                     <th>Default
  <tr><td><code>apiConfig</code> <td><code>ApiConfig</code> <td>Object with API configuration (target host, tokens...)      <td>
  <tr><td><code>ownerId</code>   <td><code>String</code>    <td>UUID prefixed with <code>user_</code> or <code>orga_</code> <td>
  <tr><td><code>appId</code>     <td><code>String</code>    <td>UUID prefixed with <code>app_</code>                        <td>
</table>

```ts
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
  <tr><th>Method <th>URL                                                                             <th>Cache?
  <tr><td>GET    <td><code>/v2/organisations/{id}/namespaces</code>                                  <td>Default
  <tr><td>GET    <td><code>/v2/organisations/{id}/applications/{appId}/tcpRedirs</code>              <td>Default
  <tr><td>POST   <td><code>/v2/organisations/{id}/applications/{appId}/tcpRedirs</code>              <td>Default
  <tr><td>DELETE <td><code>/v2/organisations/{id}/applications/{appId}/tcpRedirs/{sourcePort}</code> <td>Default
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
  "appId": ""
}'>
  <cc-logs-simple></cc-logs-simple>
</cc-smart-container>
```
