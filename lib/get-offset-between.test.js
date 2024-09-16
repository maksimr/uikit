import { getOffsetBetween } from './get-offset-between';

describe('getOffsetBetween', function() {
  /**@type {HTMLElement}*/
  let documentElement;
  beforeEach(function() {
    documentElement = document.createElement('div');
    document.body.appendChild(documentElement);
  });

  afterEach(() => {
    documentElement.remove();
  });

  it('should get offset between element and parent element', function() {
    const element = document.createElement('div');
    const parentElement = document.createElement('div');
    parentElement.appendChild(element);
    documentElement.appendChild(parentElement);
    expect(getOffsetBetween(element, parentElement)).toEqual(0);
  });

  it('should get offset between element and ancestor element', function() {
    const offsetParent = document.createElement('div');
    const element = document.createElement('div');

    new Array(/*nesting level*/10).fill(null).reduce((parentElement, _, index) => {
      const element = document.createElement('div');
      element.style.padding = '10px';
      element.style.position = index % 3 === 0 ? 'relative' : 'static';
      parentElement.appendChild(element);
      return element;
    }, offsetParent).appendChild(element);

    documentElement.appendChild(offsetParent);
    expect(getOffsetBetween(element, offsetParent)).toEqual(100);
  });
});