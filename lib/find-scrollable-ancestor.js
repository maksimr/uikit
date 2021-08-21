/**
 * @param {Element} element
 * @return {Element|null}
 */
export function findScrollableAncestor(element) {
  while (element) {
    const overflow = element.nodeType !== 1 ? '' : window.getComputedStyle(element).overflow;
    if (overflow === 'visible' || overflow === '') {
      element = (/**@type {Element}*/(element.parentNode));
      continue;
    }
    break;
  }
  return element;
}
