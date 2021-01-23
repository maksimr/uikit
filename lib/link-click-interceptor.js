/**
 * @typedef LinkClickInterceptorOptions
 * @property {HTMLElement} [rootNode]
 * @property {string} [baseUrl]
 */
// eslint-disable-next-line valid-jsdoc
/**
 * @param {function(HTMLAnchorElement, Event):(boolean|void)} handler
 * @param {LinkClickInterceptorOptions} [options]
 * @returns {function(): void}
 */
export function addLinkClickInterceptor(handler, {
  rootNode = document.body,
  baseUrl = (
    rootNode.querySelector('base')?.href ||
    document.querySelector('base')?.href ||
    window.location.origin)
} = {}) {
  let listener = null;
  rootNode.addEventListener('click', listener = function(event) {
    const RIGHT_MOUSE_BUTTON = 2;
    if (
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.which === RIGHT_MOUSE_BUTTON ||
      event.button === RIGHT_MOUSE_BUTTON
    ) {
      return;
    }

    const element = (/**@type {HTMLAnchorElement}*/(event.target.closest('a')));
    if (!element) {
      return;
    }

    const href = element.href;

    const IGNORE_URI_REGEXP = /^\s*(javascript|mailto):/i;
    if (IGNORE_URI_REGEXP.test(href)) {
      return;
    }

    if (
      href &&
      href.startsWith(baseUrl) &&
      !element.getAttribute('target') &&
      !event.defaultPrevented
    ) {
      if (handler(element, event) !== false) {
        event.preventDefault();
      }
    }
  });

  return () => rootNode.removeEventListener('click', listener);
}