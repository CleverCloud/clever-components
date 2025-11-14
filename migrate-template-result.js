#!/usr/bin/env node
/* eslint-disable no-undef */

import { readFileSync, writeFileSync } from 'fs';

/**
 * Migrates TemplateResult<1> from @typedef to @import
 */

const stats = {
  filesProcessed: 0,
  filesModified: 0,
  fileDetails: [],
};

/**
 * Process a file and convert TemplateResult typedef to import
 * @param {string} filePath - Path to the file
 */
function processFile(filePath) {
  const content = readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  let modified = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Match: @typedef {import('lit').TemplateResult<1>} TemplateResult
    if (line.match(/@typedef\s+\{import\(['"]lit['"]\)\.TemplateResult<1>\}\s+TemplateResult/)) {
      // Check if there's already an @import from 'lit' in the same JSDoc block
      let hasLitImport = false;
      let litImportLine = -1;

      // Look backwards in the same JSDoc block
      for (let j = i - 1; j >= 0; j--) {
        if (lines[j].includes('*/')) {
          break;
        }
        if (lines[j].includes('/**')) {
          break;
        }

        if (lines[j].match(/@import\s+\{[^}]*\}\s+from\s+['"]lit['"]/)) {
          hasLitImport = true;
          litImportLine = j;
          break;
        }
      }

      if (hasLitImport) {
        // Add TemplateResult to existing lit import
        const importMatch = lines[litImportLine].match(/@import\s+\{([^}]*)\}\s+from\s+['"]lit['"]/);
        if (importMatch) {
          const existingImports = importMatch[1].trim();
          const indent = lines[litImportLine].match(/^(\s*\*\s*)/)[0];
          lines[litImportLine] = `${indent}@import { ${existingImports}, TemplateResult } from 'lit'`;
          lines.splice(i, 1);
          i--; // Adjust index after removal
          modified = true;
        }
      } else {
        // Replace with new @import line
        const indent = line.match(/^(\s*\*\s*)/)[0];
        lines[i] = `${indent}@import { TemplateResult } from 'lit'`;
        modified = true;
      }
    }
  }

  if (modified) {
    const newContent = lines.join('\n');
    writeFileSync(filePath, newContent, 'utf8');
    stats.filesModified++;
    stats.fileDetails.push(filePath);
  }

  stats.filesProcessed++;
}

// Main execution
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node migrate-template-result.js <file1> [file2] ...');
  process.exit(1);
}

console.log('Starting TemplateResult migration...\n');

for (const filePath of args) {
  try {
    processFile(filePath);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Print report
console.log('Migration Summary');
console.log('='.repeat(50));
console.log(`Files processed: ${stats.filesProcessed}`);
console.log(`Files modified: ${stats.filesModified}`);
console.log();

if (stats.fileDetails.length > 0) {
  console.log('Modified files:');
  console.log('-'.repeat(50));
  for (const file of stats.fileDetails) {
    console.log(`  ${file}`);
  }
}
