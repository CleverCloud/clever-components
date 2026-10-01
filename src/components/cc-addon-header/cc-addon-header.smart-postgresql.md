---
kind: '🛠 Addon/<cc-addon-header>'
title: '💡 Smart (PostgreSQL)'
---
# 💡 Smart `<cc-addon-header smart-mode="postgresql">`

## ℹ️ Details

<table>
<tr><td><strong>Component    </strong> <td><a href="🛠-addon-cc-addon-header--default-story"><code>&lt;cc-addon-header&gt;</code></a>
<tr><td><strong>Selector     </strong> <td><code>cc-addon-header[smart-mode="postgresql"]</code>
<tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

| Name            | Type        | Details                                                | Default |
|-----------------|-------------|--------------------------------------------------------|---------|
| `apiConfig`     | `ApiConfig` | Object with API configuration (target host, tokens...) |         |
| `addonId`       | `string`    | UUID of the addon                                      |         |
| `ownerId`       | `string`    | UUID of the owner (organisation or user)               |         |
| `productStatus` | `string`    | Status of the product (optional)                       |         |

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

| Method   | URL                                                | Cache?   |
|----------|----------------------------------------------------|----------|
| `GET`    | `/v2/organisations/${ownerId}/addons/${addonId}`   | 1 second |
| `GET`    | `/v4/products/zones/${zoneName}`                   | 1 second |

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
    "addonId": "addon_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
    "ownerId": "orga_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
}'>
  <cc-addon-header smart-mode="postgresql"></cc-addon-header>
</cc-smart-container>
```
