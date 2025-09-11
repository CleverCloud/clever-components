---
kind: '🚧 Beta/🛠 Logs addon/<cc-logs-addon-runtime-beta>'
title: '💡 Smart'
---

# 💡 Smart `<cc-logs-addon-runtime-beta>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="🚧-beta-🛠-logs-addon-cc-logs-addon-runtime-beta--default-story"><code>&lt;cc-logs-addon-runtime-beta&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-logs-addon-runtime-beta></code>
  <tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

| Name                 |           Type           | Required | Details                                     | Default |
|----------------------|:------------------------:|:--------:|---------------------------------------------|---------|
| `apiConfig`          |       `ApiConfig`        |   Yes    | Object with API configuration (target host) |         |
| `ownerId`            |         `string`         |   Yes    | UUID prefixed with `orga_` or `user_`       |         |
| `realAddonId`        |         `string`         |   Yes    | Real addon ID                               |         |
| `dateRangeSelection` | `LogsDateRangeSelection` |    No    | Initial date range                          |         |

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

type LogsDateRangePresetType = 'lastHour' | 'last4Hours' | 'last7Days' | 'today' | 'yesterday';
```

## 🌐 API endpoints

| Method | Type                                                            | Cache?  |
|--------|:----------------------------------------------------------------|:--------|
| `GET`  | ``/v4/logs/organisations/${ownerId}/resources/${addonId}/logs`` | Default |

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
    "realAddonId": "",
  }'>
  <cc-logs-addon-runtime-beta></cc-logs-addon-runtime-beta>
<cc-smart-container>
```
