/**
 * @template V
 * @template R
 * @typedef BaseNodeType
 * @property {((value: V) => R) | ((value: V, next: () => R) => R)} fn
 * @property {NodeType<V,R>} prev
 * @property {NodeType<V,R>} next
 */

/**
 * @template V
 * @template R
 * @typedef {BaseNodeType<V,R> | null} NodeType
 */

/**
* @template V The type of the value passed to the handlers.
* @template R The type of the result returned by the handler.
* @returns {readonly [(fn: ((value: V) => R) | ((value: V, next: () => R) => R)) => () => void, (value: V) => any]}
*/
export function chainof() {
  /**@type {NodeType<V,R>}*/
  let headNode = null;
  /**@type {NodeType<V,R>}*/
  let tailNode = null;
  return [
    (/**@type {((value: V) => R) | ((value: V, next: () => R) => R)}*/ fn) => {
      /**@type {NodeType<V,R>}*/
      const node = { fn, prev: tailNode, next: null };
      if (tailNode) tailNode.next = node;
      if (!headNode) headNode = node;
      tailNode = node;

      return () => {
        if (node.prev) node.prev.next = node.next;
        if (node.next) node.next.prev = node.prev;
        if (node === headNode) headNode = node.next;
        if (node === tailNode) tailNode = node.prev;
      };
    },
    (/**@type {V}*/ value) => (visitNode(headNode, value))
  ];

  /**
   * @param {NodeType<V,R>} node 
   * @param {V} value 
   * @returns {any}
   */
  function visitNode(node, value) {
    if (!node) return;
    const fn = node.fn;
    /**@type {(fn: any) => fn is ((value: V) => R)}*/
    const withoutNextArg = (fn) => fn.length < 2;
    /**@type {(result?: R) => R}*/
    const next = (result) => (result !== void 0) ? result : visitNode(node.next, value);
    if (withoutNextArg(fn)) {
      const result = fn(value);
      return (result instanceof Promise) ?
        result.then(next) :
        next(result);
    }
    return fn(value, next);
  }
}