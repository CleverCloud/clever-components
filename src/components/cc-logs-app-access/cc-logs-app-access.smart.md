---
kind: '🚧 Beta/🛠 Logs app/<cc-logs-app-access-beta>'
title: '💡 Smart'
---

# 💡 Smart `<cc-logs-app-access-beta>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="https://www.clever-cloud.com/doc/clever-components/?path=/docs/🚧-beta-🛠-logs-app-cc-logs-app-access-beta--docs"><code>&lt;cc-logs-app-access-beta&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-logs-app-access-beta></code>
  <tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

| Name           |    Type     | Required | Details                                     | Default |
|----------------|:-----------:|:--------:|---------------------------------------------|---------|
| `apiConfig`    | `ApiConfig` |   Yes    | Object with API configuration (target host) |         |
| `ownerId`      |  `string`   |   Yes    | UUID prefixed with `orga_` or `user_`       |         |
| `appId`        |  `string`   |   Yes    | UUID prefixed with `app_`                   |         |

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

| Method | Type                                                                       | Cache?  |
|--------|:---------------------------------------------------------------------------|:--------|
| `GET`  | `/v4/accesslogs/organisations/${ownerId}/applications/${appId}/accesslogs` | Default |

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
    "appId": "",
  }'>
  <cc-logs-app-access-beta></cc-logs-app-access-beta>
<cc-smart-container>
```
