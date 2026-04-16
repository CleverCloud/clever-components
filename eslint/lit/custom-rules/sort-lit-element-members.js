/**
 * @import { Rule } from 'eslint'
 * @import { ClassBody, MethodDefinition, PropertyDefinition, StaticBlock } from 'estree'
 */

/** @typedef {MethodDefinition | PropertyDefinition | StaticBlock} ClassMember */

const CUSTOM_ELEMENT_LIFECYCLE = new Set([
  'connectedCallback',
  'disconnectedCallback',
  'adoptedCallback',
  'attributeChangedCallback',
]);

const LIT_ELEMENT_LIFECYCLE = new Set([
  'createRenderRoot',
  'shouldUpdate',
  'willUpdate',
  'update',
  'firstUpdated',
  'updated',
  'performUpdate',
  'scheduleUpdate',
  'getUpdateComplete',
  'requestUpdate',
]);

// Groups ordered as defined in docs/cc-example-component.js
const GROUP = {
  STATIC_PROPERTIES: 0,
  OTHER_STATIC: 1,
  CONSTRUCTOR: 2,
  PUBLIC_METHODS: 3,
  PRIVATE_METHODS: 4,
  EVENT_HANDLERS: 5,
  CUSTOM_ELEMENT_LIFECYCLE: 6,
  LIT_ELEMENT_LIFECYCLE: 7,
  RENDER: 8,
  SUB_RENDER: 9,
  STATIC_STYLES: 10,
};

// Human-readable labels for error messages
const GROUP_LABEL = {
  [GROUP.STATIC_PROPERTIES]: 'static get properties()',
  [GROUP.OTHER_STATIC]: 'static members',
  [GROUP.CONSTRUCTOR]: 'constructor',
  [GROUP.PUBLIC_METHODS]: 'public methods',
  [GROUP.PRIVATE_METHODS]: 'private methods',
  [GROUP.EVENT_HANDLERS]: 'event handlers',
  [GROUP.CUSTOM_ELEMENT_LIFECYCLE]: 'custom element lifecycle',
  [GROUP.LIT_ELEMENT_LIFECYCLE]: 'LitElement lifecycle',
  [GROUP.RENDER]: 'render()',
  [GROUP.SUB_RENDER]: 'sub-render methods',
  [GROUP.STATIC_STYLES]: 'static get styles()',
};

/**
 * Extracts the member name from its AST key node.
 * Returns null for computed keys (e.g. [Symbol.iterator]) since we can't classify them by name.
 * Treats #private fields as _-prefixed to match our naming convention.
 *
 * @param {MethodDefinition | PropertyDefinition} member
 * @returns {string | null}
 */
function getMemberName(member) {
  if (member.key == null) {
    return null;
  }
  if (member.key.type === 'Identifier') {
    return member.key.name;
  }
  if (member.key.type === 'PrivateIdentifier') {
    return `_${member.key.name}`;
  }
  return null;
}

/**
 * Assigns a group number to a class member based on its type and name.
 * Structural members (StaticBlock, constructor, PropertyDefinition) are classified by AST type,
 * static methods by their getter name, and instance methods by name prefix convention.
 *
 * @param {ClassMember} member
 * @returns {number}
 */
function getMemberGroup(member) {
  if (member.type === 'StaticBlock') {
    return GROUP.OTHER_STATIC;
  }
  if (member.type === 'MethodDefinition' && member.kind === 'constructor') {
    return GROUP.CONSTRUCTOR;
  }
  if (member.type === 'PropertyDefinition') {
    return member.static ? GROUP.OTHER_STATIC : GROUP.CONSTRUCTOR;
  }

  const name = getMemberName(member);

  if (member.static) {
    if (member.kind === 'get' && name === 'properties') {
      return GROUP.STATIC_PROPERTIES;
    }
    if (member.kind === 'get' && name === 'styles') {
      return GROUP.STATIC_STYLES;
    }
    return GROUP.OTHER_STATIC;
  }

  return getInstanceMethodGroup(name);
}

/**
 * Classifies a non-static method by its name.
 * Order matters: _render* must be checked before the generic _* prefix.
 *
 * @param {string | null} name
 * @returns {number}
 */
function getInstanceMethodGroup(name) {
  if (name == null) {
    return GROUP.PUBLIC_METHODS;
  }
  if (CUSTOM_ELEMENT_LIFECYCLE.has(name)) {
    return GROUP.CUSTOM_ELEMENT_LIFECYCLE;
  }
  if (LIT_ELEMENT_LIFECYCLE.has(name)) {
    return GROUP.LIT_ELEMENT_LIFECYCLE;
  }
  if (name === 'render') {
    return GROUP.RENDER;
  }
  if (name.startsWith('_render')) {
    return GROUP.SUB_RENDER;
  }
  if (name.startsWith('_on')) {
    return GROUP.EVENT_HANDLERS;
  }
  if (name.startsWith('_')) {
    return GROUP.PRIVATE_METHODS;
  }
  return GROUP.PUBLIC_METHODS;
}

/**
 * Detects LitElement classes by checking the superclass name or
 * the presence of `static get properties()` / `static get styles()` (for subclasses like CcFormControlElement).
 *
 * @param {ClassBody & Rule.NodeParentExtension} node
 * @param {Array<number>} groups
 * @returns {boolean}
 */
function isLitElementClass(node, groups) {
  const parent = node.parent;
  if (parent?.type === 'ClassDeclaration' || parent?.type === 'ClassExpression') {
    const superClass = parent.superClass;
    if (superClass?.type === 'Identifier' && superClass.name === 'LitElement') {
      return true;
    }
  }
  return groups.some((g) => g === GROUP.STATIC_PROPERTIES || g === GROUP.STATIC_STYLES);
}

/** @type {Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    messages: {
      unsortedMemberBefore: "'{{currentGroup}}' should appear before '{{expectedGroup}}'.",
      unsortedMemberAfter: "'{{currentGroup}}' should appear after '{{expectedGroup}}'.",
    },
  },
  create(context) {
    const sourceCode = context.sourceCode;

    return {
      ClassBody(node) {
        const members = node.body;
        if (members.length <= 1) {
          return;
        }

        const memberGroups = members.map((m) => getMemberGroup(m));

        if (!isLitElementClass(node, memberGroups)) {
          return;
        }

        // Groups should be in non-decreasing order (members of the same group keep their relative position)
        const isSorted = memberGroups.every((g, i) => i === 0 || g >= memberGroups[i - 1]);
        if (isSorted) {
          return;
        }

        // Stable sort: order by group, preserve original order within the same group
        const indexed = members.map((m, i) => ({ group: memberGroups[i], index: i }));
        const sorted = indexed.toSorted((a, b) => a.group - b.group || a.index - b.index);

        // Report on each member that would move to a different position
        for (let i = 0; i < members.length; i++) {
          if (sorted[i].index === i) {
            continue;
          }

          const expectedGroup = memberGroups[sorted[i].index];
          const currentGroup = memberGroups[i];

          context.report({
            node: members[i],
            messageId: currentGroup > expectedGroup ? 'unsortedMemberAfter' : 'unsortedMemberBefore',
            data: {
              currentGroup: GROUP_LABEL[currentGroup],
              expectedGroup: GROUP_LABEL[expectedGroup],
            },
            // Each report carries the full reorder fix so the user can apply it from any error.
            // ESLint deduplicates overlapping fixes — only one is applied per pass.
            fix(fixer) {
              const openBrace = sourceCode.getFirstToken(node);

              // For each member, separate leading whitespace/newlines from content (comments + member code).
              // When reordering, leading whitespace stays at its original position while content moves.
              const blocks = members.map((member, j) => {
                const prevEnd = j === 0 ? openBrace.range[1] : members[j - 1].range[1];

                const comments = sourceCode.getCommentsBefore(member);
                const contentStart = comments.length > 0 ? comments[0].range[0] : member.range[0];

                return {
                  leading: sourceCode.text.slice(prevEnd, contentStart),
                  content: sourceCode.text.slice(contentStart, member.range[1]),
                };
              });

              // Reassemble: keep each position's leading whitespace, swap in the sorted content
              const sortedContents = sorted.map((item) => blocks[item.index].content);
              const newText = blocks.map((block, j) => block.leading + sortedContents[j]).join('');

              const replaceStart = openBrace.range[1];
              const replaceEnd = members[members.length - 1].range[1];

              return fixer.replaceTextRange([replaceStart, replaceEnd], newText);
            },
          });
        }
      },
    };
  },
};
