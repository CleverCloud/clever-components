---
kind: '🏡 Getting Started'
title: 'Notification system'
---

# How to use notification system?

We designed a notification system based on the toast pattern.

First, this document will explain how to use it.
Then, it will show how we designed a fully decoupled way to integrate it into our _smart components_.

## The toaster

We provide two web components:

1. The `cc-toast` component that represents a single notification.
2. The `cc-toaster` component that helps you display them on your application.

First of all, you need to place the `cc-toaster` somewhere in your application.
A common practice is to have one single `cc-toaster` for the whole application and to place the element at the end of the `body` tag:

```html
<html>
  <body>
    <!-- your application here ... -->
    <cc-toaster></cc-toaster>
  </body>
</html>
```

To display a notification, you need to call the `show()` method on the `<cc-toaster>` element like this:

```javascript
const toast = {
  message: 'Message to be displayed!',
  intent: 'success',
};

document.querySelector('cc-toaster').show(toast);
```

### Note about placement

You can place the toaster where you want in your application but the toaster pattern encourages you to place it in the border of the screen.
Bellow an example showing how to place the `cc-toaster` in the top-right corner of the screen.

```css
cc-toaster {
  position: fixed;
  z-index: 1000;
  margin: 1em;
  top: 0;
  right: 0;
}
```

When doing that you need to tell the `cc-toaster` where you placed it so that he knows how to align toasts.
For that you will use the `position` attribute:

```html
<cc-toaster position="top-right"></cc-toaster>
```

The `position` attribute also drives the animation that is played when showing and hiding the toast.
You can use the `animation` property and choose between 3 animations: `fade`, `slide` or `fade-and-slide`.
When you choose `slide` or `fade-and-slide` animation, the sliding effect depends on the `position` attribute because we want the toast to appear from the right side of the screen.
For example:

* When position is `top-left`, the toast appears from left to right and disappears from right to left.
* When position is `bottom-right`, the toast appears from right to left and disappears from left to right.
* When position is `top`, the toast appears from top to bottom and disappears from bottom to top.

### Toast options

When showing a toast, you have the ability to pass some options:

* `closeable`: whether the toast has a close button.
* `timeout`: the duration in milliseconds before the toast is automatically dismissed.
* `showProgress`: whether to show a progress bar. This progress bar materializes the timeout.

Bellow is an example on how to use options:

```javascript
const toast = {
  message: 'Message to be displayed!',
  intent: 'success',
  options: {
    closeable: true,
    showProgress: true,
    timeout: 3000,
  }
};

document.querySelector('cc-toaster').show(toast);
```

If you don't provide one of the option, the following default value will be used as fallback:

* `closeable`: `false`
* `timeout`: `5000`
* `showProgress`: `false`

If you don't want to provide options each time you want to display a toast, you can provide some default options to the `cc-toaster` which will always be applied when showing a toast.
Note that you'll still be able to override those defaults when you want to.

```html
<cc-toaster toast-default-options='{ "closeable": true, "timeout": 3000 }'></cc-toaster>
```

## Integration in smart components

At some point, smart components need to trigger some notifications when something goes wrong while contacting our API (or when everything went right too). This chapter will explain how we did that in a fully decoupled manner.

For details on smart components, you can check [this introduction to smart components](🏡-getting-started-smart-components--docs).

We based our integration on DOM events:
The smart components dispatch `cc-notify` event like this:

```javascript
const toast = {
  message: 'Something went wrong while contacting clever API.',
  intent: 'danger',
};

node.dispatchEvent(new CcNotifyEvent(toast));
```

At this point, nothing really happens.
It's up to developers who integrate the smart components in their application to listen to those events and react by displaying a toast like explained before:

```javascript
document.addEventListener('cc-notify', (event) => {
  document.querySelector('cc-toaster').show(event.detail);
});
```

Notice how we use the `detail` property of the `CcNotifyEvent` instance to pass the notification to be displayed by the `cc-toaster`.
