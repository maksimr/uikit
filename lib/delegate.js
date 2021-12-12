import { addEventListener } from './consolidated-events';

export const delegate =
  /**
   * @typedef {HTMLElement|document|window} Element
   * @type {{
   *   (rootElement: (Element), element: (HTMLElement|string), type: string, fn: EventListener, options?: boolean | AddEventListenerOptions): ReturnType<addEventListener>;
   *   (element: (HTMLElement|string), type: string, fn: EventListener, options?: boolean | AddEventListenerOptions): ReturnType<addEventListener>;
   * }}
   */
  (function(...args) {
    const [rootElement, element, type, fn, options] = /**@type {[Element, HTMLElement|string, string, EventListener, boolean | AddEventListenerOptions | undefined]}*/ (
      (typeof args[2] === 'function') ?
        [document, ...args] :
        args
    );
    return addEventListener(rootElement, type, (/**@type {Event}*/event) => {
      const target = /**@type {HTMLElement}*/(event.target);
      const isMathed = target &&
        (typeof element === 'string'
          ? target?.closest(element)
          : element.contains(target));
      if (isMathed) {
        return fn(event);
      }
    }, options);
  });