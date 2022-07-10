module.exports = function(/**@type {any}*/config) {
  process.env.CHROME_BIN = process.env.CHROME_BIN || require('playwright').chromium.executablePath();

  const webpackConfig = require('../webpack.config.js')();
  delete webpackConfig.output?.filename;
  webpackConfig.devtool = 'eval-source-map';
  const webpackAffectedFilesPlugin = require('./lib/webpack-affected-files-plugin');
  webpackConfig.plugins?.push(new webpackAffectedFilesPlugin());

  const files = [
    { pattern: 'test/main.test.js', watched: false }
  ];

  config.set({
    basePath: '../',
    frameworks: ['jasmine', 'webpack'],
    files: files,
    preprocessors: files.reduce((preprocessors, file) => {
      preprocessors[file.pattern] = ['webpack'];
      return preprocessors;
    }, /**@type {Object<string,string[]>}*/({})),
    webpack: webpackConfig,
    specReporter: {
      suppressSkipped: true,
      showSpecTiming: true
    },
    reporters: ['spec'],
    autoWatch: true,
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--remote-debugging-port=9333'
        ]
      }
    },
    browsers: ['ChromeHeadlessNoSandbox'],
    singleRun: true
  });
};
