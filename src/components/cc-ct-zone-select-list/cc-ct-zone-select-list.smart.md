---
kind: "\U0001F6E0 Creation Tunnel/<cc-ct-zone-select-list>"
title: "\U0001F4A1 Smart"
---
# 💡 Smart `<cc-ct-zone-select-list>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="https://www.clever-cloud.com/doc/clever-components/?path=/docs/ ..."><code>&lt;cc-article-list&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-article-list</code>
  <tr><td><strong>Requires auth</strong> <td>No
</table>

## ⚙️ Params

<table>
  <tr><th>Name                   <th>Type                   <th>Details                       <th>Default
  <tr><td><code>lang</code>  <td><code>String</code>    <td>Sets the language the feed should be fetched in<td>
  <tr><td><code>limit</code>  <td><code>Number</code>    <td>Sets the number of articles from the feed you should get<td>
</table>

## 🌐 API endpoints

<table>
  <tr><th>Method <th>URL                                                   <th>Cache?
  <tr><td>GET    <td><code>https://www.clever-cloud.com/feed/</code>       <td>4 hours
  <tr><td>GET    <td><code>https://www.clever-cloud.com/fr/feed/</code>    <td>4 hours
</table>

## ⬇️️ Examples

### English

```html
<cc-smart-container context="{}">
  <cc-ct-zone-select-list></cc-ct-zone-select-list>
</cc-smart-container>
```

### French

```html
<cc-smart-container context="{}">
  <cc-ct-zone-select-list></cc-ct-zone-select-list>
</cc-smart-container>
```

<cc-smart-container context='{"test": "foo"}'>
<cc-ct-zone-select-list></cc-ct-zone-select-list>
</cc-smart-container>

