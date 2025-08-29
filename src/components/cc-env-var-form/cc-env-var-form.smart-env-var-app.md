---
kind: '🛠 Environment variables/<cc-env-var-form>'
title: '💡 Smart (env-var-app)'
---
# 💡 Smart `<cc-env-var-form context="env-var-app">` for application environment variables

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="🛠-environment-variables-cc-env-var-form--data-loaded-with-context-env-var-app"><code>&lt;cc-env-var-form&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-env-var-form[context="env-var-app"]</code>
  <tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

<table>
  <tr><th>Name                          <th>Type                       <th>Details                                                     <th>Default
  <tr><td><code>apiConfig</code>        <td><code>ApiConfig</code>     <td>Object with API configuration (target host, tokens...)      <td>
  <tr><td><code>ownerId</code>          <td><code>String</code>        <td>UUID prefixed with <code>user_</code> or <code>orga_</code> <td>
  <tr><td><code>appId</code>            <td><code>String</code>        <td>UUID prefixed with <code>app_</code>                        <td>
  <tr><td><code>logsUrlPattern</code>   <td><code>String</code>        <td>Pattern for the logs url                                    <td>
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
  <tr><th>Method  <th>URL                                                                        <th>Cache?
  <tr><td>GET     <td><code>/v2/organisations/{ownerId}/applications/{appId}/env</code>          <td>Default
  <tr><td>GET     <td><code>/v2/organisations/{ownerId}/applications/{appId}/deployments</code>  <td>Default
  <tr><td>PUT     <td><code>/v2/organisations/{ownerId}/applications/{appId}/env</code>          <td>Default
  <tr><td>POST    <td><code>/v2$/organisations/{ownerId}/applications/${appId}/instances`</code> <td>Default
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
  "appId": "",
  "logsUrlPattern": "",
}'>
  <cc-env-var-form context="env-var-app"></cc-env-var-form>
</cc-smart-container>
```
