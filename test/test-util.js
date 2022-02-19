afterEach(function() {
  jasmine.clock().uninstall();
});

export function useFakeTimers() {
  jasmine.clock().install();
}

/**
 * @param {number} timestamp 
 */
export function setSystemTime(timestamp) {
  jasmine.clock().mockDate(new Date(timestamp));
}