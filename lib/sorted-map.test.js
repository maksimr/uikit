import { sortedMapOf } from './sorted-map';

describe('sortedMapOf', function() {
  const comparator = (/**@type {[any, any]}*/ a, /**@type {[any, any]}*/ b) => {
    return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0;
  };

  it('should set values in sorted order', function() {
    const map = sortedMapOf(comparator);

    map.set('c', 3);
    map.set('a', 1);
    map.set('b', 2);

    expect([...map.keys()]).toEqual(['a', 'b', 'c']);
    expect([...map.values()]).toEqual([1, 2, 3]);
  });

  it('should set passed to constructor values in sorted order', function() {
    const map = sortedMapOf(comparator, [['c', 3], ['a', 1], ['b', 2]]);

    expect(map.has('a')).toBeTrue();
    expect(map.has('b')).toBeTrue();
    expect(map.has('c')).toBeTrue();
    expect([...map.keys()]).toEqual(['a', 'b', 'c']);
    expect([...map.values()]).toEqual([1, 2, 3]);
  });

  it('should delete values in sorted order', function() {
    const map = sortedMapOf(comparator);

    map.set('c', 3);
    map.set('a', 1);
    map.set('b', 2);
    map.delete('a');

    expect([...map.keys()]).toEqual(['b', 'c']);
    expect([...map.values()]).toEqual([2, 3]);
  });

  it('should iterate over entries in sorted order', function() {
    const map = sortedMapOf(comparator);

    map.set('c', 3);
    map.set('a', 1);
    map.set('b', 2);

    expect([...map.entries()]).toEqual([['a', 1], ['b', 2], ['c', 3]]);
  });

  it('should handle duplicate keys by updating the value', function() {
    const map = sortedMapOf(comparator);

    map.set('a', 1);
    map.set('a', 2);

    expect([...map.keys()]).toEqual(['a']);
    expect([...map.values()]).toEqual([2]);
  });

  it('should return correct size of the map', function() {
    const map = sortedMapOf(comparator);

    map.set('a', 1);
    map.set('b', 2);
    map.set('c', 3);

    expect(map.size).toBe(3);
    map.delete('b');
    expect(map.size).toBe(2);
  });

  it('should clear all entries', function() {
    const map = sortedMapOf(comparator);

    map.set('a', 1);
    map.set('b', 2);
    map.set('c', 3);
    map.clear();

    expect([...map.keys()]).toEqual([]);
    expect([...map.values()]).toEqual([]);
    expect(map.size).toBe(0);
  });

  it('should return undefined for non-existent keys', function() {
    const map = sortedMapOf(comparator);

    expect(map.get('non-existent')).toBeUndefined();
  });

  it('should maintain order after multiple operations', function() {
    const map = sortedMapOf(comparator);

    map.set('c', 3);
    map.set('a', 1);
    map.set('b', 2);
    map.delete('a');
    map.set('a', 4);

    expect([...map.keys()]).toEqual(['a', 'b', 'c']);
    expect([...map.values()]).toEqual([4, 2, 3]);
  });

  it('should handle complex keys correctly', function() {
    const map = sortedMapOf(comparator);

    map.set({ id: 2 }, 'two');
    map.set({ id: 1 }, 'one');

    expect([...map.keys()]).toEqual([{ id: 1 }, { id: 2 }]);
    expect([...map.values()]).toEqual(['one', 'two']);
  });

  it('should handle large number of entries', function() {
    const map = sortedMapOf(comparator);

    // require future improvements to handle large number of entries
    const entries = Array.from({ length: 10000 }, (_, i) => `value-${i}`);
    for (let i = 0; i < entries.length; i++) {
      map.set(i, entries[i]);
    }

    expect(map.size).toBe(entries.length);
    expect([...map.keys()]).toEqual([...entries.keys()]);
    expect([...map.values()]).toEqual([...entries.values()]);
  });
});