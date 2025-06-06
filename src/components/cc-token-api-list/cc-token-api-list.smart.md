---
kind: '🛠 Profile/<cc-token-api-list>'
title: '💡 Smart'
---

# 💡 Smart `<cc-token-api-list>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="🛠-profile-cc-token-api-list--default-story"><code>&lt;cc-token-api-list&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-token-api-list</code>
  <tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

| Name        | Type        | Details                                                 | Default |
|-------------|-------------|---------------------------------------------------------|---------|
| `apiConfig` | `ApiConfig` | Object with API configuration (target host, tokens...)  |         |

```ts
interface ApiConfig {
  API_HOST: string,
  API_OAUTH_TOKEN: string,
  API_OAUTH_TOKEN_SECRET: string,
  OAUTH_CONSUMER_KEY: string,
  OAUTH_CONSUMER_SECRET: string,
  AUTH_BRIDGE_HOST: string,
}
```

## 🌐 API endpoints

| Method   | Type                    | Cache?  |
|----------|:------------------------|---------|
| `GET`    | `/v2/self`              | Default |
| `GET`    | `/api-tokens`           | Default |
| `DELETE` | `/api-tokens/{tokenId}` | N/A     |

```html
<cc-smart-container context='{
    "apiConfig": {
      API_HOST: "",
      API_OAUTH_TOKEN: "",
      API_OAUTH_TOKEN_SECRET: "",
      OAUTH_CONSUMER_KEY: "",
      OAUTH_CONSUMER_SECRET: "",
      AUTH_BRIDGE_HOST: "",
    }
}'>
    <cc-token-api-list></cc-token-api-list>
<cc-smart-container>
```
