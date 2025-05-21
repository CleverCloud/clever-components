---
kind: '🛠 OAuth Consumer/<cc-oauth-consumer-form>'
title: '💡 Smart (create)'
---
# 💡 Smart `<cc-oauth-consumer-form>`

## ℹ️ Details

<table>
<tr><td><strong>Component    </strong> <td><a href="https://www.clever-cloud.com/doc/clever-components/?path=/story/🛠-oauth-consumer-cc-oauth-consumer-form--default-story"><code>&lt;cc-oauth-consumer-form&gt;</code></a>
<tr><td><strong>Selector     </strong> <td><code>cc-oauth-consumer-form[smart-mode=create]</code>
<tr><td><strong>Requires auth</strong> <td>Yes
</table>

## 👋️ Events fired

| Name                          | Payload  | Details                                                                                                                   |
|-------------------------------|----------|---------------------------------------------------------------------------------------------------------------------------|
| `cc-oauth-consumer-created`   | `string` | Fired when the OAuth consumer is created.<br/>Should be used to redirect the user to the OAuth consumer information page. |


## ⚙️ Params

| Name        | Type         | Details                                                | Default |
|-------------|--------------|--------------------------------------------------------|---------|
| `apiConfig` | `ApiConfig`  | Object with API configuration (target host, tokens...) |         |
| `ownerId`   | `string`     | UUID prefixed with orga_                               |         |

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

| Method | URL                                       | Cache?  |
|--------|-------------------------------------------|---------|
| `POST` | `/v2/organisations/${ownerId}/consumers`  | Default |

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
}'>
  <cc-oauth-consumer-form smart-mode="create"></cc-oauth-consumer-form>
</cc-smart-container>
```

