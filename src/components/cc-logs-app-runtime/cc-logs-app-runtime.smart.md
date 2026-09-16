---
kind: '🚧 Beta/🛠 Logs app/<cc-logs-app-runtime-beta>'
title: '💡 Smart'
---

# 💡 Smart `<cc-logs-app-runtime-beta>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="🚧-beta-🛠-logs-app-cc-logs-app-runtime-beta--default-story"><code>&lt;cc-logs-app-runtime-beta&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-logs-app-runtime-beta></code>
  <tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

| Name                 |           Type           | Required | Details                                     | Default |
|----------------------|:------------------------:|:--------:|---------------------------------------------|---------|
| `apiConfig`          |       `ApiConfig`        |   Yes    | Object with API configuration (target host) |         |
| `ownerId`            |         `string`         |   Yes    | UUID prefixed with `orga_` or `user_`       |         |
| `appId`              |         `string`         |   Yes    | UUID prefixed with `app_`                   |         |
| `deploymentId`       |         `string`         |    No    | UUID prefixed with `deployment_`            |         |
| `dateRangeSelection` | `LogsDateRangeSelection` |    No    | Initial date range                          |         |
| `messageFilter`      | `LogsMessageFilterValue` |    No    | Initial log message filter                  |         |

```ts
interface ApiConfig {
  API_HOST: string,
  API_OAUTH_TOKEN: string,
  API_OAUTH_TOKEN_SECRET: string,
  OAUTH_CONSUMER_KEY: string,
  OAUTH_CONSUMER_SECRET: string,
}

type LogsDateRangeSelection =
  | LogsDateRangeSelectionLive
  | LogsDateRangeSelectionPreset
  | LogsDateRangeSelectionCustom;

interface LogsDateRangeSelectionLive {
  type: 'live';
}

interface LogsDateRangeSelectionPreset {
  type: 'preset';
  preset: LogsDateRangePresetType;
}

interface LogsDateRangeSelectionCustom {
  type: 'custom';
  since: string;
  until: string;
}

interface LogsMessageFilterValue {
  value: string;
  mode: 'loose' | 'strict' | 'regex';
}
```

## 🌐 API endpoints

| Method | Type                                                           | Cache?  |
|--------|:---------------------------------------------------------------|:--------|
| `GET`  | `/v4/logs/organisations/${ownerId}/applications/${appId}/logs` | Default |

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
    "appId": "",
  }'>
  <cc-logs-app-runtime-beta></cc-logs-app-runtime-beta>
<cc-smart-container>
```
