---
kind: '🛠 TCP Redirections/<cc-tcp-redirection-form>'
title: '💡 Smart'
---

# 💡 Smart `<cc-tcp-redirection-form>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="🛠-tcp-redirections-cc-tcp-redirection-form--default-story"><code>&lt;cc-tcp-redirection-form&gt;</code></a>
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
