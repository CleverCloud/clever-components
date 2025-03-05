---
kind: '🏡 Getting Started'
title: 'Smart components'
---
# What is a smart component?

Smart components are Web Components that wrap UI components to create a clear separation between API and UI logic.

While UI components focus solely on rendering and user interactions, smart components handle all the complexity of data fetching, state management, and API interactions automatically.

This architecture ensures a clean separation of concerns where smart components manage the data layer while UI components remain focused on presentation.

Smart components automatically:
- Fetch initial data when mounted,
- Handle loading and error states,
- Update the UI when data changes,
- Make API calls in response to user actions,
- Emit events for important state changes,
- Fire events that a [`cc-toaster` component](https://www.clever-cloud.com/doc/clever-components/?path=/story/%F0%9F%9B%A0-toast-cc-toaster--default-story) can react to by showing notifications about API call results.

# How to use a smart component

When using a smart component, make sure to import the smart component file (e.g- `cc-example.smart.js`) rather than the UI component file (e.g- `cc-example.js`).
This ensures you get the complete component with data fetching capabilities.

To use a smart component:

1- Wrap it in a `<cc-smart-container>` element
2- Provide the required configuration via the `context` attribute
3- The component will automatically handle data fetching and updates

`cc-smart-container` elements can be nested, in which case they will inherit the context from their parent container.
Also note that a single container may wrap multiple UI components, you don't have to add a dedicated container for each UI component.
As long as you import all the required smart components and provide all the necessary parameters in the context, everything works seamlessly.

Here's a basic example with a single component:

```html
<cc-smart-container context='{
  "apiConfig": {
    "API_HOST": "https://api.example.com",
    "API_OAUTH_TOKEN": "token",
    "API_OAUTH_TOKEN_SECRET": "secret",
    "OAUTH_CONSUMER_KEY": "key",
    "OAUTH_CONSUMER_SECRET": "secret"
  },
  "ownerId": "orga_123"
}'>
  <cc-email-list></cc-email-list>
</cc-smart-container>
```

Here's an example showing both basic usage and nested containers with context inheritance:

```html
<!-- Parent container with API config -->
<cc-smart-container context='{
  "apiConfig": {
    "API_HOST": "https://api.example.com",
    "API_OAUTH_TOKEN": "token",
    "API_OAUTH_TOKEN_SECRET": "secret",
    "OAUTH_CONSUMER_KEY": "key",
    "OAUTH_CONSUMER_SECRET": "secret"
  }
}'>
  <!-- This component uses the parent apiConfig -->
  <cc-email-list></cc-email-list>

  <!-- Nested container inherits apiConfig and adds more context -->
  <cc-smart-container context='{
    "ownerId": "orga_123",
    "appId": "app_456"
  }'>
    <!-- These components use both the inherited apiConfig and the local context -->
    <cc-domain-management></cc-domain-management>
    <cc-tcp-redirection-form></cc-tcp-redirection-form>
  </cc-smart-container>

</cc-smart-container>
```

Each smart component has its own documentation page that specifies:

- Required configuration parameters,
- API endpoints it interacts with,
- Events it emits,
- Usage examples.

You can find these details in the component's Smart documentation page, denoted by the "💡 Smart" suffix in Storybook.
For instance, check the [`cc-addon-linked-apps` smart doc page](https://www.clever-cloud.com/doc/clever-components/?path=/docs/%F0%9F%9B%A0-addon-cc-addon-linked-apps-%F0%9F%92%A1-smart--docs).

Most smart components require authentication via an `apiConfig` object containing API credentials.
Some of them may require additional parameters like `ownerId` or `appId` depending on their functionality.
