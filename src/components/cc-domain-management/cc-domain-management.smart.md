---
kind: '🛠️ Domains/<cc-domain-management>'
title: '💡 Smart'
---

# 💡 Smart `<cc-domain-management>`

## ℹ️ Details

<!-- TODO: -->
<table>
  <tr><td><strong>Component    </strong> <td><a href="https://www.clever-cloud.com/doc/clever-components/?path=/docs/🛠-organisation-cc-orga-member-list--default-story"><code>&lt;cc-orga-member-list></code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-orga-member-list</code>
  <tr><td><strong>Requires auth</strong> <td>Yes
</table>

## 👋️ Events fired

| Name                        | Payload | Details                                                                                                       |
|-----------------------------|---------|---------------------------------------------------------------------------------------------------------------|
| `domain-management-primary-success` |         | Fired when the primary domain has been changed successfully.<br/>Should be used to refresh the app link within the console header |


## ⚙️ Params

| Name        | Type        | Details                                                 | Default |
|-------------|-------------|---------------------------------------------------------|---------|
| `apiConfig` | `ApiConfig` | Object with API configuration (target host, tokens...)  |         |
| `ownerId`   | `string`    | UUID prefixed with orga_                                |         |
| `appId`   | `string`    | UUID prefixed with app_                                |         |

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
| `GET`    | `/v4/load-balancers/organisations/${ownerId}/applications/${appId}/load-balancers/default` | Default |
| `GET` | `/v2/organisations/{ownerId}/applications/{appId}/vhosts` | Default |
| `GET` | `/v2/self/applications/{appId}/vhosts` | Default |
| `PUT` | `/v2/organisations/{ownerId}/applications/{appId}/vhosts/{domain}` | Default |
| `PUT` | `/v2/self/applications/{appId}/vhosts/{domain}` | Default |
| `DELETE` | `/v2/organisations/{ownerId}/applications/{appId}/vhosts/{domain}` | Default |
| `DELETE` | `/v2/self/applications/{appId}/vhosts/{domain}` | Default |
| `GET` | `/v2/organisations/{ownerId}/applications/{appId}/vhosts/favourite` | Default |
| `GET` | `/v2/self/applications/{appId}/vhosts/favourite` | Default |
| `PUT` | `/v2/organisations/{ownerId}/applications/{appId}/vhosts/favourite` | Default |
| `PUT` | `/v2/self/applications/{appId}/vhosts/favourite` | Default |

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
    <cc-domain-management></cc-domain-management>
<cc-smart-container>
```

