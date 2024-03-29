import { addEventListener } from './consolidated-events';
import { delegate } from './delegate-events';

export class Grabbable {
  /**
   * @typedef {(event: MouseEvent | TouchEvent) => any} EventListenerFn
   * @typedef GrabbableOptions
   * @property {EventListenerFn} [onGrabStart]
   * @property {EventListenerFn} [onGrab]
   * @property {EventListenerFn} [onGrabEnd]
   * @property {window|document|HTMLElement} [listenElement]
   * @param {HTMLElement} element 
   * @param {GrabbableOptions} options 
   */
  static for(element, options) {
    return new Grabbable(element, options);
  }

  /**
   * @param {HTMLElement} element 
   * @param {GrabbableOptions} options 
   */
  constructor(element, options) {
    /**@type {HTMLElement}*/
    this.element = element;
    this.options = options;
    /**@type {window|document|HTMLElement}*/
    this.listenEelement = options.listenElement || (element.isConnected ? element.ownerDocument : element);
    /**@type {boolean}*/
    this.isDragging = false;
    /**@type {{afterOff: (() => void)[], afterMove: (() => void)[]}}*/
    this.disposable = { afterOff: [], afterMove: [] };
  }

  on() {
    if (this.disposable.afterOff.length) {
      return;
    }

    /**@type {const}*/(['mousedown', 'touchstart']).forEach(startEvent => {
      this.disposable.afterOff.push(
        addEventListener(this.listenEelement, startEvent,
          delegate(this.element, (event) => this.onGrabStart(event))
        )
      );
    });
  }

  /**
   * @param {MouseEvent | TouchEvent} event 
   */
  onGrabStart(event) {
    if (this.isDragging) {
      return;
    }

    this.isDragging = true;
    this.options.onGrabStart?.(event);

    /**@type {const}*/([
      ['touchmove', 'touchend'],
      ['mousemove', 'mouseup']
    ]).forEach(([moveEvent, endEvent]) => {
      this.disposable.afterMove.push(
        addEventListener(
          this.listenEelement, moveEvent,
          (event) => this.onGrab(event)
        )
      );
      this.disposable.afterMove.push(
        addEventListener(
          this.listenEelement, endEvent,
          (event) => this.onGrabEnd(event)
        )
      );
    });
  }

  /**
   * @param {MouseEvent | TouchEvent} event 
   */
  onGrab(event) {
    this.options.onGrab?.(event);
  }

  /**
   * @param {MouseEvent | TouchEvent} event 
   */
  onGrabEnd(event) {
    this.isDragging = false;
    this.options.onGrabEnd?.(event);
    this.dispose(this.disposable.afterMove);
  }

  off() {
    this.dispose(this.disposable.afterMove);
    this.dispose(this.disposable.afterOff);
  }

  /**
   * @param {(() => void)[]} disposable
   */
  dispose(disposable) {
    while (disposable.length > 0) {
      const dispose = disposable.pop();
      dispose?.();
    }
  }
}

/**
 * @param {HTMLElement} element 
 * @param {GrabbableOptions} options 
 */
export function grabbable(element, options) {
  const grabbing = Grabbable.for(element, options);
  grabbing.on();
  return () => grabbing.off();
}