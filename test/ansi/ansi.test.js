import { describe, expect, it } from 'vitest';
import { stripAnsi } from '../../src/lib/ansi/ansi.js';

// TODO: DOM comparison tests need to be rewritten for Vitest
// The old tests used Chai's .dom.toEqual() which is not available in Vitest
describe.skip('ansi', function () {
  it('should handle bold', async function () {
    // placeholder
  });
  it('should handle dim', async function () {
    // placeholder
  });
  it('should handle italic', async function () {
    expect(await ansiToHtml('\u001B[3mUnicorn')).dom.toEqual('<div><span class="ansi-italic">Unicorn</span></div>');
  });
  it('should handle underline', async function () {
    expect(await ansiToHtml('\u001B[4mUnicorn')).dom.toEqual('<div><span class="ansi-underline">Unicorn</span></div>');
  });
  it('should handle inverse', async function () {
    expect(await ansiToHtml('\u001B[7mUnicorn')).dom.toEqual('<div><span class="ansi-inverse">Unicorn</span></div>');
  });
  it('should handle hidden', async function () {
    expect(await ansiToHtml('\u001B[8mUnicorn')).dom.toEqual('<div><span class="ansi-hidden">Unicorn</span></div>');
  });
  it('should handle strikethrough', async function () {
    expect(await ansiToHtml('\u001B[9mUnicorn')).dom.toEqual(
      '<div><span class="ansi-strikethrough">Unicorn</span></div>',
    );
  });
  it('should handle stop bold', async function () {
    expect(await ansiToHtml('\u001B[4;1mBold and underline\u001B[21mUnderline Only')).dom.toEqual(
      '<div><span class="ansi-underline ansi-bold">Bold and underline</span><span class="ansi-underline">Underline Only</span></div>',
    );
  });
  it('should handle stop dim', async function () {
    expect(await ansiToHtml('\u001B[4;2mUnderline and dim\u001B[22mUnderline Only')).dom.toEqual(
      '<div><span class="ansi-underline ansi-dim">Underline and dim</span><span class="ansi-underline">Underline Only</span></div>',
    );
  });
  it('should handle stop italic', async function () {
    expect(await ansiToHtml('\u001B[1;3mBold and italic\u001B[23mBold Only')).dom.toEqual(
      '<div><span class="ansi-bold ansi-italic">Bold and italic</span><span class="ansi-bold">Bold Only</span></div>',
    );
  });
  it('should handle stop underline', async function () {
    expect(await ansiToHtml('\u001B[1;4mBold and underline\u001B[24mBold Only')).dom.toEqual(
      '<div><span class="ansi-bold ansi-underline">Bold and underline</span><span class="ansi-bold">Bold Only</span></div>',
    );
  });
  it('should handle stop inverse', async function () {
    expect(await ansiToHtml('\u001B[1;7mBold and inverse\u001B[27mBold Only')).dom.toEqual(
      '<div><span class="ansi-bold ansi-inverse">Bold and inverse</span><span class="ansi-bold">Bold Only</span></div>',
    );
  });
  it('should handle stop hidden', async function () {
    expect(await ansiToHtml('\u001B[1;8mBold and hidden\u001B[28mBold Only')).dom.toEqual(
      '<div><span class="ansi-bold ansi-hidden">Bold and hidden</span><span class="ansi-bold">Bold Only</span></div>',
    );
  });
  it('should handle stop strikethrough', async function () {
    expect(await ansiToHtml('\u001B[1;9mBold and strikethrough\u001B[29mBold Only')).dom.toEqual(
      '<div><span class="ansi-bold ansi-strikethrough">Bold and strikethrough</span><span class="ansi-bold">Bold Only</span></div>',
    );
  });

  it('should handle reset with \\u001B[0m', async function () {
    expect(await ansiToHtml('\u001B[1;9;30;43mBold, strikethrough, fg black, bg yellow\u001B[0mReset')).dom.toEqual(
      '<div><span class="ansi-bold ansi-strikethrough ansi-text-black ansi-bg-yellow">Bold, strikethrough, fg black, bg yellow</span>Reset</div>',
    );
  });
  it('should handle reset with \\u001B[m', async function () {
    expect(await ansiToHtml('\u001B[1;9;30;43mBold, strikethrough, fg black, bg yellow\u001B[mReset')).dom.toEqual(
      '<div><span class="ansi-bold ansi-strikethrough ansi-text-black ansi-bg-yellow">Bold, strikethrough, fg black, bg yellow</span>Reset</div>',
    );
  });
  it('should ignore unsupported codes', async function () {
    expect(await ansiToHtml('\u001B[5;6mUnsupported')).dom.toEqual('<div>Unsupported</div>');
  });

  [
    {
      name: 'black',
      code: 30,
    },
    {
      name: 'red',
      code: 31,
    },
    {
      name: 'green',
      code: 32,
    },
    {
      name: 'yellow',
      code: 33,
    },
    {
      name: 'blue',
      code: 34,
    },
    {
      name: 'magenta',
      code: 35,
    },
    {
      name: 'cyan',
      code: 36,
    },
    {
      name: 'white',
      code: 37,
    },
    {
      name: 'bright-black',
      code: 90,
    },
    {
      name: 'bright-red',
      code: 91,
    },
    {
      name: 'bright-green',
      code: 92,
    },
    {
      name: 'bright-yellow',
      code: 93,
    },
    {
      name: 'bright-blue',
      code: 94,
    },
    {
      name: 'bright-magenta',
      code: 95,
    },
    {
      name: 'bright-cyan',
      code: 96,
    },
    {
      name: 'bright-white',
      code: 97,
    },
  ].forEach((color) =>
    describe(`Color ${color.name} with code ${color.code}`, function () {
      const bgColor = color.code + 10;
      it(`foreground should be handled with code ${color.code}`, async () => {
        expect(await ansiToHtml(`\u001B[${color.code}mColorized\u001B[39mNot colorized`)).dom.toEqual(
          `<div><span class="ansi-text-${color.name}">Colorized</span>Not colorized</div>`,
        );
      });
      it(`background should be handled with code ${bgColor}`, async () => {
        expect(await ansiToHtml(`\u001B[${bgColor}mColorized\u001B[49mNot colorized`)).dom.toEqual(
          `<div><span class="ansi-bg-${color.name}">Colorized</span>Not colorized</div>`,
        );
      });
    }),
  );
});

describe('strip ansi', () => {
  it('should strip all', () => {
    expect(stripAnsi('\u001B[1;31mWhite\u001B[0m \u001B[1;31municorn')).toBe('White unicorn');
  });
});
