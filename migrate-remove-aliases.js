#!/usr/bin/env node
/* eslint-disable no-undef */

import { readFileSync, writeFileSync } from 'fs';

/**
 * Removes @typedef type aliases and replaces them with inline generic usage
 */

const stats = {
  filesProcessed: 0,
  filesModified: 0,
  totalTypedefsRemoved: 0,
  totalImportsAdded: 0,
  fileDetails: [],
};

/**
 * Parse a typedef line to extract module, generic type, and alias
 * @param {string} line
 * @returns {{module: string, genericType: string, fullType: string, alias: string} | null}
 */
function parseTypedefGeneric(line) {
  // Match: @typedef {import('path').GenericType<...>} Alias
  const match = line.match(/@typedef\s+\{import\(['"]([^'"]+)['"]\)\.([^<}]+)(<[^}]+>)?\}\s+(\w+)/);
  if (!match) {
    return null;
  }

  return {
    module: match[1],
    genericType: match[2],
    fullType: match[2] + (match[3] || ''),
    alias: match[4],
  };
}

/**
 * Process a file
 * @param {string} filePath
 */
function processFile(filePath) {
  const content = readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  let modified = false;
  const typedefsToRemove = [];
  const importsToAdd = new Map(); // module -> Set<genericType>

  // First pass: identify all typedefs to remove and imports to add
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('@typedef') && line.includes('import(')) {
      const parsed = parseTypedefGeneric(line);
      if (parsed) {
        typedefsToRemove.push({ index: i, parsed });

        if (!importsToAdd.has(parsed.module)) {
          importsToAdd.set(parsed.module, new Set());
        }
        importsToAdd.get(parsed.module).add(parsed.genericType);
      }
    }
  }

  if (typedefsToRemove.length === 0) {
    stats.filesProcessed++;
    return;
  }

  // Second pass: replace alias usage with inline generics
  const replacements = new Map();
  for (const { parsed } of typedefsToRemove) {
    replacements.set(parsed.alias, parsed.fullType);
  }

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let lineModified = false;

    for (const [alias, fullType] of replacements.entries()) {
      // Match the alias used in type annotations
      // Patterns: {Alias}, {Alias[]} {Alias|Other}, <Alias>, (Alias)
      const patterns = [
        new RegExp(`\\{${alias}\\}`, 'g'),
        new RegExp(`\\{${alias}\\[\\]\\}`, 'g'),
        new RegExp(`\\{${alias}\\|`, 'g'),
        new RegExp(`\\|${alias}\\}`, 'g'),
        new RegExp(`<${alias}>`, 'g'),
        new RegExp(`\\(${alias}\\)`, 'g'),
      ];

      for (const pattern of patterns) {
        if (pattern.test(line)) {
          line = line.replace(new RegExp(`\\b${alias}\\b`, 'g'), fullType);
          lineModified = true;
        }
      }
    }

    if (lineModified) {
      lines[i] = line;
      modified = true;
    }
  }

  // Third pass: remove typedef lines and add imports
  // Remove typedefs in reverse order to maintain indices
  for (let j = typedefsToRemove.length - 1; j >= 0; j--) {
    const { index } = typedefsToRemove[j];
    lines.splice(index, 1);
    modified = true;
    stats.totalTypedefsRemoved++;
  }

  // Add imports - find the JSDoc block and add imports
  if (importsToAdd.size > 0 && typedefsToRemove.length > 0) {
    const firstTypedefIndex = typedefsToRemove[0].index;

    // Find the start of the JSDoc block
    let jsdocStart = firstTypedefIndex;
    for (let i = firstTypedefIndex; i >= 0; i--) {
      if (lines[i].includes('/**')) {
        jsdocStart = i;
        break;
      }
    }

    // Check if there are already @import statements in this block
    const existingImports = new Map();
    for (let i = jsdocStart; i < lines.length; i++) {
      if (lines[i].includes('*/')) {
        break;
      }

      const importMatch = lines[i].match(/@import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/);
      if (importMatch) {
        const types = importMatch[1].split(',').map((t) => t.trim());
        const module = importMatch[2];
        if (!existingImports.has(module)) {
          existingImports.set(module, { index: i, types: new Set(types) });
        } else {
          types.forEach((t) => existingImports.get(module).types.add(t));
        }
      }
    }

    // Merge new imports with existing ones
    for (const [module, genericTypes] of importsToAdd.entries()) {
      if (existingImports.has(module)) {
        // Add to existing import
        const existing = existingImports.get(module);
        genericTypes.forEach((t) => existing.types.add(t));

        const indent = lines[existing.index].match(/^(\s*\*\s*)/)[0];
        const allTypes = Array.from(existing.types).join(', ');
        lines[existing.index] = `${indent}@import { ${allTypes} } from '${module}'`;
      } else {
        // Add new import line
        const indent = lines[jsdocStart + 1]?.match(/^(\s*\*\s*)/)
          ? lines[jsdocStart + 1].match(/^(\s*\*\s*)/)[0]
          : ' * ';
        const types = Array.from(genericTypes).join(', ');
        const importLine = `${indent}@import { ${types} } from '${module}'`;

        // Insert after the last @import or after /**
        let insertIndex = jsdocStart + 1;
        for (let i = jsdocStart + 1; i < lines.length; i++) {
          if (lines[i].includes('@import')) {
            insertIndex = i + 1;
          } else if (lines[i].includes('@typedef')) {
            break;
          }
        }

        lines.splice(insertIndex, 0, importLine);
        stats.totalImportsAdded++;
      }
    }
  }

  if (modified) {
    const newContent = lines.join('\n');
    writeFileSync(filePath, newContent, 'utf8');
    stats.filesModified++;
    stats.fileDetails.push({
      path: filePath,
      typedefsRemoved: typedefsToRemove.length,
    });
  }

  stats.filesProcessed++;
}

// Main execution
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node migrate-remove-aliases.js <file1> [file2] ...');
  process.exit(1);
}

console.log('Starting type alias removal migration...\n');

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
console.log(`Total @typedef removed: ${stats.totalTypedefsRemoved}`);
console.log(`Total @import added: ${stats.totalImportsAdded}`);
console.log();

if (stats.fileDetails.length > 0) {
  console.log('Modified files:');
  console.log('-'.repeat(50));
  for (const detail of stats.fileDetails) {
    console.log(`  ${detail.path} (${detail.typedefsRemoved} typedefs removed)`);
  }
}
