---
kind: '🛠 Emails/<cc-email>'
title: '💡 Smart'
---
# 💡 Smart `<cc-email>`

<cc-smart-container context='{}'>
  <cc-email></cc-email>
</cc-smart-container>


## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="https://www.clever-cloud.com/doc/clever-components/?path=/story/🛠-emails-cc-email--default-story"><code>&lt;cc-email&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-email</code>
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
  <cc-email></cc-email>
</cc-smart-container>
```
