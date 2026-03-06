---
kind: '🛠 Network Group/<cc-network-group-list>'
title: '💡 Smart'
---

# 💡 Smart `<cc-network-group-list>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="🛠-network-group-cc-network-group-list--default-story"><code>&lt;cc-network-group-list&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-network-group-list</code>
  <tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

| Name                              | Type        | Details                                                                                                              | Default |
| --------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------- | ------- |
| `apiConfig`                       | `ApiConfig` | Object with API configuration (target host, tokens...)                                                               |         |
| `ownerId`                         | `String`    | UUID prefixed with <code>user_</code> or <code>orga_</code>                                                          |         |
| `resourceId`                      | `String`    | UUID of the resource (application or addon) to link/unlink from network groups                                       |         |
| `networkGroupDashboardUrlPattern` | `String`    | URL pattern for network group dashboard links. Use <code>:id</code> as placeholder for the network group ID         |         |
| `networkGroupCreationUrl`         | `String`    | URL to redirect users to when there are no network groups available to link (e.g. a page to create a new one)       |         |

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

| Method | URL                                                                                | Cache?  |
| ------ | ---------------------------------------------------------------------------------- | ------- |
| `GET`  | `/v4/networkgroups/organisations/{ownerId}/networkgroups`                          | Default |
| `POST` | `/v4/networkgroups/organisations/{ownerId}/networkgroups/{networkGroupId}/members` | N/A     |

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
  "resourceId": "",
  "networkGroupDashboardUrlPattern": "/organisations/:ownerId/network-groups/:id",
  "networkGroupCreationUrl": "/network-groups/new"
}'>
  <cc-network-group-list></cc-network-group-list>
</cc-smart-container>
```
