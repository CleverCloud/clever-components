---
kind: '🛠 organisation/<cc-orga-member-list>'
title: '💡 Smart'
---

# 💡 Smart `<cc-orga-member-list>`


TODO: A RETIRER
<cc-smart-container context='{
    "ownerId": "orga_927acbf6-34fe-4563-b651-28460344d2e0"
}'>
    <cc-orga-member-list>
    </cc-orga-member-list>
<cc-smart-container>

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="https://www.clever-cloud.com/doc/clever-components/?path=/docs/🛠-organisation-cc-orga-member-list--default-story"><code>&lt;cc-orga-member-list></code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-orga-member-list</code>
  <tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

<table>
  <tr><th>Name                       <th>Type                  <th>Details                                                                                                                <th>Default
  <tr><td><code>apiConfig</code>      <td><code>ApiConfig</code> <td>Object with API configuration (target host, tokens...)                                                                                                          <td>
  <tr><td><code>orgId</code>        <td><code>String</code>   <td>UUID prefixed with orga_</a>                 <td>
</table>

```js
interface ApiConfig {
  API_HOST: String,
  API_OAUTH_TOKEN: String,
  API_OAUTH_TOKEN_SECRET: String,
  OAUTH_CONSUMER_KEY: String,
  OAUTH_CONSUMER_SECRET: String,
}
```

## 🌐 API endpoints

<table>
  <tr><th>Method <th>URL                                                                        <th>Cache?
  <tr><td>GET    <td><code>/v2/organisations/${orgId}/members</code>      <td>Default
  <tr><td>PUT   <td><code>/v2/organisations/${orgId}/members</code> <td>Default
  <tr><td>DELETE   <td><code>/v2/organisations/${orgId}/members</code> <td>Default
</table>

```html
  <cc-smart-container context='{
    "apiConfig": {
      API_HOST: "",
      API_OAUTH_TOKEN: "",
      API_OAUTH_TOKEN_SECRET: "",
      OAUTH_CONSUMER_KEY: "",
      OAUTH_CONSUMER_SECRET: "",
    },
    "orgId": ""
  }'>
    <cc-orga-member-list>
    </cc-orga-member-list>
  <cc-smart-container>
```