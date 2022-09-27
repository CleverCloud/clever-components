# Notes about typechecking our components with JSDoc an algebraic types

## The `when` directive breaks TypeScript's type inferance and algebraic types.

In this example, TypeScript is able to infer that `this.person` is `PersonStateLoaded` because `state === 'loading'` is true:

```
${this.person.state === 'loaded' ? html`
  <div>Hello ${this.person.name}</div>
` : ''}
```

In this example, TypeScript is NOT able to infer that `this.person` is `PersonStateLoaded`.

```
${when(this.person.state === 'loaded', () => html`
  <div>Hello ${this.person.name}</div>
`)}
```

It complains with this error:

```
error TS2339: Property 'name' does not exist on type 'PersonState'
```



"--src/lib/smart-manager.js",
"--src/lib/define-smart-component.js",
"--src/components/cc-smart-container/cc-smart-container.js"
