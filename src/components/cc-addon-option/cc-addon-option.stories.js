import './cc-addon-option.js';
import { makeStory } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

export default {
  title: '🛠 Addon/<cc-addon-option>',
  component: 'cc-addon-option',
};

const htmlExample = `
<div class="option-details">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed libero risus,
porttitor et turpis sed, mollis ultricies quam. Sed quis fermentum sem, sed dictum sapien.
Donec rutrum ante vel dolor bibendum, eu pretium velit gravida</div>
<cc-error class="option-warning">
Nullam non nulla convallis, tincidunt nibh at, blandit eros. Cras arcu quam, faucibus eget neque id,
scelerisque ornare neque
</cc-error>
`;

const optionExample = {
  title: 'My Option',
  logo: 'https://assets.clever-cloud.com/logos/elasticsearch-kibana.svg',
};

const conf = {
  component: 'cc-addon-option',
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      ...optionExample,
      innerHTML: htmlExample,
    },
  ],
});

export const defaultEnabled = makeStory(conf, {
  items: [
    {
      ...optionExample,
      enabled: true,
      innerHTML: htmlExample,
    },
  ],
});

enhanceStoriesNames({
  defaultStory,
  defaultEnabled,
});
