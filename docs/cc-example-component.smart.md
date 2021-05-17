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
  <tr><td><strong>Component    </strong> <td><a href="https://www.clever-cloud.com/doc/clever-components/?path=/docs/ ..."><code>&lt;cc-example-component&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-example-component</code>
  <tr><td><strong>Requires auth</strong> <td>Yes/No
</table>

## ⚙️ Params

<!-- Here we describe the different params. -->

<table>
  <tr><th>Name                   <th>Type                   <th>Details                       <th>Default
  <tr><td><code>apiConfig</code> <td><code>ApiConfig</code> <td>Some details about this param <td>defaut value if necessary
  <tr><td><code>paramFoo</code>  <td><code>String</code>    <td>Some details about this param <td>defaut value if necessary
</table>

<!-- If some params are objects, out the type definitions here. Remove this if you don't need it. -->

```js
interface ApiConfig {
  API_HOST: String,
  API_OAUTH_TOKEN: String,
  API_OAUTH_TOKEN_SECRET: String,
  OAUTH_CONSUMER_KEY: String,
  OAUTH_CONSUMER_SECRET: String,
}
```

## ⚠️ Warnings!

<!-- If you need to warn the user, you can give a list here. Remove the section if you don't need it. -->

* This is important information.

## 🌐 API endpoints

<!-- List API endpoints used by the component here with the details. -->

<table>
  <tr><th>Method <th>URL                                                   <th>Cache?
  <tr><td>GET    <td><code>/v2/products/instances</code>                   <td>1 day
  <tr><td>GET    <td><code>/organisations/{id}/applications/{appId}</code> <td>Default
</table>

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

<!-- Use the component directly here. You will need to import/load the smart definition, for now we add the import in the story. -->
<!-- You don't need this if auth is required. -->

<cc-smart-container context='{ "apiConfig": {}, "paramFoo": "foobar" }'>
  <cc-example-component></cc-example-component>
</cc-smart-container>
