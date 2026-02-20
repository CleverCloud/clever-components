---
kind: '👋 Contributing'
title: 'Smart Component guidelines'
---
# Smart Component guidelines

Smart components connect UI components with data-fetching logic and API calls.
This guide helps you create smart components that handle state management and communicate with backend services.

## Building a Smart Component

### 1. Importing essential Dependencies

Before defining your smart component, import the necessary dependencies for connecting UI components with data-fetching logic:

```js
// cc-my-component.smart.js
import './cc-my-component.js';
import '../cc-smart-container/cc-smart-container.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { getCcApiClientWithOAuth, getCcApiClientWithToken } from '../../lib/cc-api-client.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { notify, notifyError, notifySuccess } from '../../lib/notifications.js';
```

You'll also likely need to import API commands from the `@clevercloud/client` package.
For the new client, use the command classes from `cc-api-commands/`:

```js
import { GetApplicationCommand } from '@clevercloud/client/cc-api-commands/application/get-application-command.js';
```

For the legacy client, use the API functions from `esm/api/`:

```js
import { getApplication } from '@clevercloud/client/esm/api/v2/application.js';
```

Here's an explanation of the key imports and their purposes:
- `defineSmartComponent`: Required to register and configure your smart component,
- `getCcApiClientWithOAuth`: Returns a shared, cached API client instance configured with OAuth v1 credentials from `apiConfig`. Can also be called with `null`/`undefined` for unauthenticated access,
- `getCcApiClientWithToken`: Returns a shared, cached API client instance configured with an API token from `apiTokenConfig`,
- `sendToApi`: Handles API requests with proper error management (legacy approach, see **API Clients: New vs Legacy**),
- `notify`, `notifyError`, `notifySuccess`: Provides user feedback through toast notifications,
- `./cc-my-component.js`: Your Lit component that handles the UI rendering and user interactions. This way, developers using your smart component only need to import the smart component file, not both the smart and UI components or the smart container.
- `../cc-smart-container/cc-smart-container.js`: The container component that provides context and connects smart components to the application state.

The `cc-smart-container` is a crucial part of the smart component architecture.
It serves as a context provider that:
- Manages the configuration context needed by smart components
- Allows context inheritance through nesting
- Handles the communication between smart components and their UI counterparts
- Provides a consistent way to pass API configurations and other parameters

All smart components must be wrapped in a `<cc-smart-container>` element when used in HTML, as shown in the usage examples.
The container exposes the context to the components through the smart component system, enabling automatic data fetching and state management.
For more information, please refer to the [Getting Started - Smart Component](🏡-getting-started-smart-components--docs).

### API Clients: New vs Legacy

There are two ways to make API calls in smart components.

#### New Client: `getCcApiClientWithOAuth` (recommended for new code)

Use `getCcApiClientWithOAuth` to obtain a shared `CcApiClient` instance authenticated with OAuth v1:

```js
// cc-my-component.smart.js
import { GetApplicationCommand } from '@clevercloud/client/cc-api-commands/application/get-application-command.js';

onContextUpdate({ context, signal }) {
  const { apiConfig, ownerId, applicationId } = context;
  const client = getCcApiClientWithOAuth(apiConfig);

  client.send(new GetApplicationCommand({ ownerId, applicationId }), { signal })
    .then((data) => {
      // handle success
    })
    .catch((error) => {
      // handle error
    });
}
```

Key characteristics:
- Returns a `CcApiClient` instance configured with OAuth v1 credentials from `apiConfig`,
- Can be called with `null` or `undefined` to obtain an unauthenticated client using the default API host,
- Clients are cached per `apiConfig` reference using a `WeakMap`, so all components sharing the same config will share the same client instance,
- The `WeakMap` allows automatic garbage collection when the `apiConfig` is no longer referenced.

#### New Client: `getCcApiClientWithToken`

Use `getCcApiClientWithToken` to obtain a shared `CcApiClient` instance authenticated with an API token:

```js
// cc-my-component.smart.js
import { GetApplicationCommand } from '@clevercloud/client/cc-api-commands/application/get-application-command.js';

onContextUpdate({ context, signal }) {
  const { apiTokenConfig, ownerId, applicationId } = context;
  const client = getCcApiClientWithToken(apiTokenConfig);

  client.send(new GetApplicationCommand({ ownerId, applicationId }), { signal })
    .then((data) => {
      // handle success
    })
    .catch((error) => {
      // handle error
    });
}
```

The `apiTokenConfig` object has the following shape (`ApiTokenConfig`):
- `API_TOKEN` (required): The API token string,
- `API_HOST` (optional): The API host URL. Falls back to the default API host if omitted.

Key characteristics:
- Returns a `CcApiClient` instance configured with API token-based authentication,
- Clients are cached per `apiTokenConfig` reference using a separate `WeakMap` from the OAuth client cache,
- The `WeakMap` allows automatic garbage collection when the `apiTokenConfig` is no longer referenced.

#### Legacy Client: `sendToApi`

The `sendToApi` function is the legacy approach still used in many existing smart components.
It is a higher-order function: calling `sendToApi({ apiConfig, signal })` returns a function that is then passed to `.then()` on the promise returned by API client functions:

```js
// cc-my-component.smart.js
onContextUpdate({ context, signal }) {
  const { apiConfig, userId } = context;

  getUserInfo({ userId })
    .then(sendToApi({ apiConfig, signal }))
    .then((data) => {
      // handle success
    })
    .catch((error) => {
      // handle error
    });
}
```

When working on existing smart components that already use `sendToApi`, there is no need to migrate them to the new client right away.

### 2. Selector and Context Parameters

First, define your smart component with a selector and context parameters:

```js
// cc-my-component.smart.js
defineSmartComponent({
  selector: 'cc-my-component', // CSS selector used to find and bind to all instances of this component in the DOM
  params: {
    // Define expected context parameters
    apiConfig: { type: Object },
    userId: { type: String },
    isAdmin: { type: Boolean, optional: true }
  },
  onContextUpdate: ...
});
```

A smart component reacts to changes in its context by receiving updates through the `onContextUpdate` callback.
The `params` section defines the specific pieces of context data that the component needs to function and interact with APIs.
Parameters can be marked as optional with `optional: true` if they are not strictly required.
**At least one parameter must be mandatory (non-optional) - you cannot make all parameters optional**.
The `type` values inside `params` serve as documentation and have no functional impact on the component's behavior.

### 3. State Updates and Data Fetching

The `updateComponent` helper is a powerful tool for managing component state:

```js
// cc-my-component.smart.js
// Pass a direct value to set the property
updateComponent('state', { state: 'loading' });

// Pass a function to modify the property with Immer
updateComponent('state', (state) => {
  state.saving = true;
  state.lastUpdate = Date.now();
});
```

Using [Immer](https://github.com/immerjs/immer) under the hood, `updateComponent` lets you write immutable updates in a mutable style.
This allows for more concise and readable state updates while still triggering Lit's change detection.

When fetching data on context updates, start by destructuring the context parameters:

```js
// cc-my-component.smart.js
onContextUpdate({ component, context, updateComponent, signal }) {
  const { apiConfig, userId } = context;

  // Set loading state
  updateComponent('state', { state: 'loading' });

  // Fetch data using destructured context params
  fetchData(apiConfig, userId, signal)
    .then((data) => {
      updateComponent('state', {
        state: 'loaded',
        value: data
      });
    })
    .catch((error) => {
      console.error(error);
      updateComponent('state', { state: 'error' });
    });
}
```

The `signal` parameter allows proper cleanup when the context changes again.
When a new context update occurs, the previous request will be aborted, preventing race conditions with stale data.

Note:
[Immer freezes objects](https://immerjs.github.io/immer/freezing/) to ensure immutability.
If you try to directly mutate an Immer-produced object elsewhere in your code, you'll get an error indicating you cannot modify readonly properties.
This error is legitimate since you should never directly mutate Lit reactive properties, even though plain JavaScript would technically allow it.
The `updateComponent` function provides the safest way to update component state while ensuring proper change detection.

### 4. Reacting to UI events and updating remote data through API calls

The `onEvent` helper simplifies event handling by wrapping `addEventListener` under the hood.
It listens for Events dispatched by the UI component and provides direct access to the event payload (`event.detail`):

```js
// cc-my-component.smart.js
onContextUpdate({ component, context, onEvent, updateComponent }) {
  onEvent('cc-my-event', (detail) => {
    updateComponent('state', (state) => {
      state.saving = true;
    });

    saveData(context.apiConfig, detail)
      .then(() => {
        notifySuccess('Save successful');
      })
      .catch((error) => {
        console.error(error);
        notifyError('Save failed');
      })
      .finally(() => {
        updateComponent('state', (state) => {
          state.saving = false;
        });
      });
  });
}
```

When called, `onEvent` automatically attaches an event listener to the component that extracts the event detail and passes it directly to your callback function.
The event listener is also automatically cleaned up when the context changes or the component is disconnected, thanks to AbortSignal integration.
This means you don't need to manually manage event listener lifecycles.

The `notifySuccess` and `notifyError` helpers provide a consistent way to show feedback to users through toast notifications:

```js
// cc-my-component.smart.js
// Show a success toast with title (second argument)
notifySuccess('Operation completed successfully', 'Success');

// Show an error toast without title
notifyError('An error occurred', 'Error');

// Show a custom toast with more options
notify({
  intent: 'info',
  title: 'Custom Notification',
  message: 'With additional details',
  options: {
    timeout: 0, // Toast won't auto-dismiss
    closeable: true // User can manually close
  }
});
```

These notification helpers ensure a consistent look and feel across the application while making it easy to provide feedback about API operations.
Refer to the [cc-toaster component](🛠-toast-cc-toaster--default-story) for more info.

## Smart Component Documentation

Smart components should be documented in a separate `.smart.md` file alongside your component implementation.
This documentation helps other developers understand how to use your smart component and what backend services it interacts with.

### Required Sections

1. Component Details block containing:
   - Link to component storybook
   - Component selector
   - Whether authentication is required

```md
## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="..."><code>&lt;cc-my-component&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>cc-my-component</code>
  <tr><td><strong>Requires auth</strong> <td>Yes
</table>
```

2. Parameters section listing all context params with types and descriptions:

```md
## ⚙️ Params

| Name        | Type        | Details                    | Default |
|-------------|-------------|----------------------------|---------|
| `apiConfig` | `ApiConfig` | API configuration object   |         |
| `userId`    | `String`    | ID of the current user    |         |
```

3. API Endpoints section detailing all backend endpoints used:

```md
## 🌐 API endpoints

| Method   | URL                     | Cache?  |
|----------|-------------------------|---------|
| `GET`    | `/v2/users/{userId}`   | Default |
| `POST`   | `/v2/users/{userId}`   | Default |
```

4. Example usage showing the component with sample context:

```md
## ⬇️️ Examples

<cc-smart-container context='{
  "apiConfig": {...},
  "userId": "user_123"
}'>
  <cc-my-component></cc-my-component>
</cc-smart-container>
```

The documentation file should be named `cc-my-component.smart.md` and placed in the same directory as your component implementation.
This ensures documentation stays close to the code and is easier to maintain.

All smart components must include this documentation format to maintain consistency across the project and make it easier for other developers to understand and use your components.
