import { binarySearch } from './binary-search';

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