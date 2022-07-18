module.exports = function(/**@type {{set: Function}}*/config) {
  require('../karma.config')(config);

  const snapshotDir = require('path').resolve(__dirname, '__image_snapshots__');
  const files = [
    { pattern: 'lib/**/*.e2e.js', watched: false }
  ];

  config.set({
    basePath: '../../',
    frameworks: ['snapshot-jasmine', 'jasmine', 'webpack'],
    files: files,
    preprocessors: files.reduce((preprocessors, file) => {
      preprocessors[file.pattern] = ['webpack'];
      return preprocessors;
    }, /**@type {Object<string,string[]>}*/({})),
    snapshot: {
      customSnapshotsDir: snapshotDir
    },
    customLaunchers: {
      Chrome: {
        base: 'SnapshotHeadlessLauncher',
        driver: require('playwright').chromium,
        flags: ['--font-render-hinting=none', '--no-sandbox', '--remote-debugging-port=9334']
      },
      Firefox: {
        base: 'SnapshotHeadlessLauncher',
        driver: require('playwright').firefox,
        flags: ['--font-render-hinting=none', '--no-sandbox']
      }
    },
    reporters: ['spec', 'outdated-snapshot'],
    browsers: ['Chrome']
  });
};
