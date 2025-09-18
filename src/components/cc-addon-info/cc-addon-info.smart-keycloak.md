---
kind: '🛠 Addon/<cc-addon-info>'
title: '💡 Smart (Keycloak)'
---
# 💡 Smart `<cc-addon-info smart-mode="keycloak">`

## ℹ️ Details

<table>
<tr><td><strong>Component    </strong> <td><a href="🛠-addons-cc-addon-info--default-story"><code>cc-addon-info</code></a>
<tr><td><strong>Selector     </strong> <td><code>cc-addon-info[smart-mode="keycloak"]</code>
<tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

| Name                          | Type          | Details                                                                                         | Default   |
| ----------------------------- | ------------- | ----------------------------------------------------------------------------------------------- | --------- |
| `apiConfig`                   | `ApiConfig`   | Object with API configuration (target host, tokens...)                                          |           |
| `ownerId`                     | `string`      | UUID prefixed with orga_                                                                        |           |
| `addonId`                     | `string`      | ID of the add-on                                                                                |           |
| `appOverviewUrlPattern`       | `string`      | Pattern for the application overview url                                                        |           |
| `addonDashboardUrlPattern`    | `string`      | Pattern for the addon dashboard url                                                             |           |
| `scalabilityUrlPattern`       | `string`      | Pattern for the scalability url                                                                 |           |
| `grafanaLink`                 | `GrafanaLink` | Grafana configuration object (may be disabled in some environments)                             | Optional  |
| `logsUrlPattern`              | `string`      | Pattern for the logs url (Example : `/organisations/${ownerId}/applications/${appId}/logs`)     |           |

```ts
interface ApiConfig {
  API_HOST: string;
  API_OAUTH_TOKEN: string;
  API_OAUTH_TOKEN_SECRET: string;
  OAUTH_CONSUMER_KEY: string;
  OAUTH_CONSUMER_SECRET: string;
}

interface GrafanaLink {
  base: string;
  console: string;
}
```

## 🌐 API endpoints

| Method   | URL                                                                       | Cache?  |
|----------|---------------------------------------------------------------------------|---------|
| `GET`    | `/v2/organisations/${ownerId}/addons/${addonId}`                          | Default |
| `GET`    | `/v4/addon-providers/addon-keycloak/addons/${realId}`                     | Default |
| `GET`    | `/v4/addon-providers/addon-keycloak/addons/${realId}/version/check`       | Default |
| `GET`    | `/v2/organisations/${ownerId}/grafana`                                    | Default |
| `POST`   | `/v4/addon-providers/addon-${providerId}/addons/${realId}/version/update` | Default |

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
    "ownerId": "",
    "addonId": "",
    "appOverviewUrlPattern": "",
    "addonDashboardUrlPattern": "", 
    "scalabilityUrlPattern": "",
    "grafanaLink": {
      "base": "",
      "console": ""
    },
    "logsUrlPattern": ""
}'>
  <cc-addon-info smart-mode="keycloak"></cc-addon-info>
</cc-smart-container>
```
