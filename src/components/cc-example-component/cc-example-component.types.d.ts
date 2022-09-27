import { SmartComponentDefinition } from "../../lib/define-smart-component.types.js";
import { CcExampleComponent } from './cc-example-component.js';

export type PersonState = PersonStateLoading | PersonStateLoaded | PersonStateError;

interface PersonStateLoading {
  state: 'loading';
}

interface PersonStateLoaded extends Person {
  state: 'loaded';
}

interface PersonStateError {
  state: 'error';
}

export interface Person {
  name: string;
  age: number;
  funny: boolean;
}

export type CcExampleComponentSmartDefinition = SmartComponentDefinition<CcExampleComponent, { personId: string }, { 'the-event': { one: string } }>;
