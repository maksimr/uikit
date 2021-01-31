/**
 * @typedef LinkClickInterceptorOptions
 * @property {HTMLElement} [rootNode]
 * @property {string} [baseUrl]
 */

/**
 * @param {function(HTMLAnchorElement, Event):(boolean|void)} handler
 * @param {LinkClickInterceptorOptions} [options]
 * @returns {function():void}
 */
export function installLinkClickInterceptor(handler, {
  rootNode = document.body,
  baseUrl = (
    rootNode.querySelector('base')?.href ||
    document.querySelector('base')?.href ||
    window.location.origin)
} = {}) {
  rootNode.addEventListener('click', onClick);
  return () => rootNode.removeEventListener('click', onClick);

  function onClick(/**@type {MouseEvent}*/event) {
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

    const target = (/**@type {HTMLElement|null}*/ (event.target));
    const element = (/**@type {HTMLAnchorElement|null}*/(target?.closest?.('a')));
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
  }
}