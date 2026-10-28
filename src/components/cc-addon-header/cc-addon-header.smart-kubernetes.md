---
kind: '🛠 Addon/<cc-addon-header>'
title: '💡 Smart (Kubernetes)'
---
# 💡 Smart `<cc-addon-header smart-mode="kubernetes">`

## ℹ️ Details

<table>
<tr><td><strong>Component    </strong> <td><a href="🛠-addons-cc-addon-header--default-story"><code>&lt;cc-addon-header&gt;</code></a>
<tr><td><strong>Selector     </strong> <td><code>cc-addon-header[smart-mode="kubernetes"]</code>
<tr><td><strong>Requires auth</strong> <td>Yes
</table>

## ⚙️ Params

| Name               | Type          | Details                                                                                          | Default    |
| ------------------ | ------------- | ------------------------------------------------------------------------------------------------ | ---------- |
| `apiConfig`        | `ApiConfig`   | Object with API configuration (target host, tokens...)                                           |            |
| `ownerId`          | `string`      | UUID prefixed with orga_                                                                         |            |
| `kubernetesId`     | `string`      | ID of the Kubernetes cluster prefixed with kubernetes_                                           |            |
| `productStatus`    | `string`      | Maturity status of the product                                                                   | Optional   |


  ```ts
interface ApiConfig {
  API_HOST: string,
  API_OAUTH_TOKEN: string,
  API_OAUTH_TOKEN_SECRET: string,
  OAUTH_CONSUMER_KEY: string,
  OAUTH_CONSUMER_SECRET: string,
}
```

## 🌐 API endpoints

| Method     | URL                                                                                          | Cache?                          |
| ---------- | -------------------------------------------------------------------------------------------- | ------------------------------- |
| `GET`      | `/v4/kubernetes/organisations/${ownerId}/clusters/${kubernetesId}`                           | Default                         |
| `GET`      | `/v4/kubernetes/organisations/${ownerId}/clusters/${kubernetesId}/kubeconfig/presigned-url`  | Default (fetched every 50 mins) |

The kubeconfig link is fetched independently of the cluster: if it cannot be retrieved, the header is still displayed, without the kubeconfig download link.

* On a `403` (the user's role is not allowed to get a kubeconfig), no error is notified and the link is not refreshed anymore.
* On any other error, an error toast is displayed once and the link keeps being refreshed every 50 mins.


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
    "ownerId": "orga_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
    "kubernetesId": "kubernetes_XXXXXXXXXXXXXXXXXXXXXXX",
    "productStatus": "",
}'>
  <cc-addon-header smart-mode="kubernetes"></cc-addon-header>
</cc-smart-container>
```
