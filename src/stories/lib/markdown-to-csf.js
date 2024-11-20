import { load as yamlLoad } from 'js-yaml';
import frontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import highlight from 'remark-highlight.js';
import remark2Html from 'remark-html';
import remarkParse from 'remark-parse';
import unified from 'unified';

export function rollupMdToCsfPlugin() {
  return {
    name: 'markdown-to-csf',
    transform(code, id) {
      if (id.endsWith('.md')) {
        return markdownToCsfWithDocsPage(code);
      }
      return code;
    },
  };
}

const processor = unified()
  .use(remarkParse, {})
  .use(remarkGfm)
  .use(frontmatter, ['yaml'])
  .use(highlight)
  .use(remark2Html, { sanitize: false });

export function markdownToCsfWithDocsPage(markdownText) {
  const htmlContent = processor().processSync(markdownText).contents;
  const parsedHTML = JSON.stringify(htmlContent);

  const csfScript = `
    import { MarkdownDocs } from '/src/stories/lib/markdown-docs.jsx';
    import React from 'react';


    export default {
      tags: ['autodocs'],
      /**
       * An autodoc is supposed to be generated because the tag "autodocs" has been added
       * from the indexer function (see "src/stories/lib/markdown-indexer.js").
       * We override the content to show our own documentation instead.
       */
      parameters: {
        docs: {
          page: () => React.createElement(MarkdownDocs, { html: ${parsedHTML} }),
        },
      },
    }

    /**
     * We export an empty story as "docs" so that it can be considered a "docs only" story
     * this solution is unofficial & undocumented so it might break some day but it works
     * both with storybook 7 & 8 which should be enough for now.
     * Basically, instead of generating two entries within the menu:
     * - a "Docs" story of type "docs" (yellow icon)
     * - a "My Story Subtitle" (classic story).
     * We get a single "My Story Subtitle" story of type "docs" story (yellow icon).
    */
    export const docs = {};
  `;

  return csfScript;
}

export function getMetaDataFromMd(markdownContent) {
  const markdownAst = processor.parse(markdownContent);

  const frontmatterNode = markdownAst.children.find((node) => node.type === 'yaml');

  const headingNode = markdownAst.children.find((node) => node.type === 'heading' && node.depth === 1);
  const kind = getKind(frontmatterNode);
  const subtitle = getSubTitle(frontmatterNode, headingNode);
  const title = [kind, subtitle].filter((a) => a != null).join('/');

  return { title, subtitle };
}

function getSubTitle(frontmatterNode, headingNode) {
  if (frontmatterNode != null) {
    const fmObject = yamlLoad(frontmatterNode.value);
    if (fmObject.title != null) {
      return fmObject.title;
    }
  }

  if (headingNode != null) {
    return headingNode.children.map((c) => c.value).join('');
  }

  return 'Untitled';
}

function getKind(frontmatterNode) {
  if (frontmatterNode != null) {
    const fmObject = yamlLoad(frontmatterNode.value);
    if (fmObject.kind != null) {
      return fmObject.kind;
    }
  }

  return null;
}
