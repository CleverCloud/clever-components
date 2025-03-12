---
kind: '🛠 Session/<cc-session-tokens>'
title: '💡 Smart'
---

# 💡 Smart `<cc-session-tokens>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="https://www.clever-cloud.com/doc/clever-components/?path=/docs/🛠-profile-cc-session-tokens--default-story"><code>&lt;cc-session-tokens&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-session-tokens</code>
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

| Method   | Type                    | Cache?  |
|----------|:------------------------|---------|
| `GET`    | `/v2/self/tokens`       | Default |
| `POST`   | `/v2/self/tokens/revoke`| Default |

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
    <cc-session-tokens></cc-session-tokens>
<cc-smart-container>
```
