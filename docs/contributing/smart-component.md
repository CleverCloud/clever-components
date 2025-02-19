---
kind: '👋 Contributing'
title: 'Smart Component guidelines'
---
# Smart Component guidelines

Smart components connect UI components with data-fetching logic and API calls. This guide will help you create smart components that handle state management and communicate with backend services.

## Building a Smart Component

### 1. Selector and Context Parameters

First, define your smart component with a selector and context parameters:

```js
defineSmartComponent({
  selector: 'my-component', // CSS selector used to find and bind to all instances of this component in the DOM
  params: {
    // Define expected context parameters
    apiConfig: { type: Object },
    userId: { type: String },
    isAdmin: { type: Boolean, optional: true }
  },
  onContextUpdate: ...
});
```
A smart component reacts to changes in its context by receiving updates through the onContextUpdate callback.
The params section defines the specific pieces of context data that the component needs to function and interact with APIs.
Parameters can be marked as optional with `optional: true` if they are not strictly required.
At least one parameter must be mandatory (non-optional) - you cannot make all parameters optional.
The `type` values inside `params` serve as documentation and have no functional impact on the component's behavior.

### 2. State Updates and Data Fetching

The `updateComponent` helper is a powerful tool for managing component state:

```js
// Pass a direct value to set the property
updateComponent('state', { state: 'loading' });

// Pass a function to modify the property with Immer
updateComponent('state', (state) => {
  state.saving = true;
  state.lastUpdate = Date.now();
});
```

Using Immer under the hood, `updateComponent` lets you write immutable updates in a mutable style.
This allows for more concise and readable state updates while still triggering Lit's change detection.

When fetching data on context updates, start by destructuring the context parameters:

```js
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

The `signal` parameter allows proper cleanup when the context changes again. When a new context update occurs, the previous request will be aborted, preventing race conditions with stale data.

### 3. Reacting to UI events and updating remote data through API calls

The `onEvent` helper simplifies event handling by wrapping `addEventListener` under the hood.
It listens for CustomEvents dispatched by the UI component and provides direct access to the event payload (`event.detail`):

```js
onContextUpdate({ component, context, onEvent, updateComponent }) {
  onEvent('my-component:save', (detail) => {
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

When called, `onEvent` automatically attaches an event listener to the component that extracts the CustomEvent detail and passes it directly to your callback function.
The event listener is also automatically cleaned up when the context changes or the component is disconnected, thanks to AbortSignal integration.
This means you don't need to manually manage event listener lifecycles.

The `notifySuccess` and `notifyError` helpers provide a consistent way to show feedback to users through toast notifications:

```js
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

## Smart Component Documentation

Smart components should be documented in a separate `.smart.md` file alongside your component implementation. This documentation helps other developers understand how to use your smart component and what backend services it interacts with.

### Required Sections

1. Component Details block containing:
   - Link to component storybook
   - Component selector
   - Whether authentication is required

```md
## ℹ️ Details

<table>
  <tr><td><strong>Component    </strong> <td><a href="..."><code>&lt;my-component&gt;</code></a>
  <tr><td><strong>Selector     </strong> <td><code>my-component</code>
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
  <my-component></my-component>
</cc-smart-container>
```

The documentation file should be named `my-component.smart.md` and placed in the same directory as your component implementation.
This ensures documentation stays close to the code and is easier to maintain.

All smart components must include this documentation format to maintain consistency across the project and make it easier for other developers to understand and use your components.
