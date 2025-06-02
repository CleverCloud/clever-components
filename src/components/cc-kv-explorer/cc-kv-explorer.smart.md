---
kind: '🚧 Beta/🛠 Kv Explorer/<cc-kv-explorer-beta>'
title: '💡 Smart'
---
# 💡 Smart `<cc-kv-explorer-beta>`

## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="https://www.clever-cloud.com/developers/doc/clever-components/?path=/story/🚧-beta-🛠-kv-explorer-cc-kv-explorer-beta--default-story"><code>&lt;cc-kv-explorer-beta&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-kv-explorer-beta</code>
  <tr><td><strong>Requires auth</strong> <td>No
</table>

## ⚙️ Params

| Name          | Type          | Details                       | Default |
|---------------|---------------|-------------------------------|---------|
| `kvApiConfig` | `KvApiConfig` | Object with API configuration |         |


```typescript

interface KvApiConfig {
  url: string;
  backendUrl: string;
}
```

## 🌐 API endpoints

TBD!

## ⬇️️ Examples

```html
<cc-smart-container context='{
  "kvApiConfig": {
    url: "",
    backendUrl: "",
  }
}'>
  <cc-kv-explorer-beta></cc-kv-explorer-beta>
</cc-smart-container>
```
