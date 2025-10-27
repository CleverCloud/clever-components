---
kind: '🛠 Addon/<cc-addon-header>'
title: '💡 Smart (Pulsar)'
---
# 💡 Smart `<cc-addon-header smart-mode="pulsar">`

## ℹ️ Details

<table>
<tr><td><strong>Component    </strong> <td><a href="🛠-addons-cc-addon-header--default-story"><code>&lt;cc-addon-header&gt;</code></a>
<tr><td><strong>Selector     </strong> <td><code>cc-addon-header[smart-mode="pulsar"]</code>
<tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

| Name            | Type        | Details                                                | Default  |
|-----------------|-------------|--------------------------------------------------------|----------|
| `apiConfig`     | `ApiConfig` | Object with API configuration (target host, tokens...) |          |
| `ownerId`       | `string`    | UUID prefixed with orga_                               |          |
| `addonId`       | `string`    | ID of the add-on                                       |          |
| `productStatus` | `string`    | Status of the product                                  | Optional |


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

| Method   | URL                                                            | Cache?  |
|----------|----------------------------------------------------------------|---------|
| `GET`    | `/v2/organisations/${ownerId}/addons/${addonId}`               | Default |
| `GET`    | `/v4/products/zones?ownerId=${ownerId}`                        | Default |
| `GET`    | `/v4/addon-providers/addon-pulsar/addons/${addonId}`           | Default |


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
    "ownerId": "orga_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
    "addonId": "addon_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
    "productStatus": ""
}'>
  <cc-addon-header smart-mode="pulsar"></cc-addon-header>
</cc-smart-container>
```
