---
kind: '🛠 Profile/<cc-token-oauth-list>'
title: '💡 Smart'
---

# 💡 Smart `<cc-token-oauth-list>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="https://www.clever-cloud.com/doc/clever-components/?path=/docs/🛠-profile-cc-token-oauth-list--default-story"><code>&lt;cc-token-oauth-list&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-token-oauth-list</code>
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
    <cc-token-oauth-list></cc-token-oauth-list>
<cc-smart-container>
```
