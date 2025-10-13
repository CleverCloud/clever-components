---
kind: '🛠 Addon/<cc-addon-info>'
title: '💡 Smart (Kubernetes)'
---
# 💡 Smart `<cc-addon-info smart-mode="kubernetes">`

## ℹ️ Details

<table>
<tr><td><strong>Component    </strong> <td><a href="🛠-addons-cc-addon-info--default-story"><code>&lt;cc-addon-info&gt;</code></a>
<tr><td><strong>Selector     </strong> <td><code>cc-addon-info[smart-mode="kubernetes"]</code>
<tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

| Name                | Type        | Details                                                                                        | Default |
| ------------------- | ----------- |------------------------------------------------------------------------------------------------| ------- |
| `apiConfig`         | `ApiConfig` | Object with API configuration (target host, tokens...)                                         |         |
| `ownerId`           | `string`    | UUID prefixed with orga_                                                                       |         |
| `addonId`           | `string`    | ID of the add-on                                                                               |         |
| `logsUrlPattern`    | `string`    | Pattern for the logs url (Example : `/organisations/${ownerId}/applications/${appId}/logs`)    |         |

```ts
interface ApiConfig {
  API_HOST: string;
  API_OAUTH_TOKEN: string;
  API_OAUTH_TOKEN_SECRET: string;
  OAUTH_CONSUMER_KEY: string;
  OAUTH_CONSUMER_SECRET: string;
}
```

## 🌐 API endpoints

| Method   | URL                                                      | Cache?  |
|----------|----------------------------------------------------------|---------|
| `GET`    | `/v2/organisations/${ownerId}/addons/${addonId}`         | Default |
| `GET`    | `/v4/addon-providers/addon-kubernetes/addons/${realId}`  | Default |


## ⬇️️ Examples

```html
<cc-smart-container context='{
    "apiConfig": {
      "API_HOST": "",
      "API_OAUTH_TOKEN": "",
      "API_OAUTH_TOKEN_SECRET": "",
      "OAUTH_CONSUMER_KEY": "",
      "OAUTH_CONSUMER_SECRET": ""
    },
    "ownerId": "orga_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
    "addonId": "addon_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
    "logsUrlPattern": "/organisations/orga_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/applications/:id/logs"
}'>
  <cc-addon-info smart-mode="kubernetes"></cc-addon-info>
</cc-smart-container>
```
