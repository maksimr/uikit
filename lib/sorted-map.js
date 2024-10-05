const { binarySearch } = require('./binary-search');

/**
 * @template K, V
 */
class SortedMap extends Map {
  /**@type {(a: [K, V], b: [K, V]) => number}*/
  #comparator;
  /**@type {[K, V][]}*/
  #sortedEntries;

  /**
   * @param {[K, V][] | null} entries 
   * @param {(a: [K, V], b: [K, V]) => number} comparator 
   */
  constructor(entries, comparator) {
    super();
    this.#sortedEntries = entries ?? [];
    this.#comparator = comparator;
  }

  /**
   * @param {[K, V]} entry 
   * @returns {number}
   */
  #getEntryIndex(entry) {
    return binarySearch(this.#sortedEntries, (thatEntry) => {
      return this.#comparator(entry, thatEntry);
    });
  }

  /**
   * @param {K} key 
   * @param {V} value 
   * @returns {this}
   */
  set(key, value) {
    const isNew = !this.has(key);
    if (isNew || this.get(key) !== value) {
      // if this is update operation, remove the old entry
      // and insert it in the correct position
      if (!isNew) this.delete(key);

      const entry = /**@type {[K, V]}*/([key, value]);
      const idx = ~this.#getEntryIndex(entry);
      this.#sortedEntries.splice(idx, 0, entry);
    }

    return super.set(key, value);
  }

  /**
   * @param {K} key 
   * @returns {boolean}
   */
  delete(key) {
    if (this.has(key)) {
      const value = this.get(key);
      const idx = this.#getEntryIndex([key, value]);
      if (idx >= 0) this.#sortedEntries.splice(idx, 1);
    }

    return super.delete(key);
  }

  clear() {
    super.clear();
    this.#sortedEntries.length = 0;
  }

  keys() {
    return this.#sortedEntries.map((entry) => entry[0])[Symbol.iterator]();
  }

  values() {
    return this.#sortedEntries.map((entry) => entry[1])[Symbol.iterator]();
  }

  entries() {
    return this.#sortedEntries[Symbol.iterator]();
  }

  [Symbol.iterator]() {
    return this.#sortedEntries[Symbol.iterator]();
  }
}

/**
 * @template K, V
 * @param {[K, V][] | null} entries 
 * @param {(a: [K, V], b: [K, V]) => number} comparator 
 * @returns {SortedMap<K, V>}
 */
function createSortedMap(entries, comparator) {
  return new SortedMap(entries, comparator);
}

module.exports = {
  createSortedMap
};