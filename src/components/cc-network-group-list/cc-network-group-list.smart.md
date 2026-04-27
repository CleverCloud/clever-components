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

| Name                              | Type        | Required | Details                                                                                                                                                                                                     | Default |
| --------------------------------- | ----------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `apiConfig`                       | `ApiConfig` | Yes      | Object with API configuration (target host, tokens...)                                                                                                                                                      |         |
| `ownerId`                         | `String`    | Yes      | UUID prefixed with <code>user_</code> or <code>orga_</code>                                                                                                                                                 |         |
| `resourceId`                      | `String`    | Yes      | UUID of the resource (application or addon) to link/unlink from network groups. If prefixed with <code>addon_</code>, the addon is resolved and checked for plan support (dev plan addons are unsupported). |         |
| `networkGroupDashboardUrlPattern` | `String`    | Yes      | URL pattern for network group dashboard links. Use <code>:id</code> as placeholder for the network group ID                                                                                                 |         |
| `networkGroupCreationUrl`         | `String`    | Yes      | URL to redirect users to when there are no network groups available to link (e.g. a page to create a new one)                                                                                               |         |
| `addonMigrationScreenUrl`         | `String`    | No       | URL of the migration screen shown when the resource is an unsupported addon (dev plan)                                                                                                                      |         |

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

| Method   | URL                                                                                           | Cache?  |
| -------- | --------------------------------------------------------------------------------------------- | ------- |
| `GET`    | `/v2/organisations/{ownerId}/addons/{addonId}`                                                | 1 day   |
| `GET`    | `/v4/networkgroups/organisations/{ownerId}/networkgroups`                                     | Default |
| `POST`   | `/v4/networkgroups/organisations/{ownerId}/networkgroups/{networkGroupId}/members`            | N/A     |
| `DELETE` | `/v4/networkgroups/organisations/{ownerId}/networkgroups/{networkGroupId}/members/{memberId}` | N/A     |

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
  "networkGroupCreationUrl": "/network-groups/new",
  "addonMigrationScreenUrl": ""
}'>
  <cc-network-group-list></cc-network-group-list>
</cc-smart-container>
```
