/**
 * Formats a story name by applying various transformations:
 * - Capitalizes the first letter
 * - Adds spaces before numbers
 * - Converts CSS to uppercase
 * - Changes "with" phrases to parenthetical format
 *
 * @param {string} rawName - The raw story name to format
 * @returns {string} The formatted story name
 */
function formatStoryName(rawName) {
  return (
    rawName[0].toUpperCase() +
    rawName
      .slice(1)
      // Camel case to with numbers
      .replace(/([0-9]+)/g, ' $1')
      .toLowerCase()
      // Special keyworks in uppercase
      .replace(/css/g, 'CSS')
      // "Foobar with details" => "Foobar (details)"
      .replace(/ with (.*)/, ' ($1)')
  );
}

/**
 * Enhances a story name by adding appropriate emoji prefixes based on the story type/state.
 * Processes special cases and adds visual indicators for different states:
 * - ⌛ for loading/waiting/skeleton states
 * - ➕ for adding states
 * - 📝 for editing states
 * - 🗑️ for deleting states
 * - 🕳 for empty states
 * - 👍 for loaded states
 * - 📈 for simulation states
 * - 🔥 for error states
 *
 * @param {string} defaultName - The original story name to enhance
 * @returns {string} The enhanced story name with appropriate prefix
 */
export function enhanceStoryName(defaultName) {
  if (defaultName === 'Default Story') {
    return 'Default';
  }
  if (defaultName === 'Skeleton') {
    return '⌛ Skeleton (no data yet)';
  }
  if (defaultName === 'Empty') {
    return '🕳 Empty (no data)';
  }
  if (
    defaultName.startsWith('Loading') ||
    defaultName.startsWith('Waiting') ||
    defaultName === 'Saving' ||
    defaultName.startsWith('Updating') ||
    defaultName.startsWith('Skeleton')
  ) {
    return '⌛ ' + formatStoryName(defaultName);
  }
  if (defaultName.startsWith('Add')) {
    return '➕ ' + formatStoryName(defaultName);
  }
  if (defaultName.startsWith('Editing')) {
    return '📝 ' + formatStoryName(defaultName);
  }
  if (defaultName.startsWith('Deleting')) {
    return '🗑️ ' + formatStoryName(defaultName);
  }
  if (defaultName.startsWith('Empty')) {
    return '🕳 ' + formatStoryName(defaultName);
  }
  if (defaultName.startsWith('Data Loaded')) {
    return '👍 ' + formatStoryName(defaultName);
  }
  if (defaultName.match(/simulation/i) != null) {
    return '📈 ' + formatStoryName(defaultName);
  }
  if (defaultName.startsWith('Error')) {
    return '🔥 ' + formatStoryName(defaultName);
  }
  return formatStoryName(defaultName);
}
