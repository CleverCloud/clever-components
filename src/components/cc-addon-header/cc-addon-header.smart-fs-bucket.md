---
kind: '🛠 Addon/<cc-addon-header>'
title: '💡 Smart (FS Bucket)'
---
# 💡 Smart `<cc-addon-header smart-mode="fs-bucket">`

## ℹ️ Details

<table>
<tr><td><strong>Component    </strong> <td><a href="🛠-addons-cc-addon-header--default-story"><code>&lt;cc-addon-header&gt;</code></a>
<tr><td><strong>Selector     </strong> <td><code>cc-addon-header[smart-mode="fs-bucket"]</code>
<tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

| Name        | Type        | Details                                                | Default |
|-------------|-------------|--------------------------------------------------------|---------|
| `apiConfig` | `ApiConfig` | Object with API configuration (target host, tokens...) |         |
| `ownerId`   | `string`    | UUID prefixed with orga_                               |         |
| `addonId`   | `string`    | ID of the add-on                                       |         |


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
| `GET`    | `/v4/products/zones/${zoneName}`                               | 1 second |


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
    "addonId": "addon_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
}'>
  <cc-addon-header smart-mode="fs-bucket"></cc-addon-header>
</cc-smart-container>
```
