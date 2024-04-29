import './cc-addon-admin.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Addon/<cc-addon-admin>',
  component: 'cc-addon-admin',
};

const conf = {
  component: 'cc-addon-admin',
};

const addon = {
  name: 'Awesome addon (PROD)',
  tags: ['foo:bar', 'simple-tag'],
};

export const defaultStory = makeStory(conf, {
  items: [{ addon }],
});

export const skeleton = makeStory(conf, {
  items: [{}],
});

export const saving = makeStory(conf, {
  items: [{ addon, saving: true }],
});

export const dataLoadedWithDangerZoneVmAndBackups = makeStory(conf, {
  items: [{ addon }],
});

export const dataLoadedWithDangerZoneVmButNoBackups = makeStory(conf, {
  items: [{ addon, noDangerZoneBackupText: true }],
});

export const dataLoadedWithDangerZoneNoVmButBackups = makeStory(conf, {
  items: [{ addon, noDangerZoneVmText: true }],
});

export const dataLoadedWithDangerZoneNoVmNoBackups = makeStory(conf, {
  items: [{ addon, noDangerZoneBackupText: true, noDangerZoneVmText: true }],
});

export const errorWithLoading = makeStory(conf, {
  items: [{ error: true }],
});

export const simulations = makeStory(conf, {
  items: [{}, {}],
  simulations: [
    storyWait(2000, ([component, componentError]) => {
      component.addon = addon;
      componentError.error = true;
    }),
  ],
});
