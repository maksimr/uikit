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