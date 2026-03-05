import { makeStory } from '../../stories/lib/make-story.js';
import './cc-homepage-video.js';

export default {
  tags: ['autodocs'],
  title: '🛠 homepage/<cc-homepage-video>',
  component: 'cc-homepage-video',
};

const conf = {
  component: 'cc-homepage-video',
  displayMode: 'flex-wrap',
  // language=CSS
  css: `
    cc-homepage-video {
      width: 50em;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      videoUrl: 'https://youtu.be/6d0M0wZoGok',
      channelUrl: 'https://www.youtube.com/@Clevercloud-platform',
    },
  ],
});

export const errorStory = makeStory(conf, {
  items: [
    {
      videoUrl: 'https://youtu.be/6d0M0wZoGop',
      channelUrl: 'https://www.youtube.com/@Clevercloud-platform',
    },
    {
      videoUrl: 'https://example.com/',
      channelUrl: 'https://www.youtube.com/@Clevercloud-platform',
    },
  ],
});
