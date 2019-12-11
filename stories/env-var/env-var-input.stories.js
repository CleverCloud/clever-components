import '../../components/env-var/env-var-input.js';
import notes from '../../.components-docs/env-var-input.md';
import { enhanceStoriesNames } from '../lib/story-names.js';
import { withCustomEventActions } from '../lib/event-action.js';

const withActions = withCustomEventActions(
  'env-var-input:input',
  'env-var-input:delete',
  'env-var-input:keep',
);

export default {
  title: '2. Environment variables|<env-var-input>',
  parameters: { notes },
};

export const defaultStory = withActions(() => {
  // language=HTML
  return `
    <style>
    env-var-input {
      margin-bottom: 0.25rem;
    }
    </style>

    <div class="title">Default:</div>
    <env-var-input name="EMPTY" value=""></env-var-input>
    <env-var-input name="PRISTINE" value="pristine value"></env-var-input>
    <env-var-input name="MULTILINE" value="line one\nline two\nline three"></env-var-input>
    <env-var-input name="NEW" value="new value" new></env-var-input>
    <env-var-input name="NEW_EDITED" value="new deleted value" new edited></env-var-input>
    <env-var-input name="EDITED" value="edited value" edited></env-var-input>
    <env-var-input name="DELETED" value="deleted value" deleted></env-var-input>
    <env-var-input name="EDITED_DELETED" value="edited deleted value" edited deleted></env-var-input>
    <env-var-input name="VERY_LONG_NAME_THAT_IS_ACTUALLY_TOO_LONG_TOO_DISPLAY_OMG_WHAT_IS_HAPPENING" value="value for long name"></env-var-input>
    <env-var-input name="LONG_VALUE" value="very long value that is actually too long too display omg what is happening"></env-var-input>

    <div class="title">Skeleton:</div>
    <env-var-input name="LOADING_VARIABLE" skeleton></env-var-input>

    <div class="title">Disabled:</div>
    <env-var-input name="DISABLED" value="disabled value" disabled></env-var-input>

    <div class="title">Readonly:</div>
    <env-var-input name="READONLY" value="readonly value" readonly></env-var-input>
  `;
});

enhanceStoriesNames({ defaultStory });
