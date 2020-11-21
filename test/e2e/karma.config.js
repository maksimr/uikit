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
    reporters: ['progress', 'outdated-snapshot'],
    autoWatch: true,
    browsers: ['Puppeteer'],
    singleRun: true
  });
};
