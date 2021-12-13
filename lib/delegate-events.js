/**
 * @param {HTMLElement|string} selector
 * @param {EventListener} fn
 * @returns {EventListener}
 */
export function delegate(selector, fn) {
  return (event) => {
    const target = /**@type {HTMLElement}*/(event.target);
    const isMathed = target &&
      (typeof selector === 'string'
        ? target?.closest(selector)
        : selector.contains(target));
    if (isMathed) {
      return fn(event);
    }
  };
}