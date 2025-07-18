// we disable this rule because this file is only meant to be processed by Storybook. It is not part of our npm / CDN bundle.
// eslint-disable-next-line import/no-extraneous-dependencies, no-unused-vars
import React, { useEffect } from 'react';
import { SELECT_STORY } from 'storybook/internal/core-events';
import { addons } from 'storybook/internal/preview-api';
// several docs rely on `cc-notice`
import '../../components/cc-notice/cc-notice.js';
import '../../components/cc-web-features-tracker/cc-web-features-tracker.smart.js';
import trackedWebFeatures from '../../components/cc-web-features-tracker/web-features.json';
import { updateRootContext } from '../../lib/smart/smart-manager.js';

/**
 * @typedef {Object} ParamsId
 * @property {StoryId} storyId
 */

/**
 * @typedef {Object} ParamsCombo
 * @property {StoryKind} [kind]
 * @property {ComponentTitle} [title]
 * @property {StoryName} [story]
 * @property {StoryName} [name]
 */

export function MarkdownDocs({ html }) {
  const htmlContent = { __html: html };

  useEffect(() => {
    updateRootContext({ trackedWebFeatures });
    document.addEventListener('click', linksListener);
    return () => {
      document.removeEventListener('click', linksListener);
    };
  }, []);

  return (
    <cc-smart-container>
      <div className="markdown-body sb-unstyled" dangerouslySetInnerHTML={htmlContent}></div>
    </cc-smart-container>
  );
}

/**
 * This function is mostly a copy paste from https://github.com/storybookjs/storybook/blob/next/code/addons/links/src/utils.ts
 * There are only small adaptations because we'd rather rely on `href` value than `data-` attributes since we have to provide links with href values anyway (for semantics)
 * We had to implement it ourselves in this file because it is supposed to be used by `withLinks` as a story decorator but story decorators do not work for docs
 * see https://storybook.js.org/addons/@storybook/addon-links ("withLinks" decorator section) for more info
 *
 * @param {Event} e
 */
function linksListener(e) {
  const linkElement = e.composedPath().find((element) => element.tagName === 'A');

  if (linkElement == null || linkElement.href == null || linkElement.origin !== window.location.origin) {
    return;
  }

  const [kind, story] = new URL(linkElement.href).pathname
    // in local we only have 1 level of path but in prod we have several
    .split('/')
    // we only keep the last level because it contains the story kind & id
    .pop()
    // story kind is the text before '--' and story id is the text after '--'
    .split('--');

  if (kind || story) {
    e.preventDefault();
    // decodeURIComponent because emojis are encoded when we retrieve the value from `href`
    navigate({ kind: decodeURIComponent(kind), story: decodeURIComponent(story) });
  }
}

/** @param {ParamsId|ParamsCombo} params */
const navigate = (params) => {
  addons.getChannel().emit(SELECT_STORY, params);
};
