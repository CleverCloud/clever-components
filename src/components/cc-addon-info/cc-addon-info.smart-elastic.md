---
kind: '🛠 Addon/<cc-addon-info>'
title: '💡 Smart (Elastic)'
---
# 💡 Smart `<cc-addon-info smart-mode="elastic">`

## ℹ️ Details

<table>
<tr><td><strong>Component    </strong> <td><a href="🛠-addons-cc-addon-info--default-story"><code>&lt;cc-addon-info&gt;</code></a>
<tr><td><strong>Selector     </strong> <td><code>cc-addon-info[smart-mode="elastic"]</code>
<tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

| Name                          | Type          | Details                                                                                         | Default   |
| ----------------------------- | ------------- | ----------------------------------------------------------------------------------------------- | --------- |
| `apiConfig`                   | `ApiConfig`   | Object with API configuration (target host, tokens...)                                          |           |
| `ownerId`                     | `string`      | UUID prefixed with orga_                                                                        |           |
| `addonId`                     | `string`      | ID of the add-on                                                                                |           |
| `appOverviewUrlPattern`       | `string`      | Pattern for the application overview url                                                        |           |
| `scalabilityUrlPattern`       | `string`      | Pattern for the scalability url                                                                 |           |
| `grafanaLink`                 | `GrafanaLink` | Grafana configuration object (may be disabled in some environments)                             | Optional  |

```ts
interface ApiConfig {
  API_HOST: string;
  API_OAUTH_TOKEN: string;
  API_OAUTH_TOKEN_SECRET: string;
  OAUTH_CONSUMER_KEY: string;
  OAUTH_CONSUMER_SECRET: string;
}

interface GrafanaLink {
  // Base used to build the URL leading to Grafana services, usually the Grafana host name
  base: string;
  // Console route leading to the Grafana org page where users may enable / disable Grafana
  console: string;
}
```

## 🌐 API endpoints

| Method | URL                                              | Cache?   |
|--------|--------------------------------------------------|----------|
| `GET`  | `/v2/organisations/${ownerId}/addons/${addonId}` | 1 second |
| `GET`  | `/v2/providers/es-addon/${addonId}`              | 1 second |
| `GET`  | `/v4/saas/grafana/${ownerId}`                    | Default  |


## ⬇️️ Examples

```html
<cc-smart-container context='{
    "apiConfig": {
      "API_HOST": "",
      "API_OAUTH_TOKEN": "",
      "API_OAUTH_TOKEN_SECRET": "",
      "OAUTH_CONSUMER_KEY": "",
      "OAUTH_CONSUMER_SECRET": ""
    },
    "ownerId": "orga_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
    "addonId": "addon_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
    "appOverviewUrlPattern": "/organisations/orga_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/applications/:id",
    "scalabilityUrlPattern": "/organisations/orga_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/applications/:id/settings",
    "grafanaLink": {
      "base": "https://grafana.services.example.com",
      "console": "https://console.example.com/organisations/orga_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/grafana"
    }
}'>
  <cc-addon-info smart-mode="elastic"></cc-addon-info>
</cc-smart-container>
```
