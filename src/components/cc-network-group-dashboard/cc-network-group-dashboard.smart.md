---
kind: '🛠 Network Group/<cc-network-group-dashboard>'
title: '💡 Smart'
---

# 💡 Smart `<cc-network-group-dashboard>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="🛠-network-group-cc-network-group-dashboard--default-story"><code>&lt;cc-network-group-dashboard&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-network-group-dashboard</code>
  <tr><td><strong>Requires auth</strong> <td>Yes
</table>

## 👋️ Events fired

| Name                           | Payload                        | Details                                                                                                     |
| ------------------------------ | ------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `cc-network-group-was-deleted` | `string` | Fired when the network group has been deleted successfully.<br/>Should be used to redirect to another page |

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

| Method   | URL                                                                        | Cache?   |
| -------- | -------------------------------------------------------------------------- | -------- |
| `GET`    | `/v4/networkgroups/organisations/{ownerId}/networkgroups/{networkGroupId}` | 1 second |
| `DELETE` | `/v4/networkgroups/organisations/{ownerId}/networkgroups/{networkGroupId}` | N/A      |

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
  <cc-network-group-dashboard></cc-network-group-dashboard>
</cc-smart-container>
```
