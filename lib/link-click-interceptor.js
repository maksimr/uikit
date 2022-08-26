/**
 * @typedef LinkClickInterceptorOptions
 * @property {HTMLElement} [rootNode] Define the root node on which we would listen clicks on links.
 * If not specified "document.body"
 * would be used @property {string} [baseUrl] Define base url which should match when check should we intercept
 * click on the link.
 * By default, used document base url
 */

/**
 * @description Intercept clicks on links inside passed root node which matches specified base url.
 * This allows preventing page reload and using client side routing.
 * This function does not prevent clicks on elements with specified target
 * @param {(anchorElement: HTMLAnchorElement, event: Event) => (boolean|void)} handler If handler returns `false`
 * interceptor would not prevent default anchor behaviour
 * @param {LinkClickInterceptorOptions} options
 * @returns {() => void} Remove click interceptor function
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
    const element = (/**@type {HTMLAnchorElement|null}*/(target?.closest?.('a,xlink')));
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