const { override, addWebpackFallback } = require('customize-cra');

module.exports = override(
  addWebpackFallback({
    os: require.resolve('os-browserify/browser'),
  })
);