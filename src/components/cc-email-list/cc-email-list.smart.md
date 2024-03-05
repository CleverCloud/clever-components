---
kind: '🛠 Profile/<cc-email-list>'
title: '💡 Smart'
---
# 💡 Smart `<cc-email-list>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="https://www.clever-cloud.com/doc/clever-components/?path=/story/🛠-profile-cc-email-list--default-story"><code>&lt;cc-email-list&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-email-list</code>
  <tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

| Name        | Type        | Details                                                | Default |
|-------------|-------------|--------------------------------------------------------|---------|
| `apiConfig` | `ApiConfig` | Object with API configuration (target host, tokens...) |         |


```typescript
interface ApiConfig {
  API_HOST: String,
  API_OAUTH_TOKEN: String,
  API_OAUTH_TOKEN_SECRET: String,
  OAUTH_CONSUMER_KEY: String,
  OAUTH_CONSUMER_SECRET: String,
}
```

## 🌐 API endpoints

| Method   | URL                              | Cache?  |
|----------|----------------------------------|---------|
| `GET`    | `/v2/self`                       | Default |
| `GET`    | `/v2/self/confirmation_email`    | Default |
| `GET`    | `/v2/self/emails`                | Default |
| `PUT`    | `/v2/self/emails/{emailAddress}` | Default |
| `DELETE` | `/v2/self/emails/{emailAddress}` | Default |


## ⬇️️ Examples

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
  <cc-email-list></cc-email-list>
</cc-smart-container>
```
