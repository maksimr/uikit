import { Heap } from './heap';

describe('heap', function() {
  const minComparator = (/**@type {number}*/a, /**@type {number}*/ b) => a - b;
  const maxComparator = (/**@type {number}*/ a, /**@type {number}*/ b) => b - a;

  it('should insert and peek the minimum element', () => {
    const heap = new Heap(minComparator);
    heap.insert(5);
    heap.insert(3);
    heap.insert(8);
    expect(heap.peek()).toBe(3);
  });

  it('should remove elements in order', () => {
    const heap = new Heap(minComparator);
    heap.insert(10);
    heap.insert(1);
    heap.insert(5);
    expect(heap.remove()).toBe(1);
    expect(heap.remove()).toBe(5);
    expect(heap.remove()).toBe(10);
    expect(heap.remove()).toBeNull();
  });

  it('should return null when peeking or removing from empty heap', () => {
    const heap = new Heap(minComparator);
    expect(heap.peek()).toBeNull();
    expect(heap.remove()).toBeNull();
  });

  it('should contain elements based on predicate', () => {
    const heap = new Heap(minComparator);
    heap.insert(2);
    heap.insert(4);
    heap.insert(6);
    expect(heap.contains(x => x === 4)).toBe(true);
    expect(heap.contains(x => x === 7)).toBe(false);
  });

  it('should work as a max heap', () => {
    const heap = new Heap(maxComparator);
    heap.insert(1);
    heap.insert(3);
    heap.insert(2);
    expect(heap.peek()).toBe(3);
    expect(heap.remove()).toBe(3);
    expect(heap.remove()).toBe(2);
    expect(heap.remove()).toBe(1);
  });

  it('should handle duplicate values', () => {
    const heap = new Heap(minComparator);
    heap.insert(2);
    heap.insert(2);
    heap.insert(2);
    expect(heap.remove()).toBe(2);
    expect(heap.remove()).toBe(2);
    expect(heap.remove()).toBe(2);
    expect(heap.remove()).toBeNull();
  });
});