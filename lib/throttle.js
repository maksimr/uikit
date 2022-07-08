/**
 * @template {(...args: any[]) => any} T
 * @typedef {((...args: Parameters<T>) => void) & ({cancel: function():void})} ThrottledFunction
 */

/**
 * @template {(...args: any[]) => any} T
 * @param {T} fn
 * @param {number} ms
 * @returns {ThrottledFunction<fn>}
 */
export function throttle(fn, ms) {
  let prevDate = Date.now() - ms;
  let timerId = /**@type {NodeJS.Timeout|null}*/(null);
  const throttledFn = /**@this {any}*/function(/**@type {Parameters<T>}*/...args) {
    const timeLeft = prevDate + ms - Date.now();
    if (timerId) clearTimeout(timerId);
    if (timeLeft > 0) {
      timerId = setTimeout(() => {
        prevDate = Date.now();
        fn.call(this, ...args);
      }, timeLeft);
      return;
    }
    prevDate = Date.now();
    fn.call(this, ...args);
  };

  throttledFn.cancel = () => {
    if (timerId) clearTimeout(timerId);
  };

  return throttledFn;
}
