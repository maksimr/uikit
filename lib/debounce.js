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
  /**@type {ReturnType<typeof setTimeout>}*/
  let timeoutId;
  /**@type {ReturnType<fn>|undefined}*/
  let result;

  /**
   * @this any
   * @param {Parameters<fn>} args
   * @return {result}
   */
  function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      result = fn.apply(this, args);
    }, ms);
    return result;
  }

  debounced.cancel = () => {
    clearTimeout(timeoutId);
  };

  return debounced;
}
