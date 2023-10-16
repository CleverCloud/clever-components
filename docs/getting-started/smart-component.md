---
kind: '🏡 Getting Started'
title: 'Smart components'
---

# What is a smart component?

Smart components are classic Web Components, but they have something special: they communicate with the outside.

A smart component is built as follows:

- the pure UI Web Component on one hand,
- the API calls (as we like to call: "the smart part") on the other hand,
- which communicate together thanks to a set of smart helpers.

Those helpers include among others:

- a dedicated Web Component,
- a context manager that handles the components updates as well as their connection/disconnection from the DOM,
- methods to listen to events emitted from the UI and to update the UI from the smart part.

This implementation allows a more robust development experience, where UI and API concerns can be developed, tested and reviewed separately or simultaneously.
