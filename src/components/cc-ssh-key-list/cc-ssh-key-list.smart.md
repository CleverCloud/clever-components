---
kind: '🛠 Profile/<cc-ssh-key-list>'
title: '💡 Smart'
---

# 💡 Smart `<cc-ssh-key-list>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="🛠-profile-cc-ssh-key-list--default-story"><code>&lt;cc-ssh-key-list&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-ssh-key-list</code>
  <tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

| Name        | Type        | Details                                                | Default |
|-------------|-------------|--------------------------------------------------------|---------|
| `apiConfig` | `ApiConfig` | Object with API configuration (target host, tokens...) |         |

```js
interface ApiConfig {
  API_HOST: String,
  API_OAUTH_TOKEN: String,
  API_OAUTH_TOKEN_SECRET: String,
  OAUTH_CONSUMER_KEY: String,
  OAUTH_CONSUMER_SECRET: String,
}
```

## 🌐 API endpoints

| Method   | URL                          | Cache?  |
|----------|------------------------------|---------|
| `GET`    | `/v2/self`                   | 1 day   |
| `GET`    | `/v2/self/keys`              | Default |
| `GET`    | `/v2/github/keys`            | Default |
| `PUT`    | `/v2/self/keys/{sshKeyName}` | Default |
| `DELETE` | `/v2/self/keys/{sshKeyName}` | Default |

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
}'>
  <cc-ssh-key-list></cc-ssh-key-list>
</cc-smart-container>
```
