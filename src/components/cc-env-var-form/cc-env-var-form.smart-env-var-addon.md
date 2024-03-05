---
kind: '🛠 Environment variables/<cc-env-var-form>'
title: '💡 Smart (env-var-addon)'
---
# 💡 Smart `<cc-env-var-form>` for add-on environment variables

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="https://www.clever-cloud.com/doc/clever-components/?path=/story/🛠-environment-variables-cc-env-var-form--data-loaded-with-context-env-var-addon"><code>&lt;cc-env-var-form&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-env-var-form[context="env-var-addon"]</code>
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
  <tr><th>Method <th>URL                                                      <th>Cache?
  <tr><td>GET    <td><code>/v2/organisations/{id}/addons/{addonId}/env</code> <td>Default
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
  <cc-env-var-form context="env-var-addon"></cc-env-var-form>
</cc-smart-container>
```
