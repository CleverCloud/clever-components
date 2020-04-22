'use strict';

// Require ESM modules like we're in the future
// eslint-disable-next-line no-global-assign
require = require('esm')(module);

const util = require('util');
const fs = require('fs-extra');
const rawGlob = require('glob');
const { extractFromCode } = require('i18n-extract');
const { translations: en } = require('../src/translations/translations.en.js');
const { translations: fr } = require('../src/translations/translations.fr.js');

const glob = util.promisify(rawGlob);
const translationsByLang = { en, fr };

async function getUsedKeys (sourceFilepaths) {
  const usedKeysByFile = {};
  for (const src of sourceFilepaths) {
    const code = await fs.readFile(src, 'utf8');
    const keys = extractFromCode(code, { marker: 'i18n' });
    usedKeysByFile[src] = keys.map(({ key }) => key);
  }
  return usedKeysByFile;
}

async function run () {

  let errors = false;

  const sourceFilepaths = await glob('./src/*/*.js', {
    ignore: [
      './src/lib/*.js',
      './src/styles/*.js',
      './src/translations/*.js',
    ],
  });

  const usedKeysByFile = await getUsedKeys(sourceFilepaths);

  // MISSING KEYS
  sourceFilepaths.forEach((src) => {
    console.log(`Inspecting translations for ${src}`);

    Object.entries(translationsByLang).forEach(([lang, translations]) => {

      const missingKeys = usedKeysByFile[src]
        .filter((key) => translations[key] == null);

      if (missingKeys.length !== 0) {
        errors = true;
        const formattedLog = missingKeys
          .map((k) => `  MISSING (${lang}): ${k}`)
          .join('\n');
        console.log(formattedLog);
      }
    });
  });

  // UNUSED KEYS
  const allUsedKeys = Object.values(usedKeysByFile)
    .reduce((a, b) => [...a, ...b]);

  Object.entries(translationsByLang).forEach(([lang, translations]) => {

    const translationsKeys = Object.keys(translations).filter((k) => k !== 'LANGUAGE');

    const unusedKeys = translationsKeys
      .filter((key) => !allUsedKeys.includes(key));

    if (unusedKeys.length !== 0) {
      errors = true;
      const formattedLog = unusedKeys
        .map((k) => `  UNUSED (${lang}): ${k}`)
        .join('\n');
      console.log(formattedLog);
    }
  });

  if (errors) {
    process.exit(1);
  }
}

run()
  .catch(console.error);
