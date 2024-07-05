import { html } from 'lit';
import { iconRemixAlertFill as iconAlert } from '../../assets/cc-remix.icons.js';
import { makeStory } from '../../stories/lib/make-story.js';
import './cc-addon-option-form.js';

const htmlExample = html`
  <div class="option-details">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed libero risus, porttitor et turpis sed, mollis ultricies
    quam. Sed quis fermentum sem, sed dictum sapien. Donec rutrum ante vel dolor bibendum, eu pretium velit gravida
  </div>
  <div class="option-warning">
    <cc-icon .icon="${iconAlert}" a11y-name="Warning" class="icon-warning"></cc-icon>
    <p>
      Nullam non nulla convallis, tincidunt nibh at, blandit eros. Cras arcu quam, faucibus eget neque id, scelerisque
      ornare neque
    </p>
  </div>
`;

export default {
  tags: ['autodocs'],
  title: '🛠 Addon/<cc-addon-option-form>',
  component: 'cc-addon-option-form',
};

const optionsExamples = [
  {
    title: 'Kibana',
    logo: 'https://assets.clever-cloud.com/logos/elasticsearch-kibana.svg',
    description: htmlExample,
    enabled: false,
    name: 'kibana',
  },
  {
    title: 'APM',
    logo: 'https://assets.clever-cloud.com/logos/elasticsearch-apm.svg',
    description: htmlExample,
    enabled: true,
    name: 'apm',
  },
];

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
