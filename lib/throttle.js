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
  let timerId = /**@type {NodeJS.Timeout|null}*/(null);
  let lastArgs = /**@type {any[]|null}*/(null);
  const tfn = function(/**@type {any[]}*/...args) {
    lastArgs = args;
    if (!timerId) {
      timerId = setTimeout(callback, ms);
    }
  };
  tfn.cancel = () => {
    if (timerId !== null) {
      clearTimeout(timerId);
    }
    cleanup();
  };
  return tfn;

  function callback() {
    const args = lastArgs;
    cleanup();
    if (args !== null) {
      fn(...args);
    }
  }

  function cleanup() {
    timerId = null;
    lastArgs = null;
  }
}
