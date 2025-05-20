---
kind: '🛠 OAuth Consumer/<cc-oauth-consumer-form>'
title: '💡 Smart (update)'
---
# 💡 Smart `<cc-oauth-consumer-form>`

## ℹ️ Details

<table>
<tr><td><strong>Component    </strong> <td><a href="https://www.clever-cloud.com/doc/clever-components/?path=/story/🛠-oauth-consumer-cc-oauth-consumer-form--default-story"><code>&lt;cc-oauth-consumer-form&gt;</code></a>
<tr><td><strong>Selector     </strong> <td><code>cc-oauth-consumer-form[smart-mode=update]</code>
<tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

| Name        | Type         | Details                                                | Default |
|-------------|--------------|--------------------------------------------------------|---------|
| `apiConfig` | `ApiConfig`  | Object with API configuration (target host, tokens...) |         |
| `ownerId`   | `string`     | UUID prefixed with orga_                               |         |
| `key`       | `string`     | Random alphanumeric string                             |         |


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

| Method   | URL                                       | Cache?  |
|----------|-------------------------------------------|---------|
| `GET`    | `/v2/organisations/${ownerId}/consumers/${key}`          | Default |
| `DELETE` | `/v2/organisations/${ownerId}/consumers/${key}`          | Default |
| `PUT`    | `/v2/organisations/${ownerId}/consumers/${key}`          | Default |



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
    "key": "",
}'>
  <cc-oauth-consumer-form smart-mode="update"></cc-oauth-consumer-form>
</cc-smart-container>
```

