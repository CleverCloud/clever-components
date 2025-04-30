---
kind: '🛠 Profile/<cc-token-api-update-form>'
title: '💡 Smart'
---

# 💡 Smart `<cc-token-api-update-form>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="https://www.clever-cloud.com/doc/clever-components/?path=/docs/🛠-profile-cc-token-api-update-form--default-story"><code>&lt;cc-token-api-update-form&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-token-api-update-form</code>
  <tr><td><strong>Requires auth</strong> <td>Yes
</table>

## 👋️ Events fired

| Name                   | Payload  | Details                                                                                                                                                                    |
|------------------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `cc-token-was-updated` | `string` | Fired when the token has been modified successfully.<br/>Should be used to redirect the user to another page. The payload contains the `id` of the token that has changed. |

## ⚙️ Params

| Name          | Type        | Details                                                | Default |
|---------------|-------------|--------------------------------------------------------|---------|
| `apiConfig`   | `ApiConfig` | Object with API configuration (target host, tokens...) |         |
| `apiTokenId`  | `string`    | ID of the API token to update                          |         |

```ts
interface ApiConfig {
  API_OAUTH_TOKEN: string,
  API_OAUTH_TOKEN_SECRET: string,
  OAUTH_CONSUMER_KEY: string,
  OAUTH_CONSUMER_SECRET: string,
  AUTH_BRIDGE_HOST: string,
}
```

## 🌐 API endpoints

| Method   | Type                       | Cache?  |
|----------|:---------------------------|---------|
| `GET`    | `/api-tokens/{apiTokenId}` | Default |
| `PUT`    | `/api-tokens/{apiTokenId}` | Default |

```html
<cc-smart-container context='{
    "apiConfig": {
      API_OAUTH_TOKEN: "",
      API_OAUTH_TOKEN_SECRET: "",
      OAUTH_CONSUMER_KEY: "",
      OAUTH_CONSUMER_SECRET: "",
      AUTH_BRIDGE_HOST: "",
    },
    "apiTokenId": "fake_api_token_bd367d99-5e42-4934-9b50-40a4a6d01766"
}'>
    <cc-token-api-update-form></cc-token-api-update-form>
<cc-smart-container>
```
