/**
 * @template {Event} EventType
 * @template {(event: EventType) => any} EventListener
 * @param {HTMLElement|string} selector
 * @param {EventListener} fn
 * @returns {(event: EventType) => (ReturnType<fn> | undefined)}
 */
export function delegate(selector, fn) {
  return (event) => {
    const target = /**@type {HTMLElement}*/(event.target);
    const isMatched = target &&
      (typeof selector === 'string'
        ? target?.closest(selector)
        : selector.contains(target));
    if (isMatched) {
      return fn(event);
    }
  };
}