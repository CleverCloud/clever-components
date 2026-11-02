// eslint-disable-next-line import-x/extensions
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test-node/**/*.test.js'],
  },
});
