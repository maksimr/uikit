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
 * @returns {jasmine.Clock}
 */
function clock() {
  return jasmine.clock();
}