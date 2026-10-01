---
kind: '🛠 Addon/<cc-addon-info>'
title: '💡 Smart (PostgreSQL)'
---
# 💡 Smart `<cc-addon-info smart-mode="postgresql">`

## ℹ️ Details

<table>
<tr><td><strong>Component    </strong> <td><a href="🛠-addon-cc-addon-info--default-story"><code>&lt;cc-addon-info&gt;</code></a>
<tr><td><strong>Selector     </strong> <td><code>cc-addon-info[smart-mode="postgresql"]</code>
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

| Method   | URL                                                                 | Cache?   |
|----------|---------------------------------------------------------------------|----------|
| `GET`    | `/v2/organisations/${ownerId}/addons/${addonId}`                    |          |
| `GET`    | `/v4/addon-providers/postgresql-addon/addons/${addonId}/dashboard`  | 1 second |

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
  <cc-addon-info smart-mode="postgresql"></cc-addon-info>
</cc-smart-container>
```
