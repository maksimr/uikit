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

  it('should add only one native handler for similar events', () => {
    const elementA = document.createElement('b');
    rootElement.appendChild(elementA);
    const fn = jest.fn();
    jest.spyOn(rootElement, 'addEventListener');

    delegate(rootElement, 'b', 'click', fn);
    delegate(rootElement, 'i', 'click', fn);

    expect(rootElement.addEventListener).toHaveBeenCalledTimes(1);
  });

  it('should distinguish capture and bubbling by adding separate native handler', () => {
    const elementA = document.createElement('b');
    rootElement.appendChild(elementA);
    const fn = jest.fn();
    jest.spyOn(rootElement, 'addEventListener');

    delegate(rootElement, 'b', 'click', fn);
    delegate(rootElement, 'i', 'click', fn, true);

    expect(rootElement.addEventListener).toHaveBeenCalledTimes(2);
  });

  it('should remove native event listener when we remove last handler', () => {
    const elementA = document.createElement('b');
    rootElement.appendChild(elementA);
    const fn = jest.fn();
    jest.spyOn(rootElement, 'addEventListener');
    jest.spyOn(rootElement, 'removeEventListener');

    const removeA = delegate(rootElement, 'b', 'click', fn);
    const removeB = delegate(rootElement, 'i', 'click', fn);

    removeA();
    expect(rootElement.removeEventListener).not.toHaveBeenCalled();

    removeB();
    expect(rootElement.removeEventListener).toHaveBeenCalledTimes(1);
  });

  it('should reattach native handler after removing all if we add new one', () => {
    const elementA = document.createElement('b');
    rootElement.appendChild(elementA);
    const fn = jest.fn();
    jest.spyOn(rootElement, 'addEventListener');
    jest.spyOn(rootElement, 'removeEventListener');

    const removeA = delegate(rootElement, 'b', 'click', fn);
    const removeB = delegate(rootElement, 'i', 'click', fn);

    expect(rootElement.addEventListener).toHaveBeenCalledTimes(1);

    removeA();
    expect(rootElement.removeEventListener).not.toHaveBeenCalled();

    removeB();
    expect(rootElement.removeEventListener).toHaveBeenCalledTimes(1);

    delegate(rootElement, 'c', 'click', fn);
    expect(rootElement.addEventListener).toHaveBeenCalledTimes(2);
  });
});