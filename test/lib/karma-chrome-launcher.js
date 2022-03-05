module.exports = {
  'launcher:ChromeHeadlessNoWait': ['type', function(executor, baseBrowserDecorator, args) {
    executor.schedule = ((schedule) => function(...args) {
      /**
       * monkey patching karma's executor to provide functionality
       * interrupt current tests executions
       * @see https://github.com/karma-runner/karma/issues/3675
       */
      const inProgress = this.capturedBrowsers.browsers.filter((browser) => browser.state === 'EXECUTING').map((browser) => {
        browser.onComplete({});
        return browser;
      }).length;
      if (inProgress) {
        this.executionScheduled = true;
      }
      return inProgress ? null : schedule.call(this, ...args);
    })(executor.schedule);

    const ChromeHeadless = require('karma-chrome-launcher')['launcher:ChromeHeadless'][1];
    return new ChromeHeadless(baseBrowserDecorator, args);
  }]
};
