---
kind: '🛠 Addon/<cc-addon-credentials>'
title: '💡 Smart (PostgreSQL)'
---
# 💡 Smart `<cc-addon-credentials smart-mode="postgresql">`

## ℹ️ Details

<table>
<tr><td><strong>Component    </strong> <td><a href="🛠-addon-cc-addon-credentials--default-story"><code>&lt;cc-addon-credentials&gt;</code></a>
<tr><td><strong>Selector     </strong> <td><code>cc-addon-credentials[smart-mode="postgresql"]</code>
<tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

| Name                       | Type        | Details                                                                       | Default |
|----------------------------|-------------|-------------------------------------------------------------------------------|---------|
| `apiConfig`                | `ApiConfig` | Object with API configuration (target host, tokens...)                        |         |
| `addonId`                  | `string`    | UUID of the addon                                                             |         |
| `credentialsRefreshToken`  | `string`    | Change this value to fetch the credentials again (optional)                   |         |

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
    "addonId": "addon_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
}'>
  <cc-addon-credentials smart-mode="postgresql"></cc-addon-credentials>
</cc-smart-container>
```
