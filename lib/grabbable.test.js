import { grabbable } from './grabbable';

describe('grabbable', () => {
  /**@type {HTMLElement}*/
  let element;
  /**@type {any}*/
  let onGrabStart = null;
  /**@type {any}*/
  let onGrab = null;
  /**@type {any}*/
  let onGrabEnd = null;
  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
    onGrabStart = jest.fn();
    onGrab = jest.fn();
    onGrabEnd = jest.fn();
  });

  afterEach(() => {
    element.parentNode?.removeChild(element);
  });

  it('should handle grabbing by mouse', () => {
    grabbable(element, {
      onGrabStart,
      onGrab,
      onGrabEnd
    });

    mousedown(element);
    mousemove(element);
    mouseup(element);

    expect(onGrabStart).toHaveBeenCalled();
    expect(onGrab).toHaveBeenCalled();
    expect(onGrabEnd).toHaveBeenCalled();
  });

  it('should handle grabbing by touch', () => {
    grabbable(element, {
      onGrabStart,
      onGrab,
      onGrabEnd
    });

    element.dispatchEvent(new MouseEvent('touchstart', { bubbles: true }));
    element.dispatchEvent(new MouseEvent('touchmove', { bubbles: true }));
    element.dispatchEvent(new MouseEvent('touchend', { bubbles: true }));

    expect(onGrabStart).toHaveBeenCalled();
    expect(onGrab).toHaveBeenCalled();
    expect(onGrabEnd).toHaveBeenCalled();
  });

  it('should not handle mousemove if user does not start grabbing', () => {
    grabbable(element, {
      onGrabStart,
      onGrab,
      onGrabEnd
    });

    mousemove(element);

    expect(onGrabStart).not.toHaveBeenCalled();
    expect(onGrab).not.toHaveBeenCalled();
    expect(onGrabEnd).not.toHaveBeenCalled();
  });

  it('should not handle mousemove if user stop grabbing', () => {
    grabbable(element, {
      onGrabStart,
      onGrab,
      onGrabEnd
    });

    mousedown(element);
    mouseup(element);
    mousemove(element);
    mousemove(element);

    expect(onGrab).not.toHaveBeenCalled();
  });

  it('should unsubscribe from grabbing', () => {
    const unsubscribe = grabbable(element, {
      onGrabStart,
      onGrab,
      onGrabEnd
    });

    unsubscribe();
    mousedown(element);
    mousemove(element);
    mouseup(element);

    expect(onGrabStart).not.toHaveBeenCalled();
    expect(onGrab).not.toHaveBeenCalled();
    expect(onGrabEnd).not.toHaveBeenCalled();
  });

  it('should handle grabbing for detached from DOM element', () => {
    element = document.createElement('div');

    grabbable(element, {
      onGrabStart,
      onGrab,
      onGrabEnd
    });

    mousedown(element);
    mousemove(element);
    mouseup(element);

    expect(onGrabStart).toHaveBeenCalled();
    expect(onGrab).toHaveBeenCalled();
    expect(onGrabEnd).toHaveBeenCalled();
  });

  function mousedown(/**@type {HTMLElement}*/element) {
    element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  }

  function mousemove(/**@type {HTMLElement}*/element) {
    element.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
  }

  function mouseup(/**@type {HTMLElement}*/element) {
    element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
  }
});