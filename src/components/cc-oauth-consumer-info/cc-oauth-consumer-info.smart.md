---
kind: '🛠 OAuth Consumer/<cc-oauth-consumer-info>'
title: '💡 Smart'
---
# 💡 Smart `<cc-oauth-consumer-info>`

## ℹ️ Details

<table>
<tr><td><strong>Component    </strong> <td><a href="🛠-oauth-consumer-cc-oauth-consumer-info--default-story"><code>&lt;cc-oauth-consumer-info&gt;</code></a>
<tr><td><strong>Selector     </strong> <td><code>cc-oauth-consumer-info</code>
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

| Method | URL                                       | Cache?  |
|--------|-------------------------------------------|---------|
| `GET`  | `/v2/organisations/${ownerId}/consumers/${key}`          | Default |
| `GET`  | `/v2/organisations/${ownerId}/consumers/${key}/secret`   | Default |

## ⬇️️ Examples

### Example one title

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
  <cc-oauth-consumer-info></cc-oauth-consumer-info>
</cc-smart-container>
```
