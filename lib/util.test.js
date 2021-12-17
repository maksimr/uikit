import { it } from '@jest/globals';
import { binarySearch } from './util';

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

    it('should find lower bound', function() {
      const x = 3;
      expect(
        binarySearch([1, 1, 3, 3, 3, 4, 4], (it) => it < x ? 1 : -0)
      ).toEqual(2);
    });

    it('should find top bound', function() {
      const x = 3;
      expect(
        binarySearch([1, 1, 3, 3, 3, 4, 4], (it) => it > x ? -0 : 1)
      ).toEqual(5);
    });

    it('should find top bound in array which does not contain exact value', function() {
      const x = 3;
      expect(
        binarySearch([-2, -1, 0, 1, 2, 4, 5], (it) => it > x ? -0 : 1)
      ).toEqual(5);
    });
  });
});