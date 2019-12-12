/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
'use strict';

const path = require('path');
const blacklist = require('metro-config/src/defaults/blacklist');

const multiSliderRoot = path.resolve(__dirname, '..', '..');

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  watchFolders: [path.resolve(__dirname, 'node_modules'), multiSliderRoot],
  resolver: {
    blacklistRE: blacklist([
      new RegExp(`${multiSliderRoot}/node_modules/react-native/.*`),
    ]),
  },
};
