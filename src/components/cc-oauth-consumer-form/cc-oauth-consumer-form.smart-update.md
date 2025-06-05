---
kind: '🛠 OAuth Consumer/<cc-oauth-consumer-form>'
title: '💡 Smart (update)'
---
# 💡 Smart `<cc-oauth-consumer-form>`

## ℹ️ Details

<table>
<tr><td><strong>Component    </strong> <td><a href="🛠-oauth-consumer-cc-oauth-consumer-form--data-loaded-with-update"><code>&lt;cc-oauth-consumer-form&gt;</code></a>
<tr><td><strong>Selector     </strong> <td><code>cc-oauth-consumer-form[smart-mode=update]</code>
<tr><td><strong>Requires auth</strong> <td>Yes
</table>

## 👋️ Events fired

| Name                            | Payload | Details                                                                                                                      |
|---------------------------------|---------|------------------------------------------------------------------------------------------------------------------------------|
| `cc-oauth-consumer-was-updated` |         | Fired when the OAuth consumer is updated.<br/>Should be used to redirect the user to the OAuth consumer information page.    |
| `cc-oauth-consumer-was-deleted`     |         | Fired when the OAuth consumer is deleted.<br/>Should be used to redirect the user to the current organisation overview page. |



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

| Method   | URL                                             | Cache?  |
|----------|-------------------------------------------------|---------|
| `GET`    | `/v2/organisations/${ownerId}/consumers/${key}` | Default |
| `DELETE` | `/v2/organisations/${ownerId}/consumers/${key}` | Default |
| `PUT`    | `/v2/organisations/${ownerId}/consumers/${key}` | Default |



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
