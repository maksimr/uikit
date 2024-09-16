/**
 * @description Returns the distance of the outer border of
 * the element relative to the inner border of the ancestor node
 * @param {HTMLElement} element
 * @param {HTMLElement} ancestorElement
 * @param {boolean} [horizontal]
 * @return {number}
 */
export function getOffsetBetween(element, ancestorElement, horizontal = false) {
  // If scrollElement is documentElement we can
  // calculate it by getBoundingClientRect and don't traverse all parents
  if (ancestorElement === document.documentElement) {
    const boundingClientRect = element.getBoundingClientRect();
    const boundingClientRectDocument = ancestorElement.getBoundingClientRect();
    return horizontal ?
      boundingClientRect.left - boundingClientRectDocument.left :
      boundingClientRect.top - boundingClientRectDocument.top;
  }

  let offset = 0;
  while (element && element.parentNode && element !== ancestorElement) {
    const parentElement = /**@type {HTMLElement}*/(
      element.parentNode === element.offsetParent || ancestorElement.contains(element.offsetParent) ?
        element.offsetParent :
        element.parentNode
    );
    const offsetTop = horizontal ? element.offsetLeft : element.offsetTop;
    offset = (element.offsetParent === parentElement) ?
      offset + offsetTop :
      offset + (offsetTop - (horizontal ? parentElement.offsetLeft : parentElement.offsetTop));
    element = parentElement;
  }
  return offset;
}