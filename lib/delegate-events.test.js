import { delegate } from './delegate-events';

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

    rootElement.addEventListener('click', delegate('b', fn));
    elementA.dispatchEvent(mouseEvent);

    expect(fn).toHaveBeenCalled();
  });

  it('should delegate event when user pass DOM node', () => {
    const elementA = document.createElement('b');
    rootElement.appendChild(elementA);
    const fn = jest.fn();

    rootElement.addEventListener('click', delegate(elementA, fn));
    elementA.dispatchEvent(mouseEvent);

    expect(fn).toHaveBeenCalled();
  });

  it('should not trigger event handler if event occur not on the target', () => {
    const fn = jest.fn();
    const elementA = document.createElement('b');
    const elementI = document.createElement('i');
    rootElement.appendChild(elementA);
    rootElement.appendChild(elementI);

    rootElement.addEventListener('click', delegate('b', fn));
    elementI.dispatchEvent(mouseEvent);
    rootElement.dispatchEvent(mouseEvent);

    expect(fn).not.toHaveBeenCalled();
  });
});