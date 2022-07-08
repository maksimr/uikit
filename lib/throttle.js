/**
 * @template {(...args: any[]) => any} T
 * @typedef {((...args: Parameters<T>) => void) & ({cancel: function():void})} ThrottledFunction
 */

/**
 * @template {(...args: any[]) => any} T
 * @param {T} fn
 * @param {number} threshold
 * @returns {ThrottledFunction<fn>}
 */
export function throttle(fn, threshold) {
  let prevDate = Date.now() - threshold;
  let timeoutId = /**@type {NodeJS.Timeout|null}*/(null);
  const throttledFn = /**@this {any}*/function(/**@type {Parameters<T>}*/...args) {
    const timeLeft = prevDate + threshold - Date.now();
    if (timeoutId) clearTimeout(timeoutId);
    if (timeLeft > 0) {
      timeoutId = setTimeout(() => {
        prevDate = Date.now();
        fn.call(this, ...args);
      }, timeLeft);
      return;
    }
    prevDate = Date.now();
    fn.call(this, ...args);
  };

  throttledFn.cancel = () => {
    if (timeoutId) clearTimeout(timeoutId);
  };

  return throttledFn;
}
