function formatStoryName (rawName) {
  return rawName[0].toUpperCase() + rawName
    .slice(1)
    // Camel case to with numbers
    .replace(/([0-9]+)/g, ' $1')
    .toLowerCase()
    // Special keyworks in uppercase
    .replace(/css/g, 'CSS')
    // "Foobar with details" => "Foobar (details)"
    .replace(/ with (.*)/, ' ($1)');
}

export function enhanceStoryName (defaultName) {
  if (defaultName === 'Default Story') {
    return 'Default';
  }
  if (defaultName === 'Skeleton') {
    return '⌛ Skeleton (no data yet)';
  }
  if (defaultName === 'Empty') {
    return '🕳 Empty (no data)';
  }
  if (defaultName.startsWith('Loading') || defaultName.startsWith('Waiting') || defaultName === 'Saving' || defaultName.startsWith('Updating') || defaultName.startsWith('Skeleton')) {
    return '⌛ ' + formatStoryName(defaultName);
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
};
