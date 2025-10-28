---
kind: '🛠 Addon/<cc-addon-info>'
title: '💡 Smart (Jenkins)'
---
# 💡 Smart `<cc-addon-info smart-mode="jenkins">`

## ℹ️ Details

<table>
<tr><td><strong>Component    </strong> <td><a href="🛠-addons-cc-addon-info--default-story"><code>&lt;cc-addon-info&gt;</code></a>
<tr><td><strong>Selector     </strong> <td><code>cc-addon-info[smart-mode="jenkins"]</code>
<tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

| Name        | Type        | Details                                                | Default |
| ----------- | ----------- |--------------------------------------------------------| ------- |
| `apiConfig` | `ApiConfig` | Object with API configuration (target host, tokens...) |         |
| `ownerId`   | `string`    | UUID prefixed with orga_                               |         |
| `addonId`   | `string`    | ID of the add-on                                       |         |

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

| Method | URL                                                   | Cache?     |
|--------|-------------------------------------------------------|------------|
| `GET`  | `/v2/organisations/${ownerId}/addons/${addonId}`      | 1 second   |
| `GET`  | `/v2/providers/jenkins/addons/${addonId}`             | 1 second   |


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
    "addonId": "addon_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
}'>
  <cc-addon-info smart-mode="jenkins"></cc-addon-info>
</cc-smart-container>
```
