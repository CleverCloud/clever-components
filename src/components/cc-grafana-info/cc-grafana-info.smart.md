---
kind: '🛠 Saas/<cc-grafana-info>'
title: '💡 Smart'
---
# 💡 Smart `<cc-grafana-info>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="https://www.clever-cloud.com/doc/clever-components/?path=/story/🛠-saas-cc-grafana-info--default-story"><code>&lt;cc-grafana-info&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-grafana-info</code>
  <tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

<table>
  <tr><th>Name                          <th>Type                   <th>Details                                                     <th>Default
  <tr><td><code>apiConfig</code>        <td><code>ApiConfig</code> <td>Object with API configuration (target host, tokens...)      <td>
  <tr><td><code>ownerId</code>          <td><code>String</code>    <td>UUID prefixed with <code>user_</code> or <code>orga_</code> <td>
  <tr><td><code>grafanaBaseLink</code>  <td><code>String</code>    <td>Base URL to the Grafana                                     <td>
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
  <tr><th>Method <th>URL                                                   <th>Cache?
  <tr><td>GET    <td><code>/v4/saas/grafana/{id}</code>                    <td>Default
  <tr><td>POST   <td><code>/v4/saas/grafana/{id}</code>                    <td>Default
  <tr><td>DELETE <td><code>/v4/saas/grafana/{id}</code>                    <td>Default
  <tr><td>POST   <td><code>/v4/saas/grafana/{id}/reset</code>              <td>Default
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
  "grafanaBaseLink": ""
}'>
  <cc-grafana-info></cc-grafana-info>
</cc-smart-container>
```
