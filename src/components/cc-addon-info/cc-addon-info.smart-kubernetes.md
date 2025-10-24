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
| `clusterId`         | `string`    | ID of the Kubernetes cluster                                                                   |         |

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

| Method   | URL                                                              | Cache?  |
|----------|------------------------------------------------------------------|---------|
| `GET`    | `/v4/kubernetes/organisations/${ownerId}/clusters/${clusterId}`  | Default |


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
    "clusterId": "kubernetes_XXXXXXXXXXXXXXXXXXXXXXX",
}'>
  <cc-addon-info smart-mode="kubernetes"></cc-addon-info>
</cc-smart-container>
```
