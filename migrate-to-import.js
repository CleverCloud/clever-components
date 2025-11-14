#!/usr/bin/env node
/* eslint-disable no-undef */

import { readFileSync, writeFileSync } from 'fs';

/**
 * Migrates JSDoc @typedef {import(...)} syntax to @import syntax
 * Consolidates multiple imports from the same module
 */

const stats = {
  filesProcessed: 0,
  filesModified: 0,
  totalTypedefsReplaced: 0,
  totalImportsCreated: 0,
  fileDetails: [],
};

/**
 * Parse a typedef import line
 * @param {string} line - The typedef line to parse
 * @returns {{module: string, type: string, alias: string} | null}
 */
function parseTypedefImport(line) {
  // Match: @typedef {import('path').Type} Alias
  const match = line.match(/@typedef\s+\{import\(['"]([^'"]+)['"]\)\.(\w+)\}\s+(\w+)/);
  if (!match) {
    return null;
  }

  return {
    module: match[1],
    type: match[2],
    alias: match[3],
  };
}

/**
 * Process a file and convert @typedef imports to @import
 * @param {string} filePath - Path to the file
 */
function processFile(filePath) {
  const content = readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  let modified = false;
  let typedefsInFile = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Check if this line contains a @typedef import
    if (line.includes('@typedef') && line.includes('import(')) {
      // Look for consecutive @typedef imports that might be grouped
      const typedefBlock = [];

      // Check if we're inside a JSDoc comment block
      let inJSDocBlock = false;
      let blockStart = i;

      // Look backwards to see if we're in a JSDoc block
      for (let k = i - 1; k >= 0; k--) {
        if (lines[k].includes('*/')) {
          break;
        }
        if (lines[k].includes('/**') || lines[k].includes('/*')) {
          inJSDocBlock = true;
          blockStart = k;
          break;
        }
      }

      // If in a JSDoc block, collect all @typedef imports in this block
      if (inJSDocBlock) {
        for (let k = blockStart; k < lines.length; k++) {
          const currentLine = lines[k];
          if (currentLine.includes('*/')) {
            break;
          }
          if (currentLine.includes('@typedef') && currentLine.includes('import(')) {
            const parsed = parseTypedefImport(currentLine);
            if (parsed) {
              typedefBlock.push({ line: currentLine, parsed, index: k });
            }
          }
        }
      } else {
        // Single line typedef (less common but possible)
        const parsed = parseTypedefImport(line);
        if (parsed) {
          typedefBlock.push({ line, parsed, index: i });
        }
      }

      if (typedefBlock.length > 0) {
        // Group by module
        const moduleGroups = new Map();

        for (const item of typedefBlock) {
          const { module, type, alias } = item.parsed;
          if (!moduleGroups.has(module)) {
            moduleGroups.set(module, []);
          }

          // Handle cases where type and alias are the same vs different
          const importSpec = type === alias ? type : `${type} as ${alias}`;
          moduleGroups.get(module).push(importSpec);
        }

        // Create new @import statements
        const newImports = [];
        for (const [module, types] of moduleGroups.entries()) {
          const typesStr = types.join(', ');
          newImports.push(` * @import { ${typesStr} } from '${module}'`);
        }

        // Replace the typedef lines with import lines
        if (inJSDocBlock) {
          // Remove all typedef lines
          const linesToRemove = typedefBlock.map((item) => item.index);

          // Remove lines in reverse order to maintain indices
          for (let k = linesToRemove.length - 1; k >= 0; k--) {
            lines.splice(linesToRemove[k], 1);
          }

          // Insert new imports at the position of the first typedef
          const insertPos = linesToRemove[0];
          for (let k = newImports.length - 1; k >= 0; k--) {
            lines.splice(insertPos, 0, newImports[k]);
          }

          // Adjust index
          i = insertPos + newImports.length;
        } else {
          // Single line replacement
          lines[i] = newImports[0].substring(3); // Remove leading " * "
          i++;
        }

        modified = true;
        typedefsInFile += typedefBlock.length;
        stats.totalImportsCreated += newImports.length;
      } else {
        i++;
      }
    } else {
      i++;
    }
  }

  if (modified) {
    const newContent = lines.join('\n');
    writeFileSync(filePath, newContent, 'utf8');
    stats.filesModified++;
    stats.totalTypedefsReplaced += typedefsInFile;
    stats.fileDetails.push({
      path: filePath,
      typedefsReplaced: typedefsInFile,
    });
  }

  stats.filesProcessed++;
}

// Main execution
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node migrate-to-import.js <file1> [file2] ...');
  process.exit(1);
}

console.log('Starting migration from @typedef to @import...\n');

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
console.log(`Total @typedef replaced: ${stats.totalTypedefsReplaced}`);
console.log(`Total @import created: ${stats.totalImportsCreated}`);
console.log();

if (stats.fileDetails.length > 0) {
  console.log('Modified files:');
  console.log('-'.repeat(50));
  for (const detail of stats.fileDetails) {
    console.log(`  ${detail.path} (${detail.typedefsReplaced} typedefs)`);
  }
}

// Save detailed report
const reportPath = '/tmp/migration-report.json';
writeFileSync(reportPath, JSON.stringify(stats, null, 2));
console.log(`\nDetailed report saved to: ${reportPath}`);
