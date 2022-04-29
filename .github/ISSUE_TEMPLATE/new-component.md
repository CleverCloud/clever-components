---
name: New component
about: Use this when you need to create a new component
title: 'cc-xxx: init component'
labels: enhancement
assignees: ''
---

## Context

<!-- Write some context about the component here, its purpose, where and how it will be used, the domain logic and rules... -->

## To be discussed

<!-- Here you can list stuff that still needs to be discussed... -->

## Inputs

<!-- List the inputs of the component (attributes/properties, slots, CSS custom properties, CSS parts...) -->
<!-- (you can describe your type definitions in the dedicated section below) -->

### Attributes/properties

| Property | Type   | Default value | Mandatory | Description |
|----------|--------|---------------|-----------|-------------|
| `xxx`    | `Yyyy` | `null`        | `true`    | TODO        |

### Slots

| Name  | Description |
|-------|-------------|
| `xxx` | TODO        |

### CSS custom property

| Name  | Type   | Default value | Description |
|-------|--------|---------------|-------------|
| `xxx` | `Yyyy` | `null`        | TODO        |

### CSS part

| Name  | Description |
|-------|-------------|
| `xxx` | TODO        |

## Outputs

<!-- List the outputs of the component (DOM events) -->
<!-- (you can describe your type definitions in the dedicated section below) -->

| Event | Data type | Description |
|-------|-----------|-------------|
| `xxx` | `Yyyy`    | TODO        |

## Type Definitions

```typescript
interface MyType {
  foo: string;
  bar: boolean;
}
```

## Data/APIs

<!-- List the different existing APIs your component will use -->

* `GET api.clever-cloud.com/v2/foobar`
* `PUT api.clever-cloud.com/v2/foobar/{id}`

<!-- In some situations, you will need APIs that don't exist yet, you can list them below -->

## Stories & states

<!-- List the different states and stories you will need to create -->

* Skeleton/loading
* Empty
* Loaded
* Waiting/saving
* Error
* Simulation

## UX writing & i18n

<!-- Your component may require some text, if you already have propositions or remarks about those, write them down here -->

## Wireframes and UI propositions

<!-- If you already have wireframes, put some mockups here -->
