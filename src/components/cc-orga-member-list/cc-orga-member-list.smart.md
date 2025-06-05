---
kind: '🛠 Organisation/<cc-orga-member-list>'
title: '💡 Smart'
---

# 💡 Smart `<cc-orga-member-list>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="🛠-organisation-cc-orga-member-list--default-story"><code>&lt;cc-orga-member-list></code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-orga-member-list</code>
  <tr><td><strong>Requires auth</strong> <td>Yes
</table>

## 👋️ Events fired

| Name                  | Payload | Details                                                                                                       |
|-----------------------|---------|---------------------------------------------------------------------------------------------------------------|
| `cc-orga-member-left` |         | Fired when the current user leaves the organisation.<br/>Should be used to redirect the user to another page. |


## ⚙️ Params

| Name        | Type        | Details                                                 | Default |
|-------------|-------------|---------------------------------------------------------|---------|
| `apiConfig` | `ApiConfig` | Object with API configuration (target host, tokens...)  |         |
| `ownerId`   | `string`    | UUID prefixed with orga_                                |         |

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

| Method   | Type                             | Cache?  |
|----------|:---------------------------------|---------|
| `GET`    | `/v2/self/id`                    | Default |
| `GET`    | `/v2/organisations/{id}/members` | Default |
| `PUT`    | `/v2/organisations/{id}/members` | Default |
| `DELETE` | `/v2/organisations/{id}/members` | Default |

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
    <cc-orga-member-list></cc-orga-member-list>
<cc-smart-container>
```
