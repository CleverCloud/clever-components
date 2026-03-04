---
kind: '🛠 Network Group/<cc-network-group-member-list>'
title: '💡 Smart'
---

# 💡 Smart `<cc-network-group-member-list>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="🛠-network-group-cc-network-group-member-list--default-story"><code>&lt;cc-network-group-member-list&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-network-group-member-list</code>
  <tr><td><strong>Requires auth</strong> <td>Yes
  <tr><td><strong>Auto-refresh </strong> <td>Every 50 minutes (to keep presigned URLs valid)
</table>

## ⚙️ Params

| Name                       | Type        | Details                                                                              | Default |
| -------------------------- | ----------- | ------------------------------------------------------------------------------------ | ------- |
| `apiConfig`                | `ApiConfig` | Object with API configuration (target host, tokens...)                               |         |
| `ownerId`                  | `String`    | UUID prefixed with <code>user_</code> or <code>orga_</code>                          |         |
| `networkGroupId`           | `String`    | UUID of the network group                                                            |         |
| `appOverviewUrlPattern`    | `String`    | URL pattern for application overview pages, with <code>:id</code> as a placeholder   |         |
| `addonDashboardUrlPattern` | `String`    | URL pattern for addon dashboard pages, with <code>:id</code> as a placeholder        |         |

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

| Method   | URL                                                                                                         | Cache?  |
| -------- | ----------------------------------------------------------------------------------------------------------- | ------- |
| `GET`    | `/v4/networkgroups/organisations/{ownerId}/networkgroups/{networkGroupId}`                                  | Default |
| `GET`    | `/v2/organisations/{ownerId}/applications?withBranches=false`                                               | Default |
| `GET`    | `/v2/organisations/{ownerId}/addons`                                                                        | Default |
| `GET`    | `/v2/organisations/{ownerId}/applications/{applicationId}`                                                  | Default |
| `GET`    | `/v2/organisations/{ownerId}/addons/{addonId}`                                                              | Default |
| `POST`   | `/v4/networkgroups/organisations/{ownerId}/networkgroups/{networkGroupId}/members`                          | N/A     |
| `DELETE` | `/v4/networkgroups/organisations/{ownerId}/networkgroups/{networkGroupId}/members/{memberId}`               | N/A     |
| `GET`    | `/v4/networkgroups/organisations/{ownerId}/networkgroups/{networkGroupId}/peers/{peerId}/configuration-url` | N/A     |

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
  "networkGroupId": "",
  "appOverviewUrlPattern": "/organisations/orga_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/applications/:id",
  "addonDashboardUrlPattern": "/organisations/orga_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/addons/:id"
}'>
  <cc-network-group-member-list></cc-network-group-member-list>
</cc-smart-container>
```
