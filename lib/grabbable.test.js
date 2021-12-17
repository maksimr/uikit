import { grabbable } from './grabbable';

describe('grabbable', () => {
  /**@type {HTMLElement}*/
  let rootElement;
  let onGrabStart = null;
  let onGrab = null;
  let onGrabEnd = null;
  beforeEach(() => {
    rootElement = document.createElement('div');
    document.body.appendChild(rootElement);
    onGrabStart = jest.fn();
    onGrab = jest.fn();
    onGrabEnd = jest.fn();
  });

  afterEach(() => {
    rootElement.parentNode?.removeChild(rootElement);
  });

  it('should handle grabbing by mouse', () => {
    grabbable(rootElement, {
      onGrabStart,
      onGrab,
      onGrabEnd
    });

    mousedown(rootElement);
    mousemove(rootElement);
    mouseup(rootElement);

    expect(onGrabStart).toHaveBeenCalled();
    expect(onGrab).toHaveBeenCalled();
    expect(onGrabEnd).toHaveBeenCalled();
  });

  it('should handle grabbing by touch', () => {
    grabbable(rootElement, {
      onGrabStart,
      onGrab,
      onGrabEnd
    });

    rootElement.dispatchEvent(new MouseEvent('touchstart', { bubbles: true }));
    rootElement.dispatchEvent(new MouseEvent('touchmove', { bubbles: true }));
    rootElement.dispatchEvent(new MouseEvent('touchend', { bubbles: true }));

    expect(onGrabStart).toHaveBeenCalled();
    expect(onGrab).toHaveBeenCalled();
    expect(onGrabEnd).toHaveBeenCalled();
  });

  it('should not handle mousemove if user does not start grabbing', () => {
    grabbable(rootElement, {
      onGrabStart,
      onGrab,
      onGrabEnd
    });

    mousemove(rootElement);

    expect(onGrabStart).not.toHaveBeenCalled();
    expect(onGrab).not.toHaveBeenCalled();
    expect(onGrabEnd).not.toHaveBeenCalled();
  });

  it('should not handle mousemove if user stop grabbing', () => {
    grabbable(rootElement, {
      onGrabStart,
      onGrab,
      onGrabEnd
    });

    mousedown(rootElement);
    mouseup(rootElement);
    mousemove(rootElement);
    mousemove(rootElement);

    expect(onGrab).not.toHaveBeenCalled();
  });

  it('should unsubscribe from grabbing', () => {
    const unsubscribe = grabbable(rootElement, {
      onGrabStart,
      onGrab,
      onGrabEnd
    });

    unsubscribe();
    mousedown(rootElement);
    mousemove(rootElement);
    mouseup(rootElement);

    expect(onGrabStart).not.toHaveBeenCalled();
    expect(onGrab).not.toHaveBeenCalled();
    expect(onGrabEnd).not.toHaveBeenCalled();
  });

  function mousedown(element) {
    element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  }

  function mousemove(element) {
    element.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
  }

  function mouseup(element) {
    element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
  }
});