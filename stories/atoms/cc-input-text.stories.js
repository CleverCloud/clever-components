import '../../components/atoms/cc-input-text.js';
import notes from '../../.components-docs/cc-input-text.md';
import { storiesOf } from '@storybook/html';
import { withCustomEventActions } from '../lib/event-action.js';

const withActions = withCustomEventActions('cc-input-text:input');

storiesOf('atoms/<cc-input-text>', module)
  .add('simple', withActions(() => `

    <style>
      cc-input-text { width: 200px; }
    </style>
    
    <div class="title">Empty value:</div>
    <cc-input-text placeholder="Placeholder here..."></cc-input-text>
    
    <div class="title">With value:</div>
    <cc-input-text value="Awesome value"></cc-input-text>
    
    <div class="title">Disabled:</div>
    <cc-input-text disabled value="This is disabled"></cc-input-text>
    
    <div class="title">Readonly:</div>
    <cc-input-text readonly value="This is readonly"></cc-input-text>
    
    <div class="title">Skeleton:</div>
    <cc-input-text skeleton value="This will be a value"></cc-input-text>
    <cc-input-text skeleton place="Placeholder text here"></cc-input-text>
    
  `), { notes })
  .add('multiline', withActions(() => `

    <style>
      cc-input-text { width: 200px; }
    </style>
      
    <div class="title">Empty value:</div>
    <cc-input-text multi placeholder="Placeholder here..."></cc-input-text>
    
    <div class="title">With value:</div>
    <cc-input-text multi value="Line one\nLine two"></cc-input-text>
    
    <div class="title">Disabled:</div>
    <cc-input-text multi disabled value="Disabled line one\nDisabled line two"></cc-input-text>
    
    <div class="title">Readonly:</div>
    <cc-input-text multi readonly value="Readonly line one\nReadonly line two"></cc-input-text>
    
    <div class="title">Skeleton:</div>
    <cc-input-text multi skeleton value="This will be\na value"></cc-input-text>
    <cc-input-text multi skeleton placeholder="Placeholder text here"></cc-input-text>
  `), { notes });
