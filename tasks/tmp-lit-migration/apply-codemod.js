import fs from 'fs';
import { parse } from '@babel/core';
import { walk } from 'estree-walker';
import glob from 'glob';
import MagicString from 'magic-string';

export function applyCodemod (callback) {

  const fileList = [
    ...glob.sync('docs/**/*.js'),
    ...glob.sync('src/**/*.js'),
  ];

  for (const filepath of fileList) {

    console.log('-'.repeat(60));
    console.log(filepath);

    const code = fs.readFileSync(filepath, { encoding: 'utf8' });
    const ast = parse(code);
    const ms = new MagicString(code);

    walk(ast, {
      enter (node, parent, prop, index) {
        callback(ms, { node, parent, prop, index });
      },
    });

    const newCode = ms.toString();
    fs.writeFileSync(filepath, newCode);
  }
}
