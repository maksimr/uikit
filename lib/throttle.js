/**
 * @template {(...args: any[]) => any} T
 * @typedef {((...args: Parameters<T>) => void) & ({cancel: function():void})} ThrottledFunction
 */

/**
 * @template {function} T
 * @param {T} fn
 * @param {number} ms
 * @returns {ThrottledFunction<fn>}
 */
export function throttle(fn, ms) {
  let timerId = null;
  let lastArgs = null;
  const tfn = function(...args) {
    lastArgs = args;
    if (!timerId) {
      timerId = setTimeout(callback, ms);
    }
  };
  tfn.cancel = () => clearTimeout(timerId);
  return tfn;

  function callback() {
    timerId = null;
    fn(...lastArgs);
    lastArgs = null;
  }
}
