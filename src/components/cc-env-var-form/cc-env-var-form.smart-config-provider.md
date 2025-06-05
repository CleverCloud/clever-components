---
kind: '🛠 Environment variables/<cc-env-var-form>'
title: '💡 Smart (config-provider)'
---
# 💡 Smart `<cc-env-var-form>` for the add-on configuration provider

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="🛠-environment-variables-cc-env-var-form--data-loaded-with-context-config-provider"><code>&lt;cc-env-var-form&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-env-var-form[context="config-provider"]</code>
  <tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

<table>
  <tr><th>Name                   <th>Type                   <th>Details                                                     <th>Default
  <tr><td><code>apiConfig</code> <td><code>ApiConfig</code> <td>Object with API configuration (target host, tokens...)      <td>
  <tr><td><code>ownerId</code>   <td><code>String</code>    <td>UUID prefixed with <code>user_</code> or <code>orga_</code> <td>
  <tr><td><code>addonId</code>   <td><code>String</code>    <td>UUID prefixed with <code>config_</code>                     <td>
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
  <tr><th>Method <th>URL                                                                       <th>Cache?
  <tr><td>GET    <td><code>/v2/organisations/{ownerId}/addons/${addonId}</code>            <td>Default
  <tr><td>GET    <td><code>/v4/addon-providers/config-provider/addons/{realAddonId}/env</code> <td>Default
  <tr><td>PUT    <td><code>/v4/addon-providers/config-provider/addons/{realAddonId}/env</code> <td>Default
</table>

The first call is used to display the add-on name and to retrieve the real add-on ID for the other API calls.

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
  "addonId": ""
}'>
  <cc-env-var-form context="config-provider"></cc-env-var-form>
</cc-smart-container>
```
