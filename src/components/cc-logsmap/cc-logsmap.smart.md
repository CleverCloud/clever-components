---
kind: '🛠 Maps/<cc-logsmap>'
title: '💡 Smart'
---
# 💡 Smart `<cc-logsmap>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="🛠-maps-cc-logsmap--default-story"><code>&lt;cc-logsmap&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-logsmap</code>
  <tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

| Name        | Type        | Details                                                |
|-------------|-------------|--------------------------------------------------------|
| `apiConfig` | `ApiConfig` | Object with API configuration (target host, tokens...) |
| `ownerId`   | `String`    | UUID prefixed with `user_` or `orga_`                  |
| `appId`     | `String`    | UUID prefixed with `app_` (optional)                   |

```ts
interface ApiConfig {
  API_HOST: String,
  API_OAUTH_TOKEN: String,
  API_OAUTH_TOKEN_SECRET: String,
  OAUTH_CONSUMER_KEY: String,
  OAUTH_CONSUMER_SECRET: String,
}
```

## 🌐 API endpoints

The endpoint used depends on the map `mode`:

| Method | URL                                                     | Cache                   | Mode      |
|--------|---------------------------------------------------------|-------------------------|-----------|
| `GET`  | `/v4/stats/organisations/{ownerId}/requests`            | Until next hour + 2 min | `heatmap` |
| `GET`  | `/v4/stats/organisations/{ownerId}/requests-live` (SSE) | None                    | `points`  |

The heat map response is byte-identical for the rest of the current hour, so it is cached until the next hour boundary plus a 2-minute margin (to absorb ingestion lag of the just-completed bucket).

* In `heatmap` mode, the heat map is fetched once with `GetHeatMapCommand`.
* In `points` mode, a live SSE stream is opened with `StreamRequestsCommand` and blinking dots are added as request batches arrive.

## ⬇️️ Examples

### Whole organization

If you only specify an `ownerId` and no `appId`, the data represent the whole organization.

```html
<cc-smart-container context='{
  "apiConfig": {
    "API_HOST": "",
    "API_OAUTH_TOKEN": "",
    "API_OAUTH_TOKEN_SECRET": "",
    "OAUTH_CONSUMER_KEY": "",
    "OAUTH_CONSUMER_SECRET": "",
  },
  "ownerId": ""
}'>
  <cc-logsmap orga-name="ACME Corp"></cc-logsmap>
</cc-smart-container>
```

### Application only

```html
<cc-smart-container context='{
  "apiConfig": {
    "API_HOST": "",
    "API_OAUTH_TOKEN": "",
    "API_OAUTH_TOKEN_SECRET": "",
    "OAUTH_CONSUMER_KEY": "",
    "OAUTH_CONSUMER_SECRET": "",
  },
  "ownerId": "",
  "appId": ""
}'>
  <cc-logsmap app-name="My Awesome Java App (PROD)"></cc-logsmap>
</cc-smart-container>
```
