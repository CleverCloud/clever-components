---
kind: '🛠 TCP Redirections/<cc-tcp-redirection-form>'
title: '💡 Smart'
---

# 💡 Smart `<cc-tcp-redirection-form>`

<button class="toggle">null</button>
<button class="toggle" data-id="app_8f5610ab-1d9f-41b6-854f-85d9a115e417">node</button>
<button class="toggle" data-id="app_b75977aa-563f-40fd-a592-224a5f6afbd6">java</button>
<button class="connect">connect</button>
<button class="disconnect">disconnect</button>

<cc-smart-container context='{
  "ownerId": "orga_3547a882-d464-4c34-8168-add4b3e0c135"
}'>
  <cc-tcp-redirection-form></cc-tcp-redirection-form>
</cc-smart-container>
<div class="inert"></div>

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="https://www.clever-cloud.com/doc/clever-components/?path=/story/%F0%9F%9B%A0-tcp-redirections-cc-tcp-redirection-form--default-story"><code>&lt;cc-tcp-redirection-form&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-tcp-redirection-form</code>
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
  <cc-tcp-redirection-form></cc-tcp-redirection-form>
</cc-smart-container>
```
