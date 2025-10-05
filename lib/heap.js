/**
 * @template T
 */
export class Heap {
  /**@type {Array<T>}*/
  #nodes = [];
  /**@type {(a: T, b: T) => number}*/
  #comparator;

  constructor(/**@type {(a: T, b: T) => Number}*/ comparator) {
    this.#comparator = comparator;
  }

  /**
   * @param {T} item 
   */
  insert(item) {
    this.#nodes.push(item);
    this.#bubbleUp(this.#nodes.length - 1);
  }

  /**
   * @returns {T | null}
   */
  remove() {
    const rootNode = this.#nodes[0];
    if (this.#nodes.length === 0) {
      return null;
    }

    if (this.#nodes.length === 1) {
      this.#nodes.length = 0;
    } else {
      this.#nodes[0] = /**@type {T}*/(this.#nodes.pop());
      this.#bubbleDown(0);
    }
    return rootNode;
  }

  /**
   * @returns {T | null}
   */
  peek() {
    return this.#nodes.length === 0 ? null : this.#nodes[0];
  }

  /**
   * @param {(item: T) => boolean} predicate
   * @returns {boolean}
   */
  contains(predicate) {
    return this.#nodes.some(predicate);
  }

  /**
   * @param {number} index 
   */
  #bubbleUp(index) {
    const node = this.#nodes[index];
    while (index > 0) {
      const parentIndex = (index - 1) >> 1;
      if (this.#comparator(this.#nodes[index], this.#nodes[parentIndex]) < 0) {
        this.#nodes[index] = this.#nodes[parentIndex];
        index = parentIndex;
      } else {
        break;
      }
    }
    this.#nodes[index] = node;
  }

  /**
   * @param {number} index 
   */
  #bubbleDown(index) {
    const count = this.#nodes.length;
    const node = this.#nodes[index];

    // While the current node has a child.
    while (index < (count >> 1)) {
      const leftChildIndex = index * 2 + 1;
      const rightChildIndex = leftChildIndex + 2;

      // Determine the index of the smaller child.
      const smallerChildIndex = (rightChildIndex < count && this.#comparator(this.#nodes[rightChildIndex], this.#nodes[leftChildIndex]) < 0)
        ? rightChildIndex
        : leftChildIndex;

      // If the node being moved down is smaller than its children, the node
      // has found the correct index it should be at.
      if (this.#comparator(node, this.#nodes[smallerChildIndex]) < 0) {
        break;
      }

      // If not, then take the smaller child as the current node.
      this.#nodes[index] = this.#nodes[smallerChildIndex];
      index = smallerChildIndex;
    }

    this.#nodes[index] = node;
  }
}