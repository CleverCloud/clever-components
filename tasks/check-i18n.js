'use strict';

const { en } = require('../components/translations/translations.en.js');
const { fr } = require('../components/translations/translations.fr.js');
const fs = require('fs-extra');
const rawGlob = require('glob');
const util = require('util');
const { extractFromCode } = require('i18n-extract');

const glob = util.promisify(rawGlob);
const translationsByLang = { en, fr };

async function getUsedKeys (sourceFilepaths) {
  const usedKeysByFile = {};
  for (let src of sourceFilepaths) {
    const code = await fs.readFile(src, 'utf8');
    const keys = extractFromCode(code, { marker: 'i18n' });
    usedKeysByFile[src] = keys.map(({ key }) => key);
  }
  return usedKeysByFile;
}

async function run () {

  let errors = false;

  const sourceFilepaths = await glob('./components/**/*.js');

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
// .then(console.log)
  .catch(console.error);
