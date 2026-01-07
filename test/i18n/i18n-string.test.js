import { describe, it, expect } from 'vitest';
import { preparePlural } from '../../src/lib/i18n/i18n-string.js';

describe('preparePlural', () => {
  describe('english', () => {
    const plural = preparePlural('en');

    it('select correct rule', () => {
      expect(plural(0, 'mouse', 'mice')).toBe('mice');
      expect(plural(1, 'mouse', 'mice')).toBe('mouse');
      expect(plural(2, 'mouse', 'mice')).toBe('mice');
      expect(plural(10, 'mouse', 'mice')).toBe('mice');
    });

    it('automatic "s" suffix', () => {
      expect(plural(0, 'cat')).toBe('cats');
      expect(plural(1, 'cat')).toBe('cat');
      expect(plural(2, 'cat')).toBe('cats');
      expect(plural(10, 'cat')).toBe('cats');
    });
  });

  describe('french', () => {
    const plural = preparePlural('fr');

    it('select correct rule', () => {
      expect(plural(0, 'cheval', 'chevaux')).toBe('cheval');
      expect(plural(1, 'cheval', 'chevaux')).toBe('cheval');
      expect(plural(2, 'cheval', 'chevaux')).toBe('chevaux');
      expect(plural(10, 'cheval', 'chevaux')).toBe('chevaux');
    });

    it('automatic "s" suffix', () => {
      expect(plural(0, 'chat')).toBe('chat');
      expect(plural(1, 'chat')).toBe('chat');
      expect(plural(2, 'chat')).toBe('chats');
      expect(plural(10, 'chat')).toBe('chats');
    });
  });
});
