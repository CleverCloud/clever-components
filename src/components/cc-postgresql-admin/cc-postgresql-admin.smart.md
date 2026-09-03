---
kind: '🛠 Addon/<cc-postgresql-admin>'
title: '💡 Smart'
---
# 💡 Smart `<cc-postgresql-admin>`

## ℹ️ Details

<table>
<tr><td><strong>Component    </strong> <td><a href="🛠-addon-cc-postgresql-admin--default-story"><code>&lt;cc-postgresql-admin&gt;</code></a>
<tr><td><strong>Selector     </strong> <td><code>cc-postgresql-admin</code>
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

| Method   | URL                                                                                | Cache?   |
|----------|------------------------------------------------------------------------------------|----------|
| `GET`    | `/v4/addon-providers/postgresql-addon/addons/${addonId}/dashboard`                  | 1 second |
| `GET`    | `/v4/addon-providers/postgresql-addon/addons/${addonId}/connections`                |          |
| `DELETE` | `/v4/addon-providers/postgresql-addon/addons/${addonId}/connections`                |          |
| `POST`   | `/v4/addon-providers/postgresql-addon/addons/${addonId}/password`                   |          |
| `POST`   | `/v4/addon-providers/postgresql-addon/addons/${addonId}/reset`                      |          |
| `POST`   | `/v4/addon-providers/postgresql-addon/addons/${addonId}/extensions`                 |          |
| `POST`   | `/v4/addon-providers/postgresql-addon/addons/${addonId}/read-only-users`            |          |
| `POST`   | `/v4/addon-providers/postgresql-addon/addons/${addonId}/promote`                    |          |
| `POST`   | `/v4/addon-providers/postgresql-addon/addons/${addonId}/reboot`                     |          |
| `POST`   | `/v4/addon-providers/postgresql-addon/addons/${addonId}/direct-host`                |          |

## ⬆️️ Events

| Name                                        | Details                                                              |
|---------------------------------------------|----------------------------------------------------------------------|
| `cc-postgresql-password-was-reset`          | The database password changed, the credentials displayed elsewhere are outdated |
| `cc-postgresql-direct-host-was-generated`   | A direct hostname and port are now available for this add-on         |

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
  <cc-postgresql-admin></cc-postgresql-admin>
</cc-smart-container>
```
