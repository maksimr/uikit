module.exports = function(config) {
  const files = ['./test/e2e/snapshot.js', 'lib/**/*.e2e.js'];
  config.set({
    basePath: '../../',
    frameworks: ['jasmine'],
    files: files,
    plugins: [
      'karma-*',
      require('./Puppeteer'),
      require('./OudatedSnapshotReporter'),
      require('./Preprocessor')
    ],
    preprocessors: files.reduce((preprocessors, file) => {
      preprocessors[file] = ['webpack'];
      return preprocessors;
    }, {}),
    customLaunchers: {
      Puppeteer_no_hinting: {
        base: 'Puppeteer',
        flags: ['--font-render-hinting=none']
      }
    },
    reporters: ['progress', 'outdated-snapshot'],
    autoWatch: true,
    browsers: ['Puppeteer_no_hinting'],
    singleRun: true
  });
};
