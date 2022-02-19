import { addEventListener } from './consolidated-events';

describe('consolidated-events', function() {
  /**@type {HTMLElement}*/
  let element;
  /**@type {MouseEvent}*/
  let clickEvent;
  beforeEach(() => {
    element = document.createElement('div');
    clickEvent = new MouseEvent('click', { bubbles: true });
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.parentNode?.removeChild(element);
  });

  it('should add event listener', () => {
    const fn = jasmine.createSpy();

    addEventListener(element, 'click', fn);
    element.dispatchEvent(clickEvent);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should remove event listener', () => {
    const fn = jasmine.createSpy();

    const removeEventListener = addEventListener(element, 'click', fn);
    removeEventListener();
    element.dispatchEvent(clickEvent);

    expect(fn).toHaveBeenCalledTimes(0);
  });

  it('should add only one native handler if we alreday have one for such type of event', () => {
    const fn = jasmine.createSpy();
    spyOn(element, 'addEventListener');

    addEventListener(element, 'click', fn);
    addEventListener(element, 'click', fn);

    expect(element.addEventListener).toHaveBeenCalledTimes(1);
  });

  it('should detach event lisener from DOM node when remove last event handler', () => {
    const fn = jasmine.createSpy();
    spyOn(element, 'addEventListener');
    spyOn(element, 'removeEventListener');

    const removeEventListenerA = addEventListener(element, 'click', fn);
    const removeEventListenerB = addEventListener(element, 'click', fn);

    removeEventListenerA();
    expect(element.removeEventListener).not.toHaveBeenCalled();

    removeEventListenerB();
    expect(element.removeEventListener).toHaveBeenCalledTimes(1);
  });

  it('should add separate native handlers if we attach listeners with diffirent options', () => {
    const fn = jasmine.createSpy();
    spyOn(element, 'addEventListener');

    addEventListener(element, 'click', fn);
    addEventListener(element, 'click', fn, true);

    expect(element.addEventListener).toHaveBeenCalledTimes(2);
  });

  it('should reattach native handler after removing all handlers and then add new one', () => {
    const fn = jasmine.createSpy();
    spyOn(element, 'addEventListener');
    spyOn(element, 'removeEventListener');

    const removeEventListenerA = addEventListener(element, 'click', fn);
    const removeEventListenerB = addEventListener(element, 'click', fn);

    expect(element.addEventListener).toHaveBeenCalledTimes(1);

    removeEventListenerA();
    removeEventListenerB();
    expect(element.removeEventListener).toHaveBeenCalledTimes(1);

    addEventListener(element, 'click', fn);
    expect(element.addEventListener).toHaveBeenCalledTimes(2);
  });
});