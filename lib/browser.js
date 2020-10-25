import { addLinkClickInterceptor } from "./link-click-interceptor";

// eslint-disable-next-line valid-jsdoc
/**
 * @param {import("./link-click-interceptor").LinkClickInterceptorOptions} [options]
 * @returns {function} Remove click interceptor
 */
export function useHistory(options = {}) {
  return addLinkClickInterceptor((element) => {
    const href = element.href;
    url(href);
  }, options);
}

/**
 * @param {string} [url] 
 * @param {boolean} [replace]
 * @param {any} [state]
 * @returns {string|null}
 */
export function url(url, replace, state = null) {
  if (typeof url === 'undefined') {
    return location.href;
  }

  if (replace) {
    history.replaceState(state, '', url);
  } else {
    history.pushState(state, '', url);
  }
}