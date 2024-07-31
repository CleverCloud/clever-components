import * as prettier from 'prettier';
const code = '(add 1 2)';
await prettier.format(code, {
  parser: 'lisp',
  plugins: ['.'],
});
