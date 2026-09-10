const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure Metro bundler includes ONNX models and external weights
config.resolver.assetExts.push('onnx', 'data');

module.exports = config;
