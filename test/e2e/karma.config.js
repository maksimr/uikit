module.exports = function(config) {
  const files = [
    { pattern: './test/e2e/image-snapshot/snapshot.js', watched: false },
    { pattern: 'lib/**/*.e2e.js', watched: false }
  ];

  config.set({
    basePath: '../../',
    frameworks: ['jasmine', 'webpack'],
    files: files,
    plugins: [
      'karma-*',
      require('./image-snapshot/puppeteer-launcher'),
      require('./image-snapshot/oudated-snapshot-reporter')
    ],
    preprocessors: files.reduce((preprocessors, file) => {
      preprocessors[file.pattern || file] = ['webpack'];
      return preprocessors;
    }, {}),
    webpack: require('../../webpack.config.js')(),
    customLaunchers: {
      Puppeteer_no_hinting: {
        base: 'Puppeteer',
        flags: ['--font-render-hinting=none', '--no-sandbox']
      }
    },
    reporters: ['progress', 'outdated-snapshot'],
    autoWatch: true,
    browsers: ['Puppeteer_no_hinting'],
    singleRun: true
  });
};
