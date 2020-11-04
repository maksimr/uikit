/**
 * @param {import("./link-click-interceptor").LinkClickInterceptorOptions} [options]
 * @returns {function} Remove click interceptor
 */
export function useHistory(options?: import("./link-click-interceptor").LinkClickInterceptorOptions): Function;
/**
 * @param {string} [url]
 * @param {boolean} [replace]
 * @param {any} [state]
 * @returns {string|null}
 */
export function url(url?: string, replace?: boolean, state?: any): string | null;
