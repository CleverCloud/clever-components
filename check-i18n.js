import { translations } from './src/translations/translations.fr.js';
import { readFileSync, writeFileSync } from 'fs';

const NBSP = '\u00a0';
const NNBSP = '\u202f';
const ELLIPSIS = '\u2026';

function checkTypography() {
  const errorsByCharacter = {
    ':': [],
    '!': [],
    '?': [],
    ';': [],
    '...': [],
  };

  Object.entries(translations).forEach(([key, valueOrFunction]) => {
    // Ce proxy retourne toujours la chaîne "FOO" pour toute propriété accédée
    const fakeObject = new Proxy({}, { get: () => 'FOO' });

    const value = typeof valueOrFunction === 'string' ? valueOrFunction : valueOrFunction(fakeObject);
    checkColonTypography(key, value, errorsByCharacter);
    checkPunctuationTypography(key, value, errorsByCharacter);
    checkEllipsisTypography(key, value, errorsByCharacter);
  });

  return errorsByCharacter;
}

function checkColonTypography(key, text, errorsByCharacter) {
  const colonRegex = new RegExp(` :`, 'g');
  let match;

  while ((match = colonRegex.exec(text)) !== null) {
    errorsByCharacter[':'].push({
      key,
      position: match.index + 1,
      context: getContext(text, match.index + 1),
    });
  }
}

function checkPunctuationTypography(key, text, errorsByCharacter) {
  const punctuationRegex = new RegExp(` [!?;]`, 'g');
  let match;

  while ((match = punctuationRegex.exec(text)) !== null) {
    const punctuation = match[0].slice(-1);
    errorsByCharacter[punctuation].push({
      key,
      position: match.index + 1,
      context: getContext(text, match.index + 1),
    });
  }
}

function checkEllipsisTypography(key, text, errorsByCharacter) {
  const ellipsisRegex = /\.\.\./g;
  let match;

  while ((match = ellipsisRegex.exec(text)) !== null) {
    errorsByCharacter['...'].push({
      key,
      position: match.index,
      context: getContext(text, match.index),
    });
  }
}

function getContext(text, position) {
  const start = Math.max(0, position - 20);
  const end = Math.min(text.length, position + 20);
  return text.slice(start, end);
}

function fixTypographyIssues(errorsByCharacter) {
  const filePath = './src/translations/translations.fr.js';
  let fileContent = readFileSync(filePath, 'utf8');
  let fixedCount = 0;

  // Group errors by key for easier processing
  const errorsByKey = {};
  Object.entries(errorsByCharacter).forEach(([character, errors]) => {
    errors.forEach(error => {
      if (!errorsByKey[error.key]) {
        errorsByKey[error.key] = [];
      }
      errorsByKey[error.key].push({ character, ...error });
    });
  });

  // Process each key
  Object.entries(errorsByKey).forEach(([key, keyErrors]) => {
    // Find the translation key and its value (including multi-line functions)
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // More comprehensive pattern to match various translation formats:
    // 1. Simple string: 'key': `content`,
    // 2. Function returning string: 'key': () => `content`,
    // 3. Multi-line functions with template literals
    // 4. Functions with sanitize calls: 'key': () => sanitize`content`,
    const keyPattern = new RegExp(
      `(\\s*'${escapedKey}'\\s*:\\s*(?:/\\*\\*[^*]*\\*+(?:[^*/][^*]*\\*+)*/\\s*)?(?:\\([^)]*\\)\\s*=>\\s*)?(?:sanitize)?)([\`'"])([\\s\\S]*?)\\2(,?)`,
      'g'
    );
    
    fileContent = fileContent.replace(keyPattern, (match, prefix, quote, content, suffix) => {
      let fixedContent = content;
      
      // Apply fixes for this key
      keyErrors.forEach(error => {
        switch (error.character) {
          case ':':
            // Replace space + colon with NBSP + colon
            fixedContent = fixedContent.replace(/ :/g, `${NBSP}:`);
            fixedCount++;
            break;
          case '!':
            // Replace space + exclamation with NNBSP + exclamation
            fixedContent = fixedContent.replace(/ !/g, `${NNBSP}!`);
            fixedCount++;
            break;
          case '?':
            // Replace space + question mark with NNBSP + question mark
            fixedContent = fixedContent.replace(/ \?/g, `${NNBSP}?`);
            fixedCount++;
            break;
          case ';':
            // Replace space + semicolon with NNBSP + semicolon
            fixedContent = fixedContent.replace(/ ;/g, `${NNBSP};`);
            fixedCount++;
            break;
          case '...':
            // Replace three dots with ellipsis
            fixedContent = fixedContent.replace(/\.\.\./g, ELLIPSIS);
            fixedCount++;
            break;
        }
      });
      
      return prefix + quote + fixedContent + quote + suffix;
    });
  });

  // Write the fixed content back to the file
  writeFileSync(filePath, fileContent, 'utf8');
  return fixedCount;
}

function main() {
  const shouldFix = process.argv.includes('--fix');
  
  console.log('🔍 Checking French typography...\n');

  const errorsByCharacter = checkTypography();

  let totalErrors = 0;
  Object.values(errorsByCharacter).forEach((errors) => {
    totalErrors += errors.length;
  });

  if (totalErrors === 0) {
    console.log('✅ No typography issues found!');
    return;
  }

  console.log(`❌ Found ${totalErrors} typography issue(s):\n`);

  const characterDescriptions = {
    ':': 'colon without NBSP',
    '!': 'exclamation mark without NNBSP',
    '?': 'question mark without NNBSP',
    ';': 'semicolon without NNBSP',
    '...': 'three dots instead of ellipsis (…)',
  };

  Object.entries(errorsByCharacter).forEach(([character, errors]) => {
    if (errors.length > 0) {
      console.log(
        `\n📍 ${character.toUpperCase()} - ${characterDescriptions[character]} (${errors.length} issue${errors.length > 1 ? 's' : ''}):`,
      );
      console.log('═'.repeat(60));

      errors.forEach((error) => {
        console.log(`Key: ${error.key}`);
        console.log(`Context: ...${error.context}...`);
        console.log('---');
      });
    }
  });

  if (shouldFix) {
    console.log('\n🔧 Applying fixes...');
    const fixedCount = fixTypographyIssues(errorsByCharacter);
    console.log(`✅ Fixed ${fixedCount} typography issues!`);
    console.log('\nRun the script again to verify the fixes.');
  } else {
    console.log('\n💡 To automatically fix these issues, run: node check-i18n.js --fix');
  }
}

main();
