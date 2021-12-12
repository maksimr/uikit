import { delegate } from './delegate';

describe('delegate', () => {
  /**@type {HTMLElement}*/
  let rootElement;
  /**@type {MouseEvent}*/
  let mouseEvent;
  beforeEach(() => {
    rootElement = document.createElement('div');
    mouseEvent = new MouseEvent('click', { bubbles: true });
    document.body.appendChild(rootElement);
  });

  afterEach(() => {
    rootElement.parentNode?.removeChild(rootElement);
  });

  it('should delegate event when user pass query selector string', () => {
    const elementA = document.createElement('b');
    rootElement.appendChild(elementA);
    const fn = jest.fn();

    delegate('b', 'click', fn);
    elementA.dispatchEvent(mouseEvent);

    expect(fn).toHaveBeenCalled();
  });

  it('should remove event listener', () => {
    const fn = jest.fn();
    const elementA = document.createElement('b');
    rootElement.appendChild(elementA);

    const removeEventListener = delegate('b', 'click', fn);
    removeEventListener();
    elementA.dispatchEvent(mouseEvent);

    expect(fn).not.toHaveBeenCalled();
  });

  it('should delegate event when user pass DOM node', () => {
    const elementA = document.createElement('b');
    rootElement.appendChild(elementA);
    const fn = jest.fn();

    delegate(elementA, 'click', fn);
    elementA.dispatchEvent(mouseEvent);

    expect(fn).toHaveBeenCalled();
  });

  it('should not trigger event handler if event occur not on the target', () => {
    const fn = jest.fn();
    const elementA = document.createElement('b');
    const elementI = document.createElement('i');
    rootElement.appendChild(elementA);
    rootElement.appendChild(elementI);

    delegate('b', 'click', fn);
    rootElement.dispatchEvent(mouseEvent);

    expect(fn).not.toHaveBeenCalled();
  });

  it('should allow pass custom root element on which we listen events', () => {
    const elementA = document.createElement('b');
    rootElement.appendChild(elementA);
    const fn = jest.fn();

    delegate(rootElement, 'b', 'click', fn);
    elementA.dispatchEvent(mouseEvent);

    expect(fn).toHaveBeenCalled();
  });
});