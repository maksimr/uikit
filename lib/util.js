/**
 * @description Selects an index in the specified array using the binary search algorithm.
 *  The evaluator receives an element and determines whether the desired index
 *  is before, at, or after it
 * @template T
 * @param {T[]} arr 
 * @param {(it: T, index: number) => number} compareFn Evaluator function that receives 2 arguments (the element and the index).
 *  Should return a negative number, zero, or a positive number
 *  depending on whether the desired index is before, at, or after the
 *  element passed to it.
 * @returns {number} index of the search key, if it is contained in the array
 *  otherwise, <tt>(-(<i>insertion point</i>) - 1)</tt>.  The
 *  <i>insertion point</i> is defined as the point at which the
 *  key would be inserted into the array
 */
export function binarySearch(arr, compareFn) {
  let min = 0;
  let max = arr.length;
  let found = false;
  while (min < max) {
    const middle = min + ((max - min) >>> 1);
    const compareResult = compareFn(arr[middle], middle);
    if (compareResult > 0) {
      min = middle + 1;
    } else {
      max = middle;
      found = !compareResult;
    }
  }
  return found ? min : -min - 1;
}