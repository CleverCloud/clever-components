---
kind: '🚧 Beta/🛠 Addons/<cc-header-addon-beta>'
title: '💡 Smart'
---
# 💡 Smart `<cc-header-addon-beta>`

## ℹ️ Details

<table>
<tr><td><strong>Component    </strong> <td><a href="🚧-beta-🛠-addons-cc-header-addon-beta--default-story"><code>&lt;cc-header-addon-beta&gt;</code></a>
<tr><td><strong>Selector     </strong> <td><code>cc-header-addon-beta</code>
<tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

| Name             | Type        | Details                                                | Default |
|------------------|-------------|--------------------------------------------------------|---------|
| `apiConfig`      | `ApiConfig` | Object with API configuration (target host, tokens...) |         |
| `ownerId`        | `string`    | UUID prefixed with orga_                               |         |
| `addonId`        | `string`    | ID of the add-on                                       |         |
| `logsUrlPattern` | `string`    | Pattern for the logs url                               |         |
| `productStatus`  | `string`    | Maturity status of the product                         |         |


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

| Method   | URL                                                                            | Cache?  |
|----------|--------------------------------------------------------------------------------|---------|
| `GET`    | `/v2/organisations/${ownerId}/addons/${addonId}`                               | Default |
| `GET`    | `/v4/products/zones?ownerId=${ownerId}`                                        | Default |
| `GET`    | `/v4/addon-providers/addon-${params.provider}/addons/${params.realId}`         | Default |
| `POST`   | `/v4/addon-providers/addon-${params.provider}/addons/${params.realId}/reboot`  | Default |
| `POST`   | `/v4/addon-providers/addon-${params.provider}/addons/${params.realId}/rebuild` | Default |


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
    "productStatus": "",
}'>
  <cc-header-addon-beta></cc-header-addon-beta>
</cc-smart-container>
```
