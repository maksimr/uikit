/**
 * @typedef {HTMLElement|Document|Window} RootElement
 * @typedef {(event: Event) => void} Fn
 * @typedef {any} Options
 * @typedef {() => void} DelegateReturn
 */

/**@type {Map<RootElement,any>}*/
const elementToEvents = new Map();

export const delegate =
  /**
   * @type {{
   *   (rootElement: (RootElement), element: (HTMLElement|string), eventType: string, fn: Fn, options?: Options): DelegateReturn;
   *   (rootElement: (HTMLElement|string), element: string, eventType: Fn, fn?: Options): DelegateReturn;
   * }}
   */
  (function(rootElement, element, eventType, fn, options) {
    if (
      typeof eventType === 'function' &&
      typeof element === 'string'
    ) {
      options = fn;
      fn = eventType;
      eventType = element;
      element = /**@type {HTMLElement}*/(rootElement);
      rootElement = document;
    }
    const events = elementToEvents.get(rootElement) || {};
    elementToEvents.set(rootElement, events);

    options = options ?? false;
    const eventKey = eventType + (options === false ? '' : JSON.stringify(options));
    const eventDescription = events[eventKey] = events[eventKey] || { listeners: [] };
    const eventListeners = eventDescription.listeners;
    /**@type {{fn: Function | null}}*/
    const listener = {
      fn: (/**@type {Event}*/event) => {
        const target = /**@type {HTMLElement}*/(event.target);
        const isMathed = target &&
          (typeof element === 'string'
            ? target?.closest(element)
            : element.contains(target));
        if (isMathed) {
          return fn(event);
        }
      }
    };
    eventListeners.push(listener);

    if (eventListeners.length === 1) {
      addDomEventListener(rootElement, eventType, options, eventKey);
    }

    return () => {
      const idx = eventListeners.indexOf(listener);
      if (idx > -1) {
        listener.fn = null;
        eventListeners.splice(idx, 1);
        if (eventListeners.length === 0) {
          rootElement.removeEventListener(
            eventType,
            eventDescription.fn,
            eventDescription.options
          );
          delete events[eventKey];
          if (Object.keys(events).length === 0) {
            elementToEvents.delete(rootElement);
          }
        }
      }
    };
  });

/**
 * @param {RootElement} rootElement 
 * @param {string} eventName 
 * @param {Options} options 
 * @param {string} eventKey 
 */
function addDomEventListener(rootElement, eventName, options, eventKey) {
  const events = elementToEvents.get(rootElement);
  const eventDescription = events[eventKey] = events[eventKey] || { listeners: [] };
  eventDescription.fn = (/**@type {Event}*/event) => {
    Array.from(eventDescription.listeners).forEach((it) => it.fn?.(event));
  };
  eventDescription.options = options;
  rootElement.addEventListener(
    eventName,
    eventDescription.fn,
    eventDescription.options
  );
}