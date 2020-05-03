'use strict';

function isTranslationFile (context) {
  const filename = context.getFilename();
  return filename.match(/\/translations\/translations\.[a-z]+\.js$/);
}

function isMainTranslationNode (node) {
  return (node.type === 'ExportNamedDeclaration')
    && (node.declaration.type === 'VariableDeclaration')
    && (node.declaration.kind === 'const')
    && (node.declaration.declarations.length === 1)
    && (node.declaration.declarations[0].type === 'VariableDeclarator')
    && (node.declaration.declarations[0].id.type === 'Identifier')
    && (node.declaration.declarations[0].id.name === 'translations')
    && (node.declaration.declarations[0].init.type === 'ObjectExpression');
}

function isLanguageTranslation (node) {
  return (node.type === 'Identifier')
    && (node.name === 'LANGUAGE');
}

function getTranslationProperties (node) {
  return node.declaration.declarations[0].init.properties
    .filter((node) => !isLanguageTranslation(node.key));
}

const OPENING_HTML_TAG = /<[a-z]+([^>]*)?>/;
const CLOSING_HTML_TAG = /<\/[a-z]+>/;
const HTML_NBSP_ENTITY = '&nbsp;';

function parseTemplate (context, node) {
  const sourceCode = context.getSourceCode();
  const contents = sourceCode.text.substring(node.start + 1, node.end - 1);
  const hasOpeningHtmlTags = contents.search(OPENING_HTML_TAG) !== -1;
  const hasClosingHtmlTags = contents.search(CLOSING_HTML_TAG) !== -1;
  const hasNbsp = contents.includes(HTML_NBSP_ENTITY);
  const hasHtml = hasOpeningHtmlTags || hasClosingHtmlTags || hasNbsp;
  return { contents, hasHtml };
}

function isSanitizeTagFunction (node) {
  return node.type === 'TaggedTemplateExpression' && node.tag.name === 'sanitize';
}

module.exports = {
  isTranslationFile,
  isMainTranslationNode,
  getTranslationProperties,
  parseTemplate,
  isSanitizeTagFunction,
};
