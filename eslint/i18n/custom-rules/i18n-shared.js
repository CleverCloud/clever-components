export function isTranslationFile(context) {
  const filename = context.getFilename();
  return filename.match(/\/translations\/translations\.[a-z]+\.js$/);
}

export function isMainTranslationNode(node) {
  return (
    node.type === 'ExportNamedDeclaration' &&
    node.declaration.type === 'VariableDeclaration' &&
    node.declaration.kind === 'const' &&
    node.declaration.declarations.length === 1 &&
    node.declaration.declarations[0].type === 'VariableDeclarator' &&
    node.declaration.declarations[0].id.type === 'Identifier' &&
    node.declaration.declarations[0].id.name === 'translations' &&
    node.declaration.declarations[0].init.type === 'ObjectExpression'
  );
}

/**
 * Returns the closest parent from a node that matches the specified type.
 * If no type is specified, returns the direct parent.
 * If no node is found, returns the root node (matching the 'Program' type).
 * @param node
 * @param {String|null} type
 * @returns {*|null}
 */
export function getClosestParentFromType(node, type) {
  if (node == null) {
    return null;
  }
  if (type == null) {
    return node.parent;
  }

  let directParent = node;
  do {
    directParent = directParent.parent;
  } while (directParent.type !== type && directParent.type !== 'Program');

  return directParent;
}

export function getTranslationProperties(node) {
  return node.declaration.declarations[0].init.properties;
}

export const OPENING_HTML_TAG = /<[a-z]+([^>]*)?>/;
export const CLOSING_HTML_TAG = /<\/[a-z]+>/;
export const HTML_NBSP_ENTITY = '&nbsp;';

export function parseTemplate(context, node) {
  const sourceCode = context.getSourceCode();
  const contents = sourceCode.text.substring(node.range[0] + 1, node.range[1] - 1);
  const hasOpeningHtmlTags = contents.search(OPENING_HTML_TAG) !== -1;
  const hasClosingHtmlTags = contents.search(CLOSING_HTML_TAG) !== -1;
  const hasNbsp = contents.includes(HTML_NBSP_ENTITY);
  const hasHtml = hasOpeningHtmlTags || hasClosingHtmlTags || hasNbsp;
  return { contents, hasHtml };
}

export function isSanitizeTagFunction(node) {
  return node.type === 'TaggedTemplateExpression' && node.tag.name === 'sanitize';
}
