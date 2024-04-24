---
kind: '🛠 Environment variables/<cc-env-var-form>'
title: '💡 Smart (exposed-config)'
---

# 💡 Smart `<cc-env-var-form>` for exposed configuration

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="https://www.clever-cloud.com/doc/clever-components/?path=/story/🛠-environment-variables-cc-env-var-form--data-loaded-with-context-exposed-config"><code>&lt;cc-env-var-form&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-env-var-form[context="exposed-config"]</code>
  <tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

<table>
  <tr><th>Name                   <th>Type                   <th>Details                                                     <th>Default
  <tr><td><code>apiConfig</code> <td><code>ApiConfig</code> <td>Object with API configuration (target host, tokens...)      <td>
  <tr><td><code>ownerId</code>   <td><code>String</code>    <td>UUID prefixed with <code>user_</code> or <code>orga_</code> <td>
  <tr><td><code>appId</code>     <td><code>String</code>    <td>UUID prefixed with <code>app_</code>                        <td>
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
  <tr><td>GET    <td><code>/v2/organisations/{id}/applications/{appId}</code>             <td>Default
  <tr><td>GET    <td><code>/v2/organisations/{id}/applications/{appId}/exposed_env</code> <td>Default
  <tr><td>PUT    <td><code>/v2/organisations/{id}/applications/{appId}/exposed_env</code> <td>Default
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
  "ownerId": "",
  "appId": ""
}'
>
  <cc-env-var-form context="exposed-config"></cc-env-var-form>
</cc-smart-container>
```
