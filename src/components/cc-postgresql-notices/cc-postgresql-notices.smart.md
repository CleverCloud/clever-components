---
kind: '🛠 Addon/<cc-postgresql-notices>'
title: '💡 Smart'
---
# 💡 Smart `<cc-postgresql-notices>`

## ℹ️ Details

<table>
<tr><td><strong>Component    </strong> <td><a href="🛠-addon-cc-postgresql-notices--default-story"><code>&lt;cc-postgresql-notices&gt;</code></a>
<tr><td><strong>Selector     </strong> <td><code>cc-postgresql-notices</code>
<tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

| Name        | Type        | Details                                                | Default |
|-------------|-------------|--------------------------------------------------------|---------|
| `apiConfig` | `ApiConfig` | Object with API configuration (target host, tokens...) |         |
| `addonId`   | `string`    | UUID of the addon                                      |         |

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

| Method   | URL                                                                | Cache?   |
|----------|--------------------------------------------------------------------|----------|
| `GET`    | `/v4/addon-providers/postgresql-addon/addons/${addonId}/dashboard` | 1 second |

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
  <cc-postgresql-notices></cc-postgresql-notices>
</cc-smart-container>
```
