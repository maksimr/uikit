
/**
 * @param {boolean} [horizontal]
 * @param {HTMLElement} [container]
 * @return {number}
 */
export function getMaxBrowserScrollSize(horizontal, container = document.body) {
  const bigNumber = '9999999999999999px';

  const scrollContainer = document.createElement('div');
  scrollContainer.style.position = 'absolute';
  scrollContainer.style.width = '1px';
  scrollContainer.style.height = '1px';
  scrollContainer.style.top = '0';
  scrollContainer.style.left = '0';
  scrollContainer.style.overflow = 'scroll';
  scrollContainer.style.opacity = '0';
  scrollContainer.style.visibility = 'hidden';

  const expander = document.createElement('div');
  expander.style.position = 'absolute';
  expander.style.left = bigNumber;
  expander.style.top = bigNumber;

  scrollContainer.appendChild(expander);
  container.appendChild(scrollContainer);
  const size = expander.getBoundingClientRect()[horizontal ? 'left' : 'top'] || parseInt(bigNumber);
  container.removeChild(scrollContainer);

  return Math.abs(size);
}