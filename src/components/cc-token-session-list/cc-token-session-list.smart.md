---
kind: '🛠 Profile/<cc-token-session-list>'
title: '💡 Smart'
---

# 💡 Smart `<cc-token-session-list>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="🛠-profile-cc-token-session-list--default-story"><code>&lt;cc-token-session-list&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-token-session-list</code>
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
}
```

## 🌐 API endpoints

| Method     | Type                    | Cache?  |
|------------|:------------------------|---------|
| `GET`      | `/v2/self/tokens`       | Default |
| `DELETE`   | `/v2/self/tokens/revoke`| Default |

```html
<cc-smart-container context='{
    "apiConfig": {
      API_HOST: "",
      API_OAUTH_TOKEN: "",
      API_OAUTH_TOKEN_SECRET: "",
      OAUTH_CONSUMER_KEY: "",
      OAUTH_CONSUMER_SECRET: "",
    }
}'>
    <cc-token-session-list></cc-token-session-list>
<cc-smart-container>
```
