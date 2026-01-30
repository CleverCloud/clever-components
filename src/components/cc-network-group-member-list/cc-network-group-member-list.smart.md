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
</table>

## ⚙️ Params

| Name             | Type        | Details                                                     | Default |
| ---------------- | ----------- | ----------------------------------------------------------- | ------- |
| `apiConfig`      | `ApiConfig` | Object with API configuration (target host, tokens...)      |         |
| `ownerId`        | `String`    | UUID prefixed with <code>user_</code> or <code>orga_</code> |         |
| `networkGroupId` | `String`    | UUID of the network group                                   |         |

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

| Method   | URL                                                                                        | Cache?  |
| -------- | ------------------------------------------------------------------------------------------ | ------- |
| `GET`    | `/v4/networkgroups/organisations/{ownerId}/networkgroups/{networkGroupId}`                 | Default |
| `GET`    | `/v2/organisations/{ownerId}/applications`                                                 | Default |
| `GET`    | `/v2/organisations/{ownerId}/addons`                                                       | Default |
| `GET`    | `/v2/organisations/{ownerId}/applications/{applicationId}`                                 | Default |
| `GET`    | `/v2/organisations/{ownerId}/addons/{addonId}`                                             | Default |
| `POST`   | `/v4/networkgroups/organisations/{ownerId}/networkgroups/{networkGroupId}/members`         | N/A     |
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
  "networkGroupId": ""
}'>
  <cc-network-group-member-list></cc-network-group-member-list>
</cc-smart-container>
```
