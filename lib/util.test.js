import { binarySearch, parseAcceptLanguage } from './util';

describe('util', function() {
  describe('binarySearch', function() {
    it('should return index of element in array', function() {
      const x = 2;
      expect(
        binarySearch([2], (it) => it > x ? -1 : (it < x ? 1 : 0))
      ).toEqual(0);
    });

    it('should return negative number if we don`t found element in array', function() {
      const x = 1;
      expect(
        binarySearch([2], (it) => it > x ? -1 : (it < x ? 1 : 0)) < 0
      ).toEqual(true);
    });

    it('should correctly handle array with odd number of elements', function() {
      const x = 2;
      expect(
        binarySearch([1, 2, 3], (it) => it > x ? -1 : (it < x ? 1 : 0))
      ).toEqual(1);
    });

    it('should find lowest index in array containing equal values', function() {
      const x = 2;
      expect(
        binarySearch([1, 2, 2, 3], (it) => it > x ? -1 : (it < x ? 1 : 0))
      ).toEqual(1);
    });

    it('should return insertion point', function() {
      const x = 2;
      const compareFn = (/**@type {number}*/it) => it > x ? -1 : 1;
      expect(~(binarySearch([3], compareFn))).toEqual(0);
      expect(~(binarySearch([1, 3], compareFn))).toEqual(1);
      expect(~(binarySearch([0, 1], compareFn))).toEqual(2);
    });
  });

  describe('parseAcceptLanguage', function() {
    it('should return empty array if value is empty', function() {
      expect(parseAcceptLanguage('')).toEqual([]);
    });

    it('should return array with one element if value is one element', function() {
      expect(parseAcceptLanguage('en')).toEqual(['en']);
      expect(parseAcceptLanguage('en-US')).toEqual(['en-US']);
      expect(parseAcceptLanguage('de-DE-1996')).toEqual(['de-DE-1996']);
    });

    it('should return array with two elements if value is two elements', function() {
      expect(parseAcceptLanguage('en,ru')).toEqual(['en', 'ru']);
    });

    it('should return array with two elements if value is two elements with q', function() {
      expect(parseAcceptLanguage('en;q=1,ru;q=0.5')).toEqual(['en', 'ru']);
      expect(parseAcceptLanguage('ru;q=0.5,en;q=1')).toEqual(['en', 'ru']);
    });

    it('should work properly if passed invalid values', function() {
      expect(parseAcceptLanguage(',en')).toEqual(['en']);
      expect(parseAcceptLanguage('en,')).toEqual(['en']);
      expect(parseAcceptLanguage(';en')).toEqual([]);
      expect(parseAcceptLanguage('en;')).toEqual(['en']);
      expect(parseAcceptLanguage('en;q=foo,ru')).toEqual(['en', 'ru']);
      expect(parseAcceptLanguage('en;q=,ru')).toEqual(['en', 'ru']);
      expect(parseAcceptLanguage('en;qq=0.5,ru')).toEqual(['en', 'ru']);
      expect(parseAcceptLanguage('en;,ru')).toEqual(['en', 'ru']);
      expect(parseAcceptLanguage('en;;;;,,,ru')).toEqual(['en', 'ru']);
    });

    it('should discard duplicates', function() {
      expect(parseAcceptLanguage('en;q=1,en;q=0.5,ru')).toEqual(['en', 'ru']);
    });
  });
});