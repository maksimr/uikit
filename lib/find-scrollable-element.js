/**
 * @param {HTMLElement} element
 * @return {HTMLElement}
 */
export function findScrollableElement(element) {
  while (element.parentNode && element.parentNode !== document) {
    const overflow = window.getComputedStyle(element).overflow;
    if (overflow === 'visible' || overflow === '') {
      /**
       * @type {Element}
       */
      // @ts-ignore
      element = element.parentNode;
      continue;
    }
    break;
  }
  return element;
}