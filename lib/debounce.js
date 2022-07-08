/**
 * @template {(...args: any) => any} T
 * @typedef {((...args: Parameters<T>) => (ReturnType<T>|undefined)) & ({cancel: function():void})} DebouncedFunction
 */

/**
 * @template {(...args: any) => any} T
 * @param {T} fn
 * @param {number} ms
 * @returns {DebouncedFunction<fn>}
 */
export function debounce(fn, ms) {
  let timeoutId = /**@type {NodeJS.Timeout|null}*/(null);
  /**@type {ReturnType<fn>|undefined}*/
  let result;

  /**
   * @this any
   * @param {Parameters<fn>} args
   * @return {result}
   */
  function debounced(...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      result = fn.apply(this, args);
      timeoutId = null;
    }, ms);
    return result;
  }

  debounced.cancel = () => timeoutId && clearTimeout(timeoutId);
  return debounced;
}
