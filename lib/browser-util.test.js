import { getOffsetBetween } from './browser-util';

describe('browser-util', function() {
  describe('getOffsetBetween', function() {
    it('should get offset between element and parent element', function() {
      const element = document.createElement('div');
      const parentElement = document.createElement('div');
      parentElement.appendChild(element);
      expect(getOffsetBetween(element, parentElement)).toEqual(0);
    });
  });
});