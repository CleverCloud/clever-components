/**
 * # Global description
 *
 * This file describes how menu entries in the sidebar should be displayed in Storybook, regarding order & group:
 * - `MENU_DESCRIPTOR` constant contains expected hierarchy with some implicit notations,
 * - `storybookMenuSort()` function is passed to Storybook to sort entries.
 *
 * # On Storybook
 *
 * The main point to understand is that the sorting is based on the menu entries title,
 * the sorting function comparing two entries between them iteratively.
 *
 * The title contains the information of whether the entry is part of a group or not:
 * - title of an entry not part of a group: 'My menu entry',
 * - title of an entry part of the 'My Group' group: 'MyGroup/My menu entry' (note that the separator is '/').
 *
 * # More details
 *
 * ## Menu descriptor constant
 *
 * `MENU_DESCRIPTOR` is an *ordered* array of items.
 *
 * Most of the time, an item will describe a group:
 * - in this case, the `key` property will be the group title,
 * - the `values` property will be an *ordered* array of entries.
 * It allows you to precisely define how entries will be ordered in a group.
 *
 * On top of that, you can skip the `values` property in two cases:
 * - if you want a group entries alphabetically ordered,
 * - for entries not part of a group: in this case, the key is the entry title.
 *
 * Finally, the check on the `key` is made with `string.startsWith()` and not equality.
 * It means that you can gather multiple groups by starting their title with the same prefix.
 * Matching groups will be alphabetically ordered between them.
 * In this case, `values` property will be ignored.
 * Note: this behaviour matches the initial legacy sort policy.
 *
 * ## Storybook sorting function
 *
 * As stated earlier, the `storybookMenuSort()` function compares two entries together and
 * decide which entry is displayed before the other.
 * More precisely, it compares their title stored in the `kind` property.
 */

const MENU_DESCRIPTOR = [
  {
    key: 'Readme',
  },
  {
    key: '🏡 Getting Started',
    values: [
      'Breaking down',
      'Use via CDN',
      'Install via NPM',
      'Manual installation',
      'Accessibility',
      'Design tokens',
      'Smart components',
      'Notification system',
      'Breaking change policy',
      'Browser support',
      'Changelog',
    ],
  },
  {
    key: '📖 Guidelines',
    values: [
      'Coming soon...',
    ],
  },
  {
    key: '🖋 Copywriting',
    values: [
      'Coming soon...',
    ],
  },
  {
    key: '👋 Contributing',
    values: [
      'Contribute',
      'Web Components guidelines',
      'Smart Component guidelines',
      'Quick accessibility reminders',
      'Tasks',
      'Translate and localize',
      'Writing stories',
      'Test',
      'Previews',
      'Release',
      'Browser support',
      'Tools',
      'Resources',
    ],
  },
  {
    key: '📌 Architecture Decision Records',
  },
  {
    key: '🧬',
  },
  {
    key: '🛠',
  },
  {
    key: '🚧',
  },
  {
    key: '🔀',
  },
  {
    key: '🕹',
  },
  {
    key: '♻️',
  },
];

/**
 * @param entryA {Object}
 * @param entryB {Object}
 * @returns {number}
 */
export function storybookMenuSort(entryA, entryB) {
  const entryInfosA = getEntryInfosFromKind(entryA[1].kind);
  const entryInfosB = getEntryInfosFromKind(entryB[1].kind);

  if (entryInfosA.menuIndex !== entryInfosB.menuIndex) {
    // case: the two entries do not belong to the same group
    // comparison: on the menu index
    return entryInfosA.menuIndex - entryInfosB.menuIndex;
  }
  else if (entryInfosA.groupName !== entryInfosB.groupName) {
    // case: the two entries do not belong to the same group but share the same prefix
    // comparison: alphabetically on the entry group name
    return entryInfosA.groupName.localeCompare(entryInfosB.groupName, undefined, { numeric: true });
  }
  else if (MENU_DESCRIPTOR[entryInfosA.menuIndex]?.values != null) {
    // case: the two entries belong to the same group and `values` property is defined
    // comparison: on the position of the entry in the `values` array
    const groupEntries = MENU_DESCRIPTOR[entryInfosA.menuIndex].values;
    return groupEntries.indexOf(entryInfosA.entryName) - groupEntries.indexOf(entryInfosB.entryName);
  }
  else {
    // case: the two entries belong to the same group and `values` property is not defined
    // comparison: alphabetically on the entry name
    return entryInfosA.entryName.localeCompare(entryInfosB.entryName, undefined, { numeric: true });
  }
}

const GROUP_SEPARATOR_CHAR = '/';

/**
 * @param kind
 * @returns {{entryName: string, groupName: string|undefined, menuIndex: number}}
 */
function getEntryInfosFromKind(kind) {
  // we only keep the first two values (`.slice(0, 2)`) because of "Smart" stories outputting special entries title ("🛠 Addon/<cc-addon-linked-apps>/💡 Smart")
  // we reverse the array (`.reverse()`) to ensure `entryName` is always populated when `groupName` can be `undefined`
  const [entryName, groupName] =  kind.split(GROUP_SEPARATOR_CHAR).slice(0, 2).reverse();
  const menuIndex = MENU_DESCRIPTOR.findIndex(item => (groupName || entryName).startsWith(item.key));

  return {
    entryName, // entry name without the group name
    groupName, // group name or 'undefined' for solo entry
    menuIndex, // entry index in the `MENU_DESCRIPTOR` array (warning: multiple groups can share the same `menuIndex` value when they have the same prefix)
  }
}
