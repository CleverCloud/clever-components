import { makeStory } from '../../stories/lib/make-story.js';
import './cc-homepage-video.js';

export default {
  tags: ['autodocs'],
  title: '🛠 homepage/<cc-homepage-video>',
  component: 'cc-homepage-video',
};

const conf = {
  component: 'cc-homepage-video',
};

export const defaultStory = makeStory(conf, {
  docs: 'Default, width-driven layout: the component takes the available width and its height follows the 16/9 ratio of the video. This is the typical single-column usage, no extra styling needed.',
  items: [
    {
      videoUrl: 'https://youtu.be/6d0M0wZoGok',
      channelUrl: 'https://www.youtube.com/@Clevercloud-platform',
    },
  ],
});

export const errorStory = makeStory(conf, {
  docs: 'When the video URL is unknown or invalid, YouTube returns no thumbnail and the play button overlay is shown on an empty background.',
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

export const smallWidthBigHeight = makeStory(conf, {
  docs: 'Contained layout (`--cc-homepage-video-container-type: size`) with an imposed width and height. Here the area is narrow and tall, so the video is limited by the **width** and centered vertically, leaving space above and below.',
  css: `cc-homepage-video { height: 50em; width: 50%; --cc-homepage-video-container-type: size; }`,
  items: [
    {
      videoUrl: 'https://youtu.be/6d0M0wZoGok',
      channelUrl: 'https://www.youtube.com/@Clevercloud-platform',
    },
  ],
});

export const bigWidthSmallHeight = makeStory(conf, {
  docs: 'Contained layout (`--cc-homepage-video-container-type: size`) with an imposed width and height. Here the area is wide and short, so the video is limited by the **height** and centered horizontally, leaving space on the sides.',
  css: `cc-homepage-video { height: 20em; width: 100%; --cc-homepage-video-container-type: size; }`,
  items: [
    {
      videoUrl: 'https://youtu.be/6d0M0wZoGok',
      channelUrl: 'https://www.youtube.com/@Clevercloud-platform',
    },
  ],
});
