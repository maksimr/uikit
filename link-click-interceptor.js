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
export function addLinkClickInterceptor(handler, _a) {
    var _b, _c;
    var { rootNode = document.body, baseUrl = (((_b = rootNode.querySelector('base')) === null || _b === void 0 ? void 0 : _b.href) || ((_c = document.querySelector('base')) === null || _c === void 0 ? void 0 : _c.href) ||
        window.location.origin) } = _a;
    let listener = null;
    rootNode.addEventListener('click', listener = function (event) {
        const RIGHT_MOUSE_BUTTON = 2;
        if (event.ctrlKey ||
            event.metaKey ||
            event.shiftKey ||
            event.which === RIGHT_MOUSE_BUTTON ||
            event.button === RIGHT_MOUSE_BUTTON) {
            return;
        }
        /**
         * @type {HTMLAnchorElement}
         */
        // @ts-ignore
        const element = event.target.closest('a');
        if (!element) {
            return;
        }
        const href = element.href;
        const IGNORE_URI_REGEXP = /^\s*(javascript|mailto):/i;
        if (IGNORE_URI_REGEXP.test(href)) {
            return;
        }
        if (href &&
            href.startsWith(baseUrl) &&
            !element.getAttribute('target') &&
            !event.defaultPrevented) {
            if (handler(element, event) !== false) {
                event.preventDefault();
            }
        }
    });
    return () => rootNode.removeEventListener('click', listener);
}
