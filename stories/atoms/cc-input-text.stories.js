import '../../components/atoms/cc-input-text.js';
import notes from '../../.components-docs/cc-input-text.md';
import { createContainer } from '../lib/dom.js';
import { storiesOf } from '@storybook/html';
import { withCustomEventActions } from '../lib/event-action.js';

const withActions = withCustomEventActions('cc-input-text:input');

function createComponent (width, value, multi, readonly) {
  const component = document.createElement('cc-input-text');
  component.style.width = width + 'px';
  component.value = value;
  component.multi = multi;
  component.readonly = readonly;
  return component;
}

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget tempor leo, eu vulputate lectus. Sed rhoncus rhoncus mi nec tempor. Pellentesque id elit aliquet, laoreet mi nec, cursus metus. Integer iaculis nibh non massa dignissim dictum.
Etiam a condimentum velit. Sed orci nunc, iaculis quis nulla nec, pretium mattis mi. Phasellus auctor sit amet massa at tempus. Sed eu aliquam justo. Nulla tortor neque, porta a elit vitae, accumsan auctor mauris. Vestibulum efficitur urna est, sit amet convallis metus porta tempus.
Etiam vestibulum placerat massa eget lacinia. Aenean bibendum, massa id mattis vehicula, turpis erat rhoncus ante, sed pharetra nulla velit non velit. Aliquam vehicula mauris elit, id elementum nisi malesuada ut. Donec hendrerit rhoncus orci, quis scelerisque quam cursus eget.
Integer posuere tortor sit amet nisl sollicitudin, at tempus ipsum semper.`;

storiesOf('1. Atoms|<cc-input-text>', module)
  .addParameters({ notes })
  .add('simple/multi, disabled, skeleton, long values', withActions(() => `

    <div class="title">Empty value (simple, multi):</div>
    <cc-input-text placeholder="Placeholder here..."></cc-input-text>
    <cc-input-text multi placeholder="Placeholder here..."></cc-input-text>
    
    <div class="title">Short value (simple, multi):</div>
    <cc-input-text value="Awesome value"></cc-input-text>
    <cc-input-text multi value="Awesome value line 1\nAwesome value line 2"></cc-input-text>
    
    <div class="title">Disabled (simple, multi):</div>
    <cc-input-text disabled value="Disabled value"></cc-input-text>
    <cc-input-text disabled multi value="Disabled value line 1\nDisabled value line 2"></cc-input-text>
    
    <div class="title">Readonly (simple, multi):</div>
    <cc-input-text readonly value="This is readonly"></cc-input-text>
    <cc-input-text readonly multi value="This is readonly line 1\nThis is readonly line 2"></cc-input-text>
    
    <div class="title">Skeleton empty (simple, multi):</div>
    <cc-input-text skeleton placeholder="Placeholder here..."></cc-input-text>
    <cc-input-text multi skeleton placeholder="Placeholder here..."></cc-input-text>
    
    <div class="title">Skeleton with value (simple, multi):</div>
    <cc-input-text skeleton value="Awesome value"></cc-input-text>
    <cc-input-text skeleton value="Awesome value"></cc-input-text>
    
    <div class="title">Long value value (simple, multi):</div>
    <cc-input-text value="${lorem}"></cc-input-text>
    <cc-input-text multi value="${lorem}"></cc-input-text>
  `))
  .add('different CSS widths', withActions(() => {

    const examples = Array
      .from(new Array(9))
      .map((_, i) => i * 150 + 100)
      .flatMap((width) => {
        return [
          `Width specified in CSS (${width}px)`,
          createComponent(width, lorem, false, false),
          createComponent(width, lorem, true, false),
        ];
      });

    return createContainer(examples);
  }));
