import '../../src/addon/cc-addon-option-form.js';
import { html } from 'lit-element';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

const htmlExample = html`
<div class="option-details">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed libero risus,
porttitor et turpis sed, mollis ultricies quam. Sed quis fermentum sem, sed dictum sapien.
Donec rutrum ante vel dolor bibendum, eu pretium velit gravida</div>
<cc-error class="option-warning">
Nullam non nulla convallis, tincidunt nibh at, blandit eros. Cras arcu quam, faucibus eget neque id,
scelerisque ornare neque
</cc-error>
`;

export default {
  title: '🛠 Addon/<cc-addon-option-form>',
  component: 'cc-addon-option-form',
};

const optionsExamples = [{
  title: 'Kibana',
  logo: 'https://static-assets.cellar.services.clever-cloud.com/logos/elasticsearch-kibana.svg',
  description: htmlExample,
  enabled: false,
  name: 'kibana',
}, {
  title: 'APM',
  logo: 'https://static-assets.cellar.services.clever-cloud.com/logos/elasticsearch-apm.svg',
  description: htmlExample,
  enabled: true,
  name: 'apm',
}];

const conf = {
  component: 'cc-addon-option-form',
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      title: 'Options for the Elastic Stack',
      description: 'Those are the options available for Elastic Stack',
      options: optionsExamples,
    },
  ],
});

export const oneOption = makeStory(conf, {
  items: [
    {
      title: 'Options for the Elastic Stack',
      description: 'Those are the options available for Elastic Stack',
      options: [optionsExamples[0]],
    },
  ],
});

enhanceStoriesNames({
  defaultStory,
  oneOption,
});
