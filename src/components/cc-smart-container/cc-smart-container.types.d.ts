import { SmartComponentDefinition } from '../../lib/define-smart-component.types';
import { CcSmartContainer } from '../../lib/define-smart-component';

export type SmartComponentDefinitionFoo = SmartComponentDefinition<CcSmartContainer, { foo: boolean, bar: string }>;
