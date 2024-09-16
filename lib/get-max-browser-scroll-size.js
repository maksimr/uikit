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