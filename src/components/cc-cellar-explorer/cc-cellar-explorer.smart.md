---
kind: '🚧 Beta/🛠 Cellar Explorer/<cc-cellar-explorer-beta>'
title: '💡 Smart'
---
# 💡 Smart `<cc-cellar-explorer-beta>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="🚧-beta-🛠-cellar-explorer-cc-cellar-explorer-beta--default-story"><code>&lt;cc-cellar-explorer-beta&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-cellar-explorer-beta</code>
  <tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

| Name              | Type        | Details                                  | Default |
|-------------------|-------------|------------------------------------------|---------|
| `apiConfig`       | `ApiConfig` | Object with API configuration            |         |
| `cellarProxyUrl`  | `String`    | URL of the Cellar proxy backend          |         |
| `ownerId`         | `String`    | ID of the owner (organization or user)   |         |
| `addonId`         | `String`    | ID of the Cellar addon                   |         |


```typescript
interface ApiConfig {
  API_HOST: string;
  API_OAUTH_TOKEN: string;
  API_OAUTH_TOKEN_SECRET: string;
  OAUTH_CONSUMER_KEY: string;
  OAUTH_CONSUMER_SECRET: string;
}
```

## 🌐 API endpoints

### Clever Cloud API

| Method | URL                                                | Cache?  |
|--------|----------------------------------------------------|---------|
| `GET`  | `/v2/organisations/{ownerId}/addons/{addonId}/env` | Default |

### Cellar Proxy API (via `cellarProxyUrl`)

| Method | URL                      | Cache?  |
|--------|--------------------------|---------|
| `POST` | `/cellar/bucket/_list`   | Default |
| `POST` | `/cellar/bucket/_create` | Default |
| `POST` | `/cellar/bucket/_get`    | Default |
| `POST` | `/cellar/bucket/_delete` | Default |

## ⬇️️ Examples

```html
<cc-smart-container context='{
  "apiConfig": {
    "API_HOST": "https://api.clever-cloud.com",
    "API_OAUTH_TOKEN": "...",
    "API_OAUTH_TOKEN_SECRET": "...",
    "OAUTH_CONSUMER_KEY": "...",
    "OAUTH_CONSUMER_SECRET": "..."
  },
  "cellarProxyUrl": "https://file-explorer-proxy.services.clever-cloud.com",
  "ownerId": "orga_...",
  "addonId": "addon_..."
}'>
  <cc-cellar-explorer-beta></cc-cellar-explorer-beta>
</cc-smart-container>
```
