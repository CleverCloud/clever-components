const frontmatter = require('remark-frontmatter');
const highlight = require('remark-highlight.js');
const remark2Html = require('remark-html');
const remarkParse = require('remark-parse');
const unified = require('unified');
const yaml = require('js-yaml');
const { storybookPlugin: modernWebStorybookPlugin } = require('@web/dev-server-storybook');

// Special patched version of '@web/dev-server-storybook'
// This loads plain markdown documents with kind/title frontmatter support
// Don't do this at home ;-)
function storybookWdsPlugin () {

  const modernWebPlugin = modernWebStorybookPlugin({ type: 'web-components' });
  const patchedPlugin = {
    ...modernWebPlugin,
    async transform (context) {
      if (context.path.endsWith('.md')) {
        context.body = markdownToCsfWithDocsPage(context.body);
      }
      else {
        return modernWebPlugin.transform(context);
      }
    },
  };

  return patchedPlugin;
}

// Same here but for the rollup static build
// This loads plain markdown documents with kind/title frontmatter support
// Don't do this at home ;-)
function storybookRollupPlugin () {
  return {
    name: 'md-plain',
    transform (code, id) {
      if (id.endsWith('.md')) {
        return markdownToCsfWithDocsPage(code);
      }
    },
  };
}

function markdownToCsfWithDocsPage (markdownText) {

  const processor = unified()
    .use(remarkParse, {})
    .use(frontmatter, ['yaml'])
    .use(highlight)
    .use(remark2Html);

  const markdownAst = processor.parse(markdownText);

  const frontmatterNode = markdownAst.children.find((node) => node.type === 'yaml');
  const kind = getKind(frontmatterNode);

  const headingNode = markdownAst.children.find((node) => node.type === 'heading' && node.depth === 1);
  const subtitle = getSubTitle(frontmatterNode, headingNode);

  const title = [kind, subtitle].filter((a) => a != null).join('/');

  const html = processor().processSync(markdownText).contents;

  const csfScript = `
    
    import { React } from '@web/storybook-prebuilt/web-components.js';
    
    const html = ${JSON.stringify(html)};
    
    class HtmlComponent extends React.Component {
      constructor(props) {
        super(props);
        this.ref = React.createRef();
      }
      componentDidMount() {
        setTimeout(() => {
          // LOL, without this, SB tries to syntax highlight and we get [Object object]
          this.ref.current.innerHTML = html;
        }, 0);
      }
      render() {
        return React.createElement('div', {
          ref: this.ref,
          className: 'markdown-body',
          style: {
            width: '100%',
            maxWidth: '1000px',
            margin: '0 auto',
          }
        });
      }
    }
    
    export default {
      title: '${title}',
      parameters: {
        docsOnly: true,
        docs: {
          page: HtmlComponent,
        }
      },
    }

    export const page = () => '';
  `;

  return csfScript;
}

function getKind (frontmatterNode) {

  if (frontmatterNode != null) {
    const fmObject = yaml.load(frontmatterNode.value);
    if (fmObject.kind != null) {
      return fmObject.kind;
    }
  }

  return null;
}

function getSubTitle (frontmatterNode, headingNode) {

  if (frontmatterNode != null) {
    const fmObject = yaml.load(frontmatterNode.value);
    if (fmObject.title != null) {
      return fmObject.title;
    }
  }

  if (headingNode != null) {
    return headingNode.children.map((c) => c.value).join('');
  }

  return 'Untitled';
}

module.exports = {
  storybookWdsPlugin,
  storybookRollupPlugin,
};
