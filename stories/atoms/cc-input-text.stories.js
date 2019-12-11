import '../../components/atoms/cc-input-text.js';
import notes from '../../.components-docs/cc-input-text.md';
import { createContainer } from '../lib/dom.js';
import { enhanceStoriesNames } from '../lib/story-names.js';
import { withCustomEventActions } from '../lib/event-action.js';

const withActions = withCustomEventActions('cc-input-text:input');

function createComponent (width, value, multi, readonly, clipboard, secret) {
  const component = document.createElement('cc-input-text');
  component.style.width = width + 'px';
  component.value = value;
  component.multi = multi;
  component.readonly = readonly;
  component.clipboard = clipboard;
  component.secret = secret;
  return component;
}

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget tempor leo, eu vulputate lectus. Sed rhoncus rhoncus mi nec tempor. Pellentesque id elit aliquet, laoreet mi nec, cursus metus. Integer iaculis nibh non massa dignissim dictum.
Etiam a condimentum velit. Sed orci nunc, iaculis quis nulla nec, pretium mattis mi. Phasellus auctor sit amet massa at tempus. Sed eu aliquam justo. Nulla tortor neque, porta a elit vitae, accumsan auctor mauris. Vestibulum efficitur urna est, sit amet convallis metus porta tempus.
Etiam vestibulum placerat massa eget lacinia. Aenean bibendum, massa id mattis vehicula, turpis erat rhoncus ante, sed pharetra nulla velit non velit. Aliquam vehicula mauris elit, id elementum nisi malesuada ut. Donec hendrerit rhoncus orci, quis scelerisque quam cursus eget.
Integer posuere tortor sit amet nisl sollicitudin, at tempus ipsum semper.`;

export default {
  title: '1. Atoms|<cc-input-text>',
  parameters: { notes },
};

export const defaultStory = withActions(() => {

  return `
    <div class="title">Empty value (simple, simple clipboard, simple secret, simple clipboard+secret, multi, multi clipboard):</div>
    <cc-input-text placeholder="Placeholder here..."></cc-input-text>
    <cc-input-text clipboard placeholder="Placeholder here..."></cc-input-text>
    <cc-input-text secret placeholder="Placeholder here..."></cc-input-text>
    <cc-input-text clipboard secret placeholder="Placeholder here..."></cc-input-text>
    <cc-input-text multi placeholder="Placeholder here..."></cc-input-text>
    <cc-input-text multi clipboard placeholder="Placeholder here..."></cc-input-text>
    
    <div class="title">Short value (simple, simple clipboard, simple secret, simple clipboard+secret, multi, multi clipboard):</div>
    <cc-input-text value="Awesome value"></cc-input-text>
    <cc-input-text clipboard value="Awesome value"></cc-input-text>
    <cc-input-text secret value="Awesome value"></cc-input-text>
    <cc-input-text clipboard secret value="Awesome value"></cc-input-text>
    <cc-input-text multi value="Awesome value line 1\nAwesome value line 2"></cc-input-text>
    <cc-input-text multi clipboard value="Awesome value line 1\nAwesome value line 2"></cc-input-text>
    
    <div class="title">Disabled (simple, simple clipboard, simple secret, simple clipboard+secret, multi, multi clipboard):</div>
    <cc-input-text disabled value="Disabled value"></cc-input-text>
    <cc-input-text disabled clipboard value="Disabled value"></cc-input-text>
    <cc-input-text disabled secret value="Disabled value"></cc-input-text>
    <cc-input-text disabled clipboard secret value="Disabled value"></cc-input-text>
    <cc-input-text disabled multi value="Disabled value line 1\nDisabled value line 2"></cc-input-text>
    <cc-input-text disabled multi clipboard value="Disabled value line 1\nDisabled value line 2"></cc-input-text>
    
    <div class="title">Readonly (simple, simple clipboard, simple secret, simple clipboard+secret, multi, multi clipboard):</div>
    <cc-input-text readonly value="This is readonly"></cc-input-text>
    <cc-input-text readonly clipboard value="This is readonly"></cc-input-text>
    <cc-input-text readonly secret value="This is readonly"></cc-input-text>
    <cc-input-text readonly clipboard secret value="This is readonly"></cc-input-text>
    <cc-input-text readonly multi value="This is readonly line 1\nThis is readonly line 2"></cc-input-text>
    <cc-input-text readonly multi clipboard value="This is readonly line 1\nThis is readonly line 2"></cc-input-text>
    
    <div class="title">Skeleton empty (simple, simple clipboard, simple secret, simple clipboard+secret, multi, multi clipboard):</div>
    <cc-input-text skeleton placeholder="Placeholder here..."></cc-input-text>
    <cc-input-text skeleton clipboard placeholder="Placeholder here..."></cc-input-text>
    <cc-input-text skeleton secret placeholder="Placeholder here..."></cc-input-text>
    <cc-input-text skeleton clipboard secret placeholder="Placeholder here..."></cc-input-text>
    <cc-input-text multi skeleton placeholder="Placeholder here..."></cc-input-text>
    <cc-input-text multi skeleton clipboard placeholder="Placeholder here..."></cc-input-text>
    
    <div class="title">Skeleton with value (simple, simple clipboard, simple secret, simple clipboard+secret, multi, multi clipboard):</div>
    <cc-input-text skeleton value="Awesome value"></cc-input-text>
    <cc-input-text skeleton clipboard value="Awesome value"></cc-input-text>
    <cc-input-text skeleton secret value="Awesome value"></cc-input-text>
    <cc-input-text skeleton clipboard secret value="Awesome value"></cc-input-text>
    <cc-input-text multi skeleton value="Awesome value line 1\nAwesome value line 2"></cc-input-text>
    <cc-input-text multi skeleton clipboard value="Awesome value line 1\nAwesome value line 2"></cc-input-text>
    
    <div class="title">Long value value (simple, simple clipboard, simple secret, simple clipboard+secret, multi, multi clipboard):</div>
    <cc-input-text value="${lorem}"></cc-input-text>
    <cc-input-text clipboard value="${lorem}"></cc-input-text>
    <cc-input-text secret value="${lorem}"></cc-input-text>
    <cc-input-text clipboard secret value="${lorem}"></cc-input-text>
    <cc-input-text multi value="${lorem}"></cc-input-text>
    <cc-input-text multi clipboard value="${lorem}"></cc-input-text>
  `;
});

export const differentCssWidths = () => {

  const examples = Array
    .from(new Array(9))
    .map((_, i) => i * 150 + 100)
    .flatMap((width) => {
      return [
        `Width specified in CSS (${width}px)`,
        createComponent(width, lorem, false, false, false, false),
        createComponent(width, lorem, false, false, true, false),
        createComponent(width, lorem, false, false, false, true),
        createComponent(width, lorem, false, false, true, true),
        createComponent(width, lorem, true, false, false, false),
        createComponent(width, lorem, true, false, true, false),
      ];
    });

  return createContainer(examples);
};

export const autoWidth = withActions(() => {

  function spread (fn) {
    return Array
      .from(new Array(4))
      .map((_, i) => (i + 1) * 15)
      .flatMap((chars) => {
        const rawContents = `_chars`;
        const contents = String(chars) + String(rawContents).padStart(chars - 2, '_');
        return fn({ chars, contents });
      });
  }

  const simple = spread(({ chars, contents }) => [
    createComponent(null, contents, false, false, false),
    document.createElement('br'),
  ]);

  const simpleClipboard = spread(({ chars, contents }) => [
    createComponent(null, contents, false, false, true),
    document.createElement('br'),
  ]);

  const simpleClipboardReadonly = spread(({ chars, contents }) => [
    createComponent(null, contents, false, true, true),
    document.createElement('br'),
  ]);

  const simpleClipboardReadonlyCss = spread(({ chars, contents }) => [
    createComponent(280, contents, false, true, true),
    document.createElement('br'),
  ]);

  const multiClipboardReadonly = spread(({ chars, contents }) => [
    createComponent(null, contents, true, true, true),
  ]);

  return createContainer([
    `simple => no auto width`,
    ...simple,
    `simple + clipboard => no auto width`,
    ...simpleClipboard,
    `simple + clipboard + readonly => auto width based on contents`,
    ...simpleClipboardReadonly,
    `simple + clipboard + readonly width fixed CSS width to 280px => <code>width:280px</code>`,
    ...simpleClipboardReadonlyCss,
    `multi => <code>width:100%</code> because it's a block`,
    ...multiClipboardReadonly,
  ]);
});

enhanceStoriesNames({ defaultStory, differentCssWidths, autoWidth });
