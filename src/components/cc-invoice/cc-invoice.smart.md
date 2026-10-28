---
kind: '🛠 Invoices/<cc-invoice>'
title: '💡 Smart'
---
# 💡 Smart `<cc-invoice>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="🛠-invoices-cc-invoice--default-story"><code>&lt;cc-invoice&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-invoice</code>
  <tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

<table>
  <tr><th>Name                                  <th>Type                   <th>Details                                                                                                                                                      <th>Default
  <tr><td><code>apiConfig</code>                <td><code>ApiConfig</code> <td>Some details about this param                                                                                                                                <td>
  <tr><td><code>ownerId</code>                  <td><code>String</code>    <td>UUID prefixed with <code>user_</code> or <code>orga_</code>                                                                                                  <td>
  <tr><td><code>invoiceNumber</code>            <td><code>String</code>    <td>A valid invoice number                                                                                                                                       <td>
  <tr><td><code>invoicePdfUrlPattern</code>     <td><code>String</code>    <td>Optional. URL pattern for the invoice PDF link. Use <code>:id</code> as placeholder for the invoice number. If not set, no PDF link is displayed. <td>
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
  <tr><td>GET    <td><code>/v2//billing/organisations/{id}/invoices/{invoiceNumber}</code>      <td>Default
  <tr><td>GET    <td><code>/v2//billing/organisations/{id}/invoices/{invoiceNumber}.html</code> <td>Default
</table>

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
  "invoiceNumber": "",
  "invoicePdfUrlPattern": "/invoices/:id.pdf"
}'>
  <cc-invoice></cc-invoice>
</cc-smart-container>
```
