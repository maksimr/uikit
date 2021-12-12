import { addEventListener } from './consolidated-events';

export const delegate =
  /**
   * @type {{
   *   (rootElement: (HTMLElement|document|window), element: (HTMLElement|string), type: string, fn: EventListener, options?: boolean | AddEventListenerOptions): Function;
   *   (rootElement: (HTMLElement|string), element: string, type: EventListener, fn?: boolean | AddEventListenerOptions): Function;
   * }}
   */
  (function(rootElement, element, type, fn, options) {
    if (typeof type === 'function' && typeof element === 'string') {
      options = /**@type {AddEventListenerOptions}*/(fn);
      fn = /**@type {EventListener}*/(type);
      type = element;
      element = /**@type {HTMLElement}*/(rootElement);
      rootElement = document;
    }

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