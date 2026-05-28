---
kind: '🛠 Overview/<cc-tile-status-codes>'
title: '💡 Smart'
---
# 💡 Smart `<cc-tile-status-codes>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="🛠-overview-cc-tile-status-codes--default-story"><code>&lt;cc-tile-status-codes&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-tile-status-codes</code>
  <tr><td><strong>Requires auth</strong> <td>Yes
</table>

### ⚙️ Params

| Name                 | Type        | Details                                                |
|----------------------|-------------|--------------------------------------------------------|
| `apiConfig`          | `ApiConfig` | Object with API configuration (target host, tokens...) |
| `ownerId`            | `String`    | UUID prefixed with `user_` or `orga_`                  |
| `appId`              | `String`    | UUID prefixed with `app_`                              |

```ts
interface ApiConfig {
  API_HOST: String,
  API_OAUTH_TOKEN: String,
  API_OAUTH_TOKEN_SECRET: String,
  OAUTH_CONSUMER_KEY: String,
  OAUTH_CONSUMER_SECRET: String,
}
```

## 🌐 API endpoints

| Method | URL                                                   | Cache   |
|--------|-------------------------------------------------------|---------|
| `GET`  | `/v4/stats/organisations/{ownerId}/http-status-codes` | Default |

## ⬇️️ Examples

### Whole organization

If you only specify a `ownerId` and no `appId`, the data represent the whole organization.

```html
<cc-smart-container context='{
  "apiConfig": {
    "API_HOST": "",
    "API_OAUTH_TOKEN": "",
    "API_OAUTH_TOKEN_SECRET": "",
    "OAUTH_CONSUMER_KEY": "",
    "OAUTH_CONSUMER_SECRET": "",
  },
  "ownerId": ""
}'>
  <cc-tile-status-codes></cc-tile-status-codes>
</cc-smart-container>
```

### Application only

```html
<cc-smart-container context='{
  "apiConfig": {
    "API_HOST": "",
    "API_OAUTH_TOKEN": "",
    "API_OAUTH_TOKEN_SECRET": "",
    "OAUTH_CONSUMER_KEY": "",
    "OAUTH_CONSUMER_SECRET": "",
  },
  "ownerId": "",
  "appId": ""
}'>
  <cc-tile-status-codes></cc-tile-status-codes>
</cc-smart-container>
```
