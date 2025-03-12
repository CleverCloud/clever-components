// we disable this rule because this file is only meant to be processed by Storybook. It is not part of our npm / CDN bundle.
// eslint-disable-next-line import/no-extraneous-dependencies, no-unused-vars
import React from 'react';
// several docs rely on `cc-notice`
import '../../components/cc-notice/cc-notice.js';
import '../../components/cc-web-features-tracker/cc-web-features-tracker.js';

export function MarkdownDocs({ html }) {
  const htmlContent = { __html: html };

  return <div className="markdown-body sb-unstyled" dangerouslySetInnerHTML={htmlContent}></div>;
}
