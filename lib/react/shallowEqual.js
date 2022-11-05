/**
 * @param {any} a 
 * @param {any} b 
 * @returns {boolean}
 */
export function shallowEqual(a, b) {
  if (is(a, b)) return true;
  if (a === null || b === null) return false;
  if (typeof a !== 'object' || typeof b !== 'object') return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key) || !is(a[key], b[key]))
      return false;
  }

  return true;
}

/**
 * @param {unknown} a 
 * @param {unknown} b 
 * @returns {boolean}
 */
function is(a, b) {
  if (a === b) return true;
  return a !== a && b !== b;
}