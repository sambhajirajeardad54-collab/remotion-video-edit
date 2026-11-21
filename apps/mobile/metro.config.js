// Expo's default monorepo config, plus one rule: never watch or resolve
// anything inside apps/video (the Remotion studio has its own isolated
// node_modules with React 19.3.1 and large media files).
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
const videoDir = path.resolve(__dirname, '../video');
const escaped = videoDir.replace(/[/\\^$.*+?()[\]{}|]/g, '\\$&');
const videoPattern = new RegExp(`^${escaped}([/\\\\].*)?$`);

const existing = config.resolver.blockList;
config.resolver.blockList = existing
  ? [].concat(existing, videoPattern)
  : videoPattern;

module.exports = config;
