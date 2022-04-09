/**
 * @param {boolean} [horizontal]
 * @return {number}
 */
export function getMaxBrowserScrollSize(horizontal) {
  const bigNumber = '9999999999999999px';
  const div = document.createElement('div');
  const style = div.style;
  style.position = 'absolute';
  style.left = bigNumber;
  style.top = bigNumber;
  document.body.appendChild(div);

  const size = div.getBoundingClientRect()[horizontal ? 'left' : 'top'] || parseInt(bigNumber);
  document.body.removeChild(div);
  return Math.abs(size);
}

/**
 * @description Returns the distance of the outer border of
 * the element relative to the inner border of the offsetParent node
 * @param {HTMLElement} element
 * @param {HTMLElement} offsetParent
 * @param {boolean} [horizontal]
 * @return {number}
 */
export function getOffsetBetween(element, offsetParent, horizontal = false) {
  // If scrollElement is documentElement we can
  // calculate it by getBoundingClientRect and don't traverse all parents
  if (offsetParent === document.documentElement) {
    const boundingClientRect = element.getBoundingClientRect();
    const boundingClientRectDocument = offsetParent.getBoundingClientRect();
    return horizontal ?
      boundingClientRect.left - boundingClientRectDocument.left :
      boundingClientRect.top - boundingClientRectDocument.top;
  }

  let offset = 0;
  while (element && element.parentNode && element !== offsetParent) {
    const parentElement = /**@type {HTMLElement}*/(element.parentNode);
    const offsetTop = horizontal ? element.offsetLeft : element.offsetTop;
    offset = (window.getComputedStyle(parentElement).position !== 'static') ?
      offset + offsetTop :
      offset + (offsetTop - (horizontal ? parentElement.offsetLeft : parentElement.offsetTop));
    element = parentElement;
  }
  return offset;
}