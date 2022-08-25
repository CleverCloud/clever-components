---
kind: '🛠 homepage/<cc-article-list>'
title: '💡 Smart'
---

# 💡 Smart `<cc-article-list>`

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
  <tr><td><code>limit</code>  <td><code>Number</code>    <td>Sets the number of articles from the feed you should get<td>9
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
<cc-smart-container context='{ "lang": "en" }'>
  <cc-article-list></cc-article-list>
</cc-smart-container>
```

<cc-smart-container context='{ "lang": "en" }'>
  <cc-article-list></cc-article-list>
</cc-smart-container>

### French

```html
<cc-smart-container context='{ "lang": "fr" }'>
  <cc-article-list></cc-article-list>
</cc-smart-container>
```

<cc-smart-container context='{ "lang": "fr" }'>
  <cc-article-list></cc-article-list>
</cc-smart-container>

### Limit (number of articles)

```html
<cc-smart-container context='{ "lang": "en", "limit": 3 }'>
  <cc-article-list></cc-article-list>
</cc-smart-container>
```

<cc-smart-container context='{ "lang": "en", "limit": 3 }'>
  <cc-article-list></cc-article-list>
</cc-smart-container>
