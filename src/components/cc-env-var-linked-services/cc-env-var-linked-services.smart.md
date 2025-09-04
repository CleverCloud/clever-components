---
kind: '🛠 Environment variables/<cc-env-var-linked-services>'
title: '💡 Smart (env-var-linked-services)'
---
# 💡 Smart `<cc-env-var-linked-services>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="🛠-environment-variables-cc-env-var-linked-services"><code>&lt;cc-env-var-linked-services&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-env-var-linked-services</code>
  <tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

<table>
  <tr><th>Name                   <th>Type                   <th>Details                                                     <th>Default
  <tr><td><code>apiConfig</code> <td><code>ApiConfig</code> <td>Object with API configuration (target host, tokens...)      <td>
  <tr><td><code>type</code>      <td><code>'app' | 'addon'</code>    <td>Type of env vars to display linked add-ons or linked apps   <td>
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

<!-- List API endpoints used by the component here with the details. -->

<table>
  <tr><th>Method <th>URL                                                    <th>Cache?
  <tr><td>GET    <td><code>/v2/applications/{appId}/dependencies/env</code> <td>Default
  <tr><td>GET    <td><code>/v2/applications/{appId}/addons/env</code>       <td>Default
</table>

## ⬇️️ Examples

- Linked applications:
```html
<cc-smart-container context='{
  "apiConfig": {
    API_HOST: "",
    API_OAUTH_TOKEN: "",
    API_OAUTH_TOKEN_SECRET: "",
    OAUTH_CONSUMER_KEY: "",
    OAUTH_CONSUMER_SECRET: "",
  },
  "type": "app",
  "ownerId": "",
  "appId": "",
}'>
  <cc-env-var-linked-services></cc-env-var-linked-services>
</cc-smart-container>
```

- Linked addons:
```html
<cc-smart-container context='{
  "apiConfig": {
    API_HOST: "",
    API_OAUTH_TOKEN: "",
    API_OAUTH_TOKEN_SECRET: "",
    OAUTH_CONSUMER_KEY: "",
    OAUTH_CONSUMER_SECRET: "",
  },
  "type": "addon",
  "ownerId": "",
  "appId": "",
}'>
  <cc-env-var-linked-services></cc-env-var-linked-services>
</cc-smart-container>
```
