---
kind: '🛠 Addon/<cc-addon-admin>'
title: '💡 Smart'
---
# 💡 Smart `<cc-addon-admin>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="🛠-addon-cc-addon-admin--default-story"><code>&lt;cc-addon-admin&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-addon-admin</code>
  <tr><td><strong>Requires auth</strong> <td>Yes
</table>

## 👋️ Events fired

| Name                         | Payload                          | Details                                                                                                                             |
| ---------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `cc-addon-was-deleted`       | `{ id: string, name: string}`    | Fired when the add-on has been deleted successfully.<br/>Should be used to redirect to another page                                 |
| `cc-addon-name-was-changed`  | `{ id: string, name: string}`    | Fired when the add-on name has been changed successfully.<br/>Should be used to refresh the menu                                    |
| `cc-addon-tags-was-changed`  | `{ id: string, tags: string[] }` | Fired when the add-on tags have been changed successfully.<br/>Should be used to refresh tag-driven views (e.g. the sidebar)        |

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

| Method   | URL                         | Cache?  |
|----------|-----------------------------|---------|
| `GET`    | `/v2/addons/{addonId}`      | Default |
| `GET`    | `/v2/addons/{addonId}/tags` | Default |
| `PUT`    | `/v2/addons/{addonId}`      | Default |
| `PUT`    | `/v2/addons/{addonId}/tags` | Default |
| `DELETE` | `/v2/addons/{addonId}`      | Default |

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
  <cc-addon-admin></cc-addon-admin>
</cc-smart-container>
```
