---
kind: '🛠 Addon/<cc-addon-backups>'
title: '💡 Smart'
---
# 💡 Smart `<cc-addon-backups>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="🛠-addon-cc-addon-backups--default-story"><code>&lt;cc-addon-backups&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-addon-backups</code>
  <tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

| Name        | Type        | Details                                                     | Default |
|-------------|-------------|-------------------------------------------------------------|---------|
| `apiConfig` | `ApiConfig` | Object with API configuration (target host, tokens...)      |         |
| `ownerId`   | `String`    | UUID prefixed with <code>user_</code> or <code>orga_</code> |         |
| `addonId`   | `String`    | UUID prefixed with <code>addon_</code>                      |         |

```typescript
interface ApiConfig {
  API_HOST: String,
  API_OAUTH_TOKEN: String,
  API_OAUTH_TOKEN_SECRET: String,
  OAUTH_CONSUMER_KEY: String,
  OAUTH_CONSUMER_SECRET: String,
}
```

## 🌐 API endpoints

| Method   | URL                                                 | Cache?  |
|----------|-----------------------------------------------------|---------|
| `GET`    | `/v2/addons/{addonId}`                              | Default |
| `GET`    | `/v2/backups/{ownerId}/{ref}`                       | Default |
| `GET`    | `/v4/addon-providers/{providerId}/addons/{addonId}` | Default |

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
  "addonId": ""
}'>
  <cc-addon-backups></cc-addon-backups>
</cc-smart-container>
```
