---
kind: '🛠 Addon/<cc-addon-access>'
title: '💡 Smart (Elastic)'
---
# 💡 Smart `<cc-addon-access smart-mode="elastic">`

## ℹ️ Details

<table>
<tr><td><strong>Component    </strong> <td><a href="🛠-addon-access-cc-addon-access--default-story"><code>&lt;cc-addon-access&gt;</code></a>
<tr><td><strong>Selector     </strong> <td><code>cc-addon-access[smart-mode="elastic"]</code>
<tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

| Name        | Type        | Details                                                | Default |
|-------------|-------------|--------------------------------------------------------|---------|
| `apiConfig` | `ApiConfig` | Object with API configuration (target host, tokens...) |         |
| `addonId`   | `string`    | UUID of the addon                                      |         |
| `ownerId`   | `string`    | UUID of the owner (organisation or user)               |         |

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

| Method | URL                                                              | Cache?  |
|--------|------------------------------------------------------------------|---------|
| `GET`  | `/v2/organisations/{ownerId}/addons/{addonId}`                   | Default |
| `GET`  | `/v2/providers/es-addon/{addonId}`                               | Default |

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
    "addonId": "addon_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "ownerId": "orga_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}'>
  <cc-addon-access smart-mode="elastic"></cc-addon-access>
</cc-smart-container>
```
