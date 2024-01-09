import { nothing } from 'lit';
import { Directive, directive } from 'lit/async-directive.js';

export class FormValidationDirective extends Directive {
  constructor (partInfo) {
    super(partInfo);
    this._formElement = partInfo.element;

    // TODO: I think the directive / helper should only handle the validation for `cc-` components
    // dispatching the event could be left to the component, this way we don't deal with the multiple form issue and we give more control to devs
    // preventDefault + novalidate attribute is an interesting feature so I'm not sure
    this._formElement.setAttribute('novalidate');
    this._formElement.addEventListener('submit', (e) => {
      e.preventDefault();

      // TODO: for instance, we could just provide a small helper that does that.
      const data = Object.fromEntries(new FormData(this._formElement));

      // TODO: for instance, we could just provide a small helper that does that.
      const isFormValid = Array.from(this._formElement.elements).filter((element) => element.validate != null)
        .map((element) => element.validate(true).valid)
        .every((result) => result);

      if (isFormValid) {
        console.log('Success', data);
      }
    });
  }

  render () {
    return nothing;
  }
}

export const formValidationDirective = directive(FormValidationDirective);
