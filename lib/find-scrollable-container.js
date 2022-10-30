/**
 * @description Find nearest scroll container including passed element 
 * @param {Node} element
 * @return {Element|null}
 */
export function findScrollableContainer(element) {
  /**@type {Element|Node|null}*/
  let nextElement = element;
  while (nextElement) {
    const overflow = nextElement.nodeType !== 1 ? 'visible' :
      window.getComputedStyle(/**@type {Element}*/(nextElement)).overflow;
    if (overflow === 'visible') {
      nextElement = nextElement.parentNode;
      continue;
    }
    break;
  }
  return /**@type {Element|null}*/(nextElement);
}
