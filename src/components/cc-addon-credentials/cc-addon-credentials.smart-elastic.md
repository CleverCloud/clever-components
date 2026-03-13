---
kind: '🛠 Addon/<cc-addon-credentials>'
title: '💡 Smart (Elastic)'
---
# 💡 Smart `<cc-addon-credentials smart-mode="elastic">`

## ℹ️ Details

<table>
<tr><td><strong>Component    </strong> <td><a href="🛠-addon-credentials-cc-addon-credentials--default-story"><code>&lt;cc-addon-credentials&gt;</code></a>
<tr><td><strong>Selector     </strong> <td><code>cc-addon-credentials[smart-mode="elastic"]</code>
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

| Method   | URL                                                    | Cache?     |
|----------|--------------------------------------------------------|------------|
| `GET`    | `/v2/providers/es-addon/${addonId}`                    | 1 second   |

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
  <cc-addon-credentials smart-mode="elastic"></cc-addon-credentials>
</cc-smart-container>
```
