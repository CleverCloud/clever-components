// @ts-nocheck

// immer uses a non-standard global property from Node.js "process"
window.process = {
  env: {
    NODE_ENV: 'production',
  },
};

export { produce } from 'immer/dist/immer.esm.js';
// TODO: object freeze
