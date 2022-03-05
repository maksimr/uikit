module.exports = {
  'launcher:ChromeHeadlessNoWait': ['type', function(/**@type {any}*/executor, /**@type {any}*/baseBrowserDecorator, /**@type {any}*/args) {
    executor.schedule = ((schedule) => /**@this {any}*/function(/**@type {any[]}*/...args) {
      /**
       * monkey patching karma's executor to provide functionality
       * interrupt current tests executions
       * @see https://github.com/karma-runner/karma/issues/3675
       */
      const inProgress = this.capturedBrowsers.browsers.filter((/**@type {any}*/browser) => browser.state === 'EXECUTING').map((/**@type {any}*/browser) => {
        browser.onComplete({});
        return browser;
      }).length;
      if (inProgress) {
        this.executionScheduled = true;
      }
      return inProgress ? null : schedule.call(this, ...args);
    })(executor.schedule);

    // @ts-ignore
    const ChromeHeadless = require('karma-chrome-launcher')['launcher:ChromeHeadless'][1];
    return new ChromeHeadless(baseBrowserDecorator, args);
  }]
};
