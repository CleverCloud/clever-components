---
kind: '🛠 Profile/<cc-token-api-creation-form>'
title: '💡 Smart'
---

# 💡 Smart `<cc-token-api-creation-form>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="https://www.clever-cloud.com/doc/clever-components/?path=/docs/🛠-profile-cc-token-api-creation-form--default-story"><code>&lt;cc-token-api-creation-form&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-token-api-creation-form</code>
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
| `POST`   | `/api-tokens`           | N/A     |

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
    <cc-token-api-creation-form></cc-token-api-creation-form>
<cc-smart-container>
```
