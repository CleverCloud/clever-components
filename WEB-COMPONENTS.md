# Web Components at Clever Cloud

Here a different rules we want any contributor to follow regarding how we write Web Components with LitElement.

## General rules and reminders

* Don't forget to document your component's public API (properties, attributes, methods, events, slots, CSS custom props...)
* Your component should be UI only and NOT COUPLED with where the data comes from
* Don't forget to init your property default values in the constructor
* Use the `dispatchCustomEvent` helper and try to emit your value directly on `detail`
* In the data I/O, prefer array of objects (instead of object literals) for collections
* Always name your event handlers "_onSomething"
* Try to sort your CSS sources in each selector (alphabetically)
* Declare all public properties in the static get properties
* Think about what will happen when there's an error
* Think about what will happen when the data is not there yet, <br> for this, we use the "skeleton screen" pattern
* Think about what will happen when the data is empty, <br> don't forget to add a message
* Think about the focus, where does it go when something is validated or when an element disappears
* Use `// language=CSS` over your `css` declaration so WebStorm can to syntaxic coloration and more
* Use `// language=HTML` in your stories so WebStorm can to syntaxic coloration and more
* Try to avoid the quotes for this `prop="${this.prop}"` and do this instead: `prop=${this.prop}`
* Make sure all texts are translated
* Prefix all translation keys with the component name and split parts with dots

## How to order stuff in a custom element using LitElement?

In order to help anyone reading this code base to find what s.he's looking for,
we're proposing this order for the different pars of a custom element built with LitElement:

1. LitElement's properties descriptor <br> `static get properties () {}`
1. Constructor <br> `constructor () {}`
1. property getters <br> `get myProp () {}`
1. property setters <br> `set myProp (value) {}`
1. public methods <br> `myMethodName (arg0, arg1) {}`
1. private methods (prefixed with an underscore) <br> `_myMethodName (arg0, arg1) {}`
1. event handlers (almost always private, prefixed with `_on`) <br> `_onClickToggle (e) {}`
1. custom element lifecycle callbacks <br> `connectedCallback () {}`
1. LitElement lifecycle callbacks <br> `firstUpdated () {}`
1. LitElement's render method <br> `render () {}`
1. LitElement's styles descriptor <br> `static get styles () {}`

## How to order attributes when you use a component?

1. `class` attribute
1. other attributes
1. event listeners
