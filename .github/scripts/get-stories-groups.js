import { appendFileSync } from 'node:fs';
import { getStoriesGroups } from '../../web-test-runner/get-story-files-groups.js';

const storiesGroups = await getStoriesGroups();
const storiesGroupsNames = storiesGroups.map(({ name }) => name);

if (process.env.GITHUB_OUTPUT != null) {
  appendFileSync(process.env.GITHUB_OUTPUT, `stories-groups=${JSON.stringify(storiesGroupsNames)}\n`);
}
