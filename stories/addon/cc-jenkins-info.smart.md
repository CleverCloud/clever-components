---
kind: '🛠 Addon/<cc-jenkins-info>'
title: '💡 Smart'
---
# 💡 Smart `<cc-jenkins-info>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="https://www.clever-cloud.com/doc/clever-components/?path=/docs/%F0%9F%9B%A0-addon-cc-jenkins-info--default-story"><code>&lt;cc-jenkins-info&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-jenkins-info</code>
  <tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

<table>
  <tr><th>Name                   <th>Type                   <th>Details                                                     <th>Default
  <tr><td><code>apiConfig</code> <td><code>ApiConfig</code> <td>Object with API configuration (target host, tokens...)      <td>
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
  <tr><th>Method <th>URL                                                                    <th>Cache?
  <tr><td>GET    <td><code>/v4/addon-providers/{providerId}/addons/{addonId}</code>         <td>Default
  <tr><td>GET    <td><code>/v4/addon-providers/jenkins/addons/{addonId}/updates</code>      <td>Default
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
  "addonId": "",
}'>
  <cc-jenkins-info></cc-jenkins-info>
</cc-smart-container>
```
