/**
 * @typedef {HTMLElement|Document|Window} ListenerElement
 * @typedef {boolean | AddEventListenerOptions} EventListenerOptions
 * @typedef EventHandler
 * @property {EventListener} nativeListener
 * @property {{fn: EventListener | null}[]} virtualListeners
 */

/**
 * @type {WeakMap<ListenerElement,EventsTarget>}
 */
const wm = new WeakMap();

class EventsTarget {
  /**
   * @param {ListenerElement} element
   * @returns {EventsTarget}
   */
  static for(element) {
    if (!wm.has(element)) {
      wm.set(element, new EventsTarget(wm));
    }
    const events = /**@type {EventsTarget}*/(wm.get(element));
    return events;
  }

  /**
   * @param {WeakMap<ListenerElement,EventsTarget>} weakMap 
   */
  constructor(weakMap) {
    /**
     * @type {Object<string,Object<string,EventHandler>>|null}
     */
    this.event = null;
    /**
     * @type {WeakMap<ListenerElement,EventsTarget>}
     */
    this.weakMapElementToEvent = weakMap;
  }

  /**
   * @param {ListenerElement} element
   * @param {string} type
   * @param {(event: any) => any} fn
   * @param {EventListenerOptions} options
   */
  subscribe(element, type, fn, options) {
    const handlers = this.handlers(type, options);
    handlers.virtualListeners.push({ fn: fn });
    if (handlers.virtualListeners.length === 1) {
      element.addEventListener(type, handlers.nativeListener, options);
    }
  }

  /**
   * @param {ListenerElement} element
   * @param {string} type
   * @param {(event: any) => any} fn
   * @param {EventListenerOptions} options
   */
  unsubscribe(element, type, fn, options) {
    const handlers = this.handlers(type, options);
    const virtualListenerIx = handlers.virtualListeners.findIndex((it) => it.fn === fn);

    if (virtualListenerIx !== -1) {
      handlers.virtualListeners[virtualListenerIx].fn = null;
      handlers.virtualListeners.splice(virtualListenerIx, 1);
    }

    if (handlers.virtualListeners.length === 0) {
      this.clear(element, type, options);
    }
  }

  /**
   * @param {Event} event
   * @param {string} type
   * @param {EventListenerOptions} options
   */
  fire(event, type, options) {
    const virtualListeners = Array.from(
      this.handlers(type, options).virtualListeners
    );
    virtualListeners.forEach(({ fn }) => fn?.(event));
  }

  /**
   * @param {string} type
   * @param {EventListenerOptions} options
   */
  handlers(type, options) {
    const key = this.eventOptionsKey(options);
    const event = (this.event = this.event || {});
    event[type] = event[type] || {};
    event[type][key] = event[type][key] || {
      nativeListener: (event) => this.fire(event, type, options),
      virtualListeners: []
    };
    return event[type][key];
  }

  /**
   * @param {ListenerElement} element
   * @param {string} type
   * @param {EventListenerOptions} options
   */
  clear(element, type, options) {
    const key = this.eventOptionsKey(options);

    if (this.event) {
      element.removeEventListener(type, this.event[type][key].nativeListener, options);
      delete this.event[type][key];

      if (isEmpty(this.event[type])) {
        delete this.event[type];
        if (isEmpty(this.event)) {
          this.event = null;
          this.weakMapElementToEvent.delete(element);
        }
      }
    }

    /**
     * @param {Object} obj 
     * @returns {boolean}
     */
    function isEmpty(obj) {
      return Object.keys(obj).length === 0;
    }
  }

  /**
   * @param {EventListenerOptions} options
   */
  eventOptionsKey(options) {
    if (!options) {
      return 0;
    }

    if (options === true) {
      return 100;
    }

    const capture = Number(options.capture) << 0;
    const passive = Number(options.passive) << 1;
    const once = Number(options.once) << 2;
    return capture + passive + once;
  }
}

/**
 * @template {ListenerElement} Element
 * @typedef {Element extends Window ? WindowEventMap : (Element extends Document ? DocumentEventMap : (Element extends Element ? HTMLElementEventMap : Record<string,any>))} EventMap
 */

/**
 * @template {ListenerElement} TargetElement
 * @template {keyof EventMap<TargetElement>} K
 * @param {TargetElement} element 
 * @param {K & string | string} type 
 * @param {(this: TargetElement, ev: EventMap<TargetElement>[K]) => any} fn 
 * @param {EventListenerOptions} [options]
 * @returns {() => void}
 */
export function addEventListener(element, type, fn, options = false) {
  const target = EventsTarget.for(element);
  target.subscribe(element, type, fn, options);
  return () => target.unsubscribe(element, type, fn, options);
}