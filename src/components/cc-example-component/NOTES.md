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

## Links

* https://usecsv.com/community/javascript-jsdoc
* https://medium.com/brain-bites/my-short-journey-from-typescript-to-javascript-with-jsdoc-and-back-c2d905d0e15f
* https://github.com/DavidWells/types-with-jsdocs
* https://github.com/microsoft/TypeScript/issues/27387
* https://docs.joshuatz.com/cheatsheets/js/jsdoc/
* https://catchts.com/callbacks#cb_structure
