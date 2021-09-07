module.exports = function(config) {
  const snapshotDir = require('path').resolve(__dirname, '__image_snapshots__');
  const files = [
    { pattern: 'lib/**/*.e2e.js', watched: false }
  ];

  config.set({
    basePath: '../../',
    frameworks: ['snapshot-jasmine', 'jasmine', 'webpack'],
    files: files,
    preprocessors: files.reduce((preprocessors, file) => {
      preprocessors[file.pattern || file] = ['webpack'];
      return preprocessors;
    }, {}),
    webpack: require('../../webpack.config.js')(),
    snapshot: {
      driver: process.env.BROWSER ?
        require('playwright')[process.env.BROWSER] :
        require('puppeteer'),
      customSnapshotsDir: snapshotDir
    },
    customLaunchers: {
      Puppeteer_no_hinting: {
        base: 'SnapshotBrowser',
        flags: ['--font-render-hinting=none', '--no-sandbox']
      }
    },
    reporters: ['progress', 'outdated-snapshot'],
    autoWatch: true,
    browsers: ['Puppeteer_no_hinting'],
    singleRun: true
  });
};
