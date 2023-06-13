import { iconRemixShieldKeyholeFill as iconEncryptionAtRest } from '../../assets/cc-remix.icons.js';
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
<div class="option-warning">
    <p>Nullam non nulla convallis, tincidunt nibh at, blandit eros. Cras arcu quam, faucibus eget neque id,
      scelerisque ornare neque</p>
</div>
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

export const defaultWithIcon = makeStory(conf, {
  items: [
    {
      ...optionExample,
      icon: iconEncryptionAtRest,
      logo: null,
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
  defaultWithIcon,
  defaultEnabled,
});
