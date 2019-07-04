'use strict';

const path = require('path');
const { analyzeComponents } = require('web-component-analyzer');

module.exports = async function ({ config }) {

  config.resolve.alias['@i18n'] = path.resolve(__dirname, '../components/lib/i18n.js');

  return config;
};
