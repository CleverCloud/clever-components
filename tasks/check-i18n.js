import { promises as fs } from 'fs';
import util from 'util';
import rawGlob from 'glob';
import { extractFromCode } from 'i18n-extract';
import { translations as en } from '../src/translations/translations.en.js';
import { translations as fr } from '../src/translations/translations.fr.js';

const glob = util.promisify(rawGlob);
const translationsByLang = { en, fr };

const babelOptions = {
  ast: true,
  plugins: [
    '@babel/plugin-syntax-import-meta',
  ],
};

async function getUsedKeys (sourceFilepaths) {
  const usedKeysByFile = {};
  for (const src of sourceFilepaths) {
    const code = await fs.readFile(src, 'utf8');
    const keys = extractFromCode(code, { marker: 'i18n', babelOptions });
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
