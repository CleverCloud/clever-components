---
kind: '📌 Architecture Decision Records'
---

# ADR 0018: How to give feedback after a user action?

🗓️ 2022-08-26 · ✍️ Pierre de Soyres

This ADR tries to explain why and how we implemented a mechanism that triggers notifications after user actions.

## Context?

When a user performs an action (e.g. clicking on a button), it is common practice to give feedback after the action has been completed.
When something goes wrong, showing an error message may help the user understand what happened and maybe provide insights on how to correct the error.
Also, showing a message after an action succeeded can comfort the user that the action has been taken into account successfully.

We started very simply by displaying only error messages near the button that triggered the action.

## Problems?

* The error messages were hard to place nicely and there was no consistency.
* The component had to maintain different error states which complicates the code a lot.
* We did not handle the case where the action succeeded.

## What we want

Before explaining the solution, here is what we want.

* We want all messages to be located in the same area of the screen.
* We want the messages to appear without disturbing the user workflow.
* We want the messages to disappear automatically after a small amount of time (few seconds).
* We want the messages to be decorated in such a way that the intention is easily understood (information, success, warning, error).

The `toast` pattern seems to be what we need.

Technically speaking, we want to allow developers to integrate the component in a totally decoupled manner so that it doesn't have any adherence to the technology or framework used (in our case [Lit](https://lit.dev/)).
Finally, we try to be pragmatic and not provide too many features that we don't need right now.

## What we implemented

We created a system composed of two Web Components:

* a `<cc-toast>` component which displays the message.
* a `<cc-toaster>` component which is the container of the `<cc-toast>` elements.

Here is how it works:

1. The `<cc-toaster>` shows a `<cc-toast>` (we're going to see how after).
2. After a certain amount of time, the `<cc-toast>` component dispatches a `cc-toast:dismiss` event. This event is also dispatched when user clicks on the close button.
3. The `<cc-toaster>` listens to the `cc-toast:dismiss` event and reacts by hiding the corresponding `<cc-toast>`.

The hard part is to provide a nice and flexible way to interact with the `<cc-toaster>`.
This was not made in one go, and we want to share with you the path that leaded us to the final implementation.

Each section below shows an implementation of the `<cc-toaster>`.
And for each implementation, we will give you an example on how it is used.
Note that each example assumes that you have a `<cc-toaster>` element somewhere in the DOM.

### First implementation

Our first implementation was based on two public methods on the `<cc-toaster>` component.

The code looked like this:

```javascript
class CcToaster {
  show(toast) {
    const key = 'abcdef123456'; // here we forged a unique identifier
    
    // toast display logic was here ...
    
    return key;
  }
  
  dismiss(key) {
    // toast dismiss logic was here ...
  }
}
```

The code below shows how it was used:

```javascript
// showing a toast was done using the public show() method
const toastKey = document.querySelector('cc-toaster').show({
  message: 'Something went wrong while perfoming action',
  intent: 'danger'
});

// dismissing a toast was done using the unique identifier returned by the show() method
document.querySelector('cc-toaster').dismiss(toastKey);
```

The problems with this technique is:

* the internal toast identifier (`key`) is leaking out from the component while it should be an internal implementation detail.
* developers have to write some code to glue the `<cc-toaster>` to their application. At this point, we wanted developers to write as less code as possible for their integration.

### Second implementation

Our second attempt was to remove all public methods and base the implementation on [custom event](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
When the `<cc-toaster>` element is added to the DOM, it starts listening to `cc-toast:show` events using `window.addEventListener()`.

The code looked like this:

```javascript
class CcToaster {
  connectedCallback () {
    window.addEventListener('cc-toast:show', (event) => {
      // toast display logic was here ...

      event.dismissToast = () => {
        // dismiss toast logic was here ...
      };
    });
    
    super.connectedCallback();
  }
}
```

Notice how we added a `dismissToast()` function to the event.

The code below shows how it was used:

```javascript
// Showing a toast was done by dispatching a `cc-toast:show` custom event with the toast definition in the event's `detail` property:
const event = new CustomEvent('cc-toast:show', {
  detail: {
    message: 'Something went wrong while perfoming action',
    intent: 'danger'
  },
  bubbles: true,
  composed: true,
});

window.dispatchEvent('cc-toast:show', event);

// Toast dismissing was done using the `dismissToast()` function that is attached to the event.
// this works because the events are handled synchronously:
event.dismissToast();
```

This technique comes with some problems:

* The integration becomes minimalist, but in fact, we found that there is too much magic going on underneath.
* The developers do not have control on the DOM element from which the events are listen. Even if not recommended, it prevents developers from having multiple `<cc-toaster>` in the same application.

### Final implementation

Once again, we needed to rework our implementation. Here is the solution we came to.

The code looks like this:

```javascript
class CcToaster {
  show(toast) {
    // toast display logic is here ...
    
    return () => {
      // toast dismiss logic is here ...  
    };
  }
}
```

The code below shows how to use it:

```javascript
// Showing a toast is done by using the `show()` public method
const dismissToast = document.querySelector('cc-toaster').show({
  message: 'Something went wrong while perfoming action',
  intent: 'danger'
});

// Dismissing a toast is done by using the function returned by the `show()` method
dismissToast();
```

This final implementation takes the best from the previous attempts.

We removed the magic happening when the `<cc-toaster>` element was added to the DOM.
As a result, developers need to code the glue between their application and the toaster.

We kept the ability to programmatically dismiss a toast, but without the need to maintain a unique identifier for the toast.

### Wrapping up

First, we wanted the integration of the toaster to be done with the less code as possible.
We figured out that it introduced a bit too much of magic.
So we came back to something that requires a bit of glue, and in fact, it provides greater flexibility for developers.

We believe that the integration should be done with decoupling in mind and a nice way to do that is by using DOM events.
The code below shows how we integrate the `<cc-toaster>` in the Clever Console:

```javascript
const toaster = document.querySelector('cc-toaster');

// Here we listen to any components in the app who want to display a notification (a few Clever Components already send this `cc:notify` event)
window.addEventListener('cc:notify', ({ detail: notification }) => {
  toaster.show(notification);
});

// This is a helper function that provides a way to easily dispatch a notification 
export function notify(node, message, intent) {
  const toast = { message, intent };
  node.dispatchEvent(new CustomEvent('cc:notify', { detail: toast, bubbles: true, composed: true }));
}
```

## Accessibility

We understood that the `toast` pattern comes, by design, with a lot of accessibility challenges.
If you want to read more about that, you can refer to the dedicated ADR: [ADR 0019: How to make toaster accessible?](https://www.clever-cloud.com/doc/clever-components/?path=/docs/📌-architecture-decision-records-adr-0019-how-to-make-toaster-accessible--docs)

## Sum up

We managed to achieve a system that allows two important things:

* Developers can use the notification/toast system with any tech stack (legacy jQuery, Vue.js, React...) and even in a project that doesn't use the Clever Components.
* Developers can use the Clever Components that send `cc:notify` events without the notification/toast system. They can be used with something else that may be already in the project.

## References

### Comparing our implementation with other libraries

It's always interesting to check differences with other libs.
We took two different toasters:

* https://fkhadra.github.io/react-toastify/
  * this one works only with React
  * There are a lot of features that we don't need
* https://github.com/Maronato/vue-toastification
  * This one works only with Vue.js

Neither of them don't have what we do for accessibility:

* the `aria-label` on the close button is hard coded in english.
* there is no description for the icon.
* toasts are not focusable with keyboard.
