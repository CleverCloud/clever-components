---
kind: '🛠 Addon/<cc-addon-header>'
title: '💡 Smart (Elastic)'
---
# 💡 Smart `<cc-addon-header smart-mode="elastic">`

## ℹ️ Details

<table>
<tr><td><strong>Component    </strong> <td><a href="🛠-addons-cc-addon-header--default-story"><code>&lt;cc-addon-header&gt;</code></a>
<tr><td><strong>Selector     </strong> <td><code>cc-addon-header[smart-mode="elastic"]</code>
<tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

| Name             | Type        | Details                                                                                 | Default |
|------------------|-------------|-----------------------------------------------------------------------------------------|---------|
| `apiConfig`      | `ApiConfig` | Object with API configuration (target host, tokens...)                                  |         |
| `ownerId`        | `string`    | UUID prefixed with orga_                                                                |         |
| `addonId`        | `string`    | ID of the add-on                                                                        |         |
| `logsUrlPattern` | `string`    | Pattern for the logs url (Example : `/organisations/${ownerId}/addons/${appId}/logs`)   |         |


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

| Method   | URL                                                            | Cache?   |
|----------|----------------------------------------------------------------|----------|
| `GET`    | `/v2/organisations/${ownerId}/addons/${addonId}`               | 1 second |
| `GET`    | `/v4/products/zones?ownerId=${ownerId}`                        | 1 second |
| `GET`    | `/v2/providers/es-addon/${addonId}`                            | 1 second |


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
    "logsUrlPattern": "",
}'>
  <cc-addon-header smart-mode="elastic"></cc-addon-header>
</cc-smart-container>
```
