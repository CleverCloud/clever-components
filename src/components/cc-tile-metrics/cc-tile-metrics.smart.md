---
kind: '🛠 Overview/<cc-tile-metrics>'
title: '💡 Smart'
---
# 💡 Smart `<cc-tile-metrics>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="https://www.clever-cloud.com/doc/clever-components/?path=/docs/🛠-overview-cc-tile-metrics--default-story"><code>&lt;cc-tile-metrics&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-tile-metrics</code>
  <tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

| Name                 | Type        | Details                                                |
|----------------------|-------------|--------------------------------------------------------|
| `apiConfig`          | `ApiConfig` | Object with API configuration (target host, tokens...) |
| `ownerId`            | `String`    | UUID prefixed with `user_` or `orga_`                  |
| `appId`              | `String`    | UUID prefixed with `app_`                              |
| `consoleGrafanaLink` | `String`    | Base link to the Console Grafana page                  |
| `grafanaBaseLink`    | `String`    | Base link to Grafana                                   |


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

| Method | URL                                                                                                          | Cache   |
|--------|--------------------------------------------------------------------------------------------------------------|---------|
| `GET`  | `/v4/metrics/organisations/{ownerId}/resources/{appId}/metrics?interval="P1D"&span="PT1H"&only=cpu&only=mem` | Default |
| `GET`  | `/v4/saas/grafana/{ownerId}`                                                                                 | Default |



## ⬇️️ Examples

```html
<cc-smart-container context='{
  "apiConfig": {
    "API_HOST": "",
    "API_OAUTH_TOKEN": "",
    "API_OAUTH_TOKEN_SECRET": "",
    "OAUTH_CONSUMER_KEY": "",
    "OAUTH_CONSUMER_SECRET": "",
  },
  "ownerId": "",
  "appId": "",
  "consoleGrafanaLink": "",
  "grafanaBaseLink": ""
}'>
  <cc-tile-metrics></cc-tile-metrics>
</cc-smart-container>
```
