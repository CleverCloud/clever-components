---
kind: '🛠 Addon/<cc-addon-credentials-beta>'
title: '💡 Smart (Pulsar)'
---
# 💡 Smart `<cc-addon-credentials-beta smart-mode="pulsar">`

## ℹ️ Details

<table>
<tr><td><strong>Component    </strong> <td><a href="🛠-addon-credentials-beta-cc-addon-credentials-beta--default-story"><code>&lt;cc-addon-credentials-beta&gt;</code></a>
<tr><td><strong>Selector     </strong> <td><code>cc-addon-credentials-beta[smart-mode="pulsar"]</code>
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

| Method   | URL                                                              | Cache?   |
|----------|------------------------------------------------------------------|----------|
| `GET`    | `/v2/organisations/${ownerId}/addons/${addonId}`                 | Default  |
| `GET`    | `/v4/addon-providers/addon-pulsar/addons/${realId}`              | 1 second |
| `GET`    | `/v4/addon-providers/addon-pulsar/clusters/${clusterId}`         | 1 second |

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
  <cc-addon-credentials-beta smart-mode="pulsar"></cc-addon-credentials-beta>
</cc-smart-container>
```
