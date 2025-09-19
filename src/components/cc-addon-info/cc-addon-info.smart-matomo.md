---
kind: '🛠 Addon/<cc-addon-info>'
title: '💡 Smart (Matomo)'
---
# 💡 Smart `<cc-addon-info smart-mode="matomo">`

## ℹ️ Details

<table>
<tr><td><strong>Component    </strong> <td><a href="🛠-addons-cc-addon-info--default-story"><code>&lt;cc-addon-info&gt;</code></a>
<tr><td><strong>Selector     </strong> <td><code>cc-addon-info[smart-mode="matomo"]</code>
<tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

| Name                        | Type        | Details                                                                                       | Default |
|-----------------------------|-------------|-----------------------------------------------------------------------------------------------|---------|
| `apiConfig`                 | `ApiConfig` | Object with API configuration (target host, tokens...)                                        |         |
| `ownerId`                   | `string`    | UUID prefixed with orga_                                                                      |         |
| `addonId`                   | `string`    | ID of the add-on                                                                              |         |
| `appOverviewUrlPattern`     | `string`    | Pattern for the app overview URL                                                              |         |
| `addonDashboardUrlPattern`  | `string`    | Pattern for the addon dashboard URL                                                           |         |
| `scalabilityUrlPattern`     | `string`    | Pattern for the scalability URL                                                               |         |
| `grafanaLink`               | `object`    | Base URL to build a Grafana link to the app (optional)                                       |         |
| `logsUrlPattern`            | `string`    | Pattern for the logs URL                                                                      |         |


  ```ts
interface ApiConfig {
  API_HOST: string,
  API_OAUTH_TOKEN: string,
  API_OAUTH_TOKEN_SECRET: string,
  OAUTH_CONSUMER_KEY: string,
  OAUTH_CONSUMER_SECRET: string,
}
```

## 🌐 API endpoints

| Method   | URL                                                                    | Cache?  |
|----------|------------------------------------------------------------------------|---------|
| `GET`    | `/v2/organisations/${ownerId}/addons/${addonId}`                       | Default |
| `GET`    | `/v4/addon-providers/${providerId}/addons/${realId}`                   | Default |
| `GET`    | `/v4/addon-providers/${providerId}/addons/${realId}/version/check`     | Default |
| `GET`    | `/v4/saas/organisations/${ownerId}/grafana`                            | Default |
| `POST`   | `/v4/addon-providers/${providerId}/addons/${realId}/version/update`    | Default |


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
    "appOverviewUrlPattern": "",
    "addonDashboardUrlPattern": "",
    "scalabilityUrlPattern": "",
    "grafanaLink": {
      "base": "",
      "console": ""
    },
    "logsUrlPattern": "",
}'>
  <cc-addon-info smart-mode="matomo"></cc-addon-info>
</cc-smart-container>
```
