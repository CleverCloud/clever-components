function formatStoryName (rawName) {
  return rawName[0].toUpperCase() + rawName
    .slice(1)
    // Camel case to "Sentence case"
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase()
    // Special keyworks in uppercase
    .replace(/css/g, 'CSS')
    // "Foobar with details" => "Foobar (details)"
    .replace(/ with (.*)/, ' ($1)');
}

function enhanceStoryName (defaultName) {
  if (defaultName === 'defaultStory') {
    return 'Default';
  }
  if (defaultName === 'skeleton') {
    return '⌛ Skeleton (no data yet)';
  }
  if (defaultName === 'empty') {
    return '🕳 Empty (no data)';
  }
  if (defaultName === 'loading' || defaultName === 'saving' || defaultName.startsWith('skeleton')) {
    return '⌛ ' + formatStoryName(defaultName);
  }
  if (defaultName.startsWith('empty')) {
    return '🕳 ' + formatStoryName(defaultName);
  }
  if (defaultName.startsWith('dataLoaded')) {
    return '👍 ' + formatStoryName(defaultName);
  }
  if (defaultName.match(/simulation/i) != null) {
    return '📈 ' + formatStoryName(defaultName);
  }
  if (defaultName.startsWith('error')) {
    return '🔥 ' + formatStoryName(defaultName);
  }
  return formatStoryName(defaultName);
};

export function enhanceStoriesNames (stories) {
  Object.entries(stories).forEach(([name, storyFn]) => {
    storyFn.story = { name: enhanceStoryName(name), ...(storyFn.story || {}) };
  });
}
