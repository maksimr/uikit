const jasmine = global.jasmine;

afterEach(function() {
  clock().uninstall();
});

export function useFakeTimers() {
  clock().install();
}

/**
 * @param {number} timestamp
 */
export function setSystemTime(timestamp) {
  clock().mockDate(new Date(timestamp));
}

/**
 * @param {number} msToRun
 */
export function advanceTimersByTime(msToRun) {
  clock().tick(msToRun);
}

/**
 * @param {(...args: any[]) => any} [fn]
 * @returns {jasmine.Spy<fn>}
 */
export function createSpy(fn) {
  const spyFn = jasmine.createSpy();
  return fn ? spyFn.and.callFake(fn) : spyFn;
}

export const spyOn = global.spyOn;
export const objectContaining = jasmine.objectContaining;

/**
 * @returns {jasmine.Clock}
 */
function clock() {
  return jasmine.clock();
}

/**
 * @description Run tests only affected by changes
 * const testsContext = require.context('../lib', true, /(test\/(?!e2e\/).*\.js$|.*\.test\.js$)/);
 * runOnlyAffectedTests(testsContext);
 * @param {__WebpackModuleApi.RequireContext} testsContext
 * @returns {void}
 */
export function runOnlyAffectedTests(testsContext) {
  const allTests = testsContext.keys();
  // @ts-ignore
  const karmaWebpackManifest = global.karmaWebpackManifest;
  const affectedTests = karmaWebpackManifest ?
    allTests.filter((path) => karmaWebpackManifest.indexOf(testsContext.resolve(path)) >= 0) :
    null;

  (affectedTests && affectedTests.length ?
    affectedTests :
    allTests).forEach(testsContext);
}
