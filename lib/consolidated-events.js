/**@type {Map<HTMLElement|Document|Window,any>}*/
const elementToEvents = new Map();


/**
 * @typedef {boolean | AddEventListenerOptions} ConsolidatedAddEventListenerOptions
 * 
 * @description Reduce number of DOM event listeners
 *  by consolidating the same events in to one
 * @param {HTMLElement|Document|Window} element 
 * @param {string} type 
 * @param {EventListener} fn 
 * @param {ConsolidatedAddEventListenerOptions} [options]
 * @returns {Function} Remove event listener
 */
export function addEventListener(element, type, fn, options) {
  const events = elementToEvents.get(element) || {};
  elementToEvents.set(element, events);

  options = options ?? false;
  const eventKey = type + (options === false ? '' : JSON.stringify(options));
  const eventDescription = events[eventKey] = events[eventKey] || { listeners: [] };
  const eventListeners = eventDescription.listeners;
  /**@type {{fn: EventListenerOrEventListenerObject | null}}*/
  const virtualListener = { fn: fn };
  eventListeners.push(virtualListener);

  if (eventListeners.length === 1) {
    attachEventListenerToNode(element, type, options, eventKey);
  }

  return () => {
    const idx = eventListeners.indexOf(virtualListener);
    if (idx > -1) {
      virtualListener.fn = null;
      eventListeners.splice(idx, 1);
      if (eventListeners.length === 0) {
        element.removeEventListener(
          type,
          eventDescription.fn,
          eventDescription.options
        );
        delete events[eventKey];
        if (Object.keys(events).length === 0) {
          elementToEvents.delete(element);
        }
      }
    }
  };
}

/**
 * @param {HTMLElement|Document|Window} rootElement 
 * @param {string} eventName 
 * @param {ConsolidatedAddEventListenerOptions|undefined} options 
 * @param {string} eventKey 
 */
function attachEventListenerToNode(rootElement, eventName, options, eventKey) {
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