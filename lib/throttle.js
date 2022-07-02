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
  let lastArgs = /**@type {Parameters<T>|null}*/(null);
  let lastThis = /**@type {any[]|null}*/(null);
  const throttledFn = /**@this {any}*/function(/**@type {Parameters<T>}*/...args) {
    const timeLeft = prevDate + ms - Date.now();
    lastArgs = args;
    lastThis = this;
    if (timerId) clearTimeout(timerId);
    if (timeLeft > 0) {
      timerId = setTimeout(() => callFn(), timeLeft);
      return;
    }
    callFn();
  };

  throttledFn.cancel = () => {
    if (timerId) clearTimeout(timerId);
    free();
  };

  return throttledFn;

  function callFn() {
    prevDate = Date.now();
    const [thisArg, args] = free();
    fn.call(thisArg, ...args);
  }

  function free() {
    const args = lastArgs;
    const thisArg = lastThis;
    lastArgs = null;
    lastThis = null;
    return [thisArg, args];
  }
}
