---
kind: '🛠 Example section/<cc-example-component>'
title: '💡 Smart (foobar)'
---
# 💡 Smart `<cc-example-component>` for foobar

<!--
The title in the frontmatter is used in the storybook menu.
The Markdown title is used in the document.
You can add some details in parens when the selector is more complex.
-->

## ℹ️ Details

<!-- Here we give some general details about the smart definition. -->

<table>
  <tr><td><strong>Component    </strong> <td><a href="https://www.clever-cloud.com/developers/doc/clever-components/?path=/docs/ ..."><code>&lt;cc-example-component&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-example-component</code>
  <tr><td><strong>Requires auth</strong> <td>Yes/No
</table>

## 👋️ Events fired

<!-- Here we describe the different events fired by the smart component. -->

| Name              | Payload            | Details                                            |
|-------------------|--------------------|----------------------------------------------------|
| `some-event-name` | `SomeEventPayload` | Some details about when or why this event is fired |

```ts
interface SomeEventPayload {
    id: string,
}
```

## ⚙️ Params

<!-- Here we describe the different params. -->

| Name        | Type         | Details                       | Default                   |
|-------------|--------------|-------------------------------|---------------------------|
| `apiConfig` | `ApiConfig`  | Some details about this param | defaut value if necessary |
| `paramFoo`  | `string`     | Some details about this param | defaut value if necessary |

<!-- If some params are objects, out the type definitions here. Remove this if you don't need it. -->

```ts
interface ApiConfig {
  API_HOST: string,
  API_OAUTH_TOKEN: string,
  API_OAUTH_TOKEN_SECRET: string,
  OAUTH_CONSUMER_KEY: string,
  OAUTH_CONSUMER_SECRET: string,
}
```

## ⚠️ Warnings!

<!-- If you need to warn the user, you can give a list here. Remove the section if you don't need it. -->

* This is important information.

## 🌐 API endpoints

<!-- List API endpoints used by the component here with the details. -->

| Method | URL                                        | Cache?  |
|--------|--------------------------------------------|---------|
| `GET`  | `/v2/products/instances`                   | 1 day   |
| `GET`  | `/organisations/{id}/applications/{appId}` | Default |

## ⬇️️ Examples

<!-- Give some examples here. Leave token information blank and focus on demonstrating the smart component context params. -->

### Example one title

Some quick description of the example.

<!-- Put HTML example here. -->

```html
<cc-smart-container context='{ "apiConfig": {}, "paramFoo": "foobar" }'>
  <cc-example-component></cc-example-component>
</cc-smart-container>
```
