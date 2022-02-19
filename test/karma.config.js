module.exports = function(config) {
  process.env.CHROME_BIN = process.env.CHROME_BIN || require('playwright').chromium.executablePath();

  const files = [
    { pattern: 'lib/**/*.test.js', watched: false }
  ];

  config.set({
    basePath: '../',
    frameworks: ['jasmine', 'webpack'],
    files: files,
    preprocessors: files.reduce((preprocessors, file) => {
      preprocessors[file.pattern || file] = ['webpack'];
      return preprocessors;
    }, {}),
    webpack: require('../webpack.config.js')(),
    reporters: ['progress'],
    autoWatch: true,
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    },
    browsers: ['ChromeHeadlessNoSandbox'],
    singleRun: true
  });
};
